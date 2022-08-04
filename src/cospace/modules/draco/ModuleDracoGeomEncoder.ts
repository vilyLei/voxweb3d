import { SubThreadModule } from "../thread/control/SubThreadModule";
import { GeometryModelDataType } from "../base/GeometryModelDataType";
import { IThreadCore } from "../thread/control/IThreadCore";
import { DracoTaskCMD } from "./DracoTaskCMD";

let CMD = DracoTaskCMD;
declare var ThreadCore: IThreadCore;
declare var DracoEncoderModule: (ins: unknown) => void;
type DiscriptorType = {
	url: string,
	index: number,
	compressionLevel: number,
	posQuantization: number,
	uvQuantization: number,
	nvQuantization: number,
	genericQuantization: number,
};
class ModuleDracoGeomEncoder {
	encoder: any;
	receiveCall(data: any): any {
		console.log("ModuleDracoGeomEncoder::receiveCall()..., data: ", data);

		let losstime = Date.now();

		let streams = data.streams;

		const encoderModule = this.encoder;
		const encoder = new encoderModule.Encoder();
		// console.log("ModuleDracoGeomEncoder::receiveCall()..., encoder: ", encoder);

		let descriptor: DiscriptorType = data.descriptor;
		let speed: number = Math.round(10 - descriptor.compressionLevel);
		if(speed < 0) {
			speed = 0;
		} else if(speed > 10) {
			speed = 10
		}
		// console.log("encode to draco speed: ", speed);

		encoder.SetSpeedOptions(speed, speed);
		encoder.SetAttributeQuantization(encoderModule.POSITION, descriptor.posQuantization);
		encoder.SetAttributeQuantization(encoderModule.TEX_COORD, descriptor.uvQuantization);
		encoder.SetAttributeQuantization(encoderModule.NORMAL, descriptor.nvQuantization);
		encoder.SetAttributeQuantization(encoderModule.GENERIC, descriptor.genericQuantization);

		const meshBuilder = new encoderModule.MeshBuilder();
		const dracoMesh = new encoderModule.Mesh();
		// console.log("ModuleDracoGeomEncoder::receiveCall()..., dracoMesh: ", dracoMesh);

		// {vertices: ArrayBuffer, uv: ArrayBuffer, normals: ArrayBuffer, indices: ArrayBuffer};

		const mesh: {
			indices: Uint16Array | Uint32Array;
			vertices: Float32Array;
			normals: Float32Array;
			colors: Float32Array;
			texcoords: Float32Array;
		} = {
			indices: streams[3],
			vertices: streams[0],
			texcoords: streams[1],
			normals: streams[2],
			colors: null
		};

		// let speed = 10;
		// encoder.SetSpeedOptions(speed, speed);
		// encoder.SetAttributeQuantization(encoderModule.POSITION, 10);
		// encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);
		const numFaces = mesh.indices.length / 3;
		const numPoints = mesh.vertices.length;
		meshBuilder.AddFacesToMesh(dracoMesh, numFaces, mesh.indices);
		// console.log("numFaces: ",numFaces);
		// console.log("numPoints: ",numPoints);
		// console.log("mesh: ",mesh);
		meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.POSITION, numPoints, 3, mesh.vertices);
		if (mesh.normals != null) {
			meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.NORMAL, numPoints, 3, mesh.normals);
		}
		if (mesh.colors != null) {
			meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.COLOR, numPoints, 3, mesh.colors);
		}
		if (mesh.texcoords != null) {
			meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.TEX_COORD, numPoints, 2, mesh.texcoords);
		}

		// let method = "edgebreaker";
		// method = "sequential";
		// if (method === "edgebreaker") {
		// 	encoder.SetEncodingMethod(encoderModule.MESH_EDGEBREAKER_ENCODING);
		// } else if (method === "sequential") {
		// 	encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);
		// }

		const encodedData = new encoderModule.DracoInt8Array();
		// Use default encoding setting.
		const encodedLen = encoder.EncodeMeshToDracoBuffer(dracoMesh, encodedData);


		// draco file buf
        const fileData = new Int8Array(encodedLen);

        for (let i = 0; i < encodedLen; i++) {
			fileData[i] = encodedData.GetValue(i);
        }

		encoderModule.destroy(dracoMesh);
		encoderModule.destroy(meshBuilder);
		encoderModule.destroy(encoder);
		encoderModule.destroy(encodedData);

		console.log("draco encode lossTime: ", (Date.now() - losstime));
		console.log("ModuleDracoGeomEncoder::receiveCall()..., encodedLen: ", encodedLen);

		let transfers = new Array(streams.length + 1);
		for(let i = 0; i < streams.length; ++i) {
			transfers[i] = streams[i].buffer;
		}
		transfers[streams.length] = fileData.buffer;

		let dataObj: any = { data: fileData, transfers: transfers, errorFlag: 0 };
		return dataObj;
	}
}
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */
class DracoGeomEncodeTask implements SubThreadModule {
	private m_dependencyFinish: boolean = false;
	private m_wasmData: any = null;
	private m_currTaskClass: number = -1;
	threadIndex: number = 0;
	encoder: any = null;
	encoderObj: any = { wasmBinary: null };
	dracoParser = new ModuleDracoGeomEncoder();

	constructor() {
		this.m_currTaskClass = ThreadCore.getCurrTaskClass();
		console.log("DracoGeomEncodeTask::constructor(), currTaskClass: ", this.m_currTaskClass);
		ThreadCore.setCurrTaskClass(this.m_currTaskClass);
		ThreadCore.acquireData(this, {}, CMD.THREAD_ACQUIRE_DATA);
		ThreadCore.useDependency(this);
		ThreadCore.resetCurrTaskClass();
	}
	postDataMessage(data: any, transfers?: ArrayBuffer[]): void {
		ThreadCore.postMessageToThread(data, transfers);
	}
	initEncoder(data: any): void {

		let bin: ArrayBuffer = data.streams[0];
		this.encoderObj["wasmBinary"] = bin;
		this.encoderObj["onModuleLoaded"] = (module: any): void => {
			this.encoder = module;
			this.dracoParser.encoder = module;
			ThreadCore.setCurrTaskClass(this.m_currTaskClass);
			ThreadCore.transmitData(this, data, CMD.THREAD_TRANSMIT_DATA, [bin]);
			ThreadCore.initializeExternModule(this);
			ThreadCore.resetCurrTaskClass();
		}
		DracoEncoderModule( this.encoderObj );
	}
	receiveData(data: any): void {

		// console.log("data.taskCmd: ", data.taskCmd);
		switch (data.taskCmd) {
			case CMD.ENCODE:
				let parseData = this.dracoParser.receiveCall(data);
				data.data = { buf: parseData.data, errorFlag: parseData.errorFlag };
				this.postDataMessage(data, parseData.transfers);
				break;
			case CMD.THREAD_ACQUIRE_DATA:
				this.threadIndex = data.threadIndex;
				this.m_wasmData = data.data;
				//console.log("#####$$$ Sub Worker mesh parser task DRACO_THREAD_ACQUIRE_DATA, data: ", data);
				if (this.m_dependencyFinish && this.m_wasmData != null) {
					this.initEncoder(this.m_wasmData);
				}
				break;
			default:
				//postDataMessage(data);
				break;
		}
	}
	getUniqueName(): string {
		return "dracoGeomEncoder";
	}
	dependencyFinish(): void {
		this.m_dependencyFinish = true;
		if (this.m_dependencyFinish && this.m_wasmData != null) {
			this.initEncoder(this.m_wasmData);
		}
	}
}
// 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下实例化代码
let ins = new DracoGeomEncodeTask();

export { DracoGeomEncodeTask };

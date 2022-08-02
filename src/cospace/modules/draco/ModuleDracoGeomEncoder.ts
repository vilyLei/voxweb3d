import { SubThreadModule } from "../thread/control/SubThreadModule";
import { GeometryModelDataType } from "../base/GeometryModelDataType";
import { IThreadCore } from "../thread/control/IThreadCore";
import { DracoTaskCMD } from "./DracoTaskCMD";

let CMD = DracoTaskCMD;
declare var ThreadCore: IThreadCore;
declare var DracoEncoderModule: (ins: unknown) => void;

class ModuleDracoGeomEncoder {
	encoder: any;
	receiveCall(data: any): any {
		console.log("ModuleDracoGeomEncoder::receiveCall()..., data: ", data);
		let streams = data.streams;

		const encoderModule = this.encoder;
		const encoder = new encoderModule.Encoder();
		console.log("ModuleDracoGeomEncoder::receiveCall()..., encoder: ", encoder);
		const meshBuilder = new encoderModule.MeshBuilder();
		const dracoMesh = new encoderModule.Mesh();
		console.log("ModuleDracoGeomEncoder::receiveCall()..., dracoMesh: ", dracoMesh);

		// {vertices: ArrayBuffer, uv: ArrayBuffer, normals: ArrayBuffer, indices: ArrayBuffer};

		const mesh: {
			indices: Uint32Array;
			vertices: Float32Array;
			normals: Float32Array;
			colors: Float32Array;
			texcoords: Float32Array;
		} = {
			indices: new Uint32Array(streams[3]),
			vertices: new Float32Array(streams[0]),
			texcoords: new Float32Array(streams[1]),
			normals: new Float32Array(streams[2]),
			colors: null
		};

		const numFaces = mesh.indices.length / 3;
		const numPoints = mesh.vertices.length;
		meshBuilder.AddFacesToMesh(dracoMesh, numFaces, mesh.indices);

		meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.POSITION, numPoints, 3, mesh.vertices);
		if (mesh.hasOwnProperty("normals")) {
			meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.NORMAL, numPoints, 3, mesh.normals);
		}
		if (mesh.colors != null) {
			meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.COLOR, numPoints, 3, mesh.colors);
		}
		if (mesh.texcoords != null) {
			meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.TEX_COORD, numPoints, 3, mesh.texcoords);
		}
		// let method = "edgebreaker";//encodeSpeed = 5
		let method = "sequential";
		if (method === "edgebreaker") {
			encoder.SetEncodingMethod(encoderModule.MESH_EDGEBREAKER_ENCODING);
		} else if (method === "sequential") {
			encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);
		}


		const encodedData = new encoderModule.DracoInt8Array();
		// Use default encoding setting.
		const encodedLen = encoder.EncodeMeshToDracoBuffer(dracoMesh, encodedData);

		console.log("ModuleDracoGeomEncoder::receiveCall()..., encodedData: ", encodedData);
		console.log("ModuleDracoGeomEncoder::receiveCall()..., encodedLen: ", encodedLen);
		console.log("ModuleDracoGeomEncoder::receiveCall()..., encodedData.data: ", encodedData.data);
		console.log("ModuleDracoGeomEncoder::receiveCall()..., encodedData.GetValue: ", encodedData.GetValue());

		encoderModule.destroy(dracoMesh);
		encoderModule.destroy(encoder);
		encoderModule.destroy(meshBuilder);

		let dataObj: any = { data: null, errorFlag: 0 };
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
	parser: any = null;
	encoder: any = { wasmBinary: null };
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
	initDecoder(data: any): void {
		let bin: ArrayBuffer = data.streams[0];
		this.encoder["wasmBinary"] = bin;
		this.encoder["onModuleLoaded"] = (module: any): void => {
			this.parser = module;
			this.dracoParser.encoder = module;
			ThreadCore.setCurrTaskClass(this.m_currTaskClass);
			ThreadCore.transmitData(this, data, CMD.THREAD_TRANSMIT_DATA, [bin]);
			ThreadCore.initializeExternModule(this);
			ThreadCore.resetCurrTaskClass();
		};
		DracoEncoderModule(this.encoder);
	}
	receiveData(data: any): void {

		// console.log("data.taskCmd: ", data.taskCmd);
		switch (data.taskCmd) {
			case CMD.PARSE:
				let parseData = this.dracoParser.receiveCall(data);
				data.data = { model: parseData.data, errorFlag: parseData.errorFlag };
				this.postDataMessage(data, parseData.transfers);
				break;
			case CMD.THREAD_ACQUIRE_DATA:
				this.threadIndex = data.threadIndex;
				this.m_wasmData = data.data;
				//console.log("#####$$$ Sub Worker mesh parser task DRACO_THREAD_ACQUIRE_DATA, data: ", data);
				if (this.m_dependencyFinish && this.m_wasmData != null) {
					this.initDecoder(this.m_wasmData);
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
			this.initDecoder(this.m_wasmData);
		}
	}
}
// 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下实例化代码
let ins = new DracoGeomEncodeTask();

export { DracoGeomEncodeTask };

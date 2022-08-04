import { SubThreadModule } from "../thread/control/SubThreadModule";
import { GeometryModelDataType } from "../base/GeometryModelDataType";
import { IThreadCore } from "../thread/control/IThreadCore";
import { DracoTaskCMD } from "./DracoTaskCMD";

let CMD = DracoTaskCMD;
declare var ThreadCore: IThreadCore;
declare var DracoDecoderModule: (ins: unknown) => void;

const TriStripDrawMode: number = 1;
const TriFanDrawMode: number = 21;

class DracoGeomParser {

	parser: any = null;
	attMap: any = null;
	attOpts: any = null;

	verbosity: number = 1;
	drawMode: number = 0;
	vsScale: number = 1.0;

	attNSMap: any = {
		position: "POSITION",
		normal: "NORMAL",
		color: "COLOR",
		uv: "TEX_COORD",
		generic: "GENERIC",
	};
	constructor() {
	}

	getAttributeOptions(ns: string): any {
		if (typeof this.attOpts[ns] === "undefined") this.attOpts[ns] = {};
		return this.attOpts[ns];
	}

	addAttributeToGeometry(dracoDecoder: any, decoder: any, dracoGeometry: any, ns: string, attribute: any, geometryBuffer: any): void {
		if (attribute.ptr === 0) {
			let errorMsg = "DracoGeomParser: No attribute " + ns;
			console.error(errorMsg);
			throw new Error(errorMsg);
		}
		let numComponents = attribute.num_components();
		let attributeData = new dracoDecoder.DracoFloat32Array();
		decoder.GetAttributeFloatForAllPoints(
			dracoGeometry,
			attribute,
			attributeData
		);
		let numPoints = dracoGeometry.num_points();
		let numValues = numPoints * numComponents;
		let fs32 = new Float32Array(numValues);
		// fs32[0] = numComponents;

		for (let i = 0; i < numValues; i++) {
			fs32[i] = attributeData.GetValue(i);
		}
		geometryBuffer[ns] = fs32;
		dracoDecoder.destroy(attributeData);
	}

	decodeGeomData(dracoDecoder: any, decoder: any, geometryType: any, buffer: any): any {
		if (this.getAttributeOptions("position").skipDequantization === true) {
			decoder.SkipAttributeTransform(dracoDecoder.POSITION);
		}
		let dracoGeometry;
		let decodingStatus;

		if (geometryType === dracoDecoder.TRIANGULAR_MESH) {
			dracoGeometry = new dracoDecoder.Mesh();
			decodingStatus = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
		} else {
			dracoGeometry = new dracoDecoder.PointCloud();
			decodingStatus = decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
		}
		if (!decodingStatus.ok() || dracoGeometry.ptr == 0) {
			let errorMsg = "DracoGeomParser: Decoding failed: ";
			errorMsg += decodingStatus.error_msg();
			console.error(errorMsg);
			dracoDecoder.destroy(decoder);
			dracoDecoder.destroy(dracoGeometry);
			throw new Error(errorMsg);
		}
		dracoDecoder.destroy(buffer);
		let numFaces;
		if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
			numFaces = dracoGeometry.num_faces();
		} else {
			numFaces = 0;
		}
		let posAttId = decoder.GetAttributeId(dracoGeometry, dracoDecoder.POSITION);
		if (posAttId == -1) {
			let errorMsg = "DracoGeomParser: No position attribute found.";
			console.error(errorMsg);
			dracoDecoder.destroy(decoder);
			dracoDecoder.destroy(dracoGeometry);
			throw new Error(errorMsg);
		}
		let geometryBuffer: any = {};
		for (let ns in this.attNSMap) {
			if (this.attMap[ns] === undefined) {
				let attId = decoder.GetAttributeId(
					dracoGeometry,
					dracoDecoder[this.attNSMap[ns]]
				);
				if (attId !== -1) {
					if (this.verbosity > 0) {
						// console.log('Loaded ' + ns + ' attribute.');
					}
					let attribute = decoder.GetAttribute(dracoGeometry, attId);
					this.addAttributeToGeometry(
						dracoDecoder,
						decoder,
						dracoGeometry,
						ns,
						attribute,
						geometryBuffer
					);
				}
			}
		}
		for (let ns in this.attMap) {
			let attributeId = this.attMap[ns];
			let attribute = decoder.GetAttributeByUniqueId(
				dracoGeometry,
				attributeId
			);
			this.addAttributeToGeometry(
				dracoDecoder,
				decoder,
				dracoGeometry,
				ns,
				attribute,
				geometryBuffer
			);
		}
		if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
			if (this.drawMode === TriStripDrawMode) {
				let stripsArray = new dracoDecoder.DracoInt32Array();
				geometryBuffer.indices = new Uint32Array(stripsArray.size());
				for (let i = 0; i < stripsArray.size(); ++i) {
					geometryBuffer.indices[i] = stripsArray.GetValue(i);
				}
				dracoDecoder.destroy(stripsArray);
			} else {
				let numIndices = numFaces * 3;
				geometryBuffer.indices = new Uint32Array(numIndices);
				let ia = new dracoDecoder.DracoInt32Array();
				for (let i = 0; i < numFaces; ++i) {
					decoder.GetFaceFromMesh(dracoGeometry, i, ia);
					let index = i * 3;
					geometryBuffer.indices[index] = ia.GetValue(0);
					geometryBuffer.indices[index + 1] = ia.GetValue(1);
					geometryBuffer.indices[index + 2] = ia.GetValue(2);
				}
				dracoDecoder.destroy(ia);
			}
		}
		if (geometryType != dracoDecoder.TRIANGULAR_MESH) {
			geometryBuffer.indices = null;
		}
		dracoDecoder.destroy(decoder);
		dracoDecoder.destroy(dracoGeometry);
		return geometryBuffer;
	}

	parseData(bufData: any, beginI: number, endI: number, status: number): void {

		let dracoDecoder = this.parser;
		let buffer = new dracoDecoder.DecoderBuffer();
		let bufLen = endI - beginI;
		if (status < 1) {
			buffer.Init(new Int8Array(bufData.buffer).subarray(0, bufLen), bufLen);
		} else {
			buffer.Init(new Int8Array(bufData.buffer).subarray(beginI, endI), bufLen);
		}
		let decoder = new dracoDecoder.Decoder();
		// Determine what type is this file: mesh or point cloud.
		let geometryType = decoder.GetEncodedGeometryType(buffer);
		if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
			if (this.verbosity > 0) {
				// console.log("Loaded a mesh segment.");
			}
		} else if (geometryType == dracoDecoder.POINT_CLOUD) {
			if (this.verbosity > 0) {
				// console.log("Loaded a point cloud.");
			}
		} else {
			let errorMsg = "DracoGeomParser: Unknown geometry type.";
			console.error(errorMsg);
			throw new Error(errorMsg);
		}

		//console.log("worker parseData, geometryType: "+geometryType);
		return this.decodeGeomData(dracoDecoder, decoder, geometryType, buffer);
	}

	transformVS(vsScale: number, matfs: Float32Array, f32vs: Float32Array, vinLength: number): void {

		let i = 0;
		let x = 0.0;
		let y = 0.0;
		let z = 0.0;
		let matX = vsScale * matfs[12];
		let matY = vsScale * matfs[13];
		let matZ = vsScale * matfs[14];

		while (i + 3 <= vinLength) {
			x = f32vs[i];
			y = f32vs[i + 1];
			z = f32vs[i + 2];
			f32vs[i] = x * matfs[0] + y * matfs[4] + z * matfs[8] + matX;
			f32vs[i + 1] = x * matfs[1] + y * matfs[5] + z * matfs[9] + matY;
			f32vs[i + 2] = x * matfs[2] + y * matfs[6] + z * matfs[10] + matZ;
			i += 3;
		}
	}
	getParseData(bufData: any, errorFlag: number): any {
		let tarr = null;
		if (bufData != null) {
			tarr = [];
			// 暂时不用
			let fvs32: Float32Array = null;
			for (let key in bufData) {
				if (bufData[key] != null) {
					tarr.push(bufData[key].buffer);
				}
			}
			if (fvs32 != null) {
				let atrribSize = fvs32[0];
				let min_x = fvs32[1];
				let min_y = fvs32[2];
				let min_z = fvs32[3];
				let max_x = min_x;
				let max_y = min_y;
				let max_z = min_z;
				let px;
				let py;
				let pz;
				for (let i = 1, len = fvs32.length; i < len; i += atrribSize) {
					px = fvs32[i];
					py = fvs32[i + 1];
					pz = fvs32[i + 2];
					if (px < min_x) min_x = px;
					else if (px > max_x) max_x = px;
					if (py < min_y) min_y = py;
					else if (py > max_y) max_y = py;
					if (pz < min_z) min_z = pz;
					else if (pz > max_z) max_z = pz;
				}
				bufData.min = { x: min_x, y: min_y, z: min_z };
				bufData.max = { x: max_x, y: max_y, z: max_z };
			}
		}

		let geomData: GeometryModelDataType = { vertices: bufData.position, uvsList: null, normals: null, indices: null };
		if (bufData.indices != undefined) geomData.indices = bufData.indices;
		if (bufData.normal != undefined) geomData.normals = bufData.normal;
		if (bufData.uv != undefined) geomData.uvsList = [bufData.uv];
		// return { data: bufData, transfers: tarr, errorFlag: errorFlag };
		return { data: geomData, transfers: tarr, errorFlag: errorFlag };
	}
	receiveCall(data: any): any {

		let streams = data.streams;
		this.drawMode = 0;
		this.vsScale = 1.0;
		this.attMap = {};
		this.attOpts = { position: {} };
		let errorFlag = 0;
		let dataObj = null;
		if (streams != null) {
			let descriptor = data.descriptor;
			if (descriptor.endI > descriptor.beginI) {
				let u8arr = streams[0];
				try {
					let losstime = Date.now();

					dataObj = this.parseData(
						u8arr,
						descriptor.beginI,
						descriptor.endI,
						descriptor.status
					);
					console.log("draco decode lossTime: ", (Date.now() - losstime));
				} catch (err) {
					errorFlag = -1;
					dataObj = null;
					console.error(err);
				}
			}
		} else {
			errorFlag = -2;
			console.error("the data is null.");
		}
		return this.getParseData(dataObj, errorFlag);
	}
}
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */
class DracoGeomParseTask implements SubThreadModule {

	private m_dataIndex: number = 0;
	private m_srcuid: number = 0;
	private m_dependencyFinish: boolean = false;
	private m_wasmData: any = null;
	private m_currTaskClass: number = -1;
	threadIndex: number = 0;
	parser: any = null;
	decoder: any = { wasmBinary: null };
	dracoParser = new DracoGeomParser();

	constructor() {
		this.m_currTaskClass = ThreadCore.getCurrTaskClass();
		console.log("DracoGeomParseTask::constructor(), currTaskClass: ", this.m_currTaskClass);
		ThreadCore.setCurrTaskClass(this.m_currTaskClass);
		ThreadCore.acquireData(this, {}, CMD.THREAD_ACQUIRE_DATA);
		ThreadCore.useDependency(this);
		ThreadCore.resetCurrTaskClass();
	}
	postDataMessage(data: any, transfers?: ArrayBuffer[]): void {
		// let sendData = {
		// 	cmd: data.cmd,
		// 	taskCmd: data.taskCmd,
		// 	threadIndex: this.threadIndex,
		// 	taskclass: this.m_currTaskClass,
		// 	srcuid: this.m_srcuid,
		// 	dataIndex: this.m_dataIndex,
		// 	streams: data.streams,
		// 	data: data.data
		// };
		ThreadCore.postMessageToThread(data, transfers);
	}
	initDecoder(data: any): void {
		let bin: ArrayBuffer = data.streams[0];
		this.decoder["wasmBinary"] = bin;
		this.decoder["onModuleLoaded"] = (module: any): void => {
			this.parser = module;
			this.dracoParser.parser = module;
			ThreadCore.setCurrTaskClass(this.m_currTaskClass);
			ThreadCore.transmitData(this, data, CMD.THREAD_TRANSMIT_DATA, [bin]);
			ThreadCore.initializeExternModule(this);
			ThreadCore.resetCurrTaskClass();
		};
		DracoDecoderModule(this.decoder);
	}
	receiveData(data: any): void {

		this.m_srcuid = data.srcuid;
		this.m_dataIndex = data.dataIndex;

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
		return "dracoGeomParser";
	}
	dependencyFinish(): void {
		this.m_dependencyFinish = true;
		if (this.m_dependencyFinish && this.m_wasmData != null) {
			this.initDecoder(this.m_wasmData);
		}
	}
}
// 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下实例化代码
let ins = new DracoGeomParseTask();

export { DracoGeomParseTask };

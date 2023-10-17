import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WebGPUContext } from "../../gpu/WebGPUContext";

class WROBufferContext {
	private mWGCtx: WebGPUContext | null = null;
	private static sVtxUid = 0;
	constructor(wgCtx?: WebGPUContext) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	initialize(wgCtx: WebGPUContext): void {
		this.mWGCtx = wgCtx;
	}

	createIndices(dataArray: number[]): Uint32Array | Uint16Array {
		if (dataArray.length <= 65536) {
			return new Uint16Array(dataArray);
		}
		return new Uint32Array(dataArray);
	}
	createIndicesWithSize(size: number): Uint32Array | Uint16Array {
		if (size <= 65536) {
			return new Uint16Array(size);
		}
		return new Uint32Array(size);
	}

	createIndexBuffer(data: Uint32Array | Uint16Array, offset = 0, mappedAtCreation = true): GPUBuffer {
		const buf = this.createBuffer(data, offset, mappedAtCreation, GPUBufferUsage.INDEX);
		buf.dataFormat = data.BYTES_PER_ELEMENT == 2 ? "uint16" : "uint32";
		buf.elementCount = data.length;

		return buf;
	}
	createVertexBuffer(data: Float32Array | Uint32Array | Uint16Array, offset = 0, mappedAtCreation = true): GPUBuffer {
		return this.createBuffer(data, offset, mappedAtCreation, GPUBufferUsage.VERTEX);
	}

	createBuffer(
		data: Float32Array | Uint32Array | Uint16Array | Int32Array | Int16Array | Uint8Array | Int8Array,
		offset = 0,
		mappedAtCreation = true,
		usage = GPUBufferUsage.VERTEX,
		vectorSize = 0
	): GPUBuffer {
		const ctx = this.mWGCtx;
		const buf = ctx.device.createBuffer({
			size: data.byteLength,
			usage: usage,
			mappedAtCreation: mappedAtCreation
		});
		if (mappedAtCreation) {
			if (data instanceof Float32Array) {
				new Float32Array(buf.getMappedRange()).set(data, offset);
				buf.dataFormat = "float32";
			} else if (data instanceof Uint32Array) {
				new Uint32Array(buf.getMappedRange()).set(data, offset);
				buf.dataFormat = "uint32";
			} else if (data instanceof Uint16Array) {
				new Uint16Array(buf.getMappedRange()).set(data, offset);
				buf.dataFormat = "uint16";
			} else if (data instanceof Int32Array) {
				new Int32Array(buf.getMappedRange()).set(data, offset);
				buf.dataFormat = "int32";
			} else if (data instanceof Int16Array) {
				new Int16Array(buf.getMappedRange()).set(data, offset);
				buf.dataFormat = "int16";
			} else if (data instanceof Int8Array) {
				new Int8Array(buf.getMappedRange()).set(data, offset);
				buf.dataFormat = "int8";
			} else if (data instanceof Uint8Array) {
				new Uint8Array(buf.getMappedRange()).set(data, offset);
				buf.dataFormat = "uint8";
			} else {
				throw Error("Illegal data type, need: Float32Array | Uint32Array | Uint16Array  | Int32Array | Int16Array | Uint8Array | Int8Array");
			}
			if(vectorSize > 1) {
				buf.vectorFormat = buf.dataFormat + 'x' + vectorSize;
			}
			buf.unmap();
		}

		buf.uid = WROBufferContext.sVtxUid++;
		return buf;
	}
}
export { WROBufferContext };

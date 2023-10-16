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
		
		if(dataArray.length <= 65536) {
			return new Uint16Array(dataArray);
		}
		return new Uint32Array(dataArray);
	}
	createIndicesWithSize(size: number): Uint32Array | Uint16Array {
		
		if(size <= 65536) {
			return new Uint16Array(size);
		}
		return new Uint32Array(size);
	}

	createIndexBuffer(data: Uint32Array | Uint16Array, offset = 0, mappedAtCreation = true): GPUBuffer {

		const buf = this.createBuffer(data, offset, mappedAtCreation, GPUBufferUsage.INDEX);
		buf.dataFormat = data.BYTES_PER_ELEMENT == 2 ? 'uint16' : 'uint32';
		buf.elementCount = data.length;
		
		return buf;
	}
	createVertexBuffer(data: Float32Array | Uint32Array | Uint16Array, offset = 0, mappedAtCreation = true): GPUBuffer {
		return this.createBuffer(data, offset, mappedAtCreation, GPUBufferUsage.VERTEX);
	}

	createBuffer(data: Float32Array | Uint32Array | Uint16Array, offset = 0, mappedAtCreation = true, usage = GPUBufferUsage.VERTEX): GPUBuffer {

		const ctx = this.mWGCtx;

		const buf = ctx.device.createBuffer({
			size: data.byteLength,
			usage: usage,
			mappedAtCreation: mappedAtCreation
		});
		if(mappedAtCreation) {
			if(data instanceof Float32Array) {
				new Float32Array(buf.getMappedRange()).set(data, offset);
			}else if(data instanceof Uint16Array) {
				new Uint16Array(buf.getMappedRange()).set(data, offset);
			}else if(data instanceof Uint16Array) {
				new Uint16Array(buf.getMappedRange()).set(data, offset);
			}
			buf.unmap();
		}

		buf.uid = WROBufferContext.sVtxUid ++;
		return buf;
	}
}
export { WROBufferContext }

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
	createVertexBuffer(data: Float32Array, offset: number = 0, mappedAtCreation: boolean = true): GPUBuffer {

		const ctx = this.mWGCtx;

		const buf = ctx.device.createBuffer({
			size: data.byteLength,
			usage: GPUBufferUsage.VERTEX,
			mappedAtCreation: mappedAtCreation
		});
		if(mappedAtCreation) {
			new Float32Array(buf.getMappedRange()).set(data, offset);
			buf.unmap();
		}

		buf.uid = WROBufferContext.sVtxUid ++;
		return buf;
	}
}
export { WROBufferContext }

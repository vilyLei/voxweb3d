import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WROPipelineContext } from "../pipeline/WROPipelineContext";
interface RUniformCtx {
	removeUniform(u: WRORUniform): void;
}
class WRORUniform {

	ctx: RUniformCtx = null;
    pipelineCtx: WROPipelineContext | null = null;

	index = -1;
	// usage = 0;
	layoutName = "";

	// texView?: GPUTextureView;
	// sampler?: GPUSampler;

	buffers: GPUBuffer[] | null = null;
	bindGroup: GPUBindGroup | null = null;

	// upateFlag = 1;
	upateFlag = 2;
	/**
	 * bind group index
	 */
	groupIndex = -1;
	constructor(){}

    updateData(data: DataView | Float32Array | Uint32Array | Uint16Array, bufIndex: number = 0): void {
		this.pipelineCtx.updateUniformBufferAt(this.buffers[bufIndex], data, this.index);
    }
	isEnabled(): boolean {
		return this.buffers != null;
	}
	destroy(): void {
		if(this.ctx) {
			this.ctx.removeUniform( this );
		}
	}
	__$$destroy(): void {
		this.groupIndex = -1;
		this.index = -1;
		this.ctx = null;
		this.pipelineCtx = null;
		this.buffers = null;
	}
}
export { WRORUniform }

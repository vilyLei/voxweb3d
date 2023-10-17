import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRUniformValue } from "./WGRUniformValue";
import { IWGRPipelineContext } from "../pipeline/IWGRPipelineContext";

interface WGRUniformCtx {
	removeUniform(u: WGRUniform): void;
}
class WGRUniform {

	private mCtx: WGRUniformCtx = null;
    private mPipelineCtx: IWGRPipelineContext | null = null;

	index = -1;
	layoutName = "";

	buffers: GPUBuffer[] | null = null;
	versions: number[];
	bindGroup: GPUBindGroup | null = null;

	/**
	 * bind group index
	 */
	groupIndex = -1;
	constructor(pipelineCtx: IWGRPipelineContext, ctx: WGRUniformCtx){
		this.mPipelineCtx = pipelineCtx;
		this.mCtx = ctx;
	}

	setValue(value: WGRUniformValue): void {
		const i = value.bufferIndex;
		if(this.versions[i] != value.version) {
			this.versions[i] = value.version;
			// console.log("WRORUniform::setValue(), call ...");
			this.mPipelineCtx.updateUniformBufferAt(this.buffers[i], value.data, this.index);
		}
	}
	isEnabled(): boolean {
		return this.buffers != null;
	}
	destroy(): void {
		if(this.mCtx) {
			this.mCtx.removeUniform( this );
			this.mCtx = null;
		}
	}
	__$$destroy(): void {

		this.groupIndex = -1;
		this.index = -1;
		this.mPipelineCtx = null;
		this.buffers = null;
	}
}
export { WGRUniform }

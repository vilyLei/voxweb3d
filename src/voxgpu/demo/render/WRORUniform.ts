import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRUniformValue } from "../../render/uniform/WGRUniformValue";
import { WROPipelineContext } from "../pipeline/WROPipelineContext";
interface RUniformCtx {
	removeUniform(u: WRORUniform): void;
}
class WRORUniform {

	private mCtx: RUniformCtx = null;
    private mPipelineCtx: WROPipelineContext | null = null;

	index = -1;
	layoutName = "";

	buffers: GPUBuffer[] | null = null;
	versions: number[];
	bindGroup: GPUBindGroup | null = null;

	// for test
	upateFlag = 2;
	/**
	 * bind group index
	 */
	groupIndex = -1;
	constructor(pipelineCtx: WROPipelineContext, ctx: RUniformCtx){
		this.mPipelineCtx = pipelineCtx;
		this.mCtx = ctx;
	}

    updateData(data: NumberArrayDataType, bufsIndex = 0): void {
		this.mPipelineCtx.updateUniformBufferAt(this.buffers[bufsIndex], data, this.index);
    }
    // updateDataWithVersion(data: NumberArrayDataType, version: number, bufsIndex = 0): void {
	// 	if(this.versions[bufsIndex] != version) {
	// 		this.versions[bufsIndex] = version;
	// 		// console.log("updateDataWithVersion(), call ...");
	// 		this.mPipelineCtx.updateUniformBufferAt(this.buffers[bufsIndex], data, this.index);
	// 	}
    // }
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
export { WRORUniform }

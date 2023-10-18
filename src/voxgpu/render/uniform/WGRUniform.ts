import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRUniformValue } from "./WGRUniformValue";
import { IWGRPipelineContext } from "../pipeline/IWGRPipelineContext";

interface WGRUniformCtx {
	removeUniform(u: WGRUniform): void;
}
class WGRUniform {
	private mCloned = false;
	private mCtx: WGRUniformCtx = null;
    private mPipelineCtx: IWGRPipelineContext | null = null;

	private mSubUfs: WGRUniform[] = [];

	uid = 0;

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
		// if(this.mCloned) {
		// 	console.log("dfdfdf, this.uid: ", this.uid, value.uid, ",v: ",this.versions[i],value.version);
		// }
		if(this.versions[i] != value.version) {
			this.versions[i] = value.version;
			// console.log("WRORUniform::setValue(), call ...");
			this.mPipelineCtx.updateUniformBufferAt(this.buffers[i], value.data, this.index, value.byteOffset);
		}
	}
	isEnabled(): boolean {
		return this.buffers != null;
	}
	__$$updateSubUniforms(): void {

		const ufs = this.mSubUfs;
		if(ufs && this.buffers) {
			for(let i = 0, ln = ufs.length; i < ln; i++) {
				this.copySelfTo( ufs[i] );
			}
		}
	}

	private copySelfTo(u: WGRUniform): void {

		u.index = this.index;
		u.layoutName = this.layoutName;
		u.buffers = this.buffers;
		u.bindGroup = this.bindGroup;
		u.groupIndex = this.groupIndex;
		u.versions = this.versions.slice(0);
		// console.log("copySelfTo(), u.versions: ", u.versions);
	}
	clone(): WGRUniform {

		const u = new WGRUniform(this.mPipelineCtx, this.mCtx);
		u.index = this.index;
		u.layoutName = this.layoutName;
		u.buffers = this.buffers;
		u.bindGroup = this.bindGroup;
		u.groupIndex = this.groupIndex;
		u.mCloned = true;
		this.mSubUfs.push(u);
		return u;
	}

	cloneMany(total:number): WGRUniform[] {
		const ls: WGRUniform[] = new Array(total);
		for(let i = 0; i < total; ++i) {
			ls[i] = this.clone();
			ls[i].uid = 1000 + i;
		}
		return ls;
	}
	destroy(): void {
		if(this.mCtx) {
			this.mSubUfs = [];
			if(this.mCloned) {

				this.index = -1;
				this.groupIndex = -1;
				this.buffers = null;
				this.bindGroup = null;
			}else {

				this.mCtx.removeUniform( this );
				this.mCtx = null;
			}
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

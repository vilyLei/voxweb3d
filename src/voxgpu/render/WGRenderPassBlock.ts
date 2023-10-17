import { RRendererPass } from "../demo/pipeline/RRendererPass";
import { RPipelineParams } from "../demo/pipeline/RPipelineParams";
import { VtxPipelinDescParam, WROPipelineContext } from "../demo/pipeline/WROPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { WGRUnit } from "./WGRUnit";

class WGRenderPassBlock {
	private mPipelineCtxs: WROPipelineContext[] = [];
	private mUnits: WGRUnit[] = [];
	private mWGCtx: WebGPUContext | null;
	private rendererPass = new RRendererPass();

	enabled = true;
	rcommands: GPUCommandBuffer[];
	constructor(wgCtx?: WebGPUContext, param?: {sampleCount: number, multisampleEnabled: boolean}) {
		this.initialize(wgCtx, param);
	}
	initialize(wgCtx: WebGPUContext, param?: {sampleCount: number, multisampleEnabled: boolean}): void {
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			this.rendererPass.initialize(wgCtx);
			this.rendererPass.build(param);
		}
	}

	createRUnit(): WGRUnit {
		let u = new WGRUnit();
		this.mUnits.push(u);
		return u;
	}
	createRenderPipeline(pipelineParams: RPipelineParams, vtxDesc: VtxPipelinDescParam): WROPipelineContext {
		let pipelineCtx = new WROPipelineContext(this.mWGCtx);
		this.mPipelineCtxs.push(pipelineCtx);
		pipelineCtx.createRenderPipelineWithBuf(pipelineParams, vtxDesc);
		return pipelineCtx;
	}

	runBegin(): void {
		this.rcommands = [];
		if (this.enabled) {
			this.rendererPass.runBegin();
			for (let i = 0; i < this.mPipelineCtxs.length; ++i) {
				this.mPipelineCtxs[i].runBegin();
			}
		}
	}
	runEnd(): void {
		if (this.enabled) {
			for (let i = 0; i < this.mPipelineCtxs.length; ++i) {
				this.mPipelineCtxs[i].runEnd();
			}
			this.rcommands = [this.rendererPass.runEnd()];
		}
	}
	run(): void {
		if (this.enabled) {
			const passEncoder = this.rendererPass.passEncoder;
			const uts = this.mUnits;
			const utsLen = uts.length;
			for (let i = 0; i < utsLen; ++i) {
				const ru = uts[i];
				if (ru.enabled) {
					ru.runBegin(passEncoder);
					ru.run(passEncoder);
				}
			}
		}
	}
	destroy(): void {
		if (this.mWGCtx) {
			this.mWGCtx = null;
		}
	}
}
export { WGRenderPassBlock };

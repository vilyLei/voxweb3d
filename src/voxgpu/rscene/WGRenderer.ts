import { VtxPipelinDescParam, WROPipelineContext } from "../demo/pipeline/WROPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { WGRenderPassBlock } from "../render/WGRenderPassBlock";
class WGRenderer {

	private mRPBlocks: WGRenderPassBlock[] = [];
	private mWGCtx: WebGPUContext | null;
	enabled = true;
	rcommands: GPUCommandBuffer[];
	constructor(wgCtx?: WebGPUContext) {
		this.initialize(wgCtx);
	}
	initialize(wgCtx: WebGPUContext): void {
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
		}
	}
	getRPBlockAt(i: number): WGRenderPassBlock {
		return this.mRPBlocks[i];
	}
	createRenderBlock(param?: {sampleCount: number, multisampleEnabled: boolean}): WGRenderPassBlock {
		if (this.mWGCtx) {
			let rb = new WGRenderPassBlock(this.mWGCtx, param);
			this.mRPBlocks.push( rb );
			return rb;
		}
		return null;
	}
	run(): void {
		const ctx = this.mWGCtx;
		const rbs = this.mRPBlocks;
		if (ctx && ctx.enabled && rbs.length > 0) {
			const rb = rbs[0];
			rb.runBegin();

			rb.run();

			rb.runEnd();
			const cmds = rb.rcommands;
			ctx.queue.submit(cmds);
		}
	}
}
export { WGRenderer }

import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGMaterial } from "../material/WGMaterial";
import { WGRPipelineContextDefParam, WGRPassParams, WGRenderPassBlock } from "../render/WGRenderPassBlock";
class WGRenderer {
	private mRPBlocks: WGRenderPassBlock[] = [];
	private mWGCtx: WebGPUContext | null;

	enabled = true;
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
	createRenderBlock(param?: WGRPassParams): WGRenderPassBlock {
		if (this.mWGCtx) {
			let rb = new WGRenderPassBlock(this.mWGCtx, param);
			this.mRPBlocks.push(rb);
			return rb;
		}
		return null;
	}
	bindMaterial(material: WGMaterial, block: WGRenderPassBlock): WGMaterial {
		if (this.mWGCtx) {
			const p = block.createRenderPipelineCtxWithMaterial(material);
			material.initialize(p);
		}
		return material;
	}
	run(): void {
		if (this.enabled) {
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
}
export { WGRPipelineContextDefParam, WGRenderer };

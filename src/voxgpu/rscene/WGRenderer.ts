import CameraBase from "../../vox/view/CameraBase";
import { Entity3D } from "../entity/Entity3D";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGMaterial } from "../material/WGMaterial";
import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { WGRPipelineContextDefParam, WGRPassParams, WGRenderPassBlock } from "../render/WGRenderPassBlock";
import Vector3D from "../../vox/math/Vector3D";
class WGRenderer {

	private mRPBlocks: WGRenderPassBlock[] = [];
	private mWGCtx: WebGPUContext;
	private mROBuilder = new WGRObjBuilder();

	readonly camera = new CameraBase();

	enabled = true;
	constructor(wgCtx?: WebGPUContext) {
		this.initialize(wgCtx);
	}
	private initCamera(width: number, height: number): void {

		console.log("width, height: ", width, height);
		const cam = this.camera;
		const camUpDirect = new Vector3D(0, 1, 0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		cam.lookAtRH(new Vector3D(800.0, 800.0, 800.0), new Vector3D(), camUpDirect);
		cam.update();
	}
	initialize(wgCtx: WebGPUContext): void {

		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			const canvas = wgCtx.canvas;
			this.initCamera(canvas.width, canvas.height);
		}
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	addEntity(entity: Entity3D, processIndex = 0, deferred = true): void {
		if (entity) {
			if (processIndex == 0 && this.mRPBlocks.length < 1) {
				this.createRenderBlock({
					sampleCount: 4,
					multisampleEnabled: true,
					depthFormat: "depth24plus"
				});
			}
			if (processIndex >= 0 && processIndex < this.mRPBlocks.length) {
				const rb = this.mRPBlocks[processIndex];
				const runit = this.mROBuilder.createRUnit(entity, rb);
				rb.addRUnit(runit);
			} else {
				throw Error("Illegal operation !!!");
			}
		}
	}
	getRPBlockAt(i: number): WGRenderPassBlock {
		return this.mRPBlocks[i];
	}
	createRenderBlock(param?: WGRPassParams): WGRenderPassBlock {
		if (this.mWGCtx) {
			const rb = new WGRenderPassBlock(this.mWGCtx, param);
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

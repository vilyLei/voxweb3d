import CameraBase from "../../vox/view/CameraBase";
import { Entity3D } from "../entity/Entity3D";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGMaterial } from "../material/WGMaterial";
import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { WGRPipelineContextDefParam, WGRPassParams, WGRenderPassBlock } from "../render/WGRenderPassBlock";
import { WGEntityNodeMana } from "./WGEntityNodeMana";
import Vector3D from "../../vox/math/Vector3D";

class WGRenderer {

	private mInit = true;

	private mRPBlocks: WGRenderPassBlock[] = [];
	private mPassParams: WGRPassParams[] = [];
	private mWGCtx: WebGPUContext;
	private mROBuilder = new WGRObjBuilder();
	private mNodeMana = new WGEntityNodeMana();

	readonly camera = new CameraBase();

	enabled = true;

	constructor(param?: { ctx: WebGPUContext }) {
		this.mNodeMana.target = this;
		if (param) {
			this.initialize(param);
		}
	}
	private initCamera(width: number, height: number): void {

		const cam = this.camera;
		const camUpDirect = new Vector3D(0, 1, 0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		cam.lookAtRH(new Vector3D(800.0, 800.0, 800.0), new Vector3D(), camUpDirect);
		cam.update();
	}

	initialize(param?: { ctx?: WebGPUContext; canvas?: HTMLCanvasElement; callback?: (type?: string) => void }): void {

		if (this.mInit && !this.mWGCtx) {
			this.mInit = false;
			const wgCtx = param ? param.ctx : null;

			if (wgCtx) {
				// console.log("WGRenderer::initialize(), a 01");

				this.mWGCtx = wgCtx;
				const canvas = wgCtx.canvas;
				this.initCamera(canvas.width, canvas.height);
			} else {
				// console.log("WGRenderer::initialize(), b 01");

				let canvas = param ? param.canvas : null;
				canvas = canvas ? canvas : document.createElement("canvas");
				canvas.width = 512;
				canvas.height = 512;
				document.body.appendChild(canvas);
				this.mWGCtx = new WebGPUContext();
				this.mWGCtx.initialize(canvas, { alphaMode: "premultiplied" }).then(() => {

					this.init();

					console.log("WGRenderer::initialize(), webgpu initialization success ...");
					if (param && param.callback) {
						param.callback("");
					}
					this.mNodeMana.updateToTarget();
				});
			}
		}
	}
	private init(): void {
		const canvas = this.mWGCtx.canvas;
		this.initCamera(canvas.width, canvas.height);
		for(let i = 0; i < this.mPassParams.length; ++i) {
			this.createRenderBlock(this.mPassParams[i]);
		}
		this.mPassParams = [];
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	addEntity(entity: Entity3D, processIndex = 0, deferred = true): void {
		if (this.mInit) {
			this.initialize();
		}
		if (entity) {
			if (this.mWGCtx && this.mWGCtx.enabled && entity.isREnabled()) {
				// console.log("WGRenderer::addEntity(), a 03");
				if (processIndex == 0 && this.mRPBlocks.length < 1) {
					this.createRenderBlock({
						sampleCount: 4,
						multisampleEnabled: true,
						depthFormat: "depth24plus"
					});
				}
				if (processIndex >= 0 && processIndex < this.mRPBlocks.length) {
					entity.applyCamera(this.camera);
					const rb = this.mRPBlocks[processIndex];
					const runit = this.mROBuilder.createRUnit(entity, rb);
				} else {
					throw Error("Illegal operation !!!");
				}
			} else {
				// console.log("WGRenderer::addEntity(), b 03");
				this.mNodeMana.addEntity(entity, processIndex, deferred);
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
		}else {
			this.mPassParams.push(param);
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
			if (ctx && ctx.enabled) {
				this.mNodeMana.update();

				const rbs = this.mRPBlocks;
				if (rbs.length > 0) {
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
	destroy(): void {
		const ctx = this.mWGCtx;
		if (ctx && ctx.enabled) {
		}
	}
}
export { WGRPipelineContextDefParam, WGRenderer };

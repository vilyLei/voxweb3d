import { WebGPUContext } from "../gpu/WebGPUContext";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import { DrawInsScene } from "./scene/DrawInsScene";

export class DemoDrawInstance {
	private mRenderingFlag = 0;
	private mWGCtx = new WebGPUContext();
	private mFPS = new RenderStatusDisplay();
	private mRsc = new DrawInsScene();

	constructor() {}

	initialize(): void {
		console.log("DemoDrawInstance::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);
		this.mFPS.initialize(null, false);
		this.mRsc.wgCtx = this.mWGCtx;

		const cfg = { alphaMode: "premultiplied" };
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization success ...");
			this.mRsc.initialize(canvas);

			document.onmousedown = evt => {
				// this.mRenderingFlag = 1;
				// this.runDo();
			};
		});
	}

	private renderFrame(): void {
		const renderer = this.mRsc.renderer;
		renderer.run();
	}
	run(): void {
		if (this.mRenderingFlag < 1) {
			this.runDo();
		}
	}
	private runDo(): void {
		if (this.mRsc.enabled) {
			this.mFPS.update();
			this.mRsc.update();
			this.renderFrame();
		}
	}
}

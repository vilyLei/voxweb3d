import { WebGPUContext } from "../gpu/WebGPUContext";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import { DrawInsScene } from "./scene/DrawInsScene";
import { DrawInsScene2 } from "./scene/DrawInsScene2";
import { DrawInsScene3 } from "./scene/DrawInsScene3";

export class DemoDrawInstance {
	private mRenderingFlag = 0;
	private mUpateFlag = 0;
	private mWGCtx = new WebGPUContext();
	private mFPS = new RenderStatusDisplay();
	// private mRsc = new DrawInsScene();
	// private mRsc = new DrawInsScene2();
	private mRsc = new DrawInsScene3();

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
				this.mUpateFlag = this.mUpateFlag > 0 ? 0 : 1;
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
			if(this.mUpateFlag < 1) {
				this.mRsc.update();
			}
			this.renderFrame();
		}
	}
}

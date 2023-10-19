import { WebGPUContext } from "../gpu/WebGPUContext";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import { EntityAnimatedScene } from "./scene/EntityAnimatedScene";

export class DemoEntityAnimate {

	private mRenderingFlag = 0;
	private mWGCtx = new WebGPUContext();
	private mFPS = new RenderStatusDisplay();
	private mRScene = new EntityAnimatedScene();

	constructor() {}

	initialize(): void {
		console.log("DemoEntityAnimate::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		this.mFPS.initialize(null, false);
		this.mRScene.wgCtx = this.mWGCtx;

		this.mWGCtx.initialize(canvas, { alphaMode: "premultiplied" }).then(() => {
			console.log("webgpu initialization success ...");
			this.mRScene.initialize(canvas);

			document.onmousedown = evt => {
				// this.mRenderingFlag = 1;
				// this.runDo();
			};
		});
	}

	private renderFrame(): void {
		const renderer = this.mRScene.renderer;
		renderer.run();
	}
	run(): void {
		if (this.mRenderingFlag < 1) {
			this.runDo();
		}
	}
	private runDo(): void {
		if (this.mRScene.enabled) {
			this.mFPS.update();
			this.mRScene.update();
			this.renderFrame();
		}
	}
}

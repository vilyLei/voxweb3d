import { WebGPUContext } from "../gpu/WebGPUContext";
import { TriangleScene } from "./scene/TriangleScene";

export class DemoTriangle {

	private mWGCtx = new WebGPUContext();
	private mRScene = new TriangleScene();

	constructor() {}

	initialize(): void {
		console.log("DemoTriangle::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		this.mWGCtx.initialize(canvas, { alphaMode: "premultiplied" }).then(() => {
			console.log("webgpu initialization success ...");
			this.mRScene.initialize(this.mWGCtx);
		});
	}

	run(): void {
		this.mRScene.renderer.run();
	}
}

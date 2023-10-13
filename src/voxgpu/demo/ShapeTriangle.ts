import { WebGPUContext } from "../gpu/WebGPUContext";

import triangleVertWGSL from "./shaders/triangle.vert.wgsl";
import redFragWGSL from "./shaders/red.frag.wgsl";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { GPURenderPassDescriptor } from "../gpu/GPURenderPassDescriptor";

export class ShapeTriangle {
	private mWGCtx = new WebGPUContext();
	private mRPipeline: GPURenderPipeline | null = null;

	constructor() {}
	initialize(): void {

		console.log("ShapeTriangle::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		// const devicePixelRatio = window.devicePixelRatio || 1;
		// canvas.width = canvas.clientWidth * devicePixelRatio;
		// canvas.height = canvas.clientHeight * devicePixelRatio;

		const ctx = this.mWGCtx;

		const cfg = {
			alphaMode: "premultiplied"
		};
		this.mWGCtx.initialize(canvas, cfg).then(() => {
			console.log("webgpu initialization success ...");

			this.mRPipeline = this.createRenderPipeline();

			this.renderFrame();
		});
	}
	private createRenderPipeline(): GPURenderPipeline {
		const ctx = this.mWGCtx;
		const device = ctx.device;

		const pipeline = device.createRenderPipeline({
			layout: "auto",
			vertex: {
				module: device.createShaderModule({
					code: triangleVertWGSL
				}),
				entryPoint: "main"
			},
			fragment: {
				module: device.createShaderModule({
					code: redFragWGSL
				}),
				entryPoint: "main",
				targets: [
					{
						format: ctx.presentationFormat
					}
				]
			},
			primitive: {
				topology: "triangle-list"
			}
		});
		return pipeline;
	}

	private renderFrame(): void {
		const ctx = this.mWGCtx;
		const device = ctx.device;
		const context = ctx.context;
		const pipeline = this.mRPipeline;

		const commandEncoder = device.createCommandEncoder();
		const textureView = context.getCurrentTexture().createView();

		const renderPassDescriptor: GPURenderPassDescriptor = {
			colorAttachments: [
				{
					view: textureView,
					clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
					loadOp: "clear",
					storeOp: "store"
				}
			]
		};
		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
		passEncoder.setPipeline(pipeline);
		passEncoder.draw(3);
		passEncoder.end();

		device.queue.submit([commandEncoder.finish()]);
	}
	run(): void {}
}

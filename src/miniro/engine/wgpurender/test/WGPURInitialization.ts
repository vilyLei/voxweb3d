import Color4 from "../../../../vox/material/Color4";

export class WGPURInitialization {
	private mWGPUDevice: any | null = null;
	private mWGPUContext: any | null = null;
	constructor() {}
	initialize(): void {
		console.log("WGPURInitialization::initialize() ...");
		// const canvas = document.querySelector("canvas");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);
		console.log("ready init webgpu ...");
		this.initWebGPU(canvas).then(() => {
			console.log("webgpu initialization finish ...");

			this.clearWGPUCanvas();
		});
		document.onmousedown = (evt):void => {
			this.clearWGPUCanvas( new Color4( Math.random(), Math.random(), Math.random()) );
		}
	}
	private clearWGPUCanvas(clearColor: Color4 = null): void {

		console.log("WGPURInitialization::clearWGPUCanvas() ...");
		// thanks: https://developer.mozilla.org/zh-CN/docs/Web/API/WebGPU_API
		// const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };
		//const clearColor = new Color4(0.5,0.2);
		clearColor = clearColor ? clearColor : new Color4(0.5, 0.2);
		const device = this.mWGPUDevice;
		const context = this.mWGPUContext;
		const encoder = device.createCommandEncoder();
		const pass = encoder.beginRenderPass({
			colorAttachments: [
				{
					clearValue: clearColor,
					// clearValue: [0.3,0.7,0.5,1.0], // yes
					view: context.getCurrentTexture().createView(),
					loadOp: "clear",
					storeOp: "store"
				}
			]
		});
		pass.end();
		const commandBuffer = encoder.finish();
		device.queue.submit([commandBuffer]);
	}
	private async initWebGPU(canvas: HTMLCanvasElement) {
		// thanks: https://codelabs.developers.google.com/your-first-webgpu-app?hl=zh-cn#2
		const gpu = (navigator as any).gpu;
		if (gpu) {
			console.log("WebGPU supported on this browser.");

			const adapter = await gpu.requestAdapter();
			if (adapter) {
				console.log("Appropriate GPUAdapter found.");
				const device = await adapter.requestDevice();
				if (device) {
					this.mWGPUDevice = device;
					console.log("Appropriate GPUDevice found.");
					const context = canvas.getContext("webgpu") as any;
					const canvasFormat = gpu.getPreferredCanvasFormat();
					this.mWGPUContext = context;
					console.log("canvasFormat: ", canvasFormat);
					context.configure({
						device: device,
						format: canvasFormat,
						alphaMode: "premultiplied"
					});
				} else {
					throw new Error("No appropriate GPUDevice found.");
				}
			} else {
				throw new Error("No appropriate GPUAdapter found.");
			}
		} else {
			throw new Error("WebGPU not supported on this browser.");
		}
	}
	run(): void {}
}

export default WGPURInitialization;

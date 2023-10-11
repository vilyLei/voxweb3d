
import { GPU } from "./GPU";
import { GPUDevice } from "./GPUDevice";
import { GPUAdapter } from "./GPUAdapter";
import { GPUQueue } from "./GPUQueue";
import { GPUCanvasContext } from "./GPUCanvasContext";
import { GPUCanvasConfiguration } from "./GPUCanvasConfiguration";

class WebGPUContext {

	readonly canvas: HTMLCanvasElement = null;
	readonly context: GPUCanvasContext = null;
	readonly device: GPUDevice = null;
	readonly queue: GPUQueue = null;
	readonly canvasFormat: string = null;

	readonly gpu: GPU = null;
	readonly gpuAdapter: GPUAdapter = null;

	constructor(){}
	async initialize(canvas: HTMLCanvasElement, wgConfig: GPUCanvasConfiguration | null = null) {

		const selfT = this as any;
		selfT.canvas = canvas;

		const gpu: GPU = (navigator as any).gpu;
		if (gpu) {
			console.log("WebGPU is supported on this browser.");
			selfT.gpu = gpu;

			const adapter = await gpu.requestAdapter();
			if (adapter) {
				selfT.gpuAdapter = adapter;
				console.log("Appropriate GPUAdapter found, adapter: ", adapter);
				const device = await adapter.requestDevice();
				if (device) {

					selfT.device = device;
					selfT.queue = device.queue;
					console.log("Appropriate GPUDevice found.");
					const context = canvas.getContext("webgpu") as any;
					let canvasFormat = gpu.getPreferredCanvasFormat();
					selfT.context = context;
					selfT.canvasFormat = canvasFormat;
					console.log("canvasFormat: ", canvasFormat);
					if(wgConfig) {
						wgConfig.device = device;
						if(wgConfig.format === undefined) {
							wgConfig.format = canvasFormat;
						}else {
							canvasFormat = wgConfig.format;
						}
					}
					context.configure(wgConfig ? wgConfig : {
						device: device,
						format: canvasFormat,
						// usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
						alphaMode: "premultiplied"
					});
					console.log("WebGPUContext instance initialization success ...");
				} else {
					throw new Error("No appropriate GPUDevice found.");
				}
			} else {
				throw new Error("No appropriate GPUAdapter found.");
			}
		} else {
			throw new Error("WebGPU is not supported on this browser.");
		}
	}
	createCurrentView(): any {
		return this.context.getCurrentTexture().createView();
	}
}
export { WebGPUContext };


import { GPU } from "./GPU";
import { GPUDevice } from "./GPUDevice";
import { GPUAdapter } from "./GPUAdapter";
import { GPUQueue } from "./GPUQueue";
import { GPUCanvasContext } from "./GPUCanvasContext";
import { GPUCanvasConfiguration } from "./GPUCanvasConfiguration";
import { GPUDeviceDescriptor } from "./GPUDeviceDescriptor";
import { GPUTextureView } from "./GPUTextureView";
import { checkGPUTextureFormat, GPUTextureFormat } from "./GPUTextureFormat";
import { calculateMipLevels, GPUMipmapGenerator } from "../texture/GPUMipmapGenerator";

class WebGPUContext {

	readonly canvas: HTMLCanvasElement = null;
	readonly context: GPUCanvasContext = null;
	readonly device: GPUDevice = null;
	readonly queue: GPUQueue = null;
	readonly canvasFormat: string = null;
	readonly presentationFormat = "bgra8unorm";
	readonly gpu: GPU = null;
	readonly gpuAdapter: GPUAdapter = null;
	readonly enabled = false;
	
	readonly mipmapGenerator = new GPUMipmapGenerator();
	constructor(){}
	async initialize(canvas: HTMLCanvasElement, wgConfig?: GPUCanvasConfiguration, deviceDescriptor?: GPUDeviceDescriptor) {

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
				const device = await adapter.requestDevice(deviceDescriptor);
				if (device) {
					
					this.mipmapGenerator.initialize(device);

					selfT.device = device;
					selfT.queue = device.queue;
					console.log("Appropriate GPUDevice found.");
					let canvasFormat = gpu.getPreferredCanvasFormat();
					selfT.canvasFormat = canvasFormat;

					selfT.context = canvas.getContext("webgpu") as any;
					const context = this.context;

					const format = canvasFormat;
					if(checkGPUTextureFormat(format)) {
						console.log("Given canvasFormat('"+format+"') is a valid gpu texture format.");
					}else {
						console.error("Given canvasFormat('"+format+"') is an invalid gpu texture format.");
						canvasFormat = "bgra8unorm";
					}

					if(wgConfig) {
						wgConfig.device = device;
						if(wgConfig.format) {
							canvasFormat = wgConfig.format;
						}else {
							wgConfig.format = canvasFormat;
						}
					}
					selfT.presentationFormat = wgConfig.format;

					context.configure(wgConfig ? wgConfig : {
						device: device,
						format: canvasFormat,
						// usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
						alphaMode: "premultiplied"
					});
					selfT.enabled = true;
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
	getPreferredCanvasFormat(): string {
		return this.gpu.getPreferredCanvasFormat();
	}
	createCurrentView(): GPUTextureView {
		return this.context.getCurrentTexture().createView();
	}
}
export { calculateMipLevels, WebGPUContext };


import { GPU } from "../../../../../voxgpu/gpu/GPU";
import { GPUDevice } from "../../../../../voxgpu/gpu/GPUDevice";
import { GPUAdapter } from "../../../../../voxgpu/gpu/GPUAdapter";
import { GPUQueue } from "../../../../../voxgpu/gpu/GPUQueue";
import { GPUCanvasContext } from "../../../../../voxgpu/gpu/GPUCanvasContext";
import { GPUCanvasConfiguration } from "../../../../../voxgpu/gpu/GPUCanvasConfiguration";

class WGContext {

	readonly context: GPUCanvasContext = null;
	readonly device: GPUDevice = null;
	readonly deviceQueue: GPUQueue = null;
	readonly canvasFormat: string = null;

	readonly gpu: GPU = null;
	readonly gpuAdapter: GPUAdapter = null;

	constructor(){}
	async initialize(canvas: HTMLCanvasElement, cfg: GPUCanvasConfiguration | null = null) {

		const gpu: GPU = (navigator as any).gpu;
		if (gpu) {
			console.log("WebGPU is supported on this browser.");
			const selfT = this as any;
			selfT.gpu = gpu;

			const adapter = await gpu.requestAdapter();
			if (adapter) {
				selfT.gpuAdapter = adapter;
				console.log("Appropriate GPUAdapter found.");
				const device = await adapter.requestDevice();
				if (device) {

					selfT.device = device;
					selfT.deviceQueue = device.queue;
					console.log("Appropriate GPUDevice found.");
					const context = canvas.getContext("webgpu") as any;
					let canvasFormat = gpu.getPreferredCanvasFormat();
					selfT.context = context;
					selfT.canvasFormat = canvasFormat;
					console.log("canvasFormat: ", canvasFormat);
					if(cfg) {
						cfg.device = device;
						if(cfg.format === undefined) {
							cfg.format = canvasFormat;
						}else {
							canvasFormat = cfg.format;
						}
					}
					context.configure(cfg ? cfg : {
						device: device,
						format: canvasFormat,
						// usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
						alphaMode: "premultiplied"
					});
					console.log("webgpu context initialization success ...");
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
export { WGContext };


import { GPU } from "./GPU";
import { GPUDevice } from "./GPUDevice";
import { GPUAdapter } from "./GPUAdapter";
import { GPUQueue } from "./GPUQueue";
import { GPUCanvasContext } from "./GPUCanvasContext";
import { GPUTextureView } from "./GPUTextureView";
interface WebGPUContextImpl {

	readonly canvas: HTMLCanvasElement;
	readonly context: GPUCanvasContext;
	readonly device: GPUDevice;
	readonly queue: GPUQueue;
	readonly canvasFormat: string;
	readonly presentationFormat: string;
	readonly gpu: GPU;
	readonly gpuAdapter: GPUAdapter;
	readonly enabled: boolean;
	/**
	 * @param format GPU texture format string.
	 * @param error The default value is true.
	 * @returns GPU texture format is correct or wrong.
	 */
	checkGPUTextureFormat(format: string, error?: boolean): boolean;
	getPreferredCanvasFormat(): string
	createCurrentView(): GPUTextureView;
}
export { WebGPUContextImpl };

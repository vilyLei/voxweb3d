import { GPUShaderModule } from "./GPUShaderModule";
import { GPUTextureView } from "./GPUTextureView";

interface GPURenderPassColorAttachment {
	label?: string;

	view: GPUTextureView;
	clearValue: { r: number, g: number,b: number, a: number } | number[] | Float32Array;
	loadOp: string;
	storeOp: string;
}
export { GPURenderPassColorAttachment };

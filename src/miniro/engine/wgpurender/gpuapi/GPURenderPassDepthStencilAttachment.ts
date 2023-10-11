import { GPUTextureView } from "./GPUTextureView";

interface GPURenderPassDepthStencilAttachment {
	label?: string;

	view: GPUTextureView;

	depthClearValue: number;
	depthLoadOp: string;
	depthStoreOp: string;
	stencilClearValue: number;
	stencilLoadOp: string;
	stencilStoreOp: string;
}
export { GPURenderPassDepthStencilAttachment };

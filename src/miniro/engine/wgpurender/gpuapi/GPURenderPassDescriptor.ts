import { GPURenderPassColorAttachment } from "./GPURenderPassColorAttachment";
import { GPURenderPassDepthStencilAttachment } from "./GPURenderPassDepthStencilAttachment";

interface GPURenderPassDescriptor {
	label?: string;

	colorAttachments?: GPURenderPassColorAttachment[];
	depthStencilAttachment?: GPURenderPassDepthStencilAttachment;
}
export { GPURenderPassDescriptor };

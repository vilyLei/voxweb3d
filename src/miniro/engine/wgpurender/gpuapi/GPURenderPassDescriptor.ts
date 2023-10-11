import { GPUQuerySet } from "./GPUQuerySet";
import { GPURenderPassColorAttachment } from "./GPURenderPassColorAttachment";
import { GPURenderPassDepthStencilAttachment } from "./GPURenderPassDepthStencilAttachment";

interface GPURenderPassDescriptor {
	label?: string;

	/**
	 * A number indicating the maximum number of draw calls that will be done in the render pass. 
	 * This is used by some implementations to size work injected before the render pass. 
	 * You should keep the default value — 50000000 — unless you know that more draw calls will be done.
	 */
	maxDrawCount?: number;
	occlusionQuerySet?: GPUQuerySet;

	timestampWrites?: {location: string, queryIndex: number, querySet: GPUQuerySet}[];

	colorAttachments?: GPURenderPassColorAttachment[];
	depthStencilAttachment?: GPURenderPassDepthStencilAttachment;
}
export { GPURenderPassDescriptor };

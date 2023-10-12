import { GPUQuerySet } from "./GPUQuerySet";
import { GPURenderPassColorAttachment } from "./GPURenderPassColorAttachment";
import { GPURenderPassDepthStencilAttachment } from "./GPURenderPassDepthStencilAttachment";

/**
 * see: https://gpuweb.github.io/gpuweb/#dictdef-gpurenderpasstimestampwrites
 * 		https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginRenderPass#colorattachments
 */
interface GPURenderPassTimestampWrites {
	/**
	 * Available values are: "beginning", "end"
	 */
	location: string;
	/**
	 * A number specifying the index position in the querySet that the timestamp will be written to.
	 */
	queryIndex: number;
	/**
	 * The GPUQuerySet, of type "timestamp", that the query results will be written to.
	 */
	querySet: GPUQuerySet;
}
/**
 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginRenderPass#colorattachments
 * 		https://gpuweb.github.io/gpuweb/#render-pass-encoder-creation
 */
interface GPURenderPassDescriptor {
	label?: string;

	/**
	 * A number indicating the maximum number of draw calls that will be done in the render pass.
	 * This is used by some implementations to size work injected before the render pass.
	 * You should keep the default value — 50000000 — unless you know that more draw calls will be done.
	 */
	maxDrawCount?: number;
	/**
	 * The GPUQuerySet that will store the occlusion query results for this pass.
	 */
	occlusionQuerySet?: GPUQuerySet;
	/**
	 * An array of objects defining where and when timestamp query values will be written for this pass.
	 */
	timestampWrites?: GPURenderPassTimestampWrites[];
	/**
	 * An array of objects (see Color attachment object structure) defining the color attachments that will be output to when executing this render pass.
	 */
	colorAttachments: GPURenderPassColorAttachment[];
	/**
	 * An object (see Depth/stencil attachment object structure) defining the depth/stencil attachment that will be output to and tested against when executing this render pass.
	 */
	depthStencilAttachment?: GPURenderPassDepthStencilAttachment;
}
export { GPURenderPassDescriptor };

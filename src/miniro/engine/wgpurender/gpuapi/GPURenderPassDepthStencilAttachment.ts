import { GPUTextureView } from "./GPUTextureView";
/**
 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginRenderPass#depthstencil_attachment_object_structure
 * 		https://gpuweb.github.io/gpuweb/#dictdef-gpurenderpassdepthstencilattachment
 */

interface GPURenderPassDepthStencilAttachment {
	label?: string;

	view: GPUTextureView;

	/**
	 * A number indicating the value to clear view's depth component prior to executing the render pass.
	 * This is ignored if depthLoadOp is not set to "clear".
	 * The value must be between 0.0 and 1.0, inclusive.
	 */
	depthClearValue?: number;


	/**
	 * An enumerated value indicating the load operation to perform on view's depth component prior to executing the render pass.
	 * Possible values are:
	 * 		"clear": Loads the clearValue for this attachment into the render pass.
	 * 		"load": Loads the existing value for this attachment into the render pass.
	 * In GPULoadOp: https://gpuweb.github.io/gpuweb/#load-and-store-ops
	 */
	depthLoadOp?: string;
	/**
	 * An enumerated value indicating the store operation to perform on view's depth component after executing the render pass.
	 * Possible values are:
	 * 		"discard": Discards the resulting value of the render pass for this attachment.
	 * 		"store": Stores the resulting value of the render pass for this attachment.
	 * In GPUStoreOp: https://gpuweb.github.io/gpuweb/#load-and-store-ops
	 */
	depthStoreOp?: string;

	/**
	 * A number indicating the value to clear view's stencil component to prior to executing the render pass. This is ignored if stencilLoadOp is not set to "clear".
	 * If stencilClearValue is omitted, it defaults to 0.
	 */
	stencilClearValue?: number;

	/**
	 * An enumerated value indicating the load operation to perform on view's stencil component prior to executing the render pass.
	 * Possible values are:
	 * 		"clear": Loads the clearValue for this attachment into the render pass.
	 * 		"load": Loads the existing value for this attachment into the render pass.
	 * In GPULoadOp: https://gpuweb.github.io/gpuweb/#load-and-store-ops
	 */
	stencilLoadOp?: string;
	/**
	 * An enumerated value indicating the store operation to perform on view's stencil component after executing the render pass.
	 * Possible values are:
	 * 		"discard": Discards the resulting value of the render pass for this attachment.
	 * 		"store": Stores the resulting value of the render pass for this attachment.
	 * In GPUStoreOp: https://gpuweb.github.io/gpuweb/#load-and-store-ops
	 */
	stencilStoreOp?: string;

	/**
	 * A boolean. Setting the value to true causes the depth component of view to be read-only.
	 * If depthReadOnly is omitted, it defaults to false.
	 */
	depthReadOnly?: boolean;
}
export { GPURenderPassDepthStencilAttachment };

import { GPUShaderModule } from "./GPUShaderModule";
import { GPUTextureView } from "./GPUTextureView";

interface GPURenderPassColorAttachment {
	label?: string;

	/**
	 * A GPUTextureView object representing the texture subresource that will be output to for this color attachment.
	 */
	view?: GPUTextureView;
	/**
	 * An enumerated value indicating the load operation to perform on view prior to executing the render pass. Possible values are:
	 * 		"clear": Loads the clearValue for this attachment into the render pass.
	 * 		"load": Loads the existing value for this attachment into the render pass.
	 * In GPULoadOp: https://gpuweb.github.io/gpuweb/#load-and-store-ops
	 */
	loadOp: string;
	/**
	 * An enumerated value indicating the store operation to perform on view after executing the render pass. Possible values are:
	 * 		"discard": Discards the resulting value of the render pass for this attachment.
	 * 		"store": Stores the resulting value of the render pass for this attachment.
	 * In GPUStoreOp: https://gpuweb.github.io/gpuweb/#load-and-store-ops
	 */
	storeOp: string;
	/**
	 * A GPUTextureView object representing the texture subresource that will receive the resolved output for this color attachment if view is multisampled.
	 */
	resolveTarget?: GPUTextureView;
	/**
	 * A color value to clear the view texture to, prior to executing the render pass.
	 * This value is ignored if loadOp is not set to "clear".
	 * clearValue takes an array or object representing the four color components r, g, b, and a as decimals.
	 */
	clearValue?: { r: number, g: number,b: number, a: number } | number[] | Float32Array;
}
export { GPURenderPassColorAttachment };

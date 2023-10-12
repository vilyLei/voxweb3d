/**
 * see: https://gpuweb.github.io/gpuweb/#dictdef-gpublendcomponent
 *      https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#fragment_object_structure
 */
interface GPUBlendComponent {
	label?: string;

	/**
	 * An enumerated value that defines the blend factor operation to be performed on values from the target attachment.
	 * If omitted, dstFactor defaults to "zero".
	 * Possible values are(in GPUBlendFactor: https://gpuweb.github.io/gpuweb/#enumdef-gpublendfactor):
	 * 		"constant", "dst", "dst-alpha", "one"
	 *		"one-minus-dst", "one-minus-src", "one-minus-src-alpha",
	 * 		"one-minus-dst-alpha", "one-minus-constant", "src",
	 *		"src-alpha", "src-alpha-saturated", "zero"
	 */
	dstFactor?: string;
	/**
	 * An enumerated value that defines the blend factor operation to be performed on values from the fragment shader.
	 * Possible values are the same as for dstFactor.
	 * If omitted, srcFactor defaults to "one".
	 */
	srcFactor?: string;
	/**
	 * An enumerated value that defines the algorithm used to combine source and destination blend factors,
	 * to calculate the final values written to the target attachment components.
	 * If omitted, dstFactor defaults to "add".
	 * Possible values are(in GPUBlendOperation: https://gpuweb.github.io/gpuweb/#enumdef-gpublendoperation):
	 * "add", "max", "min", "reverse-subtract", "subtract"
	 */
	operation?: string;
}
export { GPUBlendComponent };

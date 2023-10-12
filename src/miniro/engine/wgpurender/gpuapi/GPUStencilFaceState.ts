/**
 * see: https://gpuweb.github.io/gpuweb/#dictdef-gpustencilfacestate
 * 		https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#depthstencil_object_structure
 *
 */
interface GPUStencilFaceState {
	/**
	 * The default value is "always".
	 * Possible values are:
	 * 		"never","less","equal","less-equal","greater","not-equal","greater-equal","always",
	 * see: https://gpuweb.github.io/gpuweb/#enumdef-gpucomparefunction
	 */
	compare?: string;
	/**
	 * The default value is "keep".
	 * Possible values are:
	 * 		"keep","zero","replace","invert","increment-clamp","decrement-clamp","increment-wrap","decrement-wrap",
	 * see: https://gpuweb.github.io/gpuweb/#enumdef-gpustenciloperation
	 */
	depthFailOp?: string;
	/**
	 * The default value is "keep".
	 * Possible values are the same as for depthFailOp.
	 */
	failOp?: string;
	/**
	 * The default value is "keep".
	 * Possible values are the same as for depthFailOp.
	 */
	passOp?: string;
}
export { GPUStencilFaceState };

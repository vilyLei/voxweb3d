/**
 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#multisample_object_structure
 */
interface GPUMultisampleObject {
	/**
	 * A boolean.
	 * A value of true indicates that a fragment's alpha channel should be used to generate a sample coverage mask.
	 * If omitted, alphaToCoverageEnabled defaults to false.
	 */
	alphaToCoverageEnabled?: boolean;
	/**
	 * A number that defines the number of samples per pixel
	 */
	count?: number;
	/**
	 * A bitmask that determines which samples are written to.
	 * If omitted, mask defaults to 0xFFFFFFFF.
	 */
	mask?: number;
}
export { GPUMultisampleObject };

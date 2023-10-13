/**
 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#primitive_object_structure
 */
interface GPUPrimitiveState {
	label?: string;
	/**
	 * Possible values are: "ccw", "cw", the default value is "ccw"
	 */
	frontFace?: string;
	/**
	 * Possible values are: "back", "front", "none", the default value is "none"
	 */
	cullMode?: string;

	/**
	 * Possible values are: "uint16", "uint32"
	 */
	stripIndexFormat?: string;

	/**
	 * Possible values are: "triangle-strip", "triangle-list", "point-list", "line-list", "line-strip"
	 * the default value is "triangle-list"
	 */
	topology?: string;

	/**
	 * A boolean. A value of true indicates that depth clipping is disabled.
	 * If omitted, unclippedDepth defaults to false.
	 * Note that to control depth clipping, the depth-clip-control feature must be enabled in the GPUDevice.
	 */
	unclippedDepth?: boolean;
}
export { GPUPrimitiveState };

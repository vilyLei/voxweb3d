import { GPUStencilFaceState } from "./GPUStencilFaceState";
/**
 * see: https://gpuweb.github.io/gpuweb/#depth-stencil-state
 * 		https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#depthstencil_object_structure
 *
 */
interface GPUDepthStencilState {
	label?: string;
	/**
	 * A boolean.
	 * A value of true specifies that the GPURenderPipeline can modify depthStencilAttachment depth values after creation.
	 * Setting it to false means it cannot.
	 */
	depthWriteEnabled?: boolean;
	/**
	 * An enumerated value specifying the comparison operation used to test fragment depths against depthStencilAttachment depth values.
	 * Possible flag values are(in GPUCompareFunction: https://gpuweb.github.io/gpuweb/#enumdef-gpucomparefunction):
	 * 		"never","less","equal","less-equal","greater","not-equal","greater-equal","always",	 *
	 */
	depthCompare?: string;
	/**
	 * An enumerated value specifying the depthStencilAttachment format that the GPURenderPipeline will be compatible with.
	 * Possible flag values are:
	 * 		"stencil8","depth16unorm","depth24plus","depth24plus-stencil8","depth32float","depth32float-stencil8",
	 * See the specification's Texture Formats section for all the available format values(in GPUTextureFormat):
	 * https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
	 */
	format?: string;

	depthBia?: number;
	depthBiasClamp?: number;
	depthBiasSlopeScale?: number;
	stencilBack?: GPUStencilFaceState;
	stencilFront?: GPUStencilFaceState;
	stencilReadMask?: number;
	stencilWriteMask?: number;
}
export { GPUDepthStencilState };

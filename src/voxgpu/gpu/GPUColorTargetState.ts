import { GPUBlendState } from "./GPUBlendState";
/**
 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#fragment_object_structure
 *      https://gpuweb.github.io/gpuweb/#color-target-state
 */
interface GPUColorTargetState {
	label?: string;
	/**
	 * An enumerated value specifying the required format for output colors.
	 * See the specification's Texture Formats section for all the available format values.
	 */
	format: string;
	/**
	 * A object that describes a blend mode to be applied to the output color.
	 */
	blend?: GPUBlendState;
	/**
	 * One or more bitwise flags defining the write mask to apply to the color target state. Possible flag values are:
	 * 		GPUFlagsConstant.RED
	 * 		GPUFlagsConstant.GREEN
	 * 		GPUFlagsConstant.BLUE
	 * 		GPUFlagsConstant.ALPHA
	 * 		GPUFlagsConstant.ALL
	 * If omitted, writeMask defaults to GPUFlagsConstant.ALL.
	 * for example: writeMask: GPUFlagsConstant.RED | GPUFlagsConstant.ALPHA;
	 */
	writeMask?: number;
}
export { GPUColorTargetState };

import { GPUBlendComponent } from "./GPUBlendComponent";
/**
 * The class that describes a blend mode to be applied to the output color.
 * see: https://gpuweb.github.io/gpuweb/#dictdef-gpublendstate
 *      https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#fragment_object_structure
 */
interface GPUBlendState {
	label?: string;

	color?: GPUBlendComponent;
	alpha?: GPUBlendComponent;
}
export { GPUBlendState };

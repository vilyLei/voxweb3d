import { GPUShaderModule } from "./GPUShaderModule";
import { GPUColorTargetState } from "./GPUColorTargetState";
interface GPUFragmentState {
	label?: string;
	/**
	 * for example: {
	 * 			0: false,1200: 3.0,1300: 2.0,
	 * 			width: 20,height: 15,depth: -1,
	 * }
	 */
	constants?: any;
	module: GPUShaderModule;
	entryPoint: string;
	targets: GPUColorTargetState[];
}
export { GPUFragmentState };

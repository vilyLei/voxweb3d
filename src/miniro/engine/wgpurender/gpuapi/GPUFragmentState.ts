import { GPUShaderModule } from "./GPUShaderModule";
import { GPUColorTargetState } from "./GPUColorTargetState";
interface GPUFragmentState {
	label?: string;
	module: GPUShaderModule;
	entryPoint: string;
	targets: GPUColorTargetState[];
}
export { GPUFragmentState };

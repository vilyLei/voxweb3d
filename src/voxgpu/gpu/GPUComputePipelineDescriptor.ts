import { GPUPipelineLayout } from "./GPUPipelineLayout";
import { GPUShaderModule } from "./GPUShaderModule";

// see: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createComputePipeline

interface GPUComputeDescriptor {
	module: GPUShaderModule;
	entryPoint: string;
	constants?: any;
}
interface GPUComputePipelineDescriptor {
	label?: string;

	layout: GPUPipelineLayout;
	compute: GPUComputeDescriptor;
}
export { GPUComputePipelineDescriptor };

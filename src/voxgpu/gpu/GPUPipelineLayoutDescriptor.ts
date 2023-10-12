import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
interface GPUPipelineLayoutDescriptor {
	label?: string;
	bindGroupLayouts: GPUBindGroupLayout[];
}
export { GPUPipelineLayoutDescriptor };

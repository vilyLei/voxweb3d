import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
interface GPUComputePipeline {
	label?: string;
	getBindGroupLayout(index: number): GPUBindGroupLayout;
}
export { GPUComputePipeline };

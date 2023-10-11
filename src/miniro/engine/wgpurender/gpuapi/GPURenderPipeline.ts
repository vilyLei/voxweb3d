import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
interface GPURenderPipeline {
	label?: string;
	getBindGroupLayout(index: number): GPUBindGroupLayout;
}
export { GPURenderPipeline };

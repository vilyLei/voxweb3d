import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
interface GPURenderPipeline {
	label?: string;
	uid?: number;
	getBindGroupLayout(index: number): GPUBindGroupLayout;
}
export { GPURenderPipeline };

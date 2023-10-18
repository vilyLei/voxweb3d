import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
import { GPURenderPipeline } from "./GPURenderPipeline";
class GPURenderPipelineEmpty implements GPURenderPipeline {
	label?: string;
	uid?: number;
	getBindGroupLayout(index: number): GPUBindGroupLayout {
		throw Error("illegal operations !!!");
		return {} as GPUBindGroupLayout;
	};
}
export { GPURenderPipelineEmpty };

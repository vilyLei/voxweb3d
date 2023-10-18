import { WGRUniform } from "./uniform/WGRUniform";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRGeometry } from "./WGRGeometry";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";

interface IWGRUnit {
	uniforms?: WGRUniform[];
	pipeline: GPURenderPipeline;
	pipelinectx: IWGRPipelineContext;
	geometry: WGRGeometry;

	enabled: boolean;
	setUniformValues(values: WGRUniformValue[]): void;
	runBegin(rc: GPURenderPassEncoder): void;
	run(rc: GPURenderPassEncoder): void;
}

export { IWGRUnit };

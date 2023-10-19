import { WGRUniform } from "./uniform/WGRUniform";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import IAABB from "../../vox/geom/IAABB";

interface IWGRUnit {
	uniforms?: WGRUniform[];
	pipeline: GPURenderPipeline;
	pipelinectx: IWGRPipelineContext;
	geometry: WGRPrimitive;

	bounds: IAABB;

	enabled: boolean;
	passes?: IWGRUnit[];
	setUniformValues(values: WGRUniformValue[]): void;
	runBegin(rc: GPURenderPassEncoder): void;
	run(rc: GPURenderPassEncoder): void;
}

export { IWGRUnit };

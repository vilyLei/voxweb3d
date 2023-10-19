import { WGRUniform } from "./uniform/WGRUniform";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import { IWGRUnit } from "./IWGRUnit";
import IAABB from "../../vox/geom/IAABB";

/**
 * 大部分时候作为异步操作的占位符对象
 */
class WGRUnitEmpty implements IWGRUnit {

	// private mUniformValues: WGRUniformValue[];

	uniforms?: WGRUniform[];
	pipeline: GPURenderPipeline;
	pipelinectx: IWGRPipelineContext;
	geometry: WGRPrimitive;

	bounds: IAABB;
	enabled = true;
	setUniformValues(values: WGRUniformValue[]): void {
		// this.mUniformValues = values;
	}
	runBegin(rc: GPURenderPassEncoder): void {

	}
	run(rc: GPURenderPassEncoder): void {

	}
}

export { WGRUnitEmpty };

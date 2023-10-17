import DisplayEntity from "../../../vox/entity/DisplayEntity";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { WGRUnit } from "../../render/WGRUnit";
import { WGRUniformValue } from "../../render/uniform/WGRUniformValue";
import { WROPipelineContext } from "../pipeline/WROPipelineContext";
import { WRORUniform } from "../render/WRORUniform";
import { TransEntity } from "./TransEntity";

class WRORUnit {

	brnData: Float32Array = null;
	brnUValue: WGRUniformValue;
	brnDataVersion = 1;

    trans = new TransEntity();
    vtCount: number;
    pipeline: GPURenderPipeline | null = null;

    indexBuffer: GPUBuffer | null = null;

    vtxBuffers: GPUBuffer[] | null = null;
    pipelineCtx: WROPipelineContext | null = null;

	dispEntity: DisplayEntity | null = null;
	/**
	 * bind group index
	 */
    // bindIndex = 0;
    enabled = true;

	uniform: WRORUniform | null = null;

	runit: WGRUnit;
    constructor(){}
	destroy(): void {

	}
	// initRUnit(): void {
	// 	this.runit = new WGRUnit();
	// }
}
export { WRORUnit }

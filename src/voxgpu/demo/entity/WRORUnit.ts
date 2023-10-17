import DisplayEntity from "../../../vox/entity/DisplayEntity";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { WROPipelineContext } from "../pipeline/WROPipelineContext";
import { WRORUniform } from "../render/WRORUniform";
import { TransEntity } from "./TransEntity";

class WRORUnit {

	brnData: Float32Array = null;
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

    constructor(){}
	destroy(): void {

	}
}
export { WRORUnit }

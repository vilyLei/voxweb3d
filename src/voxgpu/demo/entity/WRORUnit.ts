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
    vtxBuffers: GPUBuffer[] | null = null;
    pipelineCtx: WROPipelineContext | null = null;
	/**
	 * bind group index
	 */
    // bindIndex = 0;
    enabled = true;

	uniform: WRORUniform | null = null;

    constructor(){}
}
export { WRORUnit }

import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { TransEntity } from "./TransEntity";

class WROEntity {
    trans = new TransEntity();
    uniformBindGroup: GPUBindGroup | null = null;
    vtCount: number;
    pipeline: GPURenderPipeline | null = null;
    vtxBuffer: GPUBuffer | null = null;

    bindIndex: number = 0;
    enabled = true;
    constructor(){}
}
export { WROEntity }
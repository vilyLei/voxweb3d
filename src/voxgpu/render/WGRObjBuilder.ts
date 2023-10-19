import { Entity3D } from "../entity/Entity3D";
import { WGRPrimitive } from "./WGRPrimitive";
import { IWGRUnit } from "./IWGRUnit";
import { WGRUnit } from "./WGRUnit";
import { GPUBuffer } from "../gpu/GPUBuffer";

class WGRObjBuilder {
    constructor() { }

    createRGeometry(
        geomParam?: { indexBuffer?: GPUBuffer; vertexBuffers: GPUBuffer[]; indexCount?: number; vertexCount?: number }
    ): WGRPrimitive | null {
        if (geomParam) {
            const g = new WGRPrimitive();
            g.ibuf = geomParam.indexBuffer;
            g.vbufs = geomParam.vertexBuffers;
            if (geomParam.indexCount) {
                g.indexCount = geomParam.indexCount;
            }
            if (geomParam.vertexCount) {
                g.vertexCount = geomParam.vertexCount;
            }
            return g;
        }
        return null;
    }
    createRUnit(entity: Entity3D): IWGRUnit {
        let runit: IWGRUnit;
        runit = new WGRUnit();
        return runit;
    }
}
export { WGRObjBuilder }

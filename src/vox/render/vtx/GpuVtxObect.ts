/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxShdCtr from "../../../vox/material/IVtxShdCtr";
import IROVtxBuilder from "../../../vox/render/IROVtxBuilder";
import IVertexRenderObj from "../../../vox/render/IVertexRenderObj";
import {ROVertexRes} from "./ROVertexRes";
import {ROIndicesRes} from "./ROIndicesRes";

class GpuVtxObect {
    version: number = -1;
    // wait del times
    waitDelTimes: number = 0;
    // renderer context unique id
    rcuid: number = 0;
    // texture resource unique id
    resUid: number = 0;

    vertex: ROVertexRes = new ROVertexRes();
    indices: ROIndicesRes = new ROIndicesRes();
    constructor() {
    }
    private m_attachCount: number = 0;
    __$attachThis(): void {
        ++this.m_attachCount;
        //console.log("GpuVtxObect::__$attachThis() this.m_attachCount: "+this.m_attachCount);
    }
    __$detachThis(): void {
        --this.m_attachCount;
        //console.log("GpuVtxObect::__$detachThis() this.m_attachCount: "+this.m_attachCount);
        if (this.m_attachCount < 1) {
            this.m_attachCount = 0;
            console.log("GpuVtxObect::__$detachThis() this.m_attachCount value is 0.");
            // do something
        }
    }
    getAttachCount(): number {
        return this.m_attachCount;
    }
    createVRO(rc: IROVtxBuilder, shdp: IVtxShdCtr, vaoEnabled: boolean): IVertexRenderObj {
        let vro: IVertexRenderObj = this.vertex.createVRO(rc, shdp, vaoEnabled, this.indices, this.indices.getUid());
        //vro.ibuf = this.indices.getGpuBuf();
        vro.ibufStep = this.indices.ibufStep;
        return vro;
    }
    updateToGpu(rc: IROVtxBuilder): void {
        this.indices.updateToGpu(rc);
        this.vertex.updateToGpu(rc);
    }
    destroy(rc: IROVtxBuilder): void {
        if (this.getAttachCount() < 1 && this.resUid >= 0) {
            this.vertex.destroy(rc);
            this.indices.destroy(rc);
            this.resUid = -1;
        }
    }
}

export {GpuVtxObect};
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
import IROVtxBuf from "../../../vox/render/IROVtxBuf";
// class VtxMap {

// }
class GpuVtxObject {
    private m_attachCount: number = 0;
    private static s_vtxMap: Map<number, ROVertexRes> = new Map();
    version = -1;
    // wait del times
    waitDelTimes = 0;
    // renderer context unique id
    rcuid = 0;
    // texture resource unique id
    resUid = 0;

    // vertex = new ROVertexRes();
    vertex: ROVertexRes = null;// = new ROVertexRes();
    indices = new ROIndicesRes();
    constructor() {
    }
    createVertex(rc: IROVtxBuilder, shdp: IVtxShdCtr, vtx: IROVtxBuf): void {
        let map = GpuVtxObject.s_vtxMap;
        let vt: ROVertexRes;
        if(map.has(vtx.getUid())) {
            vt = map.get(vtx.getUid());
        }else {
            vt = new ROVertexRes();
            vt.initialize(rc, shdp, vtx);
            map.set(vtx.getUid(), vt);
        }
        vt.__$attachThis();
        this.vertex = vt;
    }
    __$attachThis(): void {
        ++this.m_attachCount;
        //console.log("GpuVtxObject::__$attachThis() this.m_attachCount: "+this.m_attachCount);
    }
    __$detachThis(): void {
        --this.m_attachCount;
        //console.log("GpuVtxObject::__$detachThis() this.m_attachCount: "+this.m_attachCount);
        if (this.m_attachCount < 1) {
            this.m_attachCount = 0;
            console.log("GpuVtxObject::__$detachThis() this.m_attachCount value is 0.");
            // do something
        }
    }
    getAttachCount(): number {
        return this.m_attachCount;
    }
    createVRO(rc: IROVtxBuilder, shdp: IVtxShdCtr, vaoEnabled: boolean): IVertexRenderObj {
        let vro = this.vertex.createVRO(rc, shdp, vaoEnabled, this.indices);
        vro.ibufStep = this.indices.ibufStep;
        return vro;
    }
    updateToGpu(rc: IROVtxBuilder): void {
        this.indices.updateToGpu(rc);
        this.vertex.updateToGpu(rc);
    }
    destroy(rc: IROVtxBuilder): void {
        if (this.getAttachCount() < 1 && this.resUid >= 0) {
            if(this.vertex != null) {
                this.vertex.__$detachThis();
                this.vertex.destroy(rc);
                this.vertex = null;
            }
            this.indices.destroy(rc);
            this.resUid = -1;
        }
    }
}

export {GpuVtxObject};
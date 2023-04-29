/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { RenderDrawMode } from "../../vox/render/RenderConst";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";

export default class StripLineMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    private m_vs: Float32Array = null;
    private m_cvs: Float32Array = null;
    getVS(): Float32Array {
        return this.m_vs;
    }
    getCVS(): Float32Array {
        return this.m_vs;
    }
    isPolyhedral(): boolean { return false; }
    initialize(posarr: number[], colors: number[]): void {
        if (posarr.length >= 6) {
            //console.log("StripLineMesh posarr: "+posarr);
            this.vtCount = Math.floor(posarr.length / 3);
            this.m_vs = new Float32Array(posarr);
            this.bounds = new AABB();
            //  this.bounds.addFloat32Arr(this.m_vs);
            //  this.bounds.updateFast();

            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.m_vs, 3);

            if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
                this.m_cvs = new Float32Array(colors);
                ROVertexBuffer.AddFloat32Data(this.m_cvs, 3);
            }
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.drawMode = RenderDrawMode.ARRAYS_LINE_STRIP;
            this.buildEnd();
        }
    }
    setVSXYZAt(i: number, px: number, py: number, pz: number): void {
        if (this.m_vbuf != null) {
            this.m_vbuf.setData3fAt(i, 0, px, py, pz);
        }
    }
    toString(): string {
        return "StripLineMesh()";
    }
    __$destroy(): void {
        if (this.isResFree()) {
            this.bounds = null;

            this.m_vs = null;
            this.m_cvs = null;
            super.__$destroy();
        }
    }
}
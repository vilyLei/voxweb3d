/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "./MeshBase";
import IMeshBase from "./IMeshBase";
import AABB from "../geom/AABB";
import ROIVertexBuffer from "../../vox/mesh/ROIVertexBuffer";
/**
 * 通过一个 meshBase 实例原有的 vtx buffer, 加上新定义的 indices buf object 生成一个新的mesh
 */
export default class MeshWrapper extends MeshBase {
    private m_srcMesh: IMeshBase = null;
    constructor(bufDataUsage = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }

    initializeWithMesh(srcMesh: IMeshBase, ivs: Uint16Array | Uint32Array = null): void {

        if (this.m_vbuf == null && srcMesh != null && srcMesh != this) {

            let m = srcMesh as MeshBase;
            this.m_srcMesh = srcMesh;
            this.m_vbuf = m.__$attachVBuf();
            this.m_ivs = m.getIVS();
            this.vtCount = m.vtCount;
            this.trisNumber = this.vtCount / 3;

            this.setBufSortFormat(m.getBufSortFormat());
            this.drawMode = m.drawMode;
            this.bounds = new AABB();
            this.bounds.copyFrom(m.bounds);
            this.m_ivbuf = m.__$attachIVBuf();
            if (this.m_ivbuf == null) {
                if (ivs != null && ivs != m.getIVS()) {
                    this.m_ivs = ivs;
                    this.m_ivbuf = new ROIVertexBuffer();
                    this.m_ivbuf.setIVSDataAt( this.crateROIvsData().setData(ivs) );
                    this.vtCount = ivs.length;
                    this.trisNumber = this.vtCount / 3;
                    console.log("XXXXXXXXXXXXXX ROIVertexBuffer::initializeWithMesh()...this.vtCount: ", this.vtCount);
                }
            }
        }
    }
    /**
     * really destroy this instance all data
     */
    __$destroy(): void {
        if (this.m_srcMesh != null) {
            if (this.m_vbuf != null) {
                this.m_srcMesh.__$detachVBuf(this.m_vbuf);
                this.m_vbuf = null;
            }
            this.m_srcMesh = null;
        }
        super.__$destroy();

    }
}

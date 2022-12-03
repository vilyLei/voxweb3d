/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "./MeshBase";
/**
 * 通过一个 meshBase 实例原有的 vtx buffer, 加上新定义的 indices buf object 生成一个新的mesh
 */
export default class MeshWrapper extends MeshBase {
    private m_srcMesh: MeshBase = null;
    constructor(bufDataUsage = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    initializeWithMesh(srcMesh: MeshBase): void {
        if(this.m_vbuf == null && srcMesh != null && srcMesh != this) {
            this.m_srcMesh = srcMesh;
            this.m_vbuf = srcMesh.__$attachVBuf();
        }
    }
    /**
     * really destroy this instance all data
     */
    __$destroy(): void {
        if(this.m_srcMesh != null) {
            if(this.m_vbuf != null) {
                this.m_srcMesh.__$detachVBuf(this.m_vbuf);
                this.m_vbuf = null;
            }
            this.m_srcMesh = null;
        }
        super.__$destroy();

    }
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import RadialLine from "../../vox/geom/RadialLine";
import AABB from "../../vox/geom/AABB";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";

import { RenderDrawMode } from "../../vox/render/RenderConst";

export default class DashedLineMesh extends MeshBase {
    private static s_pv0: Vector3D = new Vector3D();
    private static s_pv1: Vector3D = new Vector3D();
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    private m_vs: Float32Array = null;
    private m_cvs: Float32Array = null;
    private m_lsTotal: number = 0;
    // 用于射线检测
    public rayTestRadius: number = 2.0;
    getVS(): Float32Array {
        return this.m_vs;
    }
    setVS(vs: Float32Array): void {
        this.m_vs = vs;
    }
    getCVS(): Float32Array {
        return this.m_cvs;
    }
    setCVS(cvs: Float32Array): void {
        this.m_cvs = cvs;
    }
    initialize(posarr: number[], colors: number[]): void {
        if (this.m_vs != null || posarr.length >= 6) {
            
            if(this.m_vs == null) {
                this.m_vs = new Float32Array(posarr);
            }
            this.vtCount = Math.floor(this.m_vs.length / 3);
            this.m_lsTotal = Math.floor(this.vtCount / 2);

            if(this.bounds == null) {
                this.bounds = new AABB();
            }
            this.bounds.addXYZFloat32Arr(this.m_vs);
            this.bounds.updateFast();

            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.m_vs, 3);

            // console.log("this.m_vs: ",this.m_vs);
            // console.log("colors: ",colors);

            if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
                if(this.m_cvs == null) this.m_cvs = new Float32Array(colors);
                ROVertexBuffer.AddFloat32Data(this.m_cvs, 3);
            }
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
            if(this.m_vbuf != null) {
                ROVertexBuffer.UpdateBufData(this.m_vbuf);
            }
            else {
                this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            }
            this.drawMode = RenderDrawMode.ARRAYS_LINES;
            this.buildEnd();
        }
    }
    setVSXYZAt(i: number, px: number, py: number, pz: number): void {
        if (this.m_vbuf != null) {
            this.m_vbuf.setData3fAt(i, 0, px, py, pz);
        }
    }
    toString(): string {
        return "DashedLineMesh()";
    }
    isPolyhedral(): boolean { return false; }
    // @boundsHit       表示是否包围盒体已经和射线相交了
    // @rlpv            表示物体坐标空间的射线起点
    // @rltv            表示物体坐标空间的射线朝向
    // @outV            如果检测相交存放物体坐标空间的交点
    // @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
    //
    testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number {
        let j: number = 0;
        let vs: Float32Array = this.m_vs;
        let flag: number = 0;
        let radius: number = this.rayTestRadius;
        let pv0 = DashedLineMesh.s_pv0;
        let pv1 = DashedLineMesh.s_pv1;
        for (let i: number = 0; i < this.m_lsTotal; ++i) {
            pv0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
            pv1.setXYZ(vs[j + 3], vs[j + 4], vs[j + 5]);
            flag = RadialLine.IntersectionLS(rlpv, rltv, pv0, pv1, outV, radius);
            if (flag > 0) {
                return 1;
            }
            j += 6;
        }
        return 0;
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
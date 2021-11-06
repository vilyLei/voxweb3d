/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import AABB from "../geom/AABB";
import GeometryBase from "../../vox/mesh/GeometryBase"
import SurfaceNormalCalc from "../geom/SurfaceNormalCalc";

export default class DataMesh extends MeshBase {
    private m_initIVS: Uint16Array | Uint32Array = null;
    private m_boundsVersion: number = -2;
    vsStride: number = 3;
    uvsStride: number = 2;
    nvsStride: number = 3;
    cvsStride: number = 3;

    vs: Float32Array = null
    uvs: Float32Array = null;
    nvs: Float32Array = null;
    cvs: Float32Array = null;
    tvs: Float32Array = null;
    btvs: Float32Array = null;
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }

    getVS(): Float32Array {
        return this.vs;
    }
    getUVS(): Float32Array {
        return this.uvs;
    }
    getNVS(): Float32Array {
        return this.nvs;
    }
    initializeFromGeometry(geom: GeometryBase): void {

        this.vs = geom.getVS();
        this.uvs = geom.getUVS();
        this.nvs = geom.getNVS();
        this.tvs = geom.getTVS();
        this.btvs = geom.getBTVS();
        this.m_ivs = geom.getIVS();
        this.m_initIVS = this.m_ivs;
        this.initialize();
    }

    setIVS(ivs: Uint16Array | Uint32Array): void {
        this.m_initIVS = ivs;
        this.m_ivs = ivs;
    }
    initialize(): void {

        if (this.vs != null) {
            if (this.bounds == null) {
                
                this.bounds = new AABB();
                this.bounds.addXYZFloat32Arr(this.vs);
                this.bounds.update();
                this.m_boundsVersion = this.bounds.version;
            }
            else if(this.m_boundsVersion == this.bounds.version){
                console.log("说明bounds需要重新计算");
                // 如果重新init, 但是版本号却没有改变，说明bounds需要重新计算
                this.bounds.addXYZFloat32Arr(this.vs);
                this.bounds.update();
                this.m_boundsVersion = this.bounds.version;
            }

            this.m_ivs = this.m_initIVS;            

            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.vs, this.vsStride);
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.uvs, this.uvsStride);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
                if(this.nvs == null) {
                    this.vtCount = this.m_ivs.length;
                    this.trisNumber = this.vtCount / 3;
                    this.nvs = new Float32Array(this.vs.length);
                    SurfaceNormalCalc.ClacTrisNormal(this.vs, this.vs.length, this.trisNumber, this.m_ivs, this.nvs);
                }
                ROVertexBuffer.AddFloat32Data(this.nvs, this.nvsStride);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.cvs, this.cvsStride);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.tvs, 3);
                ROVertexBuffer.AddFloat32Data(this.btvs, 3);
            }
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.updateWireframeIvs();
            this.vtCount = this.m_ivs.length;
            if (this.m_vbuf != null) {
                ROVertexBuffer.UpdateBufData(this.m_vbuf);
            }
            else {
                this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage(), this.getBufSortFormat());
            }
            this.m_vbuf.setUintIVSData(this.m_ivs);
            this.trisNumber = this.vtCount / 3;
            this.buildEnd();
        }
    }

    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number {
        return -1;
    }
    toString(): string {
        return "[DataMesh()]";
    }
    __$destroy(): void {
        if (this.isResFree()) {
            this.bounds = null;

            this.vs = null;
            this.uvs = null;
            this.nvs = null;
            this.cvs = null;
            this.tvs = null;
            this.btvs = null;
            this.m_initIVS = null;

            super.__$destroy();
        }
    }
}
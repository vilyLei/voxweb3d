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
import { IDataMesh } from "../../vox/mesh/IDataMesh";
import AABB from "../geom/AABB";
import GeometryBase from "../../vox/mesh/GeometryBase"
import SurfaceNormalCalc from "../geom/SurfaceNormalCalc";

export default class DataMesh extends MeshBase implements IDataMesh {
    private m_initIVS: Uint16Array | Uint32Array = null;
    private m_boundsChanged: boolean = true;
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_cvs: Float32Array = null;
    private m_tvs: Float32Array = null;
    private m_btvs: Float32Array = null;

    private m_boundsVersion: number = -2;
    vsStride: number = 3;
    uvsStride: number = 2;
    nvsStride: number = 3;
    cvsStride: number = 3;

    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }

    /**
     * set vertex position data
     * @param vs vertex position buffer Float32Array
     */
    setVS(vs: Float32Array): DataMesh {
        this.m_vs = vs;
        this.m_boundsChanged = true;
        return this;
    }
    /**
     * @returns vertex position buffer Float32Array
     */
    getVS(): Float32Array {
        return this.m_vs;
    }
    /**
     * set vertex uv data
     * @param vs vertex uv buffer Float32Array
     */
    setUVS(uvs: Float32Array): DataMesh {
        this.m_uvs = uvs;
        return this;
    }
    /**
     * @returns vertex uv buffer Float32Array
     */
    getUVS(): Float32Array {
        return this.m_uvs;
    }
    /**
     * set vertex normal data
     * @param vs vertex normal buffer Float32Array
     */
    setNVS(nvs: Float32Array): DataMesh {
        this.m_nvs = nvs;
        return this;
    }
    /**
     * @returns vertex normal buffer Float32Array
     */
    getNVS(): Float32Array {
        return this.m_nvs;
    }
    /**
     * set vertex tangent data
     * @param vs vertex tangent buffer Float32Array
     */
    setTVS(tvs: Float32Array): DataMesh {
        this.m_tvs = tvs;
        return this;
    }
    /**
     * @returns vertex tangent buffer Float32Array
     */
    getTVS(): Float32Array {
        return this.m_tvs;
    }
    
    /**
     * set vertex bitangent data
     * @param vs vertex bitangent buffer Float32Array
     */
    setBTVS(btvs: Float32Array): DataMesh {
        this.m_btvs = btvs;
        return this;
    }
    /**
     * set vertex color(r,g,b) data
     * @param vs vertex color(r,g,b) buffer Float32Array
     */
    setCVS(cvs: Float32Array): DataMesh {
        this.m_cvs = cvs;
        return this;
    }
    /**
     * @returns vertex bitangent buffer Float32Array
     */
    getBTVS(): Float32Array {
        return this.m_btvs;
    }
    
    
    setIVS(ivs: Uint16Array | Uint32Array): DataMesh {

        this.m_initIVS = ivs;
        this.m_ivs = ivs;
        this.m_boundsChanged = true;
        return this;
    }

    initializeFromGeometry(geom: GeometryBase): void {
        
        this.m_vs = geom.getVS();
        this.m_uvs = geom.getUVS();
        this.m_nvs = geom.getNVS();
        this.m_tvs = geom.getTVS();
        this.m_btvs = geom.getBTVS();
        this.m_cvs = geom.getCVS();
        this.m_ivs = geom.getIVS();
        
        this.m_initIVS = this.m_ivs;
        this.m_boundsChanged = true;
        this.initialize();
    }

    initialize(): void {

        if (this.m_vs != null) {
            if (this.bounds == null) {
                
                this.bounds = new AABB();
                this.bounds.addXYZFloat32Arr(this.m_vs);
                this.bounds.update();
                this.m_boundsVersion = this.bounds.version;
            }
            else if(this.m_boundsChanged || this.m_boundsVersion == this.bounds.version){
                this.bounds.reset();
                // 如果重新init, 但是版本号却没有改变，说明bounds需要重新计算
                this.bounds.addXYZFloat32Arr(this.m_vs);
                this.bounds.update();
                this.m_boundsVersion = this.bounds.version;
            }
            this.m_boundsChanged = false;

            this.m_ivs = this.m_initIVS;            

            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.m_vs, this.vsStride);
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.m_uvs, this.uvsStride);
            }
            else {
                console.warn("DataMesh hasn't uv data.");
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
                if(this.m_nvs == null) {
                    this.vtCount = this.m_ivs.length;
                    this.trisNumber = this.vtCount / 3;
                    this.m_nvs = new Float32Array(this.m_vs.length);
                    SurfaceNormalCalc.ClacTrisNormal(this.m_vs, this.m_vs.length, this.trisNumber, this.m_ivs, this.m_nvs);
                }
                ROVertexBuffer.AddFloat32Data(this.m_nvs, this.nvsStride);
            }
            else {
                console.warn("DataMesh hasn't normal(nvs) data.");
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.m_cvs, this.cvsStride);
            }
            else {
                console.warn("DataMesh hasn't color(cvs) data.");
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.m_tvs, 3);
                ROVertexBuffer.AddFloat32Data(this.m_btvs, 3);
            }
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.vtxTotal = this.m_vs.length / 3;
            this.updateWireframeIvs();
            this.vtCount = this.m_ivs.length;
            if (this.m_vbuf != null) {
                ROVertexBuffer.UpdateBufData(this.m_vbuf);
            }
            else {
                this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage(), this.getBufSortFormat());
                if(this.vbWholeDataEnabled) {
                    this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage(), this.getBufSortFormat());
                }else {
                    this.m_vbuf = ROVertexBuffer.CreateBySaveDataSeparate(this.getBufDataUsage());
                }
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
        return "DataMesh()";
    }
    __$destroy(): void {
        if (this.isResFree()) {
            this.bounds = null;

            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;
            this.m_cvs = null;
            this.m_tvs = null;
            this.m_btvs = null;
            this.m_initIVS = null;

            super.__$destroy();
        }
    }
}
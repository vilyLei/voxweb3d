/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import VtxBufConst from "../../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../../vox/mesh/ROVertexBuffer";
import AABB from "../../../vox/geom/AABB";
import MeshBase from "../../../vox/mesh/MeshBase";
import {ObjStrDataParser} from "./ObjStrDataParser";
import Vector3D from "../../math/Vector3D";

import { ObjDataParser } from "../../../vox/assets/ObjDataParser";

export default class ObjData3DMesh extends MeshBase {
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_strDataParser: ObjStrDataParser = null;
    moduleScale: number = 1.0;
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    //
    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }

    initialize(objDataStr: string, dataIsZxy: boolean = false): void {

        let baseParsering: boolean = false;
        if(baseParsering) {
            this.m_strDataParser = new ObjStrDataParser();
            this.m_strDataParser.parseStrData(objDataStr, this.moduleScale, dataIsZxy);
    
            this.m_vs = new Float32Array(this.m_strDataParser.getVS());
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
                this.m_uvs = new Float32Array(this.m_strDataParser.getUVS());
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
                this.m_nvs = new Float32Array(this.m_strDataParser.getNVS());
            }
            this.m_ivs = new Uint16Array(this.m_strDataParser.getIVS());
        }
        else {
            
            let objParser = new ObjDataParser();
            let objMeshes = objParser.Parse( objDataStr );
            let objMesh = objMeshes[0];
            console.log("objMesh: ",objMesh);
            let geom = objMesh.geometry;
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
                this.m_uvs = new Float32Array(geom.uvs);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
                this.m_nvs = new Float32Array(geom.normals);
            }
            let len: number = geom.vertices.length / 3;
            this.m_ivs = len > 65535? new Uint32Array(len) : new Uint16Array(len);
            if(dataIsZxy) {
                let k: number = 0;
                let srcVS: number[] = geom.vertices;
                this.m_vs = new Float32Array(geom.vertices.length);
                let vs = this.m_vs;
                for(let i: number = 0; i < len; ++i) {
                    vs[k] = srcVS[k + 1];
                    vs[k + 1] = srcVS[k + 2];
                    vs[k + 2] = srcVS[k];
                    this.m_ivs[i] = i;
                    k += 3;
                }
            }
            else {
                this.m_vs = new Float32Array(geom.vertices);
                for(let i: number = 0; i < len; ++i) {
                    this.m_ivs[i] = i;
                }
            }
            
            console.log("XXX m_vs: ", this.m_vs);
            console.log("XXX m_uvs: ", this.m_uvs);
            console.log("XXX m_nvs: ", this.m_nvs);
        }

        this.bounds = new AABB();
        this.bounds.addXYZFloat32Arr(this.m_vs);
        this.bounds.update();
        this.vtxTotal = this.m_vs.length / 3;

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs, 3);
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
            ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
            ROVertexBuffer.AddFloat32Data(this.m_nvs, 3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
            //trace("m_vs: "+m_vs);
            //trace("m_uvs: "+m_uvs);
            //trace("m_nvs: "+m_nvs);
            let numTriangles: number = this.m_ivs.length / 3;
            let tvs: Float32Array = new Float32Array(this.m_vs.length);
            let btvs: Float32Array = new Float32Array(this.m_vs.length);
            SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, tvs, btvs);
            //trace("tvs: "+tvs);
            //trace("btvs: "+btvs);
            ROVertexBuffer.AddFloat32Data(tvs, 3);
            ROVertexBuffer.AddFloat32Data(btvs, 3);
        }
        
        this.updateWireframeIvs();
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        if (this.m_vbuf == null) {
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setUint16IVSData(this.m_ivs);
        }
        else {
            if (this.forceUpdateIVS) {
                this.m_vbuf.setUint16IVSData(this.m_ivs);
            }
            ROVertexBuffer.UpdateBufData(this.m_vbuf);
        }
        this.vtCount = this.m_ivs.length;
        this.trisNumber = this.vtCount / 3;

        this.buildEnd();
    }
    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number {
        let boo: boolean = AABB.IntersectionRL2(rltv, rlpv, this.bounds, outV);
        return boo ? 1 : -1;
    }
    toString(): string {
        return "ObjData3DMesh()";
    }
    __$destroy(): void {
        if (this.isResFree()) {
            this.bounds = null;

            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;
            super.__$destroy();
        }
    }
}
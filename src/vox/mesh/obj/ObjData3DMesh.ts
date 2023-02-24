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
import { AABBCalc } from "../../geom/AABBCalc";
import ObjGeomDataParser from "./ObjGeomDataParser";

export default class ObjData3DMesh extends MeshBase {
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_strDataParser: ObjStrDataParser = null;
    private m_dataParser: ObjGeomDataParser = null;
    moduleScale: number = 1.0;
    baseParsering: boolean = false;
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }

    initialize(objDataStr: string, dataIsZxy: boolean = false): void {
        
        this.m_dataParser = new ObjGeomDataParser();
        this.m_dataParser.moduleScale = this.normalScale;
        this.m_dataParser.baseParsering = this.baseParsering;
        this.m_dataParser.parse(objDataStr, dataIsZxy);
        
        this.m_vs = this.m_dataParser.getVS();
        this.bounds = new AABB();
        this.bounds.addFloat32Arr(this.m_vs);
        this.bounds.update();
        this.vtxTotal = this.m_vs.length / 3;

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs, 3);
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
            this.m_uvs = this.m_dataParser.getUVS();
            ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
            this.m_nvs = this.m_dataParser.getNVS();
            
            // console.log("m_nvs: ", this.m_nvs);
            ROVertexBuffer.AddFloat32Data(this.m_nvs, 3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
            let numTriangles = this.m_ivs.length / 3;
            let tvs = new Float32Array(this.m_vs.length);
            let btvs = new Float32Array(this.m_vs.length);
            SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, tvs, btvs);
            ROVertexBuffer.AddFloat32Data(tvs, 3);
            ROVertexBuffer.AddFloat32Data(btvs, 3);
        }

        this.m_ivs = this.m_dataParser.getIVS();

        this.updateWireframeIvs();
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        if (this.m_vbuf == null) {
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setUintIVSData(this.m_ivs);
            this.buildEnd();
        }
        else {
            if (this.forceUpdateIVS) {
                this.m_vbuf.setUintIVSData(this.m_ivs);
            }
            ROVertexBuffer.UpdateBufData(this.m_vbuf);
        }
        this.vtCount = this.m_ivs.length;
        this.trisNumber = this.vtCount / 3;
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
        let boo: boolean = AABBCalc.IntersectionRL2(rltv, rlpv, this.bounds, outV);
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
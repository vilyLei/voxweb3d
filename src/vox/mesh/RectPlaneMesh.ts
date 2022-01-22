/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import PlaneCalc from "../../vox/geom/PlaneCalc";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";
import VtxBufData from "../../vox/mesh/VtxBufData";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import { RenderDrawMode } from "../../vox/render/RenderConst";
import Color4 from "../material/Color4";
import { AABBCalc } from "../geom/AABBCalc";

export default class RectPlaneMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    color0: Color4 = new Color4();
    color1: Color4 = new Color4();
    color2: Color4 = new Color4();
    color3: Color4 = new Color4();

    offsetU: number = 0.0;
    offsetV: number = 0.0;
    uScale: number = 1.0;
    vScale: number = 1.0;

    flipVerticalUV: boolean = false;
    /**
     * axisFlag = 0 is XOY plane,
     * axisFlag = 1 is XOZ plane,
     * axisFlag = 2 is YOZ plane
     */
    axisFlag: number = 0;
    
    private m_polyhedralBoo: boolean = true;
    private m_vs: Float32Array = null
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_cvs: Float32Array = null;

    private m_tvs: Float32Array = null;
    private m_btvs: Float32Array = null;

    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    setUVS(uvsLen8: Float32Array): void {
        if (uvsLen8 != null && uvsLen8.length == 8) {
            if (this.m_uvs == null) {
                this.m_uvs = uvsLen8.slice(0);
            }
            else {
                this.m_uvs.set(uvsLen8);
            }
        }
    }
    
    getNVS(): Float32Array { return this.m_nvs; }
    
    getCVS(): Float32Array { return this.m_cvs; }
    initialize(startX: number, startY: number, pwidth: number, pheight: number): void {
        if (this.m_vs != null) {
            return;
        }

        let minX: number = startX;
        let minY: number = startY;
        let maxX: number = startX + pwidth;
        let maxY: number = startY + pheight;
        let pz: number = 0.0;
        //
        // ccw is positive, left-bottom pos(minX,minY) -> right-bottom pos(maxX,minY) -> right-top pos(maxX,maxY)  -> right-top pos(minX,maxY)
        this.m_ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
        //this.m_ivs = new Uint32Array([0,1,2,0,2,3]);
        switch (this.axisFlag) {
            case 0:
                // XOY plane
                this.m_vs = new Float32Array([
                    minX, minY, pz,
                    maxX, minY, pz,
                    maxX, maxY, pz,
                    minX, maxY, pz
                ]);
                break;
            case 1:
                // XOZ plane
                this.m_vs = new Float32Array([
                    maxX, pz, minY,
                    minX, pz, minY,
                    minX, pz, maxY,
                    maxX, pz, maxY
                ]);
                break;
            case 2:
                // YOZ plane
                this.m_vs = new Float32Array([
                    pz, minX, minY,
                    pz, maxX, minY,
                    pz, maxX, maxY,
                    pz, minX, maxY
                ]);
                break;
            default:
                break;
        }
        if (this.bounds == null) this.bounds = new AABB();
        this.bounds.addXYZFloat32Arr(this.m_vs);
        this.bounds.updateFast();

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs, 3);

        if (this.m_uvs == null && this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
            if (this.flipVerticalUV) {
                this.m_uvs = new Float32Array([
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 1.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 1.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 0.0 * this.vScale,
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 0.0 * this.vScale
                ]);
            }
            else {
                this.m_uvs = new Float32Array([
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 0.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 0.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 1.0 * this.vScale,
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 1.0 * this.vScale
                ]);
            }
        }

        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
            switch (this.axisFlag) {
                case 0:
                    this.m_nvs = new Float32Array([
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0
                    ]);
                    break;
                case 1:
                    this.m_nvs = new Float32Array([
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0
                    ]);
                    break;
                case 2:
                    this.m_nvs = new Float32Array([
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0
                    ]);
                    break;
                default:
                    break;
            }
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
            this.m_cvs = new Float32Array([
                this.color0.r, this.color0.g, this.color0.b,
                this.color1.r, this.color1.g, this.color1.b,
                this.color2.r, this.color2.g, this.color2.b,
                this.color3.r, this.color3.g, this.color3.b
            ]);
        }

        if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
            let numTriangles: number = 2;
            this.m_tvs = new Float32Array(12);
            this.m_btvs = new Float32Array(12);
            SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, this.m_tvs, this.m_btvs);
        }

        this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;
        this.buildVbuf();

        this.vtxTotal = 4;
        this.trisNumber = 2;

        /*
        // VtxBufData 使用样例, 要注释掉上面的构建调用
        let bufData:VtxBufData = new VtxBufData(2);
        bufData.addAttributeDataAt(0,this.m_vs, 3);
        bufData.addAttributeDataAt(1,this.m_uvs, 2);

        let vs2:Float32Array = this.m_vs = new Float32Array([
            100.0 + maxX,pz,100.0 + minY,
            100.0 + minX,pz,100.0 + minY,
            100.0 + minX,pz,100.0 + maxY,
            //100.0 + maxX,pz,100.0 + maxY
        ]);
        
        bufData.addAttributeDataAt(0,vs2, 3);
        bufData.addAttributeDataAt(1,this.m_uvs, 2);
        //this.m_ivs = new Uint16Array([0,1,2,0,2,3, 4+0,4+1,4+2,4+0,4+2,4+3]);
        //let p1ivs:Uint16Array = new Uint16Array([4+0,4+1,4+2,4+0,4+2,4+3]);
        let p1ivs:Uint16Array = new Uint16Array([4+0,4+1,4+2]);

        bufData.addIndexData(this.m_ivs);
        bufData.addIndexData(p1ivs);

        this.m_vbuf = ROVertexBuffer.CreateByBufDataSeparate(bufData,this.getBufDataUsage());
        this.vtCount = bufData.getIndexDataLengthTotal();
        this.vtxTotal = bufData.getVerticesTotal();
        this.trisNumber = bufData.getTrianglesTotal();
        //console.log("this.vtxTotal: "+this.vtxTotal);
        //console.log("this.trisNumber: "+this.trisNumber);
        //*/

        this.buildEnd();
    }
    reinitialize(): void {
        this.buildVbuf();
    }
    private buildVbuf(): void {

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs, 3);
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {

            ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
            ROVertexBuffer.AddFloat32Data(this.m_nvs, 3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
            ROVertexBuffer.AddFloat32Data(this.m_cvs, 3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
            ROVertexBuffer.AddFloat32Data(this.m_tvs, 3);
            ROVertexBuffer.AddFloat32Data(this.m_btvs, 3);
        }
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;

        this.updateWireframeIvs();
        this.vtCount = this.m_ivs.length;
        if (this.m_vbuf != null) {
            if(this.forceUpdateIVS) {
                this.m_vbuf.setUintIVSData(this.m_ivs);
            }
            ROVertexBuffer.UpdateBufData(this.m_vbuf);
        }
        else {
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage(), this.getBufSortFormat());
        }
        this.m_vbuf.setUintIVSData(this.m_ivs);
        this.buildEnd();
    }
    vsFloat32: Float32Array = null;
    dataStepList: number[] = null;
    // 是否是多面体实体,如果是，则可以进行三角面的相关计算等操作, 如果不是则需要进行相关的几何算法计算
    isPolyhedral(): boolean { return this.m_polyhedralBoo; }
    // 设置自身是否是多面体实体，根据实际需要改变相关的状态值
    setPolyhedral(boo: boolean): void { this.m_polyhedralBoo = boo; }

    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number {
        if (this.m_polyhedralBoo) return -1;
        if (boundsHit) {
            let boo: boolean = AABBCalc.IntersectionRL2(rltv, rlpv, this.bounds, outV);
            return boo ? 1 : -1;
        }
        return -1;
    }
    toString(): string {
        return "[RectPlaneMesh()]";
    }
    __$destroy(): void {
        if (this.isResFree()) {
            this.bounds = null;

            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;
            this.m_cvs = null;

            super.__$destroy();
        }
    }
}
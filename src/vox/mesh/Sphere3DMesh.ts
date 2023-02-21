/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3D from "../../vox/math/Vector3D";
import RadialLine from "../../vox/geom/RadialLine";
import AABB from "../../vox/geom/AABB";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import MeshVertex from "../../vox/mesh/MeshVertex"
import MeshBase from "../../vox/mesh/MeshBase"
export default class Sphere3DMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    private m_longitudeNumSegments: number = 10;
    private m_latitudeNumSegments: number = 10;
    private m_radius: number = 50;
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_cvs: Float32Array = null;

    inverseUV = false;
    uvScale = 1.0;
    mode = 0;
    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }
    getCVS(): Float32Array { return this.m_cvs; }
    getIVS(): Uint16Array | Uint32Array { return this.m_ivs; }

    initialize(radius: number, longitudeNumSegments: number, latitudeNumSegments: number, doubleTriFaceEnabled: boolean): void {
        if (this.vtxTotal < 1) {
            if (radius < 0.0001) radius = 0.0001;

            this.bounds = new AABB();
            this.bounds.min.setXYZ(-radius, -radius, -radius);
            this.bounds.max.setXYZ(radius, radius, radius);
            this.bounds.updateFast();
            if (longitudeNumSegments < 2) longitudeNumSegments = 2;
            if (latitudeNumSegments < 2) latitudeNumSegments = 2;
            this.m_radius = Math.abs(radius);
            this.m_longitudeNumSegments = longitudeNumSegments;
            this.m_latitudeNumSegments = latitudeNumSegments;

            if ((this.m_latitudeNumSegments + 1) % 2 == 0) {
                this.m_latitudeNumSegments += 1;
            }
            if (this.m_longitudeNumSegments = this.m_latitudeNumSegments) {
                this.m_longitudeNumSegments += 1;
            }

            let i = 1, j = 0, trisTot = 0;
            let xRad = 0.0, yRad = 0.0, px = 0.0, py = 0.0;
            let vtx = new MeshVertex(0, -this.m_radius, 0, trisTot);

            console.log("Sphere3DMesh::initialize() ...");
            // 计算绕 y轴 的纬度线上的点
            let vtxVec = [];
            let vtxRows: MeshVertex[][] = [];
            vtxRows.push([]);
            let vtxRow = vtxRows[0];
            let centerUV = this.inverseUV ? 1.0 : 0.5;

            vtx.u = vtx.v = centerUV;
            vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;

            let v0 = vtx.cloneVertex();
            for (j = 0; j <= this.m_longitudeNumSegments; ++j) {
                vtxRow.push(v0);
            }
            vtxVec.push(v0);

            // console.log("vtxRow first: ", vtxRow);
            let pr = 0.0
            let py2 = 0.0;
            let f = 1.0 / this.m_radius;

            for (i = 1; i < this.m_latitudeNumSegments; ++i) {
                yRad = Math.PI * i / this.m_latitudeNumSegments;
                px = Math.sin(yRad);
                py = Math.cos(yRad);

                vtx.y = -this.m_radius * py;
                pr = this.m_radius * px;

                // py2 = vtx.y;
                // if (py2 < 0) py2 = -py2;
                // uv inverse yes or no
                //if (!this.inverseUV) py2 = this.m_radius - py2;
                //py2 /= pr2;

                if (this.inverseUV) {
                    py2 = Math.abs(yRad / Math.PI - 0.5);
                }
                else {
                    py2 = 0.5 - Math.abs(yRad / Math.PI - 0.5);
                }
                py2 *= this.uvScale;
                vtxRows.push([]);
                let row = vtxRows[i];
                for (j = 0; j < this.m_longitudeNumSegments; ++j) {
                    xRad = (Math.PI * 2 * j) / this.m_longitudeNumSegments;
                    ++trisTot;
                    px = Math.sin(xRad);
                    py = Math.cos(xRad);
                    vtx.x = px * pr;
                    vtx.z = py * pr;
                    vtx.index = trisTot;
                    // calc uv
                    vtx.u = 0.5 + px * py2;
                    vtx.v = 0.5 + py * py2;
                    vtx.nx = vtx.x * f; vtx.ny = vtx.y * f; vtx.nz = vtx.z * f;

                    row.push(vtx.cloneVertex());
                    vtxVec.push(row[j]);
                }
                row.push(row[0]);
            }
            ++trisTot;
            vtx.index = trisTot;
            vtx.x = 0; vtx.y = this.m_radius; vtx.z = 0;
            vtx.u = vtx.v = centerUV;
            vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
            vtxRows.push([]);
            let lastRow = vtxRows[this.m_latitudeNumSegments];
            let v1 = vtx.cloneVertex();
            for (j = 0; j <= this.m_longitudeNumSegments; ++j) {
                lastRow.push(v1);
            }
            vtxVec.push(v1);
            console.log("vtxRow last: ", lastRow);
            // vtxVec.push(lastRow[0]);
            console.log("this.m_longitudeNumSegments: ", this.m_longitudeNumSegments);
            // console.log("vtxRows: ", vtxRows);
            let pvtx: MeshVertex = null;
            ///////////////////////////   ///////////////////////////    ////////////////
            let pivs: number[] = [];

            let rowa = null;
            let rowb = null;
            let layerN = this.m_latitudeNumSegments;
            if (this.mode == 1) {
                let halfN = layerN / 2 + 1;
                for (i = halfN; i <= layerN; ++i) {
                    rowa = vtxRows[i - 1];
                    rowb = vtxRows[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
            } else if (this.mode == -1) {
                let halfN = layerN / 2 + 1;
                for (i = 1; i < halfN; ++i) {
                    rowa = vtxRows[i - 1];
                    rowb = vtxRows[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
            } else if (this.mode == 2) {

                let halfN = layerN / 2 + 1;
                let mi = halfN - 1;
                // let pu = 0.0;
                console.log("use sph mode 2, halfN: ", halfN, "mi: ", mi);
                let miRow = vtxRows[mi].slice();
                let n = miRow.length - 1;
                for (i = 0; i < n; ++i) {
                    vtx = miRow[i].cloneVertex();
                    ++trisTot;
                    vtx.index = trisTot;
                    miRow[i] = vtx;
                    vtxVec.push(vtx);
                }
                miRow[miRow.length - 1] = miRow[0];

                let list0: MeshVertex[][] = [];
                for (i = 0; i < halfN; ++i) {
                    list0.push(vtxRows[i]);
                }
                list0[list0.length - 1] = miRow;

                let list1 = vtxRows;
                let list1_copy: MeshVertex[][] = [];
                for (i = halfN - 1; i <= layerN; ++i) {
                    list1_copy.push(vtxRows[i]);
                }
                console.log("calc UV_U XXXXX");
                ///*
                for (i = 1; i < halfN; ++i) {
                    yRad = Math.PI * i / this.m_latitudeNumSegments;
                    px = Math.sin(yRad);
                    py = Math.cos(yRad);
                    if (this.inverseUV) {
                        py2 = Math.abs(yRad / Math.PI - 0.5);
                    }
                    else {
                        py2 = 0.5 - Math.abs(yRad / Math.PI - 0.5);
                    }
                    py2 *= this.uvScale;

                    const ls = list0[i];
                    for (j = 0; j < this.m_longitudeNumSegments; ++j) {
                        vtx = ls[j];
                        xRad = (Math.PI * 2 * j) / this.m_longitudeNumSegments;
                        // calc uv
                        vtx.u = 0.25 + Math.sin(xRad) * py2 * 0.5;
                        vtx.v = 0.5 + Math.cos(xRad) * py2;
                    }
                }
                vtx = list0[0][0];
                vtx.u = 0.25;
                vtx.v = 0.5;
                //*/
                for (i = halfN - 1; i < layerN; ++i) {
                    yRad = Math.PI * i / this.m_latitudeNumSegments;
                    px = Math.sin(yRad);
                    py = Math.cos(yRad);
                    if (this.inverseUV) {
                        py2 = Math.abs(yRad / Math.PI - 0.5);
                    }
                    else {
                        py2 = 0.5 - Math.abs(yRad / Math.PI - 0.5);
                    }
                    py2 *= this.uvScale;

                    const ls = list1[i];
                    // const n = ls.length;
                    for (j = 0; j < this.m_longitudeNumSegments; ++j) {
                        vtx = ls[j];
                        xRad = (Math.PI * 2 * j) / this.m_longitudeNumSegments;
                        // calc uv
                        vtx.u = 0.75 + Math.sin(xRad) * py2 * 0.5;
                        vtx.v = 0.5 + Math.cos(xRad) * py2;
                    }
                }
                vtx = list1[list1.length - 1][0];
                vtx.u = 0.75;
                vtx.v = 0.5;

                console.log("list0: ", list0);
                // console.log("list1: ", list1);
                console.log("list1_copy: ", list1_copy);

                for (i = 1; i < halfN; ++i) {
                    rowa = list0[i - 1];
                    rowb = list0[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
                for (i = halfN; i <= layerN; ++i) {
                    rowa = list1[i - 1];
                    rowb = list1[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
            } else {
                for (i = 1; i <= layerN; ++i) {
                    rowa = vtxRows[i - 1];
                    rowb = vtxRows[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
            }
            this.vtxTotal = vtxVec.length;
            if (doubleTriFaceEnabled) {
                this.m_ivs = this.createIVSBYSize(pivs.length * 2);
                this.m_ivs.set(pivs, 0);
                pivs.reverse();
                this.m_ivs.set(pivs, pivs.length);
            }
            else {
                this.m_ivs = this.createIVSByArray(pivs);
            }
            this.m_vs = new Float32Array(this.vtxTotal * 3);
            i = 0;
            for (j = 0; j < this.vtxTotal; ++j) {
                pvtx = vtxVec[j];
                this.m_vs[i++] = pvtx.x; this.m_vs[i++] = pvtx.y; this.m_vs[i++] = pvtx.z;
            }
            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.m_vs, 3);
            //
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
                // uv
                this.m_uvs = new Float32Array(this.vtxTotal * 2);
                //
                i = 0;
                for (j = 0; j < this.vtxTotal; ++j) {
                    pvtx = vtxVec[j];
                    //trace(tri.index0, ",", tri.index1, ",", tri.index2);
                    this.m_uvs[i] = pvtx.u; this.m_uvs[i + 1] = pvtx.v;
                    i += 2;
                }
                ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
                this.m_nvs = new Float32Array(this.vtxTotal * 3);
                //
                i = 0;
                for (j = 0; j < this.vtxTotal; ++j) {
                    pvtx = vtxVec[j];
                    this.m_nvs[i] = pvtx.nx; this.m_nvs[i + 1] = pvtx.ny; this.m_nvs[i + 2] = pvtx.nz;
                    i += 3;
                }
                ROVertexBuffer.AddFloat32Data(this.m_nvs, 3);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
                this.m_cvs = new Float32Array(this.vtxTotal * 3);
                //
                i = 0;
                for (j = 0; j < this.vtxTotal; ++j) {
                    this.m_cvs[i] = 1.0; this.m_cvs[i + 1] = 1.0; this.m_cvs[i + 2] = 1.0;
                    i += 3;
                }
                ROVertexBuffer.AddFloat32Data(this.m_cvs, 3);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
                let numTriangles = this.m_ivs.length / 3;
                let tvs = new Float32Array(this.m_vs.length);
                let btvs = new Float32Array(this.m_vs.length);
                SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, tvs, btvs);
                ROVertexBuffer.AddFloat32Data(tvs, 3);
                ROVertexBuffer.AddFloat32Data(btvs, 3);
            }

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
    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number {
        return RadialLine.IntersectioNearSphere2(rlpv, rltv, Vector3D.ZERO, this.m_radius, outV);
    }
    toString(): string {
        return "Sphere3DMesh()";
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import AABB from "../../vox/geom/AABB";
import GeometryBase from "../../vox/mesh/GeometryBase";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";

export default class QuadGridMeshGeometry extends GeometryBase {

    uScale: number = 1.0;
    vScale: number = 1.0;
    uvType: number = 0;
    normalScale: number = 1.0;

    normalEnabled: boolean = false;
    tangentEnabled: boolean = false;

    constructor() {
        super();
    }

    initializeXOYPlane(beginPos: Vector3D, width: number = 300, height: number = 300, rn: number = 4, cn: number = 4): void {

        let posTable: Vector3D[][] = new Array(rn);
        let dv: Vector3D = new Vector3D(width / cn, height / rn, 0.0);
        for (let r: number = 0; r < rn; ++r) {
            let row: Vector3D[] = new Array(cn);
            for (let c: number = 0; c < cn; ++c) {
                row[cn - c - 1] = new Vector3D(
                    beginPos.x + c * dv.x,
                    beginPos.y + r * dv.y,
                    beginPos.z
                );
            }
            posTable[r] = row;
        }
        this.initialize(posTable);
    }
    initializeXOZPlane(beginPos: Vector3D, width: number = 300, long: number = 300, rn: number = 4, cn: number = 4): void {

        let posTable: Vector3D[][] = new Array(rn);
        let dv: Vector3D = new Vector3D(width / cn, 0.0, long / rn);
        for (let r: number = 0; r < rn; ++r) {
            let row: Vector3D[] = new Array(cn);
            for (let c: number = 0; c < cn; ++c) {
                row[cn - c - 1] = new Vector3D(
                    beginPos.x + c * dv.x,
                    beginPos.y,
                    beginPos.z + r * dv.z
                );
            }
            posTable[r] = row;
        }
        this.initialize(posTable);
    }
    initializeYOZPlane(beginPos: Vector3D, height: number = 300, long: number = 300, rn: number = 4, cn: number = 4): void {

        let posTable: Vector3D[][] = new Array(rn);
        let dv: Vector3D = new Vector3D(0.0, height / cn, long / rn);
        for (let r: number = 0; r < rn; ++r) {
            let row: Vector3D[] = new Array(cn);
            for (let c: number = 0; c < cn; ++c) {
                row[cn - c - 1] = new Vector3D(
                    beginPos.x,
                    beginPos.y + c * dv.y,
                    beginPos.z + r * dv.z
                );
            }
            posTable[r] = row;
        }
        this.initialize(posTable);
    }
    /**
     * @param posTable exmples[[pos01,pos02,pos03],[pos11,pos12,pos13]]
     * @param uvType the value is 0 or 1
     */
    initialize(posTable: Vector3D[][]): void {
        let i: number = 0;
        let j: number = 0;

        let px: number = 0;

        this.vtxTotal = posTable[0].length * posTable.length;
        this.m_vs = new Float32Array(this.vtxTotal * 3);
        this.m_uvs = new Float32Array(this.vtxTotal * 2);

        let k: number = 0;
        let l: number = 0;
        let len: number = posTable[0].length;
        let subLen: number = len - 1;

        let rows: Vector3D[][] = posTable;
        let tot: number = rows.length;
        let row = rows[0];

        let uScale: number = this.uScale;
        let vScale: number = this.uScale;
        let uvType: number = this.uvType;
        for (i = 0; i < tot; ++i) {
            row = rows[i];
            px = i / (tot - 1);
            for (j = 0; j < len; ++j) {
                if (uvType < 1) {
                    this.m_uvs[l++] = uScale * (j / subLen);
                    this.m_uvs[l++] = vScale * px;
                }
                else {
                    this.m_uvs[l++] = uScale * px;
                    this.m_uvs[l++] = vScale * (j / subLen);
                }
                let pv: Vector3D = row[j];
                this.m_vs[k++] = pv.x; this.m_vs[k++] = pv.y; this.m_vs[k++] = pv.z;
            }
        }

        this.bounds.addFloat32Arr(this.m_vs);
        this.bounds.updateFast();

        let cn: number = len;
        let a: number = 0;
        let b: number = 0;
        tot = tot - 1;
        let ivsLen: number = tot * subLen * 6;
        if (ivsLen < 65535) {
            this.m_ivs = new Uint16Array(ivsLen);
        }
        else {
            this.m_ivs = new Uint32Array(ivsLen);
        }
        k = 0;
        for (i = 0; i < tot; ++i) {
            a = i * cn;
            b = (i + 1) * cn;
            for (j = 1; j <= subLen; ++j) {
                this.m_ivs[k++] = a + j; this.m_ivs[k++] = b + j - 1; this.m_ivs[k++] = a + j - 1;
                this.m_ivs[k++] = a + j; this.m_ivs[k++] = b + j; this.m_ivs[k++] = b + j - 1;
            }
        }

        let numTriangles: number = this.m_ivs.length / 3;
        if (this.normalEnabled || this.tangentEnabled) {
            this.m_nvs = new Float32Array(this.m_vs.length);
            SurfaceNormalCalc.ClacTrisNormal(this.m_vs, this.m_vs.length, numTriangles, this.m_ivs, this.m_nvs);
            if (this.normalScale != 1.0) {
                tot = this.m_nvs.length;
                for (i = 0; i < tot; i += 3) {
                    this.m_nvs[i] *= this.normalScale;
                    this.m_nvs[i + 1] *= this.normalScale;
                    this.m_nvs[i + 2] *= this.normalScale;
                }
            }
        }

        if (this.tangentEnabled) {
            this.m_tvs = new Float32Array(this.m_vs.length);
            this.m_btvs = new Float32Array(this.m_vs.length);
            SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, this.m_tvs, this.m_btvs);
        }

        this.vtCount = this.m_ivs.length;
        this.trisNumber = this.vtCount / 3;

        // console.log("subLen: ", subLen);
        // console.log("this.vtxTotal: ", this.vtxTotal);
        // console.log("this.m_ivs: ", this.m_ivs);
    }
}
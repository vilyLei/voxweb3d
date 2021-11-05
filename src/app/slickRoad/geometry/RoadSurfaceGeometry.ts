/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import GeometryBase from "../../../vox/mesh/GeometryBase"

export default class RoadSurfaceGeometry extends GeometryBase {

    uScale: number = 1.0;
    vScale: number = 1.0;

    offsetXYZ: Vector3D = new Vector3D();
    roadWidth: number = 120;
    distance: number = 0;
    constructor() {
        super();
    }
    
    initialize(posTable: Vector3D[][], uvType: number): void {

        let i: number = 0;
        let j: number = 0;

        let px: number = 0;
        let py: number = 0;

        this.vtxTotal = posTable[0].length * posTable.length;
        this.m_vs = new Float32Array(this.vtxTotal * 3);
        this.m_uvs = new Float32Array(this.vtxTotal * 2);
        
        let k: number = 0;
        let l: number = 0;
        let len: number = posTable[0].length;
        let subLen: number = len - 1;
        
        let rows: Vector3D[][] = posTable;
        let tot: number = rows.length;
        let disTotal: number = 0;
        let dis: number = 0;
        let disList: number[] = new Array(len);
        let row = rows[0];
        disList[0] = 0;
        for (i = 1; i < len; ++i) {
            dis = Vector3D.Distance(row[i],row[i-1]);
            disTotal += dis;
            disList[i] = disTotal;
        }
        for (i = 1; i < len; ++i) {
            disList[i] = disList[i] / disTotal;
        }
        this.distance = disTotal;
        let uScale = this.uScale;
        let vScale = this.uScale;
        if (uvType < 1) {
            uScale *= Math.round(disTotal / this.roadWidth);
        }
        else {
            vScale *= Math.round(disTotal / this.roadWidth);
        }
        // let ox: number = this.offsetXYZ.x;
        // let oy: number = this.offsetXYZ.y;
        // let oz: number = this.offsetXYZ.z;
        for (i = 0; i < tot; ++i) {
            row = rows[i];
            px = i/(tot - 1);
            for (j = 0; j < len; ++j) {
                if (uvType < 1) {
                    this.m_uvs[l++] = uScale * disList[j];//(j / subLen);
                    this.m_uvs[l++] = vScale * px;
                }
                else {
                    this.m_uvs[l++] = uScale * px;
                    this.m_uvs[l++] = vScale  * disList[j];//(j / subLen);
                }
                let pv: Vector3D = row[j];
                //this.m_vs[k++] = pv.x + ox; this.m_vs[k++] = pv.y + oy; this.m_vs[k++] = pv.z + oz;
                this.m_vs[k++] = pv.x; this.m_vs[k++] = pv.y; this.m_vs[k++] = pv.z;
            }
        }

        //this.bounds.addXYZFloat32Arr(this.m_vs);
        //this.bounds.updateFast();

        let cn: number = len;
        let a: number = 0;
        let b: number = 0;
        tot = tot - 1;
        this.m_ivs = new Uint16Array(tot * subLen * 6);
        k = 0;
        for (i = 0; i < tot; ++i) {
            a = i * cn;
            b = (i + 1) * cn;
            for (j = 1; j <= subLen; ++j) {
                this.m_ivs[k++] = a + j; this.m_ivs[k++] = b + j - 1; this.m_ivs[k++] = a + j - 1;
                this.m_ivs[k++] = a + j; this.m_ivs[k++] = b + j; this.m_ivs[k++] = b + j - 1;
            }
        }
        this.vtCount = this.m_ivs.length;
        this.trisNumber = this.vtCount / 3;

        this.bounds.addXYZFloat32Arr(this.m_vs);
        this.bounds.update();
    }
}
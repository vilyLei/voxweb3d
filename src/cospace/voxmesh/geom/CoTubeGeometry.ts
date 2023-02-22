/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IMatrix4 from "../../../vox/math/IMatrix4";
import CoGeometry from "./CoGeometry";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

export default class CoTubeGeometry extends CoGeometry {

    private m_longitudeNum: number = 0;
    private m_latitudeNum: number = 0;

    uScale: number = 1.0;
    vScale: number = 1.0;

    constructor() {
        super();
    }

    clone(): CoTubeGeometry {

        let geometry = new CoTubeGeometry();

        geometry.m_longitudeNum = this.m_longitudeNum;
        geometry.m_latitudeNum = this.m_latitudeNum;
        geometry.uScale = this.uScale;
        geometry.vScale = this.vScale;

        geometry.copyFrom(this);
        return geometry;
    }
    getCenterAt(i: number, outV: IVector3D): void {
        if (i >= 0 && i <= this.m_latitudeNum) {
            if (this.m_vs != null) {
                outV.setXYZ(0.0, 0.0, 0.0);
                let pvs = this.m_vs;
                let end = (i + 1) * (this.m_longitudeNum + 1) * 3;
                i = (i * (this.m_longitudeNum + 1)) * 3;
                end -= 3;
                //console.log("i: "+i,end);
                for (; i < end; i += 3) {
                    outV.x += pvs[i];
                    outV.y += pvs[i + 1];
                    outV.z += pvs[i + 2];
                }
                outV.scaleBy(1.0 / this.m_longitudeNum);
            }
        }
    }
    transformAt(i: number, mat4: IMatrix4): void {
        if (i >= 0 && i <= this.m_latitudeNum) {
            let pvs = this.m_vs;
            let end = (i + 1) * (this.m_longitudeNum + 1) * 3;
            i = (i * (this.m_longitudeNum + 1)) * 3;
            mat4.transformVectorsRangeSelf(pvs, i, end);
        }
    }
    getRangeAt(i: number, segLen: number = 3): number[] {
        if (i >= 0 && i <= this.m_latitudeNum) {
            let end = (i + 1) * (this.m_longitudeNum + 1) * segLen;
            i = (i * (this.m_longitudeNum + 1)) * segLen;
            return [i, end];
        }
        return [-1, -1];
    }

    initialize(radius: number, height: number, longitudeNumSegments: number, latitudeNumSegments: number, uvType: number = 1, alignYRatio: number = -0.5): void {
        let i = 0;
        let j = 0;
        if (radius < 0.01) radius = 0.01;
        if (longitudeNumSegments < 2) longitudeNumSegments = 2;
        if (latitudeNumSegments < 1) latitudeNumSegments = 1;
        this.m_longitudeNum = longitudeNumSegments;
        this.m_latitudeNum = latitudeNumSegments;

        let m_radius = Math.abs(radius);
        let ph = Math.abs(height);

        let yRad = 0;
        let px = 0;
        let py = 0;
        let minY = alignYRatio * ph;
        if (this.bounds != null) {
            this.bounds.min.setXYZ(-radius, minY, -radius);
            this.bounds.max.setXYZ(radius, minY + ph, radius);
            this.bounds.updateFast();
        }

        let vtx = CoRScene.createVec3();
        let srcRow: IVector3D[] = [];
        let pv: IVector3D;
        let pi2 = Math.PI * 2;
        for (i = 0; i < 1; ++i) {
            for (j = 0; j < longitudeNumSegments; ++j) {
                yRad = (pi2 * j) / longitudeNumSegments;
                px = Math.sin(yRad);
                py = Math.cos(yRad);
                vtx.x = px * m_radius;
                vtx.z = py * m_radius;
                pv = CoRScene.createVec3(vtx.x, vtx.y, vtx.z, 1.0);
                srcRow.push(pv);
            }
            srcRow.push(srcRow[0]);
        }
        this.vtxTotal = (longitudeNumSegments + 1) * (latitudeNumSegments + 1);
        this.m_vs = new Float32Array(this.vtxTotal * 3);
        this.m_uvs = new Float32Array(this.vtxTotal * 2);

        // calc cylinder wall vertexes
        let tot = latitudeNumSegments;
        let k = 0;
        let l = 0;
        console.log("latitudeNumSegments: ", latitudeNumSegments, " vtx tot: ", this.vtxTotal);
        for (i = 0; i <= tot; ++i) {
            px = i / tot;
            py = minY + ph * px;
            for (j = 0; j <= longitudeNumSegments; ++j) {
                if (uvType < 1) {
                    this.m_uvs[l++] = this.uScale * (j / longitudeNumSegments);
                    this.m_uvs[l++] = this.uScale * px;
                }
                else {
                    this.m_uvs[l++] = this.uScale * px;
                    this.m_uvs[l++] = this.uScale * (j / longitudeNumSegments);
                }
                // this.m_vs[k++] = srcRow[j].x; this.m_vs[k++] = py; this.m_vs[k++] = srcRow[j].z;
                const vtx = srcRow[j];
                const vs = this.m_vs;
                switch (this.axisType) {
                    case 1:
                        vs[k++] = vtx.x; vs[k++] = py; vs[k++] = vtx.z;
                        break;
                    case 2:
                        vs[k++] = vtx.z; vs[k++] = vtx.x; vs[k++] = py;
                        break;
                    default:
                        vs[k++] = py; vs[k++] = vtx.z; vs[k++] = vtx.x;
                        break;
                }
            }
        }
        let cn = longitudeNumSegments + 1;
        let a = 0;
        let b = 0;
        this.m_ivs = new Uint16Array(tot * longitudeNumSegments * 6);
        k = 0;
        for (i = 0; i < tot; ++i) {
            a = i * cn;
            b = (i + 1) * cn;
            for (j = 1; j <= longitudeNumSegments; ++j) {
                this.m_ivs[k++] = a + j; this.m_ivs[k++] = b + j - 1; this.m_ivs[k++] = a + j - 1;
                this.m_ivs[k++] = a + j; this.m_ivs[k++] = b + j; this.m_ivs[k++] = b + j - 1;
            }
        }
        this.vtCount = this.m_ivs.length;
        this.trisNumber = this.vtCount / 3;
    }
}
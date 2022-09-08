/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IDataMesh from "../../../vox/mesh/IDataMesh";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IPlaneMeshBuilder } from "./IPlaneMeshBuilder";
import MeshVertex from "../../../vox/mesh/MeshVertex";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";

import { ICoRScene } from "../../voxengine/ICoRScene";
import IMatrix4 from "../../../vox/math/IMatrix4";
declare var CoRScene: ICoRScene;

import { MeshBuilder } from "./MeshBuilder";

export default class ConeMeshBuilder extends MeshBuilder {

    constructor() {
        super();
    }

    // private m_ivs: Uint16Array;
    // private m_vs: Float32Array;
    // private m_uvs: Float32Array;
    // private m_nvs: Float32Array;

    private radius = 30.0;
    private height = 100.0;
    private longitudeNumSegments = 2;
    private alignYRatio = -0.5;

    inverseUV: boolean = false;
    uScale: number = 1.0;
    vScale: number = 1.0;

    create(radius: number, height: number, longitudeNumSegments: number, alignYRatio: number = -0.5): IRawMesh {

        this.radius = radius;
        this.height = height;
        this.longitudeNumSegments = longitudeNumSegments;
        this.alignYRatio = alignYRatio;
        return this.createMesh();
    }
    protected setMeshData(mesh: IRawMesh): void {
        
        ///*
        let radius = this.radius;
        let height = this.height;
        let longitudeNumSegments = this.longitudeNumSegments;
        let alignYRatio = this.alignYRatio;

        if (radius < 0.01) radius = 0.01;
        if (longitudeNumSegments < 2) longitudeNumSegments = 2;
        let latitudeNumSegments: number = 2;

        let i: number = 1;
        let j: number = 0
        let trisTot: number = 0;
        let yRad: number = 0.0;
        let px: number = 0.0;
        let py: number = 0.0;
        radius = Math.abs(radius);
        height = Math.abs(height);
        let minY: number = alignYRatio * height;
        let vtx: MeshVertex = new MeshVertex(0.0, minY, 0.0, trisTot);

        // 计算绕 y轴 的纬度线上的点
        let vtxVec: MeshVertex[] = [];
        let vtxRows: MeshVertex[][] = [];
        vtxRows.push([]);
        let vtxRow: MeshVertex[] = vtxRows[0];

        vtx.u = 0.5; vtx.v = 0.5;

        for (j = 0; j < 1; ++j) {
            vtx.index = trisTot;
            ++trisTot;
            vtxRow.push(vtx.cloneVertex());
            vtxVec.push(vtxRow[j]);
        }
        py = minY;
        let py2: number = 0.499;
        for (; i < latitudeNumSegments; ++i) {
            yRad = (Math.PI * i) / latitudeNumSegments;
            vtx.y = py;

            vtxRows.push([]);
            let rowa: MeshVertex[] = vtxRows[i];
            for (j = 0; j < longitudeNumSegments; ++j) {
                yRad = (Math.PI * 2.0 * j) / longitudeNumSegments;

                px = Math.sin(yRad);
                py = Math.cos(yRad);
                vtx.x = px * radius;
                vtx.z = py * radius;
                vtx.index = trisTot;
                ++trisTot;

                // calc uv
                px *= py2;
                py *= py2;
                vtx.u = 0.5 + px;
                vtx.v = 0.5 + py;

                rowa.push(vtx.cloneVertex());
                vtxVec.push(rowa[j]);
            }

            rowa.push(rowa[0]);
        }
        vtxRows.push([]);
        let rowa: MeshVertex[] = vtxRows[vtxRows.length - 1];
        let rowb: MeshVertex[] = vtxRows[vtxRows.length - 2];
        for (j = 0; j < longitudeNumSegments; ++j) {
            rowa.push(rowb[j].cloneVertex());
            rowa[j].index = trisTot;
            ++trisTot;
            vtxVec.push(rowa[j]);
        }
        rowa.push(rowa[0]);

        vtx.x = 0.0;
        vtx.y = minY + height;
        vtx.z = 0.0;
        vtx.u = 0.5;
        vtx.v = 0.5;
        vtxRows.push([]);
        let lastRow: MeshVertex[] = vtxRows[vtxRows.length - 1];
        for (j = 0; j < longitudeNumSegments; ++j) {
            vtx.index = trisTot;
            ++trisTot;
            lastRow.push(vtx.cloneVertex());
            vtxVec.push(lastRow[j]);
        }
        lastRow.push(lastRow[0]);
        let pvtx: MeshVertex = null;

        let pivs: number[] = [];
        i = 1;
        latitudeNumSegments += 1;
        for (; i <= latitudeNumSegments; ++i) {
            let rowa: MeshVertex[] = vtxRows[i - 1];
            let rowb: MeshVertex[] = vtxRows[i];
            for (j = 1; j <= longitudeNumSegments; ++j) {
                if (i == 1) {
                    pivs.push(rowa[0].index);
                    pivs.push(rowb[j].index);
                    pivs.push(rowb[j - 1].index);
                }
                else if (i == latitudeNumSegments) {
                    pivs.push(rowa[j].index);
                    pivs.push(rowb[j].index);
                    pivs.push(rowa[j - 1].index);
                }
            }
        }

        let vtxTotal = vtxVec.length;

        let vs = new Float32Array(vtxTotal * 3);
        let uvs = new Float32Array(vtxTotal * 2);
        let nvs = new Float32Array(vtxTotal * 3);

        i = 0;
        for (j = 0; j < vtxTotal; ++j) {
            pvtx = vtxVec[j];
            vs[i] = pvtx.x; vs[i + 1] = pvtx.y; vs[i + 2] = pvtx.z;
            //trace(pvtx.x+","+pvtx.y+","+pvtx.z);
            i += 3;
        }

        let ivs = new Uint16Array(pivs);

        i = 0;
        for (j = 0; j < vtxTotal; ++j) {
            pvtx = vtxVec[j];
            uvs[i] = pvtx.u; uvs[i + 1] = pvtx.v;
            i += 2;
        }
        let trisNumber = ivs.length / 3;
        SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
        // i = 0;
        // for (j = 0; j < vtxTotal; ++j) {
        //     pvtx = vtxVec[j];
        //     nvs[i] = pvtx.nx; nvs[i + 1] = pvtx.ny; nvs[i + 2] = pvtx.nz;
        //     i += 3;
        // }

        mesh.addFloat32Data(vs, 3);
        if(mesh.isUVSEnabled()) {
            mesh.addFloat32Data(uvs, 2);
        }
        if(mesh.isNVSEnabled()) {
            mesh.addFloat32Data(nvs, 3);
        }
        mesh.setIVS(ivs);

        // this.m_ivs = ivs;
        // this.m_vs = vs;
        // this.m_uvs = uvs;
        // this.m_nvs = nvs;
        //*/

        // mesh.addFloat32Data(this.m_vs, 3);
        // mesh.addFloat32Data(this.m_uvs, 2);
        // mesh.addFloat32Data(this.m_nvs, 3);
        // mesh.setIVS(this.m_ivs);

        // this.m_ivs = null;
        // this.m_vs = null;
        // this.m_uvs = null;
        // this.m_nvs = null;
    }
}
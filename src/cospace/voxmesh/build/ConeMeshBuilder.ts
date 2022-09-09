/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRawMesh from "../../../vox/mesh/IRawMesh";
import MeshVertex from "../../../vox/mesh/MeshVertex";

import { ICoAGeom } from "../../ageom/ICoAGeom";
declare var CoAGeom: ICoAGeom;

import { MeshBuilder } from "./MeshBuilder";
import { IConeMeshBuilder } from "./IConeMeshBuilder";

class ConeMeshBuilder extends MeshBuilder implements IConeMeshBuilder {

    constructor() {
        super();
    }

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

        i = 0;
        for (j = 0; j < vtxTotal; ++j) {
            pvtx = vtxVec[j];
            vs[i] = pvtx.x; vs[i + 1] = pvtx.y; vs[i + 2] = pvtx.z;
            i += 3;
        }

        let ivs = new Uint16Array(pivs);
        mesh.addFloat32Data(vs, 3);

        if (mesh.isUVSEnabled()) {
            let uvs = new Float32Array(vtxTotal * 2);
            i = 0;
            for (j = 0; j < vtxTotal; ++j) {
                pvtx = vtxVec[j];
                uvs[i] = pvtx.u; uvs[i + 1] = pvtx.v;
                i += 2;
            }

            mesh.addFloat32Data(uvs, 2);
        }
        if (mesh.isNVSEnabled()) {
            let nvs = new Float32Array(vtxTotal * 3);
            let trisNumber = ivs.length / 3;
            CoAGeom.SurfaceNormal.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);

            mesh.addFloat32Data(nvs, 3);
        }
        mesh.setIVS(ivs);
    }
}
export { ConeMeshBuilder };
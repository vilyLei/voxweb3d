/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { MeshBuilder } from "./MeshBuilder";
import { ISphereMeshBuilder } from "./ISphereMeshBuilder";
import MeshVertex from "../../../vox/mesh/MeshVertex";

class SphereMeshBuilder extends MeshBuilder implements ISphereMeshBuilder {

    constructor() {
        super();
    }
    private m_radius: number;
    private m_longitudeNumSegments: number;
    private m_latitudeNumSegments: number;
    private m_doubleTriFaceEnabled: boolean;

    inverseUV = false;
    uvScale = 1.0;


    create(radius: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 20, doubleTriFaceEnabled: boolean = false): IRawMesh {
        this.m_radius = radius;
        this.m_longitudeNumSegments = longitudeNumSegments;
        this.m_latitudeNumSegments = latitudeNumSegments;
        this.m_doubleTriFaceEnabled = doubleTriFaceEnabled;
        return this.createMesh();
    }
    protected setMeshData(mesh: IRawMesh): void {

        let radius = this.m_radius;
        let longitudeNumSegments = this.m_longitudeNumSegments;
        let latitudeNumSegments = this.m_latitudeNumSegments;
        let doubleTriFaceEnabled = this.m_doubleTriFaceEnabled;

        if (radius < 0.0001) radius = 0.0001;

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

        // 计算绕 y轴 的纬度线上的点
        let vtxVec = [];
        let vtxRows: MeshVertex[][] = [];
        vtxRows.push([]);
        let vtxRow: MeshVertex[] = vtxRows[0];
        let centerUV = this.inverseUV ? 1.0 : 0.5;

        vtx.u = vtx.v = centerUV;
        vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;
        vtxRow.push(vtx.cloneVertex());
        vtxVec.push(vtxRow[0]);

        let pr = 0.0
        let py2 = 0.0;
        let f = 1.0 / this.m_radius;

        for (i = 0; i < this.m_latitudeNumSegments; ++i) {
            yRad = Math.PI * i / this.m_latitudeNumSegments;
            px = Math.sin(yRad);
            py = Math.cos(yRad);

            vtx.y = -this.m_radius * py;
            pr = this.m_radius * px;

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
        lastRow.push(vtx.cloneVertex());
        vtxVec.push(lastRow[0]);

        let pvtx: MeshVertex = null;
        let pivs: number[] = [];

        let rowa = null;
        let rowb = null;
        i = 1;
        for (; i <= this.m_latitudeNumSegments; ++i) {
            rowa = vtxRows[i - 1];
            rowb = vtxRows[i];
            for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                if (i == 1) {
                    pivs.push(rowa[0].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                }
                else if (i == this.m_latitudeNumSegments) {
                    pivs.push(rowa[j].index); pivs.push(rowb[0].index); pivs.push(rowa[j - 1].index);
                }
                else {
                    pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                    pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                }
            }
        }
        let vtxTotal = vtxVec.length;
        let ivs: Uint16Array | Uint32Array;
        if (doubleTriFaceEnabled) {
            ivs = this.createIVSBYSize(pivs.length * 2);
            ivs.set(pivs, 0);
            pivs.reverse();
            ivs.set(pivs, pivs.length);
        }
        else {
            ivs = this.createIVSByArray(pivs);
        }
        let vs = new Float32Array(vtxTotal * 3);
        i = 0;
        for (j = 0; j < vtxTotal; ++j) {
            pvtx = vtxVec[j];
            vs[i] = pvtx.x; vs[i + 1] = pvtx.y; vs[i + 2] = pvtx.z;
            i += 3;
        }

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
            i = 0;
            for (j = 0; j < vtxTotal; ++j) {
                pvtx = vtxVec[j];
                nvs[i] = pvtx.nx; nvs[i + 1] = pvtx.ny; nvs[i + 2] = pvtx.nz;
                i += 3;
            }
            mesh.addFloat32Data(nvs, 3);
        }
        if (mesh.isCVSEnabled()) {
            let cvs = new Float32Array(vtxTotal * 3);
            i = 0;
            for (j = 0; j < vtxTotal; ++j) {
                cvs[i] = 1.0; cvs[i + 1] = 1.0; cvs[i + 2] = 1.0;
                i += 3;
            }
            mesh.addFloat32Data(cvs, 3);
        }
        mesh.setIVS(ivs);
    }
}
export { SphereMeshBuilder };
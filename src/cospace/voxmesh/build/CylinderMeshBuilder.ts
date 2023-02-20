/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { MeshBuilder } from "./MeshBuilder";
import { ICylinderMeshBuilder } from "./ICylinderMeshBuilder";
import MeshVertex from "../../../vox/mesh/MeshVertex";

class CylinderMeshBuilder extends MeshBuilder implements ICylinderMeshBuilder {

    constructor() {
        super();
    }
    private m_radius: number;
    private m_height: number;
    private m_longitudeNumSegments: number;
    private m_uvType: number;
    private m_alignYRatio: number;

    inverseUV = false;
    uScale = 1.0;
    vScale = 1.0;

    create(radius: number, height: number, longitudeNumSegments: number = 20, uvType: number = 1, alignYRatio: number = -0.5): IRawMesh {
        this.m_radius = radius;
        this.m_height = height;
        this.m_longitudeNumSegments = longitudeNumSegments;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;
        return this.createMesh();
    }

    protected setMeshData(mesh: IRawMesh): void {

        let radius = this.m_radius;
        let height = this.m_height;
        if (radius < 0.0001) radius = 0.0001;
        let longitudeNumSegments = this.m_longitudeNumSegments;
        if (longitudeNumSegments < 2) longitudeNumSegments = 2;
        
        let latitudeNumSegments = 3;

        let m_radius = Math.abs(radius);
        let m_height = Math.abs(height);

        let i = 1
        let j = 0;
        let trisTot = 0;
        let yRad = 0;
        let px = 0;
        let py = 0;
        let minY = this.m_alignYRatio * m_height;

        let vtx = new MeshVertex();
        vtx.y = minY;

        // two independent circles and a cylinder wall
        let vtxVec: MeshVertex[] = [];
        let vtxRows: MeshVertex[][] = [];
        vtxRows.push([]);
        let vtxRow: MeshVertex[] = vtxRows[0];
        vtx.u = 0.5; vtx.v = 0.5;
        vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;
        vtxRow.push(vtx.cloneVertex());
        vtxVec.push(vtxRow[0]);

        for (; i < latitudeNumSegments; ++i) {
            //
            vtx.y = minY + m_height * (i - 1);
            vtxRows.push([]);
            let row = vtxRows[i];
            for (j = 0; j < longitudeNumSegments; ++j) {
                yRad = (Math.PI * 2 * j) / longitudeNumSegments;
                ++trisTot;
                //Math::sinCos(&px, &py, yRad);
                px = Math.sin(yRad);
                py = Math.cos(yRad);
                //
                vtx.x = px * m_radius;
                vtx.z = py * m_radius;
                vtx.index = trisTot;
                // calc uv
                px *= 0.495;
                py *= 0.495;
                vtx.u = 0.5 + px;
                vtx.v = 0.5 + py;
                //
                if (i < 2) {
                    vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;
                }
                else {
                    vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
                }
                //
                row.push(vtx.cloneVertex());
                vtxVec.push(row[j]);
            }
            row.push(row[0]);
        }
        ++trisTot;
        vtx.index = trisTot;
        vtx.x = 0; vtx.y = minY + m_height; vtx.z = 0.0;
        vtx.u = 0.5; vtx.v = 0.5;
        vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
        vtxRows.push([]);
        let lastRow = vtxRows[3];
        lastRow.push(vtx.cloneVertex());
        vtxVec.push(lastRow[0]);
        // two circles's vertexes calc end;
        // calc cylinder wall vertexes
        let f = 1.0 / m_radius;
        for (i = 0; i < 2; ++i) {
            let preRow = vtxRows[i + 1];
            vtxRows.push([]);
            let row = vtxRows[vtxRows.length - 1];
            for (j = 0; j <= longitudeNumSegments; ++j) {
                ++trisTot;
                vtx.copyFrom(preRow[j]);
                vtx.index = trisTot;
                if (this.m_uvType < 1) {
                    if (i < 1) {
                        vtx.v = 0.0;
                    }
                    else {
                        vtx.v = this.vScale;//1.0
                    }
                    vtx.u = this.uScale * (j / longitudeNumSegments);
                }
                else {
                    if (i < 1) {
                        vtx.u = 0.0;
                    }
                    else {
                        vtx.u = this.uScale;//1.0;
                    }
                    vtx.v = this.vScale * (j / longitudeNumSegments);
                }

                vtx.ny = 0.0;
                vtx.nx = vtx.x * f;
                vtx.nz = vtx.z * f;

                row.push(vtx.cloneVertex());
                vtxVec.push(row[j]);
            }
        }
        let pvtx: MeshVertex = null;
        let pivs: number[] = [];
        i = 1;
        let rowa: MeshVertex[] = null;
        let rowb: MeshVertex[] = null;
        for (; i <= latitudeNumSegments; ++i) {
            rowa = vtxRows[i - 1];
            rowb = vtxRows[i];
            for (j = 1; j <= longitudeNumSegments; ++j) {
                if (i == 1) {
                    pivs.push(rowa[0].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                }
                else if (i == latitudeNumSegments) {
                    pivs.push(rowa[j].index); pivs.push(rowb[0].index); pivs.push(rowa[j - 1].index);
                }
            }
        }
        // create cylinder wall triangles
        rowa = vtxRows[vtxRows.length - 2];
        rowb = vtxRows[vtxRows.length - 1];
        for (j = 1; j <= longitudeNumSegments; ++j) {
            pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
            pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
        }

        let vtxTotal = vtxVec.length;

        let vs = new Float32Array(vtxTotal * 3);
        i = 0;
        for (j = 0; j < vtxTotal; ++j) {
            pvtx = vtxVec[j];
            vs[i] = pvtx.x; vs[i + 1] = pvtx.y; vs[i + 2] = pvtx.z;
            //trace(pvtx.x+","+pvtx.y+","+pvtx.z);
            i += 3;
        }
        mesh.addFloat32Data(vs, 3);
        // if (mesh.isUVSEnabled()) {

        let ivs = new Uint16Array(pivs);

        let vtCount = ivs.length;
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
        mesh.setIVS(ivs);
    }
}
export { CylinderMeshBuilder };
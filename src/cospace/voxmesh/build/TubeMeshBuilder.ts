/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { MeshBuilder } from "./MeshBuilder";
import { ITubeMeshBuilder } from "./ITubeMeshBuilder";
import CoTubeGeometry from "../geom/CoTubeGeometry";

import { ICoAGeom } from "../../ageom/ICoAGeom";
declare var CoAGeom: ICoAGeom;
class TubeMeshBuilder extends MeshBuilder implements ITubeMeshBuilder {

    constructor() {
        super();
    }
    private m_radius: number;
    private m_height: number;
    private m_longitudeNumSegments: number;
    private m_latitudeNumSegments: number;
    private m_uvType: number;
    private m_alignYRatio: number;
    private m_geometry = new CoTubeGeometry();

    uScale = 1.0;
    vScale = 1.0;

    create(radius: number, height: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 1, uvType: number = 1, alignYRatio: number = -0.5): IRawMesh {
        this.m_radius = radius;
        this.m_height = height;
        this.m_longitudeNumSegments = longitudeNumSegments;
        this.m_latitudeNumSegments = latitudeNumSegments;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;
        return this.createMesh();
    }

    protected setMeshData(mesh: IRawMesh): void {
        
        let geometry = this.m_geometry;
        geometry.reset();
        geometry.uScale = this.uScale;
        geometry.vScale = this.vScale;

        geometry.initialize(
            this.m_radius,
            this.m_height,
            this.m_longitudeNumSegments,
            this.m_latitudeNumSegments,
            this.m_uvType,
            this.m_alignYRatio
            );
        let vs = geometry.getVS();
        let ivs = geometry.getIVS();
        mesh.addFloat32Data(vs, 3);
        if(mesh.isUVSEnabled()) {
            let uvs = geometry.getUVS();
            mesh.addFloat32Data(uvs, 2);
        }
        if(mesh.isNVSEnabled()) {
            let nvs = new Float32Array(vs.length);
            CoAGeom.SurfaceNormal.ClacTrisNormal(vs, vs.length, ivs.length / 3, ivs, nvs);
            mesh.addFloat32Data(nvs, 3);
        }
        mesh.setIVS(ivs);
        geometry.reset();
    }
}
export { TubeMeshBuilder };
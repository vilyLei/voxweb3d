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

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
class TubeMeshBuilder extends MeshBuilder implements ITubeMeshBuilder {

    constructor() {
        super();
    }
    private m_radius: number;
    private m_long: number;
    private m_longitudeNumSegments: number;
    private m_latitudeNumSegments: number;
    private m_uvType: number;
    private m_alignYRatio: number;
    readonly geometry = new CoTubeGeometry();

    uScale = 1.0;
    vScale = 1.0;

    create(radius: number, long: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 1, uvType: number = 1, alignYRatio: number = -0.5): IRawMesh {
        this.m_radius = radius;
        this.m_long = long;
        this.m_longitudeNumSegments = longitudeNumSegments;
        this.m_latitudeNumSegments = latitudeNumSegments;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;
        return this.createMesh();
    }

    protected setMeshData(mesh: IRawMesh): void {

        let g = this.geometry;
        g.uScale = this.uScale;
        g.vScale = this.vScale;

        g.initialize(
            this.m_radius,
            this.m_long,
            this.m_longitudeNumSegments,
            this.m_latitudeNumSegments,
            this.m_uvType,
            this.m_alignYRatio
        );
        let nvFlag = mesh.isNVSEnabled();
        let vs = g.getVS();
        let ivs = g.getIVS();
        let uvs = g.getUVS();
        let nvs: Float32Array = null;

        if (nvFlag) {
            nvs = new Float32Array(vs.length);
        }

        if (nvFlag) {
            let pv = CoMath.createVec3();
            let nv = CoMath.createVec3();
            for (let i = 0; i <= this.m_latitudeNumSegments; ++i) {


                g.getCenterAt(i, pv);
                let cv = pv;
                let range = g.getRangeAt(i);
                let pvs = vs.subarray(range[0], range[1]);
                let pnvs = nvs.subarray(range[0], range[1]);
                let tot = pvs.length / 3;
                let k = 0;
                for (let j = 0; j < tot; ++j) {
                    k = j * 3;
                    nv.setXYZ(pvs[k], pvs[k + 1], pvs[k + 2]);
                    nv.subtractBy(cv);
                    nv.normalize();
                    pnvs[k] = nv.x;
                    pnvs[k + 1] = nv.y;
                    pnvs[k + 2] = nv.z;
                }
            }
        }

        mesh.addFloat32Data(vs, 3);
        if (mesh.isUVSEnabled()) {
            mesh.addFloat32Data(uvs, 2);
        }
        if (nvFlag) {
            mesh.addFloat32Data(nvs, 3);
        }
        mesh.setIVS(ivs);
        g.reset();
    }
}
export { TubeMeshBuilder };
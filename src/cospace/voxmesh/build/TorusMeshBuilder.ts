/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRawMesh from "../../../vox/mesh/IRawMesh";
import CoTubeGeometry from "../geom/CoTubeGeometry";

import { MeshBuilder } from "./MeshBuilder";
import { ITorusMeshBuilder } from "./ITorusMeshBuilder";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class TorusMeshBuilder extends MeshBuilder implements ITorusMeshBuilder {

    constructor() {
        super();
    }

    private m_ringRadius = 100.0;
    private m_axisRadius = 50.0;
    private m_uvType = 1;
    private m_longitudeNumSegments = 5;
    private m_latitudeNumSegments = 10;
    private m_alignYRatio = -0.5;

    inverseUV = false;
    uScale = 1.0;
    vScale = 1.0;
    /**
     * 0: vertical to x-axis, 1: vertical to y-axis, 2: vertical to z-axis, the default value is 0
     */
    axisType = 0;
    readonly geometry = new CoTubeGeometry();

    create(ringRadius: number = 200, axisRadius: number = 50, longitudeNumSegments: number = 30, latitudeNumSegments: number = 20, uvType: number = 1, alignYRatio: number = -0.5): IRawMesh {

        this.m_ringRadius = ringRadius;
        this.m_axisRadius = axisRadius;
        this.m_longitudeNumSegments = longitudeNumSegments;
        this.m_latitudeNumSegments = latitudeNumSegments;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;
        return this.createMesh();
    }
    protected setMeshData(mesh: IRawMesh): void {

        let ringRadius = this.m_ringRadius;
        let axisRadius = this.m_axisRadius;
        let longitudeNumSegments = this.m_longitudeNumSegments;
        let latitudeNumSegments = this.m_latitudeNumSegments;
        let uvType = this.m_uvType;
        let alignYRatio = this.m_alignYRatio;
        let g = this.geometry;
        switch (this.axisType) {
            case 1:
                g.axisType = 2;
                break;
            case 2:
                g.axisType = 0;
                break;
            default:
                g.axisType = 1;
                break;
        }
        g.initialize(axisRadius, 0.0, longitudeNumSegments, latitudeNumSegments, uvType, alignYRatio);

        let nvFlag = mesh.isNVSEnabled();
        let vs = g.getVS();
        let ivs = g.getIVS();
        let uvs = g.getUVS();
        let nvs: Float32Array = null;

        if (nvFlag) {
            nvs = new Float32Array(vs.length);
        }

        let pi2 = 2.0 * Math.PI;
        let rad = 0.0;
        let pv = CoMath.createVec3();
        let nv = CoMath.createVec3();
        let mat4 = CoMath.createMat4();
        for (let i = 0; i <= latitudeNumSegments; ++i) {

            mat4.identity();
            rad = pi2 * i / latitudeNumSegments;
            
            switch (this.axisType) {
                case 1:
                    pv.x = Math.cos(rad) * ringRadius;
                    pv.z = Math.sin(rad) * ringRadius;
                    mat4.rotationY(-rad);
                    break;
                case 2:
                    pv.y = Math.cos(rad) * ringRadius;
                    pv.x = Math.sin(rad) * ringRadius;
                    mat4.rotationZ(-rad);
                    break;
                default:
                    pv.z = Math.cos(rad) * ringRadius;
                    pv.y = Math.sin(rad) * ringRadius;
                    mat4.rotationX(-rad);
                    break;
            }

            mat4.setTranslation(pv);
            g.transformAt(i, mat4);

            if (nvFlag) {
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
        if(mesh.isUVSEnabled()) {
            mesh.addFloat32Data(uvs, 2);
        }
        if(nvFlag) {
            mesh.addFloat32Data(nvs, 3);
        }
        mesh.setIVS(ivs);
        g.reset();
    }
}
export { TorusMeshBuilder };
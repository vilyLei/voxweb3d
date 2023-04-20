/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import IROTransform from "../../vox/display/IROTransform";
import Default3DEntity from "../../vox/entity/Default3DEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import Tube3DMesh from "../../vox/mesh/Tube3DMesh";

export default class Tube3DEntity extends Default3DEntity {
    private m_longitudeNum = 10;
    private m_latitudeNum = 1;
    private m_uvType = 1;
    private m_alignYRatio = -0.5;
    private m_transMatrix: Matrix4 = null;
    private m_currMesh: Tube3DMesh = null;
    private m_radius = 50.0;
    private m_height = 100.0;

    uScale = 1.0;
    vScale = 1.0;
    // wireframe: boolean = false;
    /**
     * axisType = 0 is XOY plane,
     * axisType = 1 is XOZ plane,
     * axisType = 2 is YOZ plane
     */
    axisType = 0;
    constructor(transform: IROTransform = null) {
        super(transform);
    }
    setVtxTransformMatrix(matrix: Matrix4): void {
        this.m_transMatrix = matrix;
    }
    initialize(radius: number, height: number, longitudeNum: number, latitudeNum: number, texList: IRenderTexture[] = null, uvType: number = 1, alignYRatio: number = -0.5): void {
        this.m_radius = radius;
        this.m_height = height;
        this.m_longitudeNum = longitudeNum;
        this.m_latitudeNum = latitudeNum;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;

        this.createMaterial(texList);
        this.activeDisplay();
    }

    protected __activeMesh(material: IRenderMaterial): void {

        this.m_currMesh = this.getMesh() as Tube3DMesh;

        let mesh = this.m_currMesh;
        if (mesh == null) {
            mesh = new Tube3DMesh();
            mesh.axisType = this.axisType;

            if (this.m_transMatrix != null) {
                mesh.setTransformMatrix(this.m_transMatrix);
            }
            mesh.uScale = this.uScale;
            mesh.vScale = this.vScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.wireframe = this.wireframe;
            mesh.setVtxBufRenderData(material);
            mesh.initialize(this.m_radius, this.m_height, this.m_longitudeNum, this.m_latitudeNum, this.m_uvType, this.m_alignYRatio);
            this.setMesh( mesh );
            mesh.setTransformMatrix(null);
        }
        this.m_transMatrix = null;
    }
    // reinitializeMesh(): void {
    //     if (this.m_currMesh != null) {
    //         this.m_currMesh.reinitialize();
    //     }
    // }
    getCircleCenterAt(i: number, outV: Vector3D): void {
        if (this.m_currMesh != null) {
            this.m_currMesh.getCircleCenterAt(i, outV);
        }
    }
    transformCircleAt(i: number, mat4: Matrix4): void {
        if (this.m_currMesh != null) {
            this.m_currMesh.transformCircleAt(i, mat4);
        }
    }
	destroy(): void {
        this.m_transMatrix = null;
		super.destroy();
	}
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROTransform from "../../vox/display/IROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import Matrix4 from "../math/Matrix4";
import Torus3DMesh from "../mesh/Torus3DMesh";

export default class Torus3DEntity extends DisplayEntity {
    private m_ringRadius = 50.0;
    private m_axisRadius = 100.0;
    private m_plongitudeNumSegments = 30.0;
    private m_latitudeNumSegments = 50.0;
    private m_uvType = 1;
    private m_alignYRatio = -0.5;
    private m_transMatrix: Matrix4 = null;
    uScale = 1.0;
    vScale = 1.0;
    wireframe = false;
    normalEnabled = false;
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
    private createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            let cm = new Default3DMaterial();
            cm.normalEnabled = this.normalEnabled;
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else if (texList != null && this.getMaterial().getTextureTotal() < 1) {
            this.getMaterial().setTextureList(texList);
        }
    }
	/**
     * @param ringRadius the default value is 200
     * @param axisRadius the default value is 50
     * @param longitudeNumSegments the default value is 30
     * @param latitudeNumSegments the default value is 20
     * @param texList the default value is null
     * @param uvType the default value is 1
     * @param alignYRatio the default value is -0.5
	 * @returns a torus entity
     */
    initialize(ringRadius: number = 200, axisRadius: number = 50, longitudeNumSegments: number = 30, latitudeNumSegments: number = 20, texList: IRenderTexture[] = null, uvType: number = 1, alignYRatio: number = -0.5): void {
        this.m_ringRadius = ringRadius;
        this.m_axisRadius = axisRadius;
        this.m_plongitudeNumSegments = longitudeNumSegments;
        this.m_latitudeNumSegments = latitudeNumSegments;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;

        this.createMaterial(texList);
        this.activeDisplay();
    }

    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh = new Torus3DMesh();
            if (this.m_transMatrix != null) {
                mesh.setTransformMatrix(this.m_transMatrix);
            }
            mesh.uScale = this.uScale;
            mesh.vScale = this.vScale;
            mesh.axisType = this.axisType;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.wireframe = this.wireframe;
            mesh.setVtxBufRenderData(material);
            mesh.initialize(this.m_ringRadius, this.m_axisRadius, this.m_plongitudeNumSegments, this.m_latitudeNumSegments, this.m_uvType, this.m_alignYRatio);
            this.setMesh(mesh);
        }
    }
}
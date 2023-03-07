/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Matrix4 from "../../vox/math/Matrix4";
import IROTransform from "../../vox/display/IROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import Cylinder3DMesh from "../../vox/mesh/Cylinder3DMesh";

export default class Cylinder3DEntity extends DisplayEntity {
    private m_plongitudeNumSegments: number = 10.0;
    private m_uvType: number = 1;
    private m_alignYRatio: number = -0.5;
    private m_transMatrix: Matrix4 = null;
    uScale: number = 1.0;
    vScale: number = 1.0;
    normalEnabled: boolean = false;
    wireframe: boolean = false;
    private m_radius: number = 50.0;
    private m_height: number = 100.0;
    constructor(transform: IROTransform = null) {
        super(transform);
    }
    setVtxTransformMatrix(matrix: Matrix4): void {
        this.m_transMatrix = matrix;
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            let cm: Default3DMaterial = new Default3DMaterial();
            cm.normalEnabled = this.normalEnabled;
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else if (texList != null && this.getMaterial().getTextureTotal() < 1) {
            this.getMaterial().setTextureList(texList);
        }
    }
    /**
     * @param radius radius
     * @param height height
     * @param longitudeNumSegments longitude segments number
     * @param texList the defaule value is null
     * @param uvType the default value is 1
     * @param alignYRatio the default value is -0.5
     */
    initialize(radius: number, height: number, longitudeNumSegments: number, texList: IRenderTexture[] = null, uvType: number = 1, alignYRatio: number = -0.5): void {
        this.m_radius = radius;
        this.m_height = height;
        this.m_plongitudeNumSegments = longitudeNumSegments;
        this.m_uvType = uvType;
        this.m_alignYRatio = alignYRatio;

        this.createMaterial(texList);
        this.activeDisplay();
    }

    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh: Cylinder3DMesh = new Cylinder3DMesh();

            if (this.m_transMatrix != null) {
                mesh.setTransformMatrix(this.m_transMatrix);
            }
            mesh.uScale = this.uScale;
            mesh.vScale = this.vScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.wireframe = this.wireframe;
            mesh.setVtxBufRenderData(material);
            mesh.initialize(this.m_radius, this.m_height, this.m_plongitudeNumSegments, 2, this.m_uvType, this.m_alignYRatio);
            this.setMesh(mesh);
            mesh.setTransformMatrix(null);
        }
        this.m_transMatrix = null;
    }

    toString(): string {
        return "[Cylinder3DEntity(uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")]";
    }
}
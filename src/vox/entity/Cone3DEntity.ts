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
import Cone3DMesh from "../../vox/mesh/Cone3DMesh";
import Matrix4 from "../math/Matrix4";

export default class Cone3DEntity extends DisplayEntity {
    private m_radius: number = 50.0;
    private m_height: number = 100.0;
    private m_plongitudeNumSegments: number = 10.0;
    private m_uvType: number = 1;
    private m_alignYRatio: number = -0.5;
    private m_transMatrix: Matrix4 = null;
    uScale: number = 1.0;
    vScale: number = 1.0;
    wireframe: boolean = false;

    constructor(transform: IROTransform = null) {
        super(transform);
    }
    setVtxTransformMatrix(matrix: Matrix4): void {
        this.m_transMatrix = matrix;
    }
    private createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            let cm: Default3DMaterial = new Default3DMaterial();
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else {
            this.getMaterial().setTextureList(texList);
        }
    }
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
            let mesh: Cone3DMesh = new Cone3DMesh();
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
        }
    }

    toString(): string {
        return "[Cone3DEntity(uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")]";
    }
}
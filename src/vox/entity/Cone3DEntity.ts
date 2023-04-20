/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROTransform from "../../vox/display/IROTransform";
import Default3DEntity from "../../vox/entity/Default3DEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import Cone3DMesh from "../../vox/mesh/Cone3DMesh";
import Matrix4 from "../math/Matrix4";

export default class Cone3DEntity extends Default3DEntity {
    private m_radius = 50.0;
    private m_height = 100.0;
    private m_plongitudeNumSegments = 10.0;
    private m_uvType = 1;
    private m_alignYRatio = -0.5;
    private m_transMatrix: Matrix4 = null;
    uScale = 1.0;
    vScale = 1.0;
    // wireframe = false;
    // normalEnabled = false;

    constructor(transform: IROTransform = null) {
        super(transform);
    }
    setVtxTransformMatrix(matrix: Matrix4): void {
        this.m_transMatrix = matrix;
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
            let mesh = new Cone3DMesh();
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
	destroy(): void {
        this.m_transMatrix = null;
		super.destroy();
	}
}

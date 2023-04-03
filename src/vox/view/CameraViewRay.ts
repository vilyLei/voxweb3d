/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import Plane from "../../vox/geom/Plane";
import IRendererScene from "../scene/IRendererScene";

export default class CameraViewRay {
    private m_camera: IRenderCamera = null;
    private m_stage: IRenderStage3D = null;
    private m_rlpv: Vector3D = new Vector3D();
    private m_rltv: Vector3D = new Vector3D();
    private m_pnv: Vector3D = new Vector3D(0.0, 1.0, 0.0);
    private m_pdis: number = 0.0;
    /**
     * the intersection point in world space
     */
    position: Vector3D = new Vector3D();

    constructor() { }
	initialize(rscene: IRendererScene): void {
		this.bindCameraAndStage(rscene.getCamera(), rscene.getStage3D());
	}
    bindCameraAndStage(camera: IRenderCamera, stage: IRenderStage3D): void {
        this.m_camera = camera;
        this.m_stage = stage;
    }

    setPlaneParam(plane_nv: Vector3D, plane_dis: number): void {
        this.m_pnv.copyFrom(plane_nv);
        this.m_pnv.normalize();
        this.m_pdis = plane_dis;
    }
    /**
     * calculate the intersection point in world space
     */
    intersectPlane(): void {
        if (this.m_camera != null && this.m_stage != null) {
            this.m_camera.update();
            this.m_camera.getWorldPickingRayByScreenXY(this.m_stage.mouseX, this.m_stage.mouseY, this.m_rlpv, this.m_rltv);
            Plane.IntersectionSLV2(this.m_pnv, this.m_pdis, this.m_rlpv, this.m_rltv, this.position);
        }
    }
    destroy(): void {
        this.m_camera = null;
        this.m_stage = null;
    }
}

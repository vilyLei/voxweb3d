/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import CameraBase from "../../vox/view/CameraBase";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

class CameraDragSlide {
    constructor() { }

    private m_stage3D: IRenderStage3D = null;
    private m_camera: CameraBase = null;
    initialize(stage3D: IRenderStage3D, camera: CameraBase): void {
        if (this.m_stage3D == null) {
            this.m_stage3D = stage3D;
            this.m_camera = camera;
        }
    }

    private m_mouseX: number = 0.0;
    private m_mouseY: number = 0.0;
    private m_enabled: boolean = false;

    attach(): void {
        this.m_mouseX = this.m_stage3D.mouseX;
        this.m_mouseY = this.m_stage3D.mouseY;
        this.m_enabled = true;
    }
    detach(): void {
        this.m_enabled = false;
    }
    run(): void {
        if (this.m_enabled) {
            let dx: number = this.m_mouseX - this.m_stage3D.mouseX;
            let dy: number = this.m_mouseY - this.m_stage3D.mouseY;
            this.m_camera.slideViewOffsetXY(dx, dy);
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
        }
    }
}

export {CameraDragSlide};
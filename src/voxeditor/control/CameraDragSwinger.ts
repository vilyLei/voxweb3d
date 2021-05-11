/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import CameraBase from "../../vox/view/CameraBase";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

export default class CameraDragSwinger {
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

    enabled(): void {
        this.m_mouseX = this.m_stage3D.mouseX;
        this.m_mouseY = this.m_stage3D.mouseY;
        this.m_enabled = true;
    }
    disable(): void {
        this.m_enabled = false;
    }
    runWithYAxis(): void {
        if (this.m_enabled) {
            let dx: number = this.m_mouseX - this.m_stage3D.mouseX;
            let dy: number = this.m_mouseY - this.m_stage3D.mouseY;
            let abs_dx: number = Math.abs(dx);
            let abs_dy: number = Math.abs(dy);
            if (abs_dx > abs_dy) {
                if (abs_dx > 0.5) this.m_camera.swingHorizontalWithAxis(dx * 0.2, Vector3D.Y_AXIS);
            }
            else {
                if (abs_dy > 0.5) this.m_camera.swingVertical(dy * -0.2);
            }
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
        }
    }
    runWithZAxis(): void {
        if (this.m_enabled) {
            let dx: number = this.m_mouseX - this.m_stage3D.mouseX;
            let dy: number = this.m_mouseY - this.m_stage3D.mouseY;
            let abs_dx: number = Math.abs(dx);
            let abs_dy: number = Math.abs(dy);
            if (abs_dx > abs_dy) {
                if (abs_dx > 0.5) this.m_camera.swingHorizontalWithAxis(dx * 0.2, Vector3D.Y_AXIS);
            }
            else {
                if (abs_dy > 0.5) this.m_camera.swingVertical(dy * -0.2);
            }
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
        }
    }
}
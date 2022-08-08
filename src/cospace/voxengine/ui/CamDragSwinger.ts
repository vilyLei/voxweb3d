/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IRenderStage3D from "../../../vox/render/IRenderStage3D";

import { ICoRScene } from "../ICoRScene";
declare var CoRScene: ICoRScene;

class CamDragSwinger {
    constructor() { }

    private m_stage3D: IRenderStage3D = null;
    private m_camera: IRenderCamera = null;
    initialize(stage3D: IRenderStage3D, camera: IRenderCamera): void {
        if (this.m_stage3D == null) {
            this.m_stage3D = stage3D;
            this.m_camera = camera;
        }
    }

    private m_mouseX: number = 0.0;
    private m_mouseY: number = 0.0;
    private m_enabled: boolean = false;
    private m_rotationSpeed: number = 0.0;
    private m_aotuRotationDelay: number = 100.0;
    autoRotationEnabled: boolean = false;
    autoRotationSpeed: number = 0.2;
    rotationAttenuationEnabled: boolean = false;
    rotationSpeed: number = 0.2;
    attach(): void {
        this.m_mouseX = this.m_stage3D.mouseX;
        this.m_mouseY = this.m_stage3D.mouseY;
        this.m_enabled = true;
        this.m_aotuRotationDelay = 100;
    }
    detach(): void {
        this.m_enabled = false;
    }
    runWithYAxis(): void {
        this.runWithAxis(CoRScene.Vector3D.X_AXIS);
    }
    runWithZAxis(): void {
        this.runWithAxis(CoRScene.Vector3D.Y_AXIS);
    }
    /*
            if (this.m_enabled) {
                let dx: number = this.m_mouseX - this.m_stage3D.mouseX;
                let dy: number = this.m_mouseY - this.m_stage3D.mouseY;
                let abs_dx: number = Math.abs(dx);
                let abs_dy: number = Math.abs(dy);
                if (abs_dx > abs_dy) {
                    this.m_rotationSpeed = dx * this.rotationSpeed;
                    if (abs_dx > 0.5) {
                        (this.m_camera as any).swingHorizontalWithAxis(this.m_rotationSpeed, Vector3D.Y_AXIS);
                    }
                }
                else {
                    this.m_rotationSpeed = 0.0;
                    if (abs_dy > 0.5) {
                        (this.m_camera as any).swingVertical(-dy * this.rotationSpeed);
                    }
                }
                this.m_mouseX = this.m_stage3D.mouseX;
                this.m_mouseY = this.m_stage3D.mouseY;
            }
            else if( this.autoRotationEnabled ) {
                if(this.m_aotuRotationDelay < 0) {
                    (this.m_camera as any).swingHorizontalWithAxis(this.autoRotationSpeed, Vector3D.Y_AXIS);
                }
                else {
                    this.m_aotuRotationDelay --;
                }
            }
        }
        //*/
    runWithAxis(axis: IVector3D): void {
        if (this.m_enabled) {
            let dx: number = this.m_mouseX - this.m_stage3D.mouseX;
            let dy: number = this.m_mouseY - this.m_stage3D.mouseY;
            let abs_dx: number = Math.abs(dx);
            let abs_dy: number = Math.abs(dy);
            if (abs_dx > abs_dy) {
                if (abs_dx > 0.5) {
                    (this.m_camera as any).swingHorizontalWithAxis(dx * 0.2, axis);
                }
            }
            else {
                if (abs_dy > 0.5) {
                    (this.m_camera as any).swingVertical(dy * -0.2);
                }
            }
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
        }
        else if (this.autoRotationEnabled) {
            if (this.m_aotuRotationDelay < 0) {
                (this.m_camera as any).swingHorizontalWithAxis(this.autoRotationSpeed, axis);
            }
            else {
                this.m_aotuRotationDelay--;
            }
        }
    }

    runWithCameraAxis(): void {
        if (this.m_enabled) {
            let dx: number = this.m_mouseX - this.m_stage3D.mouseX;
            let dy: number = this.m_mouseY - this.m_stage3D.mouseY;
            let abs_dx: number = Math.abs(dx);
            let abs_dy: number = Math.abs(dy);
            if (abs_dx > abs_dy) {
                if (abs_dx > 0.5) {
                    (this.m_camera as any).swingHorizontal(dx * 0.2);
                }
            }
            else {
                if (abs_dy > 0.5) {
                    (this.m_camera as any).swingVertical(dy * -0.2);
                }
            }
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
        }
        else if (this.autoRotationEnabled) {
            if (this.m_aotuRotationDelay < 0) {
                (this.m_camera as any).swingHorizontal(this.autoRotationSpeed);
            }
            else {
                this.m_aotuRotationDelay--;
            }
        }
    }
}
export { CamDragSwinger };
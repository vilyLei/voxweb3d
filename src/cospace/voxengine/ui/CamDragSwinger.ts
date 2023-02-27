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

    private m_mouseX = 0.0;
    private m_mouseY = 0.0;
    private m_enabled = false;
    private m_rotationSpeed = 0.0;
    private m_aotuRotationDelay = 100.0;
    autoRotationEnabled = false;
    autoRotationSpeed = 0.2;
    rotationAttenuationEnabled = false;
    rotationSpeed = 0.2;
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
        this.runWithAxis(CoRScene.Vector3D.Y_AXIS);
    }
    runWithZAxis(): void {
        this.runWithAxis(CoRScene.Vector3D.Z_AXIS);
    }

    private run(axis: IVector3D, type: number): void {
        if (this.m_enabled) {
            let dx = this.m_mouseX - this.m_stage3D.mouseX;
            let dy = this.m_mouseY - this.m_stage3D.mouseY;
            let abs_dx = Math.abs(dx);
            let abs_dy = Math.abs(dy);
            if (abs_dx > abs_dy) {
                if (abs_dx > 0.5) {
					if(type < 1) {
						(this.m_camera as any).swingHorizontalWithAxis(dx * 0.2, axis);
					}else {
						(this.m_camera as any).swingHorizontal(dx * 0.2);
					}
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

				if(type < 1) {
					(this.m_camera as any).swingHorizontalWithAxis(this.autoRotationSpeed, axis);
				}else {
					(this.m_camera as any).swingHorizontal(this.autoRotationSpeed);
				}
            }
            else {
                this.m_aotuRotationDelay--;
            }
        }
    }
    runWithAxis(axis: IVector3D): void {
		this.run(axis, 0);
    }

    runWithCameraAxis(): void {
		this.run(null, 1);
    }
}
export { CamDragSwinger };

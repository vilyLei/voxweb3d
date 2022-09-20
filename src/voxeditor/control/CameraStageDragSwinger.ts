/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import CameraBase from "../../vox/view/CameraBase";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import MouseEvent from "../../vox/event/MouseEvent";
import { CameraDragSwinger } from "../../voxeditor/control/CameraDragSwinger";

export default class CameraStageDragSwinger {
    constructor() { }

    private m_stage3D: IRenderStage3D = null;
    private m_dragSwinger: CameraDragSwinger = new CameraDragSwinger();
    private m_enabled: boolean = true;

    /**
     * the value contains 0(mouse down), 1(mouse middle), 2(mouse right)
     */
    buttonType: number = 0;
    bgEventEnabled: boolean = false;
    setAutoRotationEnabled(enabled: boolean): void {
        this.m_dragSwinger.autoRotationEnabled = enabled;
    }
    initialize(stage3D: IRenderStage3D, camera: CameraBase): void {
        if (this.m_stage3D == null) {
            this.m_stage3D = stage3D;
            this.m_dragSwinger.initialize(stage3D, camera);
            // if(bgMouseDown) {
            //     stage3D.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDownListener, true, false);
            // }
            // else {
            //     stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
            // }
            // stage3D.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);

            const ME = MouseEvent;
            let downType = ME.MOUSE_DOWN;
            if (this.bgEventEnabled) {
                downType = ME.MOUSE_BG_DOWN;
            }
            let upType = ME.MOUSE_UP;

            if (this.buttonType == 1) {
                if (this.bgEventEnabled) {
                    downType = ME.MOUSE_BG_MIDDLE_DOWN;
                    console.log("middle bg down");
                } else {
                    downType = ME.MOUSE_MIDDLE_DOWN;
                    console.log("middle down");
                }
                upType = ME.MOUSE_MIDDLE_UP;
                console.log("middle ME.MOUSE_MIDDLE_UP: ", ME.MOUSE_MIDDLE_UP);
            } else if (this.buttonType == 2) {
                if (this.bgEventEnabled) {
                    downType = ME.MOUSE_BG_RIGHT_DOWN;
                } else {
                    downType = ME.MOUSE_RIGHT_DOWN;
                }
                upType = ME.MOUSE_RIGHT_UP;
            }
            console.log("middle upType: ", upType);
            stage3D.addEventListener(downType, this, this.mouseDownListener, true, false);
            stage3D.addEventListener(upType, this, this.mouseUpListener, false, true);
        }
    }

    private mouseDownListener(evt: any): void {
        console.log("XXXXXXXXXXXX mouse interact down...");
        if (this.m_enabled) {
            this.m_dragSwinger.attach();
        }
    }
    private mouseUpListener(evt: any): void {
        console.log("XXXXXXXXXXXX mouse interact up...");
        this.m_dragSwinger.detach();
    }
    setEnabled(enabled: boolean): void {
        this.m_enabled = enabled;
    }
    detach(): void {
        this.m_dragSwinger.detach();
    }
    runWithYAxis(): void {
        this.m_dragSwinger.runWithYAxis();
    }
    runWithZAxis(): void {
        this.m_dragSwinger.runWithZAxis();
    }
    runWithCameraAxis(): void {
        this.m_dragSwinger.runWithCameraAxis();
    }
}
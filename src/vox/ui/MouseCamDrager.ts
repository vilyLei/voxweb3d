/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRenderCamera } from "../render/IRenderCamera";
import IRenderStage3D from "../render/IRenderStage3D";
import { CamDragSwinger } from "./CamDragSwinger";
import { CamDragSlider } from "./CamDragSlider";
import MouseEvent from "../event/MouseEvent";

export default class MouseCamDrager {
    constructor() { }

    private m_stage3D: IRenderStage3D = null;
    private m_dragSwinger = new CamDragSwinger();
    private m_dragSlider = new CamDragSlider();
    private m_swing = true;
    /**
     * the value contains 0(mouse down), 1(mouse middle), 2(mouse right)
     */
    buttonType = 0;
    bgEventEnabled = true;
    initialize(stage3D: IRenderStage3D, camera: IRenderCamera): void {

        if (this.m_stage3D == null) {

            this.m_stage3D = stage3D;
            this.m_dragSwinger.initialize(stage3D, camera);
            this.m_dragSlider.initialize(stage3D, camera);

            const ME = MouseEvent;
            let downType = ME.MOUSE_DOWN;
            if (this.bgEventEnabled) {
                downType = ME.MOUSE_BG_DOWN;
            }
            let upType = ME.MOUSE_UP;

            if (this.buttonType == 1) {
                if (this.bgEventEnabled) {
                    downType = ME.MOUSE_BG_MIDDLE_DOWN;
                } else {
                    downType = ME.MOUSE_MIDDLE_DOWN;
                }
                upType = ME.MOUSE_MIDDLE_UP;
            } else if (this.buttonType == 2) {
                if (this.bgEventEnabled) {
                    downType = ME.MOUSE_BG_RIGHT_DOWN;
                } else {
                    downType = ME.MOUSE_RIGHT_DOWN;
                }
                upType = ME.MOUSE_RIGHT_UP;

                document.oncontextmenu = function (e) {
                    e.preventDefault();
                }
            }
            stage3D.addEventListener(downType, this, this.mouseDownListener, true, false);
            stage3D.addEventListener(upType, this, this.mouseUpListener, true, true);
        }
    }
    setSlideSpeed(slideSpeed: number): void {
        this.m_dragSlider.slideSpeed = slideSpeed;
    }
    enableSwing(): void {
        this.m_swing = true;
    }
    isEnabledSwing(): boolean {
        return this.m_swing;
    }
    enableSlide(): void {
        this.m_swing = false;
    }
    private mouseDownListener(evt: any): void {
        this.attach();
    }
    private mouseUpListener(evt: any): void {
        this.detach();
    }
    attach(): void {
        this.m_dragSwinger.attach();
        this.m_dragSlider.attach()
    }
    detach(): void {
        this.m_dragSwinger.detach();
        this.m_dragSlider.detach();
    }
    runWithYAxis(): void {
        if (this.m_swing) {
            this.m_dragSwinger.runWithYAxis();
        } else {
            this.m_dragSlider.run();
        }
    }
    runWithZAxis(): void {
        if (this.m_swing) {
            this.m_dragSwinger.runWithZAxis();
        } else {
            this.m_dragSlider.run();
        }
    }
}

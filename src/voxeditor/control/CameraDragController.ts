/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRenderCamera } from "../../vox/render/IRenderCamera";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import MouseEvent from "../../vox/event/MouseEvent";
import {CameraDragSwinger} from "../../voxeditor/control/CameraDragSwinger";
import {CameraDragSlide} from "../../voxeditor/control/CameraDragSlide";

export default class CameraDragController {
    constructor() { }

    private m_stage3D: IRenderStage3D = null;
    private m_dragSwinger: CameraDragSwinger = new CameraDragSwinger();
    private m_dragSlider: CameraDragSlide = new CameraDragSlide();
    private m_swing: boolean = true;
    initialize(stage3D: IRenderStage3D, camera: IRenderCamera): void {
        if (this.m_stage3D == null) {
            this.m_stage3D = stage3D;
            this.m_dragSwinger.initialize(stage3D, camera);
            this.m_dragSlider.initialize(stage3D, camera);
            stage3D.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseDownListener, true, false);
            stage3D.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, false, true);
        }
    }
    setSlideSpeed(slideSpeed: number): void {
        this.m_dragSlider.slideSpeed = slideSpeed;
    }
    enableSwing(): void {
        this.m_swing = true;
    }
    enableSlide(): void {
        this.m_swing = false;
    }
    private mouseDownListener(evt: any): void {
        this.m_dragSwinger.attach();
        this.m_dragSlider.attach();
    }
    private mouseUpListener(evt: any): void {
        this.m_dragSwinger.detach();
        this.m_dragSlider.detach();
    }
    detach(): void {
        this.m_dragSwinger.detach();
        this.m_dragSlider.detach();
    }
    runWithYAxis(): void {
        if(this.m_swing) {
            this.m_dragSwinger.runWithYAxis();
        }
        else {
            this.m_dragSlider.run();
        }
    }
    runWithZAxis(): void {
        if(this.m_swing) {
            this.m_dragSwinger.runWithZAxis();
        }
        else {
            this.m_dragSlider.run();
        }
    }
}
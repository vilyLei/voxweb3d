/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "../../vox/event/EventBase";
import KeyboardEvent from "../../vox/event/KeyboardEvent";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import StageBase from "./StageBase";

class SubStage3D extends StageBase implements IRenderStage3D {

    private m_enterFrame_listener: ((evt: any) => void)[] = [];
    private m_enterFrame_ers: any[] = [];
    private m_enterFrameEvt: EventBase = new EventBase();
    
    constructor(rcuid: number, pdocument: any) {
        super(rcuid);
    }
    enterFrame(): void {
        this.m_enterFrameEvt.type = EventBase.ENTER_FRAME;
        let len: number = this.m_enterFrame_listener.length;
        for (var i: number = 0; i < len; ++i) {
            this.m_enterFrame_listener[i].call(this.m_enterFrame_ers[i], this.m_enterFrameEvt);
        }
    }

    setViewPort(px: number, py: number, pw: number, ph: number): void {
        this.m_autoSynViewAndStageSize = false;
        this.m_viewX = px;
        this.m_viewY = py;
        if (pw != this.m_viewW || ph != this.m_viewH) {
            this.m_viewW = pw;
            this.m_viewH = ph;
            this.updateViewUData();
        }
    }
    private updateViewUData(): void {
        this.uProbe.setVec4Data(
            2.0 / (this.m_viewW * this.pixelRatio)
            , 2.0 / (this.m_viewH * this.pixelRatio)
            , this.m_viewW * this.pixelRatio
            , this.m_viewH * this.pixelRatio
        );
        this.uProbe.update();
        this.m_preStageWidth = this.m_viewW;
        this.m_preStageHeight = this.m_viewH;

    }
    update(): void {
        if (this.m_preStageWidth != this.stageWidth || this.m_preStageHeight != this.stageHeight) {
            if (this.m_autoSynViewAndStageSize) {
                this.m_viewW = this.stageWidth;
                this.m_viewH = this.stageHeight;
                this.updateViewUData();
            }
            this.stageHalfWidth = 0.5 * this.stageWidth;
            this.stageHalfHeight = 0.5 * this.stageHeight;
        }
    }
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = true): void {
        if (func != null && target != null) {
            switch (type) {
                case EventBase.RESIZE:
                    console.warn("addEventListener EventBase.RESIZE invalid operation.");
                    break;
                case EventBase.ENTER_FRAME:
                    this.addTarget(this.m_enterFrame_listener, this.m_enterFrame_ers, target, func);
                    break;
                case KeyboardEvent.KEY_DOWN:
                    console.warn("addEventListener KeyboardEvent.KEY_DOWN invalid operation.");
                    break;
                case KeyboardEvent.KEY_UP:
                    console.warn("addEventListener KeyboardEvent.KEY_UP invalid operation.");
                    break;
                default:
                    this.m_dp.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
                    break;
            }
        }
    }
    removeEventListener(type: number, target: any, func: (evt: any) => void): void {
        if (func != null && target != null) {
            switch (type) {
                case EventBase.RESIZE:
                    // this.removeTarget(this.m_resize_listener, this.m_resize_ers, target);
                    break;
                case EventBase.ENTER_FRAME:
                    this.removeTarget(this.m_enterFrame_listener, this.m_enterFrame_ers, target);
                    break;
                case KeyboardEvent.KEY_DOWN:
                    // this.removeTarget(this.m_keyDown_listener, this.m_keyDown_ers, target);
                    break;
                case KeyboardEvent.KEY_UP:
                    // this.removeTarget(this.m_keyUp_listener, this.m_keyUp_ers, target);
                    break;
                default:
                    this.m_dp.removeEventListener(type, target, func);
                    break;
            }
        }
    }
}
export default SubStage3D;
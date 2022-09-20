/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "../../vox/event/EventBase";
import MouseEvent from "../../vox/event/MouseEvent";
import KeyboardEvent from "../../vox/event/KeyboardEvent";
import Keyboard from "../../vox/ui/Keyboard";
// import UniformVec4Probe from "../../vox/material/UniformVec4Probe";
import { IShaderUniformProbe } from "../../vox/material/IShaderUniformProbe";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

export default class Stage3D implements IRenderStage3D {
    private m_rcuid: number = 0;
    private static s_document: any = null;

    uProbe: IShaderUniformProbe = null;

    pixelRatio: number = 1.0;
    stageWidth: number = 800;
    stageHeight: number = 600;
    // 实际宽高, 和gpu端对齐
    stageHalfWidth: number = 400;
    stageHalfHeight: number = 300;
    mouseX: number = 0;
    mouseY: number = 0;
    // sdiv页面实际占据的像素宽高
    viewWidth: number = 800;
    viewHeight: number = 600;
    mouseViewX: number = 0;
    mouseViewY: number = 0;
    constructor(rcuid: number, pdocument: any) {
        this.m_rcuid = rcuid;
        if (Stage3D.s_document == null) {
            Stage3D.s_document = pdocument;

            pdocument.onkeydown = function (evt: any): void {
                Keyboard.KeyDown(evt);
            }
            pdocument.onkeyup = function (evt: any): void {
                Keyboard.KeyUp(evt);
            }
        }
        Keyboard.AddEventListener(KeyboardEvent.KEY_DOWN, this, this.keyDown);
        Keyboard.AddEventListener(KeyboardEvent.KEY_UP, this, this.keyUp);
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    private m_viewX: number = 0.0;
    private m_viewY: number = 0.0;
    private m_viewW: number = 1.0
    private m_viewH: number = 1.0;
    // mouse event dispatcher
    private m_dp = new MouseEvt3DDispatcher();
    private m_resize_listener: ((evt: any) => void)[] = [];
    private m_resize_ers: any[] = [];
    private m_enterFrame_listener: ((evt: any) => void)[] = [];
    private m_enterFrame_ers: any[] = [];

    private m_keyEvt: KeyboardEvent = new KeyboardEvent();
    private m_keyDown_listener: ((evt: any) => void)[] = [];
    private m_keyDown_ers: any[] = [];
    private m_keyUp_listener: ((evt: any) => void)[] = [];
    private m_keyUp_ers: any[] = [];
    private m_preStageWidth: number = 0;
    private m_preStageHeight: number = 0;
    private m_mouseEvt: MouseEvent = new MouseEvent();
    private m_baseEvt: EventBase = new EventBase();
    // 是否舞台尺寸和view自动同步一致
    private m_autoSynViewAndStageSize: boolean = true;
    getDevicePixelRatio(): number {
        return window.devicePixelRatio;
    }
    getViewX(): number {
        return this.m_viewX;
    }
    getViewY(): number {
        return this.m_viewY;
    }
    getViewWidth(): number {
        return this.m_viewW;
    }
    getViewHeight(): number {
        return this.m_viewH;
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
        this.uProbe.setVec4Data(2.0 / this.stageWidth, 2.0 / this.stageHeight, this.stageWidth, this.stageHeight);
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
            this.m_baseEvt.target = this;
            this.m_baseEvt.type = EventBase.RESIZE;
            this.m_baseEvt.phase = 1;
            this.sendResizeEvt(this.m_baseEvt);
        }
    }
    private keyDown(evt: any): void {

        this.m_keyEvt.phase = 1;
        this.m_keyEvt.type = KeyboardEvent.KEY_DOWN;
        this.m_keyEvt.altKey = evt.altKey;
        this.m_keyEvt.ctrlKey = evt.ctrlKey;
        this.m_keyEvt.shiftKey = evt.shiftKey;
        this.m_keyEvt.repeat = evt.repeat;
        this.m_keyEvt.key = evt.key;
        this.m_keyEvt.keyCode = evt.keyCode;
        this.m_keyEvt.location = evt.location;

        let len: number = this.m_keyDown_listener.length;
        for (var i: number = 0; i < len; ++i) {
            this.m_keyDown_listener[i].call(this.m_keyDown_ers[i], this.m_keyEvt);
        }
    }
    private keyUp(evt: any): void {
        this.m_keyEvt.phase = 1;
        this.m_keyEvt.type = KeyboardEvent.KEY_UP;
        this.m_keyEvt.altKey = evt.altKey;
        this.m_keyEvt.ctrlKey = evt.ctrlKey;
        this.m_keyEvt.shiftKey = evt.shiftKey;
        this.m_keyEvt.repeat = evt.repeat;
        this.m_keyEvt.key = evt.key;
        this.m_keyEvt.keyCode = evt.keyCode;
        this.m_keyEvt.location = evt.location;
        this.m_keyEvt.target = this;

        let len: number = this.m_keyUp_listener.length;
        for (var i: number = 0; i < len; ++i) {
            this.m_keyUp_listener[i].call(this.m_keyUp_ers[i], this.m_keyEvt);
        }
    }
    private sendResizeEvt(evt: any): void {
        let len: number = this.m_resize_listener.length;
        //console.log("Stage3D::sendResizeEvt(), m_resize_listener.length: ",this.m_resize_listener.length);
        for (var i: number = 0; i < len; ++i) {
            this.m_resize_listener[i].call(this.m_resize_ers[i], evt);
        }
    }
    private dispatchMouseEvt(phase: number, tar: any = null): void {
        const evt = this.m_mouseEvt;
        evt.mouseX = this.mouseX;
        evt.mouseY = this.mouseY;
        evt.target = tar == null ? this : tar;
        evt.phase = phase;
        this.m_dp.dispatchEvt(this.m_mouseEvt);
    }
    mouseDown(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_DOWN;
        this.dispatchMouseEvt(phase);
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = phase;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
    }
    mouseUp(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_UP;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = phase;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(phase);
    }
    mouseClick(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_CLICK;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(1);
    }
    mouseDoubleClick(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_DOUBLE_CLICK;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(1);
    }
    mouseRightDown(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_DOWN;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(phase);
    }
    mouseRightUp(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_UP;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(phase);
    }
    mouseMiddleDown(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MIDDLE_DOWN;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(phase);
    }
    mouseMiddleUp(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MIDDLE_UP;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(phase);
    }


    mouseBgDown(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_DOWN;   
        this.dispatchMouseEvt(1);
    }
    mouseBgUp(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_UP;
        this.dispatchMouseEvt(1);
    }
    mouseBgClick(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_CLICK;
        this.dispatchMouseEvt(1);
    }
    mouseBgRightDown(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_RIGHT_DOWN;     
        this.dispatchMouseEvt(1);
    }
    mouseBgRightUp(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_RIGHT_UP;
        this.dispatchMouseEvt(1);
    }    
    mouseBgMiddleDown(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_MIDDLE_DOWN;     
        this.dispatchMouseEvt(1);
    }
    mouseBgMiddleUp(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_MIDDLE_UP;
        this.dispatchMouseEvt(1);
    }

    mouseRightClick(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_CLICK;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(1);
    }
    mouseMove(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MOVE;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(1);
    }
    mouseWheel(evt: any): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_WHEEL;
        this.m_mouseEvt.wheelDeltaY = evt.wheelDeltaY;
        this.dispatchMouseEvt(1);

        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.wheelDeltaY = evt.wheelDeltaY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
    }
    // 等同于 touchCancle
    mouseCancel(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_CANCEL;
        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
        this.dispatchMouseEvt(1);
    }
    //param [{x,y},{x,y},...]
    mouseMultiDown(posArray: any[]): void {

        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_DOWN;
        this.m_mouseEvt.posArray = posArray;
        this.dispatchMouseEvt(1);

        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_mouseEvt.posArray = posArray;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
    }
    //param [{x,y},{x,y},...]
    mouseMultiUp(posArray: any[]): void {

        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_UP;
        this.m_mouseEvt.posArray = posArray;
        this.dispatchMouseEvt(1);

        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_mouseEvt.posArray = posArray;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
    }
    //param [{x,y},{x,y},...]
    mouseMultiMove(posArray: any[]): void {

        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_MOVE;
        this.m_mouseEvt.posArray = posArray;
        this.dispatchMouseEvt(1);

        // this.m_mouseEvt.mouseX = this.mouseX;
        // this.m_mouseEvt.mouseY = this.mouseY;
        // this.m_mouseEvt.target = this;
        // this.m_mouseEvt.phase = 1;
        // this.m_mouseEvt.posArray = posArray;
        // this.m_dp.dispatchEvt(this.m_mouseEvt);
    }

    mouseWindowUp(phase: number = 1): void {
    }
    mouseWindowRightUp(phase: number = 1): void {
    }
    private m_enterFrameEvt: EventBase = new EventBase();
    enterFrame(): void {
        this.m_enterFrameEvt.type = EventBase.ENTER_FRAME;
        const ls = this.m_enterFrame_listener;
        let len: number = ls.length;
        for (var i: number = 0; i < len; ++i) {
            ls[i].call(this.m_enterFrame_ers[i], this.m_enterFrameEvt);
        }
    }
    private addTarget(funcs: ((evt: any) => void)[], listeners: any[], target: any, func: (evt: any) => void): void {
        let i = 0;
        for (i = funcs.length - 1; i >= 0; --i) {
            if (target === listeners[i]) {
                break;
            }
        }
        if (i < 0) {
            listeners.push(target);
            funcs.push(func);
        }
    }
    
    private removeTarget(funcs: ((evt: any) => void)[], listeners: any[], target: any): void {
        for (let i = funcs.length - 1; i >= 0; --i) {
            if (target === listeners[i]) {
                listeners.splice(i, 1);
                funcs.splice(i, 1);
                break;
            }
        }
    }
    //m_resize_listener: ((evt: any) => void)[]
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = true): void {
        if (func != null && target != null) {
            let i: number = 0;
            switch (type) {
                case EventBase.RESIZE:
                    // for (i = this.m_resize_listener.length - 1; i >= 0; --i) {
                    //     if (target === this.m_resize_ers[i]) {
                    //         break;
                    //     }
                    // }
                    // if (i < 0) {
                    //     this.m_resize_ers.push(target);
                    //     this.m_resize_listener.push(func);
                    // }
                    this.addTarget(this.m_resize_listener, this.m_resize_ers, target, func);
                    break;
                case EventBase.ENTER_FRAME:
                    // for (i = this.m_enterFrame_listener.length - 1; i >= 0; --i) {
                    //     if (target === this.m_enterFrame_ers[i]) {
                    //         break;
                    //     }
                    // }
                    // if (i < 0) {
                    //     this.m_enterFrame_ers.push(target);
                    //     this.m_enterFrame_listener.push(func);
                    // }
                    this.addTarget(this.m_enterFrame_listener, this.m_enterFrame_ers, target, func);
                    break;

                case KeyboardEvent.KEY_DOWN:
                    // for (i = this.m_keyDown_listener.length - 1; i >= 0; --i) {
                    //     if (target === this.m_keyDown_ers[i]) {
                    //         break;
                    //     }
                    // }
                    // if (i < 0) {
                    //     this.m_keyDown_ers.push(target);
                    //     this.m_keyDown_listener.push(func);
                    // }
                    this.addTarget(this.m_keyDown_listener, this.m_keyDown_ers, target, func);
                    break;
                case KeyboardEvent.KEY_UP:
                    // for (i = this.m_keyUp_listener.length - 1; i >= 0; --i) {
                    //     if (target === this.m_keyUp_ers[i]) {
                    //         break;
                    //     }
                    // }
                    // if (i < 0) {
                    //     this.m_keyUp_ers.push(target);
                    //     this.m_keyUp_listener.push(func);
                    // }
                    this.addTarget(this.m_keyUp_listener, this.m_keyUp_ers, target, func);
                    break;
                default:
                    this.m_dp.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
                    break;
            }
        }
    }
    removeEventListener(type: number, target: any, func: (evt: any) => void): void {
        if (func != null && target != null) {
            let i: number = 0;
            switch (type) {
                case EventBase.RESIZE:
                    // for (i = this.m_resize_listener.length - 1; i >= 0; --i) {
                    //     if (target === this.m_resize_ers[i]) {
                    //         this.m_resize_ers.splice(i, 1);
                    //         this.m_resize_listener.splice(i, 1);
                    //         break;
                    //     }
                    // }
                    this.removeTarget(this.m_resize_listener, this.m_resize_ers, target);
                    break;
                case EventBase.ENTER_FRAME:
                    // for (i = this.m_enterFrame_listener.length - 1; i >= 0; --i) {
                    //     if (target === this.m_enterFrame_ers[i]) {
                    //         this.m_enterFrame_ers.splice(i, 1);
                    //         this.m_enterFrame_listener.splice(i, 1);
                    //         break;
                    //     }
                    // }
                    this.removeTarget(this.m_enterFrame_listener, this.m_enterFrame_ers, target);
                    break;
                case KeyboardEvent.KEY_DOWN:
                    // for (i = this.m_keyDown_listener.length - 1; i >= 0; --i) {
                    //     if (target === this.m_keyDown_ers[i]) {
                    //         this.m_keyDown_ers.splice(i, 1);
                    //         this.m_keyDown_listener.splice(i, 1);
                    //         break;
                    //     }
                    // }
                    this.removeTarget(this.m_keyDown_listener, this.m_keyDown_ers, target);
                    break;
                case KeyboardEvent.KEY_UP:
                    // for (i = this.m_keyUp_listener.length - 1; i >= 0; --i) {
                    //     if (target === this.m_keyUp_ers[i]) {
                    //         this.m_keyUp_ers.splice(i, 1);
                    //         this.m_keyUp_listener.splice(i, 1);
                    //         break;
                    //     }
                    // }
                    this.removeTarget(this.m_keyUp_listener, this.m_keyUp_ers, target);
                    break;
                default:
                    this.m_dp.removeEventListener(type, target, func);
                    break;
            }
        }
    }
}
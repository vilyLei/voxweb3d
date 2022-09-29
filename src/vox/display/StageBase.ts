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

export default class StageBase {
    protected m_rcuid: number = 0;
    
    protected m_viewX: number = 0.0;
    protected m_viewY: number = 0.0;
    protected m_viewW: number = 1.0
    protected m_viewH: number = 1.0;
    protected m_stW: number = 800;
    protected m_stH: number = 600;
    // mouse event dispatcher
    protected m_dp = new MouseEvt3DDispatcher();
    // 是否舞台尺寸和view自动同步一致
    protected m_autoSynViewAndStageSize: boolean = true;
    protected m_preStageWidth: number = 0;
    protected m_preStageHeight: number = 0;
    protected m_mouseEvt: MouseEvent = new MouseEvent();
    protected m_baseEvt: EventBase = new EventBase();

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

    constructor(rcuid: number) {
        this.m_rcuid = rcuid;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
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
    }
    mouseUp(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_UP;
        this.dispatchMouseEvt(phase);
    }
    mouseClick(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_CLICK;
        this.dispatchMouseEvt(1);
    }
    mouseDoubleClick(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_DOUBLE_CLICK;
        this.dispatchMouseEvt(1);
    }
    mouseRightDown(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_DOWN;
        this.dispatchMouseEvt(phase);
    }
    mouseRightUp(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_UP;
        this.dispatchMouseEvt(phase);
    }
    mouseMiddleDown(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MIDDLE_DOWN;
        this.dispatchMouseEvt(phase);
    }
    mouseMiddleUp(phase: number = 1): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MIDDLE_UP;
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
        this.dispatchMouseEvt(1);
    }
    mouseMove(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MOVE;
        this.dispatchMouseEvt(1);
    }
    mouseWheel(evt: any): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_WHEEL;
        this.m_mouseEvt.wheelDeltaY = evt.wheelDeltaY;
        this.dispatchMouseEvt(1);
    }
    // 等同于 touchCancle
    mouseCancel(): void {
        this.m_mouseEvt.type = MouseEvent.MOUSE_CANCEL;
        this.dispatchMouseEvt(1);
    }
    //param [{x,y},{x,y},...]
    mouseMultiDown(posArray: any[]): void {

        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_DOWN;
        this.m_mouseEvt.posArray = posArray;
        this.dispatchMouseEvt(1);
    }
    //param [{x,y},{x,y},...]
    mouseMultiUp(posArray: any[]): void {

        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_UP;
        this.m_mouseEvt.posArray = posArray;
        this.dispatchMouseEvt(1);
    }
    //param [{x,y},{x,y},...]
    mouseMultiMove(posArray: any[]): void {

        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_MOVE;
        this.m_mouseEvt.posArray = posArray;
        this.dispatchMouseEvt(1);
    }

    mouseWindowUp(phase: number = 1): void {
    }
    mouseWindowRightUp(phase: number = 1): void {
    }
    
    protected addTarget(funcs: ((evt: any) => void)[], listeners: any[], target: any, func: (evt: any) => void): void {
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
    
    protected removeTarget(funcs: ((evt: any) => void)[], listeners: any[], target: any): void {
        for (let i = funcs.length - 1; i >= 0; --i) {
            if (target === listeners[i]) {
                listeners.splice(i, 1);
                funcs.splice(i, 1);
                break;
            }
        }
    }
}
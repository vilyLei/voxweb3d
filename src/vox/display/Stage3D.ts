/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "../../vox/event/EventBase";
import KeyboardEvent from "../../vox/event/KeyboardEvent";
import Keyboard from "../../vox/ui/Keyboard";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import StageBase from "./StageBase";

export default class Stage3D extends StageBase implements IRenderStage3D {
    private static s_document: any = null;
    private m_resize_listener: ((evt: any) => void)[] = [];
    private m_resize_ers: any[] = [];
    private m_enterFrame_listener: ((evt: any) => void)[] = [];
    private m_enterFrame_ers: any[] = [];

    private m_keyEvt: KeyboardEvent = new KeyboardEvent();
    private m_keyDown_listener: ((evt: any) => void)[] = [];
    private m_keyDown_ers: any[] = [];
    private m_keyUp_listener: ((evt: any) => void)[] = [];
    private m_keyUp_ers: any[] = [];
    private m_enterFrameEvt: EventBase = new EventBase();

    constructor(rcuid: number, pdocument: any) {

        super(rcuid);

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
    
    enterFrame(): void {
        this.m_enterFrameEvt.type = EventBase.ENTER_FRAME;
        const ls = this.m_enterFrame_listener;
        let len: number = ls.length;
        for (var i: number = 0; i < len; ++i) {
            ls[i].call(this.m_enterFrame_ers[i], this.m_enterFrameEvt);
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
    protected updateViewUData(): void {

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
            this.m_stW = this.stageWidth;
            this.m_stH = this.stageHeight;
            this.stageHalfWidth = 0.5 * this.m_stW;
            this.stageHalfHeight = 0.5 * this.m_stH;
            this.m_baseEvt.target = this;
            this.m_baseEvt.type = EventBase.RESIZE;
            this.m_baseEvt.phase = 1;
            this.sendResizeEvt(this.m_baseEvt);
        }else {
            this.stageWidth = this.m_stW;
            this.stageHeight = this.m_stH;
            this.stageHalfWidth = 0.5 * this.m_stW;
            this.stageHalfHeight = 0.5 * this.m_stH;
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
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = true): void {

        if (func != null && target != null) {
            switch (type) {
                case EventBase.RESIZE:
                    this.addTarget(this.m_resize_listener, this.m_resize_ers, target, func);
                    break;
                case EventBase.ENTER_FRAME:
                    this.addTarget(this.m_enterFrame_listener, this.m_enterFrame_ers, target, func);
                    break;

                case KeyboardEvent.KEY_DOWN:
                    this.addTarget(this.m_keyDown_listener, this.m_keyDown_ers, target, func);
                    break;
                case KeyboardEvent.KEY_UP:
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
            switch (type) {
                case EventBase.RESIZE:
                    this.removeTarget(this.m_resize_listener, this.m_resize_ers, target);
                    break;
                case EventBase.ENTER_FRAME:
                    this.removeTarget(this.m_enterFrame_listener, this.m_enterFrame_ers, target);
                    break;
                case KeyboardEvent.KEY_DOWN:
                    this.removeTarget(this.m_keyDown_listener, this.m_keyDown_ers, target);
                    break;
                case KeyboardEvent.KEY_UP:
                    this.removeTarget(this.m_keyUp_listener, this.m_keyUp_ers, target);
                    break;
                default:
                    this.m_dp.removeEventListener(type, target, func);
                    break;
            }
        }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "../../vox/event/EventBase";
import MouseEvent from "../../vox/event/MouseEvent";
import KeyboardEvent from "../../vox/event/KeyboardEvent";
import UniformVec4Probe from "../../vox/material/UniformVec4Probe";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

class SubStage3D implements IRenderStage3D
{
    private m_rcuid:number = 0;
    constructor(rcuid:number,pdocument:any)
    {
        this.m_rcuid = rcuid;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid():number
    {
        return this.m_rcuid;
    }
    pixelRatio:number = 1.0;
    stageWidth:number = 800;
    stageHeight:number = 600;
    // 实际宽高, 和gpu端对齐
    stageHalfWidth:number = 400;
    stageHalfHeight:number = 300;
    mouseX:number = 0;
    mouseY:number = 0;
    // sdiv页面实际占据的像素宽高
    viewWidth:number = 800;
    viewHeight:number = 600;
    mouseViewX:number = 0;
    mouseViewY:number = 0;
    private m_viewX:number = 0.0;
    private m_viewY:number = 0.0;
    private m_viewW:number = 1.0
    private m_viewH:number = 1.0;
    // mouse event dispatcher
    private m_mouseEvtDispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();            
    private m_resize_listener:((evt:any)=>void)[] = [];
    private m_resize_ers:any[] = [];
    private m_enterFrame_listener:((evt:any)=>void)[] = [];
    private m_enterFrame_ers:any[] = [];
    private m_keyDown_listener:((evt:any)=>void)[] = [];
    private m_keyDown_ers:any[] = [];
    private m_keyUp_listener:((evt:any)=>void)[] = [];
    private m_keyUp_ers:any[] = [];
    uProbe:UniformVec4Probe = null;
    private m_preStageWidth:number = 0;
    private m_preStageHeight:number = 0;
    private m_mouseEvt:MouseEvent = new MouseEvent();
    // 是否舞台尺寸和view自动同步一致
    private m_autoSynViewAndStageSize:boolean = true;
    getDevicePixelRatio():number
    {
        return window.devicePixelRatio;
    }
    getViewX():number
    {
        return this.m_viewX;
    }
    getViewY():number
    {
        return this.m_viewY;
    }
    getViewWidth():number
    {
        return this.m_viewW;
    }
    getViewHeight():number
    {
        return this.m_viewH;
    }
    setViewPort(px:number,py:number,pw:number,ph:number):void
    {
        this.m_autoSynViewAndStageSize = false;
        this.m_viewX = px;
        this.m_viewY = py;
        if(pw != this.m_viewW || ph != this.m_viewH)
        {
            this.m_viewW = pw;
            this.m_viewH = ph;
            this.updateViewUData();
        }
    }
    private updateViewUData():void
    {
        if(this.uProbe == null)
        {
            this.uProbe = new UniformVec4Probe(1);
            this.uProbe.bindSlotAt( this.m_rcuid );
        }
        this.uProbe.setVec4Data(
            2.0/(this.m_viewW * this.pixelRatio)
            ,2.0/(this.m_viewH * this.pixelRatio)
            , this.m_viewW * this.pixelRatio
            ,this.m_viewH * this.pixelRatio
            );
        this.uProbe.update();
        this.m_preStageWidth = this.m_viewW;
        this.m_preStageHeight = this.m_viewH;
                 
    }
    update():void
    {
        if(this.m_preStageWidth != this.stageWidth || this.m_preStageHeight != this.stageHeight)
        {
            if(this.m_autoSynViewAndStageSize)
            {
                this.m_viewW = this.stageWidth;
                this.m_viewH = this.stageHeight;
                this.updateViewUData();
            }
            this.stageHalfWidth = 0.5 * this.stageWidth;
            this.stageHalfHeight = 0.5 * this.stageHeight;
        }
    }
    mouseDown(phase:number = 1):void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_DOWN;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = phase;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);                
    }
    mouseUp(phase:number = 1):void
    {
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvt.type = MouseEvent.MOUSE_UP;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;                
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = phase;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    mouseClick():void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_CLICK;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    mouseDoubleClick():void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_DOUBLE_CLICK;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    mouseRightDown(phase:number = 1):void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_DOWN;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    mouseRightUp(phase:number = 1):void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_UP;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }

    
    mouseBgDown():void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_DOWN;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    mouseBgUp():void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_BG_UP;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    
    mouseRightClick():void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_CLICK;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    mouseMove():void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MOVE;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    mouseWheel(evt:any):void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_WHEEL;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.wheelDeltaY = evt.wheelDeltaY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    // 等同于 touchCancle
    mouseCancel():void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_CANCEL;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    //param [{x,y},{x,y},...]
    mouseMultiDown(posArray:any[]):void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_DOWN;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvt.posArray = posArray;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    //param [{x,y},{x,y},...]
    mouseMultiUp(posArray:any[]):void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_UP;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvt.posArray = posArray;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    //param [{x,y},{x,y},...]
    mouseMultiMove(posArray:any[]):void
    {
        this.m_mouseEvt.type = MouseEvent.MOUSE_MULTI_MOVE;
        this.m_mouseEvt.mouseX = this.mouseX;
        this.m_mouseEvt.mouseY = this.mouseY;
        this.m_mouseEvt.target = this;
        this.m_mouseEvt.phase = 1;
        this.m_mouseEvt.posArray = posArray;
        this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
    }
    
    mouseWindowUp(phase:number = 1):void
    {
    }
    mouseWindowRightUp(phase:number = 1):void
    {
    }
    private m_enterFrameEvt: EventBase = new EventBase();
    enterFrame():void
    {
        this.m_enterFrameEvt.type = EventBase.ENTER_FRAME;
        let len:number = this.m_enterFrame_listener.length;
        for(var i:number = 0; i < len; ++i)
        {
            this.m_enterFrame_listener[i].call(this.m_enterFrame_ers[i],this.m_enterFrameEvt);
        }
    }
    addEventListener(type:number,target:any,func:(evt:any)=>void,captureEnabled:boolean = true,bubbleEnabled:boolean = true):void
    {
        if(func != null && target != null)
        {
            let i:number = 0;
            switch(type)
            {
                case EventBase.RESIZE:
                    console.warn("addEventListener EventBase.RESIZE invalid operation.");
                break;
                case EventBase.ENTER_FRAME:
                    for(i = this.m_enterFrame_listener.length - 1; i >= 0; --i)
                    {
                        if(target === this.m_enterFrame_ers[i])
                        {
                            break;
                        }
                    }
                    if(i < 0)
                    {
                        this.m_enterFrame_ers.push(target);
                        this.m_enterFrame_listener.push(func);
                    }
                break;
                case KeyboardEvent.KEY_DOWN:
                    console.warn("addEventListener KeyboardEvent.KEY_DOWN invalid operation.");
                break;
                case KeyboardEvent.KEY_UP:
                    console.warn("addEventListener KeyboardEvent.KEY_UP invalid operation.");
                break;
                default:
                    this.m_mouseEvtDispatcher.addEventListener(type,target,func,captureEnabled,bubbleEnabled);
                break;
            }
        }
    }
    removeEventListener(type:number,target:any,func:(evt:any)=>void):void
    {
        if(func != null && target != null)
        {
            let i:number = 0;
            switch(type)
            {
                case EventBase.RESIZE:
                    for(i = this.m_resize_listener.length - 1; i >= 0; --i)
                    {
                        if(target === this.m_resize_ers[i])
                        {
                            this.m_resize_ers.splice(i,1);
                            this.m_resize_listener.splice(i,1);
                            break;
                        }
                    }
                break;
                case EventBase.ENTER_FRAME:
                    for(i = this.m_enterFrame_listener.length - 1; i >= 0; --i)
                    {
                        if(target === this.m_enterFrame_ers[i])
                        {
                            this.m_enterFrame_ers.splice(i,1);
                            this.m_enterFrame_listener.splice(i,1);
                            break;
                        }
                    }
                break;
                case KeyboardEvent.KEY_DOWN:
                    for(i = this.m_keyDown_listener.length - 1; i >= 0; --i)
                    {
                        if(target === this.m_keyDown_ers[i])
                        {
                            this.m_keyDown_ers.splice(i,1);
                            this.m_keyDown_listener.splice(i,1);
                            break;
                        }
                    }
                break;
                case KeyboardEvent.KEY_UP:
                    for(i = this.m_keyUp_listener.length - 1; i >= 0; --i)
                    {
                        if(target === this.m_keyUp_ers[i])
                        {
                            this.m_keyUp_ers.splice(i,1);
                            this.m_keyUp_listener.splice(i,1);
                            break;
                        }
                    }
                break;
                default:
                    this.m_mouseEvtDispatcher.removeEventListener(type,target,func);
                break;
            }
        }
    }
}
export default SubStage3D;
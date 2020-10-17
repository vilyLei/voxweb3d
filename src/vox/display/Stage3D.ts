/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
/*
3D system runtime environment
*/

import * as EventBaseT from "../../vox/event/EventBase";
import * as MouseEventT from "../../vox/event/MouseEvent";
import * as KeyboardEventT from "../../vox/event/KeyboardEvent";
import * as KeyboardT from "../../vox/ui/Keyboard";
import * as UniformVec4ProbeT from "../../vox/material/UniformVec4Probe";
import * as MouseEvt3DDispatcherT from "../../vox/event/MouseEvt3DDispatcher";

import EventBase = EventBaseT.vox.event.EventBase;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import KeyboardEvent = KeyboardEventT.vox.event.KeyboardEvent;
import Keyboard = KeyboardT.vox.ui.Keyboard;
import UniformVec4Probe = UniformVec4ProbeT.vox.material.UniformVec4Probe;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;
export namespace vox
{
    export namespace display
    {
        export class Stage3D
        {
            private static s_index:number = 0;
            private m_index:number = 0;
            constructor()
            {
                this.m_index = Stage3D.s_index;
                Stage3D.s_index ++;

                Keyboard.AddEventListener(KeyboardEvent.KEY_DOWN,this,this.keyDown);
                Keyboard.AddEventListener(KeyboardEvent.KEY_UP,this,this.keyUp);
            }
            getIndex():number
            {
                return this.m_index;
            }
            pixelRatio:number = 1.0;
            stageWidth:number = 800;
            stageHeight:number = 600;
            stageHalfWidth:number = 400;
            stageHalfHeight:number = 300;
            mouseX:number = 0;
            mouseY:number = 0;
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
            private m_keyEvt:KeyboardEvent = new KeyboardEvent();
            private m_keyDown_listener:((evt:any)=>void)[] = [];
            private m_keyDown_ers:any[] = [];
            private m_keyUp_listener:((evt:any)=>void)[] = [];
            private m_keyUp_ers:any[] = [];

            uProbe:UniformVec4Probe = null;
            private m_preStageWidth:number = 0;
            private m_preStageHeight:number = 0;
            private m_mouseEvt:MouseEvent = new MouseEvent();
            private m_baseEvt:EventBase = new EventBase();
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
                    //this.m_stageParamArr = new Float32Array([2.0/800.0,2.0/600.0,800.0,600.0]);
                    this.uProbe = new UniformVec4Probe(1);
                    this.uProbe.bindSlotAt( this.m_index );
                    //this.uProbe.addVec4Data(this.m_stageParamArr, 1);
                }
                //  this.uProbe.setVec4Data(
                //      2.0/this.m_viewW
                //      ,2.0/this.m_viewH
                //      , this.m_viewW
                //      ,this.m_viewH
                //      );
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
                    this.m_baseEvt.target = this;
                    this.m_baseEvt.type = EventBase.RESIZE;
                    this.m_baseEvt.phase = 1;
                    this.sendResizeEvt(this.m_baseEvt);
                }
            }
            private keyDown(evt:any):void
            {
                this.m_keyEvt.phase = 1;
                this.m_keyEvt.type = KeyboardEvent.KEY_DOWN;
                this.m_keyEvt.altKey = evt.altKey;
                this.m_keyEvt.ctrlKey = evt.ctrlKey;
                this.m_keyEvt.shiftKey = evt.shiftKey;
                this.m_keyEvt.repeat = evt.repeat;
                this.m_keyEvt.key = evt.key;
                this.m_keyEvt.keyCode = evt.keyCode;
                this.m_keyEvt.location = evt.location;
                let len:number = this.m_keyDown_listener.length;
                for(var i:number = 0; i < len; ++i)
                {
                    this.m_keyDown_listener[i].call(this.m_keyDown_ers[i],this.m_keyEvt);
                }
            }
            private keyUp(evt:any):void
            {
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
                let len:number = this.m_keyUp_listener.length;
                for(var i:number = 0; i < len; ++i)
                {
                    this.m_keyUp_listener[i].call(this.m_keyUp_ers[i],this.m_keyEvt);
                }
            }
            private sendResizeEvt(evt:any):void
            {
                let len:number = this.m_resize_listener.length;      
                //console.log("Stage3D::sendResizeEvt(), m_resize_listener.length: ",this.m_resize_listener.length);
                for(var i:number = 0; i < len; ++i)
                {
                    this.m_resize_listener[i].call(this.m_resize_ers[i],evt);
                }
            }

            mouseDown():void
            {
                this.m_mouseEvt.type = MouseEvent.MOUSE_DOWN;
                this.m_mouseEvt.mouseX = this.mouseX;
                this.m_mouseEvt.mouseY = this.mouseY;
                this.m_mouseEvt.target = this;
                this.m_mouseEvt.phase = 1;
                this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);                
            }
            mouseUp():void
            {
                this.m_mouseEvt.phase = 1;
                this.m_mouseEvt.type = MouseEvent.MOUSE_UP;
                this.m_mouseEvt.mouseX = this.mouseX;
                this.m_mouseEvt.mouseY = this.mouseY;                
                this.m_mouseEvt.target = this;
                this.m_mouseEvt.phase = 1;
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
            mouseRightDown():void
            {
                this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_DOWN;
                this.m_mouseEvt.mouseX = this.mouseX;
                this.m_mouseEvt.mouseY = this.mouseY;
                this.m_mouseEvt.target = this;
                this.m_mouseEvt.phase = 1;
                this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
            }
            mouseRightUp():void
            {
                this.m_mouseEvt.type = MouseEvent.MOUSE_RIGHT_UP;
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
            
            addEventListener(type:number,target:any,func:(evt:any)=>void,captureEnabled:boolean = true,bubbleEnabled:boolean = true):void
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
                                    break;
                                }
                            }
                            if(i < 0)
                            {
                                this.m_resize_ers.push(target);
                                this.m_resize_listener.push(func);
                            }
                        break;
                        case KeyboardEvent.KEY_DOWN:
                            for(i = this.m_keyDown_listener.length - 1; i >= 0; --i)
                            {
                                if(target === this.m_keyDown_ers[i])
                                {
                                    break;
                                }
                            }
                            if(i < 0)
                            {
                                this.m_keyDown_ers.push(target);
                                this.m_keyDown_listener.push(func);
                            }
                        break;
                        case KeyboardEvent.KEY_UP:
                            for(i = this.m_keyUp_listener.length - 1; i >= 0; --i)
                            {
                                if(target === this.m_keyUp_ers[i])
                                {
                                    break;
                                }
                            }
                            if(i < 0)
                            {
                                this.m_keyUp_ers.push(target);
                                this.m_keyUp_listener.push(func);
                            }
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
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 渲染场景内物体的鼠标事件控制类

import * as Vector3DT from "../../vox/geom/Vector3";
import * as MouseEventT from "../../vox/event/MouseEvent";
import * as Stage3DT from "../../vox/display/Stage3D";

import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as RaySelectedNodeT from '../../vox/scene/RaySelectedNode';
import * as IRaySelectorT from '../../vox/scene/IRaySelector';
import * as IEvt3DControllerT from '../../vox/scene/IEvt3DController';
import * as IEvtDispatcherT from "../../vox/event/IEvtDispatcher";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import RaySelectedNode = RaySelectedNodeT.vox.scene.RaySelectedNode;
import IRaySelector = IRaySelectorT.vox.scene.IRaySelector;
import IEvt3DController = IEvt3DControllerT.vox.scene.IEvt3DController;
import IEvtDispatcher = IEvtDispatcherT.vox.event.IEvtDispatcher;


export namespace vox
{
    export namespace scene
    {
        export class MouseEvt3DController implements IEvt3DController
        {
            constructor()
            {
            }        
            private m_stage:Stage3D = null;
            private m_raySelector:IRaySelector = null;
            private m_unlockBoo:boolean = true;
            initialize(stage:Stage3D):void
            {
                //console.log("MouseEvt3DController::initialize()......");
                if(this.m_stage == null)
                {
                    this.m_stage = stage;
                    stage.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                    stage.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                    stage.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener);
                    stage.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener);                
                }
            }
            setRaySelector(raySelector:IRaySelector):void
            {
                this.m_raySelector = raySelector;
            }
            private m_mouseEvt:MouseEvent = new MouseEvent();
            private m_mouseOverEvt:MouseEvent = new MouseEvent();
            private m_mouseOutEvt:MouseEvent = new MouseEvent();
            private m_evtTarget:DisplayEntity = null;
            private m_evtTypes:Float32Array = new Float32Array(64);
            private m_evtXList:Float32Array = new Float32Array(64);
            private m_evtYList:Float32Array = new Float32Array(64);
            private m_evtWheelDeltaYs:Float32Array = new Float32Array(64);
            private m_evtTotal:number = 0;
            private mouseWheeelListener(evt:any):void
            {
                this.m_evtTypes[this.m_evtTotal] = (evt.type);
                this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
                this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
                this.m_evtWheelDeltaYs[this.m_evtTotal] = (evt.wheelDeltaY);
                this.m_mouseEvt.type = evt.type;
                this.m_evtTotal++;
            }
            // 鼠标动了, 摄像机动了, 被渲染对象本身动了,都可能形成mouse move事件
            private mouseMoveListener(evt:any):void
            {
                this.m_evtTypes[this.m_evtTotal] = (evt.type);
                this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
                this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
                this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
                this.m_mouseEvt.type = evt.type;
                this.m_evtTotal++;
            }
            private mouseDownListener(evt:any):void
            {
                this.m_evtTypes[this.m_evtTotal] = (evt.type);
                this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
                this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
                this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
                this.m_mouseEvt.type = evt.type;
                this.m_evtTotal++;
            }
            private mouseUpListener(evt:any):void
            {
                this.m_evtTypes[this.m_evtTotal] = (evt.type);
                this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
                this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
                this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
                this.m_mouseEvt.type = evt.type;
                this.m_evtTotal++;              
            }
            // @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
            // @param       status: 1(default process),1(deselect ray pick target)
            // @return      1 is send evt yes,0 is send evt no,-1 is event nothing
            run(evtFlowPhase:number,status:number):number
            {
                let flag:number = -1;
                if(this.m_unlockBoo)
                {
                    flag = this.m_evtTotal>0?0:-1;
                    let dispatcher:IEvtDispatcher = null;
                    let node:RaySelectedNode;
                    let lpv:Vector3D;;
                    let wpv:Vector3D;;
                    if(flag > -1)
                    {
                        node = status<1?this.m_raySelector.getSelectedNode():null;
                        
                        if(node != null)
                        {
                            lpv = node.lpv;
                            wpv = node.wpv;
                            let entity:DisplayEntity = node.entity;
                            dispatcher = entity.getEvtDispatcher(MouseEvent.EventClassType);

                            for(let i:number = 0;i < this.m_evtTotal;i++)
                            {
                                this.m_mouseEvt.type = this.m_evtTypes[i];
                                this.m_mouseEvt.mouseX = this.m_evtXList[i];
                                this.m_mouseEvt.mouseY = this.m_evtYList[i];
                                this.m_mouseEvt.wheelDeltaY = this.m_evtWheelDeltaYs[i];
                                //console.log("this.m_mouseEvt.type: "+this.m_mouseEvt.type);
                                if(this.m_mouseEvt.type > 0)
                                {
                                    //console.log("this.m_raySelector.getSelectedNodesTotal(): "+this.m_raySelector.getSelectedNodesTotal()); 
                                    //node = this.m_raySelector.getSelectedNode();
                                    if(node != null)
                                    {
                                        //entity = node.entity;
                                        //dispatcher = entity.getEvtDispatcher(MouseEvent.EventClassType);
                                        if(dispatcher != null)
                                        {
                                            this.m_mouseEvt.target = entity;
                                            this.m_mouseEvt.phase = evtFlowPhase;
                                            this.m_mouseEvt.lpos.copyFrom(lpv);
                                            this.m_mouseEvt.wpos.copyFrom(wpv);
                                            this.m_raySelector.getRay(this.m_mouseEvt.raypv,this.m_mouseEvt.raytv);
                                            if(this.m_evtTarget != entity)
                                            {
                                                this.m_mouseOverEvt.phase = evtFlowPhase;
                                                this.m_mouseOverEvt.type = MouseEvent.MOUSE_OVER;
                                                this.m_mouseOverEvt.mouseX = this.m_mouseEvt.mouseX;
                                                this.m_mouseOverEvt.mouseY = this.m_mouseEvt.mouseY;
                                                this.m_mouseOverEvt.target = entity;
                                                this.m_mouseOverEvt.lpos.copyFrom(lpv);
                                                this.m_mouseOverEvt.wpos.copyFrom(wpv);
                                                this.m_raySelector.getRay(this.m_mouseOverEvt.raypv,this.m_mouseOverEvt.raytv);
                                                flag += dispatcher.dispatchEvt(this.m_mouseOverEvt);
                                            }
                                            flag += dispatcher.dispatchEvt(this.m_mouseEvt);
                                            if(this.m_evtTarget != null && this.m_evtTarget != entity)
                                            {
                                                dispatcher = this.m_evtTarget.getEvtDispatcher(MouseEvent.EventClassType);
                                                if(dispatcher != null)
                                                {
                                                    this.m_mouseOutEvt.phase = evtFlowPhase;
                                                    this.m_mouseOutEvt.type = MouseEvent.MOUSE_OUT;
                                                    this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
                                                    this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
                                                    this.m_mouseOutEvt.target = this.m_evtTarget;
                                                    this.m_mouseOutEvt.lpos.copyFrom(lpv);
                                                    this.m_mouseOutEvt.wpos.copyFrom(wpv);
                                                    this.m_raySelector.getRay(this.m_mouseOutEvt.raypv,this.m_mouseOutEvt.raytv);
                                                    //console.log("mouse out 01."+this.m_evtTarget.name);
                                                    flag += dispatcher.dispatchEvt(this.m_mouseOutEvt);
                                                }
                                            }
                                            this.m_evtTarget = entity;
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if(this.m_evtTarget != null)
                            {
                                dispatcher = this.m_evtTarget.getEvtDispatcher(MouseEvent.EventClassType);
                                if(dispatcher != null)
                                {
                                    this.m_mouseOutEvt.phase = evtFlowPhase;
                                    this.m_mouseOutEvt.type = MouseEvent.MOUSE_OUT;
                                    this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
                                    this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
                                    this.m_mouseOutEvt.target = this.m_evtTarget;
                                    this.m_raySelector.getRay(this.m_mouseOutEvt.raypv,this.m_mouseOutEvt.raytv);
                                    flag += dispatcher.dispatchEvt(this.m_mouseOutEvt);
                                }
                                this.m_evtTarget = null;
                            }
                        }
                    }
                    if(flag == 0 && dispatcher != null)
                    {
                        //任何 在 evtFlowPhase 值所代表的阶段的事件能被接收，则表示这个事件应该无法穿透到下一个过程
                        flag = dispatcher.passTestPhase(evtFlowPhase);
                    }
                }
                return flag>0?1:0;
            }
            runEnd():void
            {
                //  if(this.m_mouseEvt.type == 5001)
                //  {
                //      console.log("this.m_mouseEvt.type: "+this.m_mouseEvt.type);
                //  }
                this.m_evtTotal = 0;
                this.m_mouseEvt.type = 0;
            }
            reset():void
            {
                this.m_evtTotal = 0;
            }
            
            getEvtType():number
            {
                return this.m_mouseEvt.type;
            }
            isSelected():boolean
            {
                return this.m_raySelector.getSelectedNode() != null;
            }
            lock():void
            {
                this.m_unlockBoo = false;
            }
            unlock():void
            {
                this.m_unlockBoo = true;
            }
            isUnlock():boolean
            {
                return this.m_unlockBoo;
            }
        }
    }
}
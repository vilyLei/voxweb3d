/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 渲染场景内物体的鼠标事件控制类

import Vector3D from "../../vox/math/Vector3D";
import MouseEvent from "../../vox/event/MouseEvent";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

import IRenderEntity from "../../vox/render/IRenderEntity";
import RaySelectedNode from '../../vox/scene/RaySelectedNode';
import IRaySelector from '../../vox/scene/IRaySelector';
import IEvt3DController from '../../vox/scene/IEvt3DController';
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";

export default class MouseEvt3DController implements IEvt3DController
{
    private m_mainStage:IRenderStage3D = null;
    private m_currStage:IRenderStage3D = null;
    private m_raySelector:IRaySelector = null;
    private m_unlockBoo:boolean = true;
    private static s_uid:number = 0;
    private m_uid:number = 0;
    constructor(){
        this.m_uid = MouseEvt3DController.s_uid++;
    }

    initialize(mainStage:IRenderStage3D,currStage:IRenderStage3D):void
    {
        //console.log("MouseEvt3DController::initialize()......");
        if(this.m_mainStage == null)
        {            
            this.m_mainStage = mainStage;
            this.m_currStage = currStage;
            mainStage.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener,true,false);
            mainStage.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener,true,false);
            mainStage.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener,true,false);
            mainStage.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener,true,false);
        }
    }
    setRaySelector(raySelector:IRaySelector):void
    {
        this.m_raySelector = raySelector;
    }
    private m_mouseEvt:MouseEvent = new MouseEvent();
    private m_mouseOverEvt:MouseEvent = new MouseEvent();
    private m_mouseOutEvt:MouseEvent = new MouseEvent();
    private m_evtTarget:IRenderEntity = null;
    private m_evtTypes:Float32Array = new Float32Array(64);
    private m_evtXList:Float32Array = new Float32Array(64);
    private m_evtYList:Float32Array = new Float32Array(64);
    private m_evtWheelDeltaYs:Float32Array = new Float32Array(64);
    private m_evtTotal:number = 0;
    //private m_node:RaySelectedNode = null;
    private m_evtFlowPhase:number = -1;
    private static s_unlockMouseEvt:boolean = true;
    private mouseWheeelListener(evt:any):void
    {
        if(this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
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
        if(this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
            //this.m_currStage.mouseMove();
        }
        this.m_evtTypes[this.m_evtTotal] = (evt.type);
        this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
        this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
        this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
        this.m_mouseEvt.type = evt.type;
        this.m_evtTotal++;
    }
    private mouseDownListener(evt:any):void
    {
        if(this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        if(MouseEvt3DController.s_unlockMouseEvt)
        {
            this.m_evtTypes[this.m_evtTotal] = (evt.type);
            this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
            this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
            this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
            this.m_mouseEvt.type = evt.type;
            this.m_evtTotal++;
        }
    }
    private mouseUpListener(evt:any):void
    {
        if(this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        if(MouseEvt3DController.s_unlockMouseEvt)
        {
            this.m_evtTypes[this.m_evtTotal] = (evt.type);
            this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
            this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
            this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
            this.m_mouseEvt.type = evt.type;
            this.m_evtTotal++;
        }       
    }
    mouseOutEventTarget(): number
    {
        if(this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        if(this.m_evtTarget != null)
        {
            let dispatcher:IEvtDispatcher = this.m_evtTarget.getEvtDispatcher(MouseEvent.EventClassType);
            if(dispatcher != null)
            {
                this.m_mouseOutEvt.phase = this.m_evtFlowPhase;
                this.m_mouseOutEvt.type = MouseEvent.MOUSE_OUT;
                this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
                this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
                this.m_mouseOutEvt.target = this.m_evtTarget;
                this.m_raySelector.getRay(this.m_mouseOutEvt.raypv,this.m_mouseOutEvt.raytv);
                this.m_evtTarget = null;
                return dispatcher.dispatchEvt(this.m_mouseOutEvt);
            }
            this.m_evtTarget = null;
        }
        return 0;
    }
    /**
     * @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
     * @param       status: 1(default process),1(deselect ray pick target)
     * @return      1 is send evt yes,0 is send evt no,-1 is event nothing
     */
    run(evtFlowPhase:number,status:number):number
    {
        let flag:number = -1;
        if(this.m_unlockBoo)
        {
            this.m_evtFlowPhase = evtFlowPhase;
            let i:number = 0;
            flag = this.m_evtTotal>0?0:-1;
            let dispatcher:IEvtDispatcher = null;
            let node:RaySelectedNode;
            let lpv:Vector3D;
            let wpv:Vector3D;
            if(flag > -1)
            {
                
                if(this.m_currStage != this.m_mainStage && this.m_currStage != null)
                {
                    MouseEvt3DController.s_unlockMouseEvt = false;
                    for(i = 0;i < this.m_evtTotal;i++)
                    {
                        switch(this.m_evtTypes[i])
                        {
                            case MouseEvent.MOUSE_DOWN:
                                this.m_currStage.mouseDown(1);
                                break;
                            case MouseEvent.MOUSE_UP:
                                this.m_currStage.mouseUp(1);
                                break;
                            case MouseEvent.MOUSE_MOVE:
                                this.m_currStage.mouseMove();
                                break;
                            default:
                                break;
                        }
                    }
                    MouseEvt3DController.s_unlockMouseEvt = true;
                }
                node = status<1?this.m_raySelector.getSelectedNode():null;
                if(node != null)
                {
                    lpv = node.lpv;
                    wpv = node.wpv;
                    let entity:IRenderEntity = node.entity;
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
                    //  if(this.m_evtTarget != null)
                    //  {
                    //      dispatcher = this.m_evtTarget.getEvtDispatcher(MouseEvent.EventClassType);
                    //      if(dispatcher != null)
                    //      {
                    //          this.m_mouseOutEvt.phase = evtFlowPhase;
                    //          this.m_mouseOutEvt.type = MouseEvent.MOUSE_OUT;
                    //          this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
                    //          this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
                    //          this.m_mouseOutEvt.target = this.m_evtTarget;
                    //          this.m_raySelector.getRay(this.m_mouseOutEvt.raypv,this.m_mouseOutEvt.raytv);
                    //          flag += dispatcher.dispatchEvt(this.m_mouseOutEvt);
                    //      }
                    //      this.m_evtTarget = null;
                    //  }
                    flag += this.mouseOutEventTarget();
                    if(this.m_currStage != null)
                    {
                        for(i = 0; i < this.m_evtTotal; i++)
                        {
                            switch(this.m_evtTypes[i])
                            {
                                case MouseEvent.MOUSE_DOWN:
                                    this.m_currStage.mouseBgDown();
                                    break;
                                case MouseEvent.MOUSE_UP:
                                    this.m_currStage.mouseBgUp();
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
                if(this.m_currStage != null)
                {
                    MouseEvt3DController.s_unlockMouseEvt = false;
                    for(i = 0;i < this.m_evtTotal;i++)
                    {
                        switch(this.m_evtTypes[i])
                        {
                            case MouseEvent.MOUSE_DOWN:
                                this.m_currStage.mouseDown(2);
                                break;
                            case MouseEvent.MOUSE_UP:
                                this.m_currStage.mouseUp(2);
                                break;
                            //  case MouseEvent.MOUSE_MOVE:
                            //      this.m_currStage.mouseMove();
                            //      break;
                            default:
                                break;
                        }
                    }
                    MouseEvt3DController.s_unlockMouseEvt = true;
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
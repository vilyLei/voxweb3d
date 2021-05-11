

import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import RendererState from "../../../vox/render/RendererState";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import MouseEvt3DDispatcher from "../../../vox/event/MouseEvt3DDispatcher";
import AxisDragController from "../../../voxeditor/control/AxisDragController";
import * as PlaneDragControllerT from "../../../voxeditor/control/PlaneDragController";
import RendererScene from "../../../vox/scene/RendererScene";
import DragAxisQuad3D from "../../../voxeditor/entity/DragAxisQuad3D";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import MouseEvent = MouseEventT.vox.event.MouseEvent;
//import RendererState = RendererStateT.vox.render.RendererState;
//import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;
//import AxisDragController = AxisDragControllerT.voxeditor.control.AxisDragController;
import PlaneDragController = PlaneDragControllerT.voxeditor.control.PlaneDragController;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
//import DragAxisQuad3D = DragAxisQuad3DT.voxeditor.entity.DragAxisQuad3D;

export namespace voxvat
{
export namespace demo
{
    export namespace scene
    {
        export class AxisDragObject
        {
            constructor()
            {
            }
            private m_axisDragCtr:AxisDragController = new AxisDragController();
            private m_planeDragCtr:PlaneDragController = new PlaneDragController();
            private m_axisDisp:DisplayEntity = null;
            private m_qxozDisp:DisplayEntity = null;
            private m_qxoyDisp:DisplayEntity = null;
            private m_qyozDisp:DisplayEntity = null;
            private m_axisDispatcher:MouseEvt3DDispatcher = null;
            private m_qxozDispatcher:MouseEvt3DDispatcher = null;
            private m_qxoyDispatcher:MouseEvt3DDispatcher = null;
            private m_qyozDispatcher:MouseEvt3DDispatcher = null;
            private m_planeNV:Vector3D = new Vector3D();

            private m_isActive:boolean = true;
            private m_rpv:Vector3D = new Vector3D();
            private m_rtv:Vector3D = new Vector3D();
            private m_rsc:RendererScene = null;
            private m_mouseDownBoo:boolean = false;
            private m_axisMouseDownBoo:boolean = false;
            private m_quadMouseDownBoo:boolean = false;
            private m_targetDisp:DisplayEntity = null;
            callbackFuncTarget:any = null;
            callbackFunc:()=>void = null;
            initialize(sc:RendererScene,rproIndex:number,axisSize:number,axisThickness:number):void
            {
                if(this.m_rsc == null)
                {
                    let quadAxis:DragAxisQuad3D = new DragAxisQuad3D();
                    quadAxis.pickTestRadius = 12.0;
                    quadAxis.initialize(axisSize, axisThickness);
                    this.m_rsc.addEntity(quadAxis, rproIndex);
                    this.m_rsc = sc;
                    this.m_axisDisp = quadAxis;
                    
                    let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.axisMouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.axisMouseUpListener);
                    quadAxis.setEvtDispatcher(dispatcher);
                    this.m_axisDispatcher = dispatcher;
                    quadAxis.mouseEnabled = true;
                    
                    this.m_rsc.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                }
            }
            
            initializeHasQuad(sc:RendererScene,rproIndex:number,axisSize:number,axisThickness:number,quadSize:number,quadAlpha:number ):void
            {
                if(this.m_rsc == null)
                {
                    this.m_rsc = sc;
                    let rstate:number = RendererState.NONE_TRANSPARENT_ALWAYS_STATE;
                    let quadAxis:DragAxisQuad3D = new DragAxisQuad3D();
                    quadAxis.pickTestRadius = axisThickness + 4.0;
                    quadAxis.colorX.a = 0.5;
                    quadAxis.colorY.a = 0.5;
                    quadAxis.colorZ.a = 0.5;
                    quadAxis.initialize(axisSize, axisThickness);
                    quadAxis.setRenderState( rstate );
                    this.m_rsc.addEntity(quadAxis,rproIndex);
                    this.m_rsc = sc;
                    this.m_axisDisp = quadAxis;
                    let pm:any;
                    
                    let qxozDisp:Plane3DEntity = new Plane3DEntity();
                    qxozDisp.initializeXOZ(0.0,0.0,quadSize,quadSize,null);
                    qxozDisp.getMesh().setPolyhedral(false);
                    pm = qxozDisp.getMaterial();
                    pm.setRGBA4f(0.0,1.0,0.0,quadAlpha);
                    qxozDisp.setRenderState( rstate );
                    this.m_rsc.addEntity(qxozDisp,rproIndex);
                    //NONE_TRANSPARENT_ALWAYS_STATE
                    let qxoyDisp:Plane3DEntity = new Plane3DEntity();
                    qxoyDisp.initializeXOY(0.0,0.0,quadSize,quadSize,null);
                    qxoyDisp.getMesh().setPolyhedral(false);
                    pm = qxoyDisp.getMaterial();
                    pm.setRGBA4f(0.0,0.0,1.0,quadAlpha);
                    qxoyDisp.setRenderState( rstate );
                    this.m_rsc.addEntity(qxoyDisp,rproIndex);
                    
                    let qyozDisp:Plane3DEntity = new Plane3DEntity();
                    qyozDisp.initializeYOZ(0.0,0.0,quadSize,quadSize,null);
                    qyozDisp.getMesh().setPolyhedral(false);
                    pm = qyozDisp.getMaterial();
                    pm.setRGBA4f(1.0,0.0,0.0,quadAlpha);
                    qyozDisp.setRenderState( rstate );
                    this.m_rsc.addEntity(qyozDisp,rproIndex);
    
                    let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                    dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.axisMouseDownListener);
                    dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.axisMouseUpListener);
                    quadAxis.setEvtDispatcher(dispatcher);
                    this.m_axisDispatcher = dispatcher;
                    quadAxis.mouseEnabled = true;
    
                    if(qxozDisp != null)
                    {
                        dispatcher = new MouseEvt3DDispatcher();
                        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.qxozMouseDownListener);
                        dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.qxozMouseUpListener);
                        qxozDisp.setEvtDispatcher(dispatcher);
                        this.m_qxozDispatcher = dispatcher;
                        qxozDisp.mouseEnabled = true;
                        this.m_qxozDisp = qxozDisp;
                    }
                    
                    if(qxoyDisp != null)
                    {
                        dispatcher = new MouseEvt3DDispatcher();
                        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.qxoyMouseDownListener);
                        dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.qxozMouseUpListener);
                        qxoyDisp.setEvtDispatcher(dispatcher);
                        this.m_qxoyDispatcher = dispatcher;
                        qxoyDisp.mouseEnabled = true;
                        this.m_qxoyDisp = qxoyDisp;
                    }
                    
                    if(qyozDisp != null)
                    {
                        dispatcher = new MouseEvt3DDispatcher();
                        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.qyozMouseDownListener);
                        dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.qxozMouseUpListener);
                        qyozDisp.setEvtDispatcher(dispatcher);
                        this.m_qyozDispatcher = dispatcher;
                        qyozDisp.mouseEnabled = true;
                        this.m_qyozDisp = qyozDisp;
                    }
                    this.m_rsc.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                }
            }
            
            protected mouseUpListener(evt:any):void
            {
                this.m_mouseDownBoo = false;

                this.m_axisMouseDownBoo = false;
                this.m_quadMouseDownBoo = false;
            }
            protected axisMouseDownListener(evt:any):void
            {
                this.m_axisDragCtr.bindTarget(this.m_axisDisp);
                this.m_axisDragCtr.dragBegin(evt.lpos, evt.raypv,evt.raytv);
                this.m_mouseDownBoo = true;

                this.m_quadMouseDownBoo = false;
                this.m_axisMouseDownBoo = true;
            }
            protected axisMouseUpListener(evt:any):void
            {
                this.m_mouseDownBoo = false;

                this.m_axisMouseDownBoo = false;
                this.m_quadMouseDownBoo = false;
            }
            
            protected qxozMouseDownListener(evt:any):void
            {
                //console.log("qxozMouseDownListener");
                this.m_planeNV.setXYZ(0.0,1.0,0.0);
                this.m_planeDragCtr.targetEntity = this.m_axisDisp;
                this.m_planeDragCtr.dragBegin(this.m_planeNV, this.m_qxozDisp.getTransform().getY(), evt.raypv,evt.raytv);
                this.m_mouseDownBoo = true;

                this.m_axisMouseDownBoo = false;
                this.m_quadMouseDownBoo = true;
            }
            protected qxozMouseUpListener(evt:any):void
            {
                this.m_mouseDownBoo = false;

                this.m_axisMouseDownBoo = false;
                this.m_quadMouseDownBoo = false;
            }

            protected qxoyMouseDownListener(evt:any):void
            {
                //console.log("qxoyMouseDownListener");
                this.m_planeNV.setXYZ(0.0,0.0,1.0);
                this.m_planeDragCtr.targetEntity = this.m_axisDisp;
                this.m_planeDragCtr.dragBegin(this.m_planeNV, this.m_qxozDisp.getTransform().getZ(), evt.raypv,evt.raytv);
                this.m_mouseDownBoo = true;

                this.m_axisMouseDownBoo = false;
                this.m_quadMouseDownBoo = true;
            }
            protected qyozMouseDownListener(evt:any):void
            {
                //console.log("qxoyMouseDownListener");
                this.m_planeNV.setXYZ(1.0,0.0,0.0);
                this.m_planeDragCtr.targetEntity = this.m_axisDisp;
                this.m_planeDragCtr.dragBegin(this.m_planeNV, this.m_qxozDisp.getTransform().getX(), evt.raypv,evt.raytv);
                this.m_mouseDownBoo = true;

                this.m_axisMouseDownBoo = false;
                this.m_quadMouseDownBoo = true;
            }
            setVisible(boo:boolean):void
            {
                this.m_axisDisp.setVisible(boo);
                if(this.m_qxozDisp != null)
                {
                    this.m_qxozDisp.setVisible(boo);
                }
                if(this.m_qxoyDisp != null)
                {
                    this.m_qxoyDisp.setVisible(boo);
                }
                if(this.m_qyozDisp != null)
                {
                    this.m_qyozDisp.setVisible(boo);
                }
            }
            getVisible():boolean
            {
                return this.m_axisDisp.getVisible();
            }
            setDragTarget(target:DisplayEntity):void
            {
                this.m_targetDisp = target;
                if(this.m_targetDisp != null)
                {
                    this.m_targetDisp.getPosition(this.m_posV);
                    this.m_axisDisp.setPosition(this.m_posV);
                    this.m_axisDisp.update();
                    this.m_axisDisp.setVisible(true);

                    if(this.m_qxozDisp != null)
                    {
                        this.m_qxozDisp.setPosition(this.m_posV);
                        this.m_qxozDisp.update();
                        this.m_qxozDisp.setVisible(true);
                    }
                    if(this.m_qxoyDisp != null)
                    {
                        this.m_qxoyDisp.setPosition(this.m_posV);
                        this.m_qxoyDisp.update();
                        this.m_qxoyDisp.setVisible(true);
                    }
                    if(this.m_qyozDisp != null)
                    {
                        this.m_qyozDisp.setPosition(this.m_posV);
                        this.m_qyozDisp.update();
                        this.m_qyozDisp.setVisible(true);
                    }
                }
            }
            isSelected():boolean
            {
                return this.m_axisDisp.getVisible();
            }
            isDraging():boolean
            {
                return this.m_axisDisp.getVisible() && this.m_mouseDownBoo;
            }
            deselect():void
            {
                this.callbackFunc = null;
                this.callbackFuncTarget = null;//
                this.m_targetDisp = null;
                this.setVisible(false);
                //this.m_axisDisp.setVisible(false);
                //if(this.m_qxozDisp != null)this.m_qxozDisp.setVisible(false);
            }
            private m_posV:Vector3D = new Vector3D();
            run():void
            {
                if(this.m_mouseDownBoo)
                {
                    this.m_rsc.getMouseXYWorldRay(this.m_rpv, this.m_rtv);
                    if(this.m_axisMouseDownBoo)
                    {
                        this.m_axisDragCtr.updateDrag(this.m_rpv, this.m_rtv);
                    }
                    else if(this.m_quadMouseDownBoo)
                    {
                        this.m_planeDragCtr.updateDrag(this.m_rpv, this.m_rtv);
                    }

                    this.m_axisDisp.getPosition(this.m_posV);

                    if(this.m_qxozDisp != null)
                    {
                        this.m_qxozDisp.setPosition(this.m_posV);
                        this.m_qxozDisp.update();
                    }                    
                    if(this.m_qxoyDisp != null)
                    {
                        this.m_qxoyDisp.setPosition(this.m_posV);
                        this.m_qxoyDisp.update();
                    }
                    if(this.m_qyozDisp != null)
                    {
                        this.m_qyozDisp.setPosition(this.m_posV);
                        this.m_qyozDisp.update();
                    }
                    if(this.m_targetDisp != null)
                    {
                        this.m_targetDisp.setPosition(this.m_posV);
                        this.m_targetDisp.update();
                        if(this.callbackFunc != null)
                        {
                            this.callbackFunc.call(this.callbackFuncTarget);
                        }
                    }

                }
            }
        }
    }
}
}
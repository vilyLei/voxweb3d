

import * as Vector3DT from "../../../vox/geom/Vector3";
import * as MouseEventT from "../../../vox/event/MouseEvent";
import * as DisplayEntityT from "../../../vox/entity/DisplayEntity";
import * as CameraBaseT from "../../../vox/view/CameraBase";
import * as MouseEvt3DDispatcherT from "../../../vox/event/MouseEvt3DDispatcher";
import * as ParalMap2MaterialT from "../mateiral/ParalMap2Material";
import * as AxisDragObjectT from "./AxisDragObject";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;
import ParalMap2Material = ParalMap2MaterialT.voxvat.demo.material.ParalMap2Material;
import AxisDragObject = AxisDragObjectT.voxvat.demo.scene.AxisDragObject;

export namespace voxvat
{
export namespace demo
{
    export namespace scene
    {
        export class DispEvtEntity
        {
            constructor()
            {
            }
            private m_disp:DisplayEntity = null;
            private m_material:any = null;
            private m_mouseEvt:MouseEvent = new MouseEvent();
            private m_dispatcher:MouseEvt3DDispatcher = null;
            private m_rotV:Vector3D = null;
            private m_rotSpdV:Vector3D = null;
            private m_isActive:boolean = true;
            private m_mouseOverBooo:boolean = true;
            index:number = 0;
            dragCtrlObj:AxisDragObject = null;
            radius:number = 0.0;
            camera:CameraBase = null;
            initialize(disp:DisplayEntity):void
            {
                this.m_disp = disp;
                //this.m_material = material;
                
                let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_OVER,this,this.mouseOverListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_OUT,this,this.mouseOutListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener);
                disp.setEvtDispatcher(dispatcher);
                disp.mouseEnabled = true;

                this.m_dispatcher = new MouseEvt3DDispatcher();
                this.m_rotV = new Vector3D(Math.random() * 300.0,Math.random() * 300.0,Math.random() * 300.0);
                this.m_rotSpdV = new Vector3D(Math.random() * 2.0 - 1.0,Math.random() * 2.0 - 1.0,Math.random() * 2.0 - 1.0);
                disp.setRotationXYZ(this.m_rotV.x,this.m_rotV.y,this.m_rotV.z);
            }
            getDisp():DisplayEntity
            {
                return this.m_disp;
            }
            addEventListener(type:number,target:any,func:(evt:any)=>void):void
            {
                this.m_dispatcher.addEventListener(type,target,func);
            }
            removeEventListener(type:number,target:any,func:(evt:any)=>void):void
            {
                this.m_dispatcher.removeEventListener(type,target,func);
            }
            protected mouseOverListener(evt:any):void
            {
                //console.log("... DispEvtEntity mouse over.");
                this.m_mouseOverBooo = true;
            }
            protected mouseOutListener(evt:any):void
            {
                //console.log("... DispEvtEntity mouse out.");
                this.m_material = this.m_disp.getMaterial();
                if(this.m_material != null)
                {
                    this.m_material.setRGB3f(1.0,1.0,1.0);
                }
                this.m_mouseOverBooo = false;
            }
            protected mouseDownListener(evt:any):void
            {
                if(this.dragCtrlObj != null)
                {
                    this.dragCtrlObj.setDragTarget(this.m_disp);
                    this.dragCtrlObj.callbackFuncTarget = this;
                    this.dragCtrlObj.callbackFunc = this.runCallback;
                }

                this.m_mouseEvt.phase = evt.phase;
                this.m_mouseEvt.type = evt.type;
                this.m_mouseEvt.target = this;
                this.m_dispatcher.dispatchEvt(this.m_mouseEvt);
            }
            private m_pv:Vector3D = new Vector3D();
            private runCallback():void
            {
                if(this.camera != null)
                {
                    this.m_disp.getPosition( this.m_pv);
                    console.log("this.m_pv: "+this.m_pv.toString());
                    let hitBoo:boolean = this.camera.visiTestSphere2(this.m_pv, this.radius);
                    console.log("hitBoo: "+hitBoo);
                }
            }
            protected mouseUpListener(evt:any):void
            {
            }
            protected mouseMoveListener(evt:any):void
            {
                //console.log("... DispEvtEntity mouse move.");
                let boo:boolean = this.dragCtrlObj == null || !this.dragCtrlObj.isDraging();
                if(boo)
                {
                    this.m_material = this.m_disp.getMaterial();
                    if(this.m_material != null)
                    {
                        this.m_material.setRGB3f(Math.random() * 1.8 + 0.1,Math.random() * 1.8 + 0.1,Math.random() * 1.8 + 0.1);
                    }
                }
            }
            run():void
            {
                if(this.m_mouseOverBooo)
                {
                    this.m_rotV.addBy( this.m_rotSpdV );
                    this.m_disp.setRotationXYZ(this.m_rotV.x,this.m_rotV.y,this.m_rotV.z);
                    this.m_disp.update();
                }
            }
        }
    }
}
}
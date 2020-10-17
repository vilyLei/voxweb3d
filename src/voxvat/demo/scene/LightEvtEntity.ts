

import * as Vector3DT from "../../../vox/geom/Vector3";
import * as MouseEventT from "../../../vox/event/MouseEvent";
import * as DisplayEntityT from "../../../vox/entity/DisplayEntity";
import * as BoundsEntityT from "../../../vox/entity/BoundsEntity";
import * as MouseEvt3DDispatcherT from "../../../vox/event/MouseEvt3DDispatcher";
import * as ParalLightDataT from "../light/ParalLightData";
import * as AxisDragObjectT from "./AxisDragObject";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import BoundsEntity = BoundsEntityT.vox.entity.BoundsEntity;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;
import ParalLightData = ParalLightDataT.voxvat.demo.light.ParalLightData;
import AxisDragObject = AxisDragObjectT.voxvat.demo.scene.AxisDragObject;

export namespace voxvat
{
export namespace demo
{
    export namespace scene
    {
        export class LightBoundsEntity extends BoundsEntity
        {
            //constructor()
            //{
            //    super();
            //}
            index:number = 0;
            disp:DisplayEntity = null;
            disp1:DisplayEntity = null;
            private m_pv:Vector3D = new Vector3D();
            update():void
            {
                super.update();
                if(this.disp != null)
                {
                    this.disp.copyPositionFrom(this);
                    this.disp.update();
                    this.disp.getPosition(this.m_pv);
                    ParalLightData.SetLightPosAt(this.m_pv.x,this.m_pv.y,this.m_pv.z, this.index);
                    ParalLightData.Update();
                }
                if(this.disp1 != null)
                {
                    this.disp1.copyPositionFrom(this);
                    this.disp1.update();
                }
            }
        }
        export class LightEvtEntity
        {
            constructor()
            {
            }
            private m_disp:LightBoundsEntity = null;
            private m_isActive:boolean = true;
            dragCtrlObj:AxisDragObject = null;
            private m_mouseEvt:MouseEvent = new MouseEvent();
            private m_dispatcher:MouseEvt3DDispatcher = null;
            index:number = 0;
            initialize(disp:LightBoundsEntity):void
            {
                this.m_disp = disp;
                let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
                dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                //  dispatcher.addEventListener(MouseEvent.MOUSE_OVER,this,this.mouseOverListener);
                //  dispatcher.addEventListener(MouseEvent.MOUSE_OUT,this,this.mouseOutListener);
                dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener);
                disp.setEvtDispatcher(dispatcher);
                this.m_dispatcher = new MouseEvt3DDispatcher();
                disp.mouseEnabled = true;
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
                console.log("... LightEvtEntity mouse over.");
            }
            protected mouseOutListener(evt:any):void
            {
                console.log("... LightEvtEntity mouse out.");
            }
            protected mouseDownListener(evt:any):void
            {
                if(this.dragCtrlObj != null)
                {
                    this.dragCtrlObj.setDragTarget(this.m_disp);
                }
                this.m_mouseEvt.type = evt.type;
                this.m_mouseEvt.target = evt.target;
                this.m_dispatcher.dispatchEvt(this.m_mouseEvt);
            }
            protected mouseUpListener(evt:any):void
            {
            }
            protected mouseMoveListener(evt:any):void
            {
                //console.log("... LightEvtEntity mouse move.");
                this.m_disp.disp.setRotationXYZ(0.0,this.m_disp.disp.getTransform().getRotationY() + 2.0,0.0);
                this.m_disp.disp.update();
            }
            run():void
            {
            }
        }
    }
}
}
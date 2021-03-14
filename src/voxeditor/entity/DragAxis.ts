
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as LineT from "../../vox/geom/Line";
import * as Matrix4T from "../../vox/math/Matrix4";

import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../../vox/entity/Axis3DEntity";
import * as MouseEventT from "../../vox/event/MouseEvent";
import * as MouseEvt3DDispatcherT from "../../vox/event/MouseEvt3DDispatcher";

import Vector3D = Vector3DT.vox.math.Vector3D;
import StraightLine = LineT.vox.geom.StraightLine;
import Matrix4 = Matrix4T.vox.math.Matrix4;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import MouseEvt3DDispatcher = MouseEvt3DDispatcherT.vox.event.MouseEvt3DDispatcher;

export namespace voxeditor
{
export namespace entity
{
    export class DragAxis extends Axis3DEntity
    {
        targetEntity:DisplayEntity = null;
        //  constructor()
        //  {
        //      super();
        //  }
        //  mouseMoveListener(evt:any):void
        //  {
        //  }
        //  mouseOverListener(evt:any):void
        //  {
        //  }
        //  mouseOutListener(evt:any):void
        //  {
        //  }
        initialize(size:number = 100.0):void
        {
            let dispatcher:MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
            dispatcher.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
            //  dispatcher.addEventListener(MouseEvent.MOUSE_OVER,this,this.mouseOverListener);
            //  dispatcher.addEventListener(MouseEvent.MOUSE_OUT,this,this.mouseOutListener);
            //  dispatcher.addEventListener(MouseEvent.MOUSE_MOVE,this,this.mouseMoveListener);
            this.setEvtDispatcher(dispatcher);
            this.mouseEnabled = true;
            super.initialize(size);
        }
        mouseUpListener(evt:any):void
        {
            //this.deselect();
        }
        isSelected():boolean
        {
            return this.m_flag > -1;
        }
        select():void
        {

        }
        deselect():void
        {
            this.m_flag = -1;
        }
        destroy():void
        {
            this.targetEntity = null;
            super.destroy();
        }
        
        private m_flag:number = -1;
        private m_axis_pv:Vector3D = new Vector3D();
        private m_axis_tv:Vector3D = new Vector3D();
        private m_initPos:Vector3D = new Vector3D();
        private m_pos:Vector3D = new Vector3D();
        private m_dv:Vector3D = new Vector3D();
        private m_outV:Vector3D = new Vector3D();
        private m_initV:Vector3D = new Vector3D();

        private calcClosePos(rpv:Vector3D, rtv:Vector3D):void
        {
            if(this.m_flag > -1)
            {
                
                let mat4:Matrix4 = this.getTransform().getInvMatrix();
                mat4.transformVector3Self(rpv);
                mat4.deltaTransformVectorSelf(rtv);
                let outV:Vector3D = this.m_outV;
                StraightLine.CalcTwoSLCloseV2(rpv,rtv, this.m_axis_pv,this.m_axis_tv,outV);
                mat4 = this.getTransform().getMatrix();
                mat4.transformVector3Self(outV);
            }
        }
        public updateDrag(rpv:Vector3D, rtv:Vector3D):void
        {
            if(this.m_flag > -1)
            {
                this.calcClosePos(rpv,rtv);
                this.m_dv.copyFrom(this.m_outV);
                this.m_dv.subtractBy(this.m_initV);
                this.m_pos.copyFrom(this.m_initPos);
                this.m_pos.addBy(this.m_dv);
                this.setPosition(this.m_pos);
                this.update();
                if(this.targetEntity != null)
                {
                    //console.log("this.targetEntity: "+this.targetEntity.toString());
                    this.targetEntity.setPosition(this.m_pos);
                    this.targetEntity.update();
                }
            }
        }
        
        mouseDownListener(evt:any):void
        {
            //console.log("DragAxis::mouseDownListener().");
            //console.log("this.targetEntity != null: "+(this.targetEntity != null));
            // console.log("evt.lpos: "+evt.lpos.toString()+",evt.wpos: "+evt.wpos.toString());
            let px:number = Math.abs(evt.lpos.x);
            let py:number = Math.abs(evt.lpos.y);
            let pz:number = Math.abs(evt.lpos.z);
            let flag:number = -1;
            if(px > py)
            {
                if(px < pz)
                {
                    // z axis
                    flag = 2;
                }
                else
                {
                    // x axis
                    flag = 0;
                }
            }
            else
            {
                if(py < pz)
                {
                    // z axis
                    flag = 2;
                }
                else
                {
                    // y axis
                    flag = 1;
                }
            }
            this.m_flag = flag;
            if(this.m_flag > -1)
            {
                switch(this.m_flag)
                {
                    case 0:
                        // x axis
                        this.m_axis_tv.setXYZ(1.0,0.0,0.0);
                        break;
                    case 1:
                        // y axis
                        this.m_axis_tv.setXYZ(0.0,1.0,0.0);
                        break;
                    case 2:
                        // z axis
                        this.m_axis_tv.setXYZ(0.0,0.0,1.0);        
                        break;
                    default:
                        break;        
                }
            }
            // console.log("AxisCtrlObj::mouseDownListener(). this.m_flag: "+this.m_flag);
            this.calcClosePos(evt.raypv,evt.raytv);
            this.m_initV.copyFrom( this.m_outV );
            this.getPosition(this.m_initPos);            
        }
    }
}
}
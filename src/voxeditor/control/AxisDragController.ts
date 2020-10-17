
import * as Vector3DT from "../../vox/geom/Vector3";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as LineT from "../../vox/geom/Line";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import StraightLine = LineT.vox.geom.StraightLine;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;

export namespace voxeditor
{
    export namespace control
    {
        export class AxisDragController
        {
            private m_axis_pv:Vector3D = new Vector3D();
            private m_axis_tv:Vector3D = new Vector3D();
            private m_initPos:Vector3D = new Vector3D();
            private m_pos:Vector3D = new Vector3D();
            private m_dv:Vector3D = new Vector3D();
            private m_outV:Vector3D = new Vector3D();
            private m_initV:Vector3D = new Vector3D();
            private m_flag:number = -1;

            targetEntity:DisplayEntity = null;
            constructor()
            {
            }
            private calcClosePos(rpv:Vector3D,rtv:Vector3D):void
            {
                let mat4:Matrix4 = this.targetEntity.getTransform().getInvMatrix();
                mat4.transformVector3Self(rpv);
                mat4.deltaTransformVectorSelf(rtv);                
                StraightLine.CalcTwoSLCloseV2(rpv,rtv, this.m_axis_pv,this.m_axis_tv,this.m_outV);
                mat4 = this.targetEntity.getTransform().getMatrix();
                mat4.transformVector3Self(this.m_outV);
            }
            public updateDrag(rpv:Vector3D,rtv:Vector3D):void
            {
                this.calcClosePos(rpv,rtv);
                this.m_dv.copyFrom(this.m_outV);
                this.m_dv.subtractBy(this.m_initV);
                this.m_pos.copyFrom(this.m_initPos);
                this.m_pos.addBy(this.m_dv);
                if(this.targetEntity != null)
                {
                    this.targetEntity.setPosition(this.m_pos);
                    this.targetEntity.update();
                }
            }
            public dragBegin(lpos:Vector3D,rpv:Vector3D,rtv:Vector3D):void
            {
                let px:number = Math.abs(lpos.x);
                let py:number = Math.abs(lpos.y);
                let pz:number = Math.abs(lpos.z);
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
                this.calcClosePos(rpv,rtv);
                this.m_initV.copyFrom( this.m_outV );
                if(this.targetEntity != null)
                {
                    this.targetEntity.getPosition(this.m_initPos);
                }
            }
            public getPosition():Vector3D
            {
                return this.m_pos;
            }
        }
    }
}
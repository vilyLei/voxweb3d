
import * as Vector3DT from "../../vox/geom/Vector3";
import * as PlaneT from "../../vox/geom/Plane";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Plane = PlaneT.vox.geom.Plane;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;

export namespace voxeditor
{
    export namespace control
    {
        export class PlaneDragController
        {
            private m_initPos:Vector3D = new Vector3D();
            private m_pos:Vector3D = new Vector3D();
            private m_dv:Vector3D = new Vector3D();
            private m_outV:Vector3D = new Vector3D();
            private m_initV:Vector3D = new Vector3D();

            private m_planeNV:Vector3D = new Vector3D();
            private m_planeDis:number = 0.0;

            targetEntity:DisplayEntity = null;
            constructor()
            {
            }
            private calcClosePos(rpv:Vector3D,rtv:Vector3D):void
            {
                Plane.IntersectionSLV2(this.m_planeNV, this.m_planeDis,rpv,rtv,this.m_outV);
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
            public dragBegin(planeNV:Vector3D,planeDis:number,rpv:Vector3D,rtv:Vector3D):void
            {
                this.m_planeNV.copyFrom(planeNV);
                this.m_planeDis = planeDis;
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
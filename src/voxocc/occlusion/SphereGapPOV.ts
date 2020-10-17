
import * as Vector3DT from "../../vox/geom/Vector3";
import * as LineT from "../../vox/geom/Line";
import * as AABBT from "../../vox/geom/AABB";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as ISpacePOCT from "../../vox/scene/occlusion/ISpacePOV";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import StraightLine = LineT.vox.geom.StraightLine;
import AABB = AABBT.vox.geom.AABB;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import ISpacePOV = ISpacePOCT.vox.scene.occlusion.ISpacePOV;
export namespace voxocc
{
    export namespace occlusion
    {
        
        // 一般和别的 凸体pov等 结合使用, 一般用于产生 交集
        export class SphereGapPOV implements ISpacePOV
        {
            constructor()
            {
            }
            private m_centerv:Vector3D = new Vector3D();
            private m_pv:Vector3D = new Vector3D();
            private m_occTV:Vector3D = new Vector3D();
            private m_camPv:Vector3D = null;
            private m_occDis:number = 0.0;
            private m_occRadiusK:number = 0.0;
            public occRadius:number = 300.0;
            
            public enabled:boolean = true;
            public status:number = 0;
            setCamPosition(pv:Vector3D):void
            {
                this.m_camPv = pv;
            }
            setPosition(pov:Vector3D):void
            {
                this.m_centerv.copyFrom(pov);
            }
            updateOccData():void
            {
            }
            getOccRadius():number
            {
                return this.m_occDis;
            }
            getOccCenter():Vector3D
            {
                return this.m_centerv;
            }
            addSubPov(pov:ISpacePOV):void
            {
            }
            cameraTest(camera:CameraBase):void
            {
                this.status = 0;
                if(camera.visiTestSphere2(this.m_centerv, this.occRadius))
                {
                    this.status = 1;
                }
            }
            begin():void
            {
                this.m_occTV.copyFrom(this.m_centerv);
                this.m_occTV.subtractBy(this.m_camPv);
                let pv:Vector3D = this.m_occTV;
                this.m_occDis = Math.sqrt(pv.x*pv.x + pv.y*pv.y + pv.z*pv.z);
                pv.x /= this.m_occDis;
                pv.y /= this.m_occDis;
                pv.z /= this.m_occDis;
                this.m_occRadiusK = this.occRadius / this.m_occDis;
            }
            test(bounds:AABB,cullMask:number):void
            {
                this.m_pv.copyFrom(bounds.center);
                this.m_pv.subtractBy(this.m_camPv);
                this.m_pv.w = bounds.radius + this.m_occRadiusK * this.m_occTV.dotProduct(this.m_pv);
                if(StraightLine.CalcPVDis(this.m_occTV,this.m_camPv,bounds.center) < this.m_pv.w)
                {
                    this.status = 0;
                }
                else
                {
                    this.status = 1;
                }
            }
        }
    }
}

import * as Vector3DT from "../../vox/geom/Vector3";
import * as MathConstT from "../../vox/utils/MathConst";
import * as LineT from "../../vox/geom/Line";
import * as AABBT from "../../vox/geom/AABB";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as ISpacePOCT from "../../vox/scene/occlusion/ISpacePOV";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import MathConst = MathConstT.vox.utils.MathConst;
import StraightLine = LineT.vox.geom.StraightLine;
import AABB = AABBT.vox.geom.AABB;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import ISpacePOV = ISpacePOCT.vox.scene.occlusion.ISpacePOV;
export namespace voxocc
{
    export namespace occlusion
    {
        
        export class SpherePOV implements ISpacePOV
        {
            constructor()
            {
            }
            private m_subPovs:ISpacePOV[] = null;
            private m_subPovsTotal:number = 0;
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
                return this.occRadius;
            }
            getOccCenter():Vector3D
            {
                return this.m_centerv;
            }
            addSubPov(pov:ISpacePOV):void
            {
                if(pov != null && pov != this)
                {
                    if(this.m_subPovs == null)
                    {
                        this.m_subPovs = [];
                    }
                    this.m_subPovs.push(pov);
                    ++this.m_subPovsTotal;
                }
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
                
                if(this.m_subPovsTotal > 0)
                {
                    for(let i:number = 0; i < this.m_subPovsTotal; ++i)
                    {
                        this.m_subPovs[i].begin();
                    }
                }
            }
            test(bounds:AABB,cullMask:number):void
            {
                //  this.m_pv.copyFrom(bounds.center);
                //  this.m_pv.subtractBy(this.m_camPv);
                //  let dis:number = this.m_occTV.dotProduct(this.m_pv);
                this.status = 0;
                this.m_pv.copyFrom(bounds.center);
                this.m_pv.subtractBy(this.m_centerv);
                let dis:number = this.m_occTV.dotProduct(this.m_pv);
                if(dis > MathConst.MATH_MIN_POSITIVE)
                {
                    this.m_pv.copyFrom(bounds.center);
                    this.m_pv.subtractBy(this.m_camPv);
                    dis = this.m_occTV.dotProduct(this.m_pv);
                    //  dis = this.m_occTV.dotProduct(this.m_pv);
                    //  //if((dis - this.m_occDis) > bounds.radius)
                    //  //{
                    //      //let por:number = this.m_occRadiusK * dis;
                    //      //dis = StraightLine.CalcPVDis(this.m_occTV,this.m_camPv,bounds.center) + bounds.radius;
                    //      //if(dis < por)
                    //      //if((StraightLine.CalcPVDis(this.m_occTV,this.m_camPv,bounds.center) + bounds.radius) < (this.m_occRadiusK * dis))
                    //      //{
                    //      //    this.status = 1;
                    //      //}
                    //  //}
                    if((StraightLine.CalcPVDis(this.m_occTV,this.m_camPv,bounds.center) + bounds.radius) < (this.m_occRadiusK * dis))
                    {
                        this.status = 1;
                    }
                }
                else
                {
                    dis = Vector3D.Distance(bounds.center, this.m_centerv);
                    if((dis + bounds.radius) < this.occRadius)
                    {
                        this.status = 1;                        
                    }
                }
                
                if(this.m_subPovsTotal > 0 && this.status == 1)
                {
                    for(let i:number = 0; i < this.m_subPovsTotal; ++i)
                    {
                        this.m_subPovs[i].test(bounds,cullMask);
                        if(this.m_subPovs[i].status != 1)
                        {
                            this.status = 0;
                            break;
                        }
                    }
                }
                
            }
        }
    }
}

import * as Vector3DT from "../..//vox/math/Vector3D";
import * as AABBT from "../../vox/geom/AABB";
import * as PlaneT from "../../vox/geom/Plane";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as ISpacePOCT from "../../vox/scene/occlusion/ISpacePOV";
import * as SphHoleOccObjT from './SphereGapPOV';
import * as QuadGapOccObjT from './QuadGapPOV';

import Vector3D = Vector3DT.vox.math.Vector3D;
import AABB = AABBT.vox.geom.AABB;
import Plane = PlaneT.vox.geom.Plane;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import ISpacePOV = ISpacePOCT.vox.scene.occlusion.ISpacePOV;
import SphereGapPOV = SphHoleOccObjT.voxocc.occlusion.SphereGapPOV;
import QuadGapPOV = QuadGapOccObjT.voxocc.occlusion.QuadGapPOV;
export namespace voxocc
{
    export namespace occlusion
    {
        // 一般和别的 凸体pov等 结合使用, 一般用于产生 交集
        export class QuadHolePOV implements ISpacePOV
        {
            constructor()
            {
            }
            private m_subPovs:ISpacePOV[] = null;
            private m_subPovsTotal:number = 0;
            private m_sphOcc:SphereGapPOV = new SphereGapPOV();
            private m_qgPOV0:QuadGapPOV = new QuadGapPOV();
            private m_qgPOV1:QuadGapPOV = new QuadGapPOV();

            private m_pvList:Vector3D[] = [
                new Vector3D,new Vector3D,new Vector3D,new Vector3D
                ,new Vector3D,new Vector3D,new Vector3D,new Vector3D
            ];
            private m_centerv:Vector3D = new Vector3D();
            private m_pv:Vector3D = new Vector3D();
            private m_nv0:Vector3D = new Vector3D();
            private m_nv1:Vector3D = new Vector3D();
            private m_dis0:number = 0.0;
            private m_dis1:number = 0.0;
            private m_planePv0:Vector3D = new Vector3D();
            private m_planePv1:Vector3D = new Vector3D();
            private m_camPv:Vector3D = null;
            
            public enabled:boolean = true;
            public status:number = 0;

            setCamPosition(pv:Vector3D):void
            {
                this.m_camPv = pv;
                this.m_sphOcc.setCamPosition(pv);
                this.m_qgPOV0.setCamPosition(pv);
                this.m_qgPOV1.setCamPosition(pv);
                
            }
            setParamFromeBoxFaceZ(minV:Vector3D,maxV:Vector3D):Vector3D[]
            {
                //let list:Vector3D[] = [
                //    new Vector3D(minV.x,minV.y,minV.z), new Vector3D(minV.x,maxV.y,minV.z), 
                //    new Vector3D(maxV.x,maxV.y,minV.z),new Vector3D(maxV.x,minV.y,minV.z),
                //    
                //    new Vector3D(minV.x,minV.y,maxV.z), new Vector3D(minV.x,maxV.y,maxV.z), 
                //    new Vector3D(maxV.x,maxV.y,maxV.z),new Vector3D(maxV.x,minV.y,maxV.z)
                //
                //]

                let list:Vector3D[] = this.m_pvList;
                list[0].setXYZ(minV.x,minV.y,minV.z);list[1].setXYZ(minV.x,maxV.y,minV.z);
                list[2].setXYZ(maxV.x,maxV.y,minV.z);list[3].setXYZ(maxV.x,minV.y,minV.z);                
                list[4].setXYZ(minV.x,minV.y,maxV.z);list[5].setXYZ(minV.x,maxV.y,maxV.z);
                list[6].setXYZ(maxV.x,maxV.y,maxV.z);list[7].setXYZ(maxV.x,minV.y,maxV.z);
                
                this.m_qgPOV0.setParam(this.m_pvList[0],this.m_pvList[1],this.m_pvList[2],this.m_pvList[3]);
                this.m_qgPOV1.setParam(this.m_pvList[4],this.m_pvList[5],this.m_pvList[6],this.m_pvList[7]);

                //this.setParam(list[0],list[1],list[2],list[3],list[4],list[5],list[6],list[7]);
                return list;
            }
            setParamFromeBoxFaceX(minV:Vector3D,maxV:Vector3D):Vector3D[]
            {
                //  let list:Vector3D[] = [
                //      new Vector3D(minV.x,minV.y,minV.z), new Vector3D(minV.x,maxV.y,minV.z), 
                //      new Vector3D(minV.x,maxV.y,maxV.z),new Vector3D(minV.x,minV.y,maxV.z),
                //      
                //      new Vector3D(maxV.x,minV.y,minV.z), new Vector3D(maxV.x,maxV.y,minV.z), 
                //      new Vector3D(maxV.x,maxV.y,maxV.z),new Vector3D(maxV.x,minV.y,maxV.z)
                //  
                //  ]
                
                let list:Vector3D[] = this.m_pvList;
                //list[].setXYZ
                list[0].setXYZ(minV.x,minV.y,minV.z);list[1].setXYZ(minV.x,maxV.y,minV.z);
                list[2].setXYZ(minV.x,maxV.y,maxV.z);list[3].setXYZ(minV.x,minV.y,maxV.z);
                list[4].setXYZ(maxV.x,minV.y,minV.z);list[5].setXYZ(maxV.x,maxV.y,minV.z);
                list[6].setXYZ(maxV.x,maxV.y,maxV.z);list[7].setXYZ(maxV.x,minV.y,maxV.z);
                //this.setParam(list[0],list[1],list[2],list[3],list[4],list[5],list[6],list[7]);
                this.m_qgPOV0.setParam(this.m_pvList[0],this.m_pvList[1],this.m_pvList[2],this.m_pvList[3]);
                this.m_qgPOV1.setParam(this.m_pvList[4],this.m_pvList[5],this.m_pvList[6],this.m_pvList[7]);
                return list;
            }
            setParam(va0:Vector3D,vb0:Vector3D,vc0:Vector3D,vd0:Vector3D,va1:Vector3D,vb1:Vector3D,vc1:Vector3D,vd1:Vector3D):void
            {
                this.m_pvList[0].copyFrom(va0);
                this.m_pvList[1].copyFrom(vb0);
                this.m_pvList[2].copyFrom(vc0);
                this.m_pvList[3].copyFrom(vd0);
                this.m_pvList[4].copyFrom(va1);
                this.m_pvList[5].copyFrom(vb1);
                this.m_pvList[6].copyFrom(vc1);
                this.m_pvList[7].copyFrom(vd1);
                this.m_qgPOV0.setParam(this.m_pvList[0],this.m_pvList[1],this.m_pvList[2],this.m_pvList[3]);
                this.m_qgPOV1.setParam(this.m_pvList[4],this.m_pvList[5],this.m_pvList[6],this.m_pvList[7]);
            }
            updateOccData():void
            {
                this.m_qgPOV0.updateOccData();
                this.m_qgPOV1.updateOccData();

                Vector3D.CrossSubtract(this.m_pvList[0],this.m_pvList[1],this.m_pvList[0],this.m_pvList[3], this.m_nv0);
                Vector3D.CrossSubtract(this.m_pvList[4],this.m_pvList[5],this.m_pvList[4],this.m_pvList[7], this.m_nv1);

                this.m_planePv0.copyFrom(this.m_pvList[0]);
                this.m_planePv0.addBy(this.m_pvList[1]);
                this.m_planePv0.addBy(this.m_pvList[2]);
                this.m_planePv0.addBy(this.m_pvList[3]);
                this.m_planePv0.scaleBy(0.25);

                this.m_planePv1.copyFrom(this.m_pvList[4]);
                this.m_planePv1.addBy(this.m_pvList[5]);
                this.m_planePv1.addBy(this.m_pvList[6]);
                this.m_planePv1.addBy(this.m_pvList[7]);
                this.m_planePv1.scaleBy(0.25);
                this.m_pv.copyFrom(this.m_planePv1);
                this.m_pv.subtractBy(this.m_planePv0);
                // 计算this.m_qgPOV0 所对应的平面的外面正空间的指向法线
                if(this.m_pv.dot(this.m_nv0) > 0.0)
                {
                    this.m_nv0.scaleBy(-1.0);
                }
                // 计算this.m_qgPOV1 所对应的平面的外面正空间的指向法线
                if(this.m_pv.dot(this.m_nv1) < 0.0)
                {
                    this.m_nv1.scaleBy(-1.0);
                }
                this.m_nv0.normalize();
                this.m_nv1.normalize();

                this.m_dis0 = this.m_nv0.dot(this.m_planePv0);
                this.m_dis1 = this.m_nv1.dot(this.m_planePv1);

                /*
                this.m_centerv.copyFrom(va0);
                this.m_centerv.addBy(vb0);
                this.m_centerv.addBy(vc0);
                this.m_centerv.addBy(vd0);
                this.m_centerv.addBy(va1);
                this.m_centerv.addBy(vb1);
                this.m_centerv.addBy(vc1);
                this.m_centerv.addBy(vd1);
                this.m_centerv.scaleBy(0.125);

                this.m_pvList[0] = va0;
                this.m_pvList[1] = vb0;
                this.m_pvList[2] = vc0;
                this.m_pvList[3] = vd0;
                this.m_pvList[4] = va1;
                this.m_pvList[5] = vb1;
                this.m_pvList[6] = vc1;
                this.m_pvList[7] = vd1;
                //*/
                this.m_centerv.copyFrom(this.m_pvList[0]);
                this.m_centerv.addBy(this.m_pvList[1]);
                this.m_centerv.addBy(this.m_pvList[2]);
                this.m_centerv.addBy(this.m_pvList[3]);
                this.m_centerv.addBy(this.m_pvList[4]);
                this.m_centerv.addBy(this.m_pvList[5]);
                this.m_centerv.addBy(this.m_pvList[6]);
                this.m_centerv.addBy(this.m_pvList[7]);
                this.m_centerv.scaleBy(0.125);


                this.m_sphOcc.setPosition(this.m_centerv);
                this.m_sphOcc.occRadius = 0.0;                
                for(let i:number = 0; i < 8; ++i)
                {
                    this.m_pv.copyFrom(this.m_pvList[i]);
                    this.m_pv.subtractBy(this.m_centerv);
                    this.m_pv.w = this.m_pv.getLength();
                    if(this.m_pv.w > this.m_sphOcc.occRadius)
                    {
                        this.m_sphOcc.occRadius = this.m_pv.w;
                    }
                }
            }

            getOccRadius():number
            {
                return this.m_sphOcc.occRadius;
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
                this.m_sphOcc.cameraTest(camera);
                this.status = this.m_sphOcc.status;
            }
            begin():void
            {
                // 检测自身是否被摄像机可见
                this.m_qgPOV0.begin();
                this.m_qgPOV1.begin();
                this.m_sphOcc.begin();
                
                this.m_pv.copyFrom(this.m_planePv0);
                this.m_pv.subtractBy(this.m_camPv);
                this.m_pv.normalize();
                this.m_pv.w = this.m_pv.dot(this.m_nv0);

                this.m_pv.copyFrom(this.m_planePv1);
                this.m_pv.subtractBy(this.m_camPv);
                this.m_pv.normalize();
                this.m_pv.x = this.m_pv.dot(this.m_nv1);

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
                if(this.m_pv.w * this.m_pv.x < 0.0)
                {
                    this.m_sphOcc.test(bounds,cullMask);
                    this.status = this.m_sphOcc.status;
                    if(this.status == 0)
                    {
                        this.status = 1;
                        // 集合的交集
                        this.m_qgPOV0.test(bounds,cullMask);
                        this.m_qgPOV1.test(bounds,cullMask);
                        
                        if((this.m_qgPOV0.status + this.m_qgPOV1.status) < 1)
                        {
                            this.status = 0;
                        }
                        else
                        {
                            //this.m_nv0.
                            if(this.m_pv.w < 0.0)
                            {
                                // 近面是 m_qgPOV0
                                if(this.m_qgPOV0.status < 1)
                                {
                                    // 近面的 gap 可见, 判断是否与当前的 远面 的负空间相交
                                    Plane.PlaneIntersectSphere(this.m_nv1,this.m_dis1, bounds.center,bounds.radius);
                                    if(Plane.IntersectBoo || Plane.IntersectSatus < 0)
                                    {
                                        this.status = 0;
                                    }
                                }
                            }
                            else
                            {
                                // 近面是 m_qgPOV1
                                if(this.m_qgPOV1.status < 1)
                                {
                                    // 近面的 gap 可见, 判断是否与当前的 远面 的负空间相交
                                    Plane.PlaneIntersectSphere(this.m_nv0,this.m_dis0, bounds.center,bounds.radius);
                                    if(Plane.IntersectBoo || Plane.IntersectSatus < 0)
                                    {
                                        this.status = 0;
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    this.status = 1;
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
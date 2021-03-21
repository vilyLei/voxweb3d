/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3DT from "../../vox/math/Vector3D";
import * as VelocityXZModuleT from "../../voxmotion/primitive/VelocityXZModule";
import * as IEntityTransformT from "../../vox/entity/IEntityTransform";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import VelocityXZModule = VelocityXZModuleT.voxmotion.primitive.VelocityXZModule;
import IEntityTransform = IEntityTransformT.vox.entity.IEntityTransform;

export namespace voxmotion
{
    export namespace primitive
    {
        export class DirectXZModule
        {
            private m_dstPos:Vector3D = new Vector3D();
            private m_pos:Vector3D = new Vector3D();
            private m_currPos:Vector3D = new Vector3D();
            private m_velModule:VelocityXZModule = new VelocityXZModule();
            private m_target:IEntityTransform = null;
            private m_moving:boolean = true;
            syncTargetUpdate:boolean = true;
            constructor(){}
            setVelocityFactor(oldVelocityFactor:number, newVelocityFactor:number):void
            {
                this.m_velModule.setFactor(oldVelocityFactor,newVelocityFactor);
            }
            bindTarget(target:IEntityTransform):void
            {
                this.m_target = target;
            }
            toXZ(px:number,pz:number):void
            {
                this.m_dstPos.x = px;
                this.m_dstPos.z = pz;
                this.m_velModule.setDirecXZ(px - this.m_currPos.x, pz - this.m_currPos.z);
                this.m_moving = true;
            }
            isMoving():boolean
            {
                return this.m_moving;
            }
            private m_velocityFlag:boolean = true;
            getVelocity():Vector3D
            {
                return this.m_velModule.spdv;
            }
            /**
             * 只有再 isMoving() 返回为 true 的时候才能单独调用
             */
            calcVelocity():void
            {
                this.m_velModule.updateDirecXZ(this.m_dstPos.x - this.m_currPos.x, this.m_dstPos.z - this.m_currPos.z);
                this.m_velModule.run();
                this.m_velocityFlag = false;
            }
            run():void
            {
                if(this.m_moving && this.m_target != null)
                {
                    this.updatePos();
                }
            }
            private updatePos():void
            {
                if(this.m_velocityFlag)
                {
                    this.calcVelocity();
                }
                this.m_velocityFlag = true;
                let spdv:Vector3D = this.m_velModule.spdv;

                this.m_pos.subVecsTo(this.m_currPos, this.m_dstPos);
                let squaredDis:number = this.m_pos.getLengthSquared();
                let ang:number = MathConst.GetAngleByXY(spdv.x,-spdv.z);
                if(spdv.getLengthSquared() < squaredDis)
                {
                    this.m_pos.addVecsTo(this.m_currPos,spdv);
                    this.m_pos.subtractBy(this.m_dstPos);
                    this.m_currPos.addVecsTo(this.m_currPos,spdv);
                }
                else
                {
                    this.m_currPos.copyFrom(this.m_dstPos);
                    this.m_moving = false;
                }
                
                this.m_target.setPosition( this.m_currPos );
                this.m_target.setRotationXYZ(0.0,ang,0.0);

                if(this.syncTargetUpdate)
                {
                    this.m_target.update();
                }
            }
        }
    }
}
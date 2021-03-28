/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";
import * as Matrix4T from "../../vox/math/Matrix4";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as DirecUnitT from "../../app/robot/DirecUnit";

import Vector3D = Vector3T.vox.math.Vector3D;
import Matrix4 = Matrix4T.vox.math.Matrix4;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import DirecUnit = DirecUnitT.app.robot.DirecUnit;

export namespace app
{
    export namespace robot
    {
        export class CoreFrameAxis
        {
            private m_engityCore:DisplayEntity = null;
            private m_entityTG:DisplayEntity = null;
            private m_entityBGL:DisplayEntity = null;
            private m_entityBGR:DisplayEntity = null;
            private m_entitySGL:DisplayEntity = null;
            private m_entitySGR:DisplayEntity = null;
            private m_centerPos:Vector3D = new Vector3D();
            private m_halfSize:Vector3D = new Vector3D();
            private m_direc:DirecUnit = new DirecUnit();
            private m_halfWidth:number = 32.0;
            private m_bgLong:number = 32.0;
            private m_angScale:number = 0.6;

            private m_angleL:number = 0.0;
            private m_angleR:number = 0.0;

            
            private m_posV:Vector3D = new Vector3D();

            private m_tgPos:Vector3D = new Vector3D();
            private m_tgAngle:number = 20.0;
            private m_coreAngle:number = 25.0;
            private m_bgAngle:number = 30.0;
            private m_bgOffsetAngle:number = 10.0;
            private m_bgAngleDirec:number = 1.0;
            private m_sgAngle:number = 40.0;
            private m_sgOffsetAngle:number = 20.0;
            private m_sgAngleDirec:number = 1.0;

            private m_coreMatrix4:Matrix4 = null;//new Matrix4();
            
            constructor(){}

            setCoreAngle(angle:number):void
            {
                this.m_coreAngle = angle;
            }
            setBgAngle(angle:number, OffsetAngle:number,angleDirec:number):void
            {
                this.m_bgAngle = angle;
                this.m_bgOffsetAngle = OffsetAngle;
                this.m_bgAngleDirec = angleDirec > 0.0 ? 1.0:-1.0;
            }
            setSgOffsetAngle(angle:number, OffsetAngle:number,angleDirec:number):void
            {
                this.m_sgAngle = angle;
                this.m_sgOffsetAngle = OffsetAngle;
                this.m_sgAngleDirec = angleDirec > 0.0 ? 1.0:-1.0;
            }
            setAngleDirec(bgAngleDirec:number,sgAngleDirec:number):void
            {
                this.m_bgAngleDirec = bgAngleDirec > 0.0 ? 1.0:-1.0;
                this.m_sgAngleDirec = sgAngleDirec > 0.0 ? 1.0:-1.0;
            }
            toPositive():void
            {
                this.m_direc.toPositive();
            }
            toNegative():void
            {
                this.m_direc.toNegative();
            }
            setDuration(duration:number):void
            {
                this.m_direc.duration = duration;
            }            
            getDuration():number
            {
                return this.m_direc.duration;
            }
            setTG(tg:DisplayEntity,tgAngle:number,offsetPosition:Vector3D):void
            {
                this.m_entityTG = tg;
                this.m_tgAngle = tgAngle;
                //this.m_tgPos.copyFrom(offsetPosition);
            }
            setBG(bgL:DisplayEntity,bgR:DisplayEntity,bgLong:number):void
            {
                this.m_entityBGL = bgL;
                this.m_entityBGR = bgR;
                this.m_bgLong = bgLong;
            }
            setSG(sgL:DisplayEntity,sgR:DisplayEntity,):void
            {
                this.m_entitySGL = sgL;
                this.m_entitySGR = sgR;
            }
            initialize(coreEntity:DisplayEntity,coreCenterPos:Vector3D,halfWidth:number):void
            {
                if(this.m_engityCore == null && coreEntity != null)
                {
                    this.m_engityCore = coreEntity;
                    this.m_centerPos.copyFrom(coreCenterPos);
                    this.m_engityCore.setPosition(coreCenterPos);
                    this.m_halfWidth = halfWidth;
                    this.m_halfSize.x = halfWidth;
                    this.m_direc.initialize();

                    this.m_engityCore.update();
                    this.m_coreMatrix4 = this.m_engityCore.getToParentMatrix();
                }
            }
            
            getBiasTime():number
            {
                return this.m_direc.getBiasTime();
            }
            getOriginTime():number
            {
                return this.m_direc.getOriginTime();
            }
            getNextOriginTime(time:number):number
            {
                return this.m_direc.getNextOriginTime(time);
            }
            resetPose():void
            {
                let scale:number = this.m_angScale;
                this.m_angScale = 0.0;
                this.m_direc.factor = 0.0;
                this.m_direc.reset();
                this.run(0.0);
                this.m_angScale = scale;
                this.m_direc.factor = 0.0;
            }
            run(time:number):void
            {
                this.m_direc.calc(time);
                //console.log("direc.factor: "+this.m_direc.factor);
                let factor:number = this.m_direc.factor;
                let scale:number = this.m_angScale;
                //let coreAngle:number = factor * this.m_coreAngle * scale;
                let bgAngle:number = factor * this.m_bgAngle * scale;
                let bgOffsetAngle:number = this.m_bgOffsetAngle * scale;

                this.m_angleL = -bgAngle + bgOffsetAngle;
                this.m_angleR = bgAngle + bgOffsetAngle;

                if(this.m_entityTG != null)
                {
                    this.m_engityCore.setRotationXYZ(0.0, factor * this.m_tgAngle * scale, 0.0);
                    this.m_engityCore.update();
                }
                this.m_engityCore.setRotationXYZ(0.0, factor * this.m_coreAngle * scale, 0.0);
                this.m_engityCore.update();

                this.m_posV.setXYZ(0.0,0.0, -this.m_halfWidth);
                //  this.m_engityCore.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_coreMatrix4.transformVector3Self(this.m_posV);
                this.m_entityBGL.setPosition(this.m_posV);
                this.m_entityBGL.setRotationXYZ(0.0,0.0,this.m_angleL);
                this.m_entityBGL.update();

                this.m_posV.setXYZ(0.0,0.0, this.m_halfWidth);
                //  this.m_engityCore.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_coreMatrix4.transformVector3Self(this.m_posV);
                this.m_entityBGR.setPosition(this.m_posV);
                this.m_entityBGR.setRotationXYZ(0.0,0.0,this.m_angleR);
                this.m_entityBGR.update();
                
                this.runPart();
            }
            private runPart():void
            {
                let factor:number = this.m_sgAngleDirec * this.m_direc.factor;
                let scale:number = this.m_sgAngleDirec * this.m_angScale;

                let sgAngle:number = factor * this.m_sgAngle * scale;
                let sgOffsetAngle:number = this.m_sgOffsetAngle * scale;
                //  let kfL:number = ((factor + 0.5)) - 0.3;
                //  let kfR:number = (1.0 - (factor + 0.5)) - 0.3;
                
                //console.log("factor, angleL,angleR: ",factor,angleL,angleR);
                this.m_angleL -= sgAngle + sgOffsetAngle;
                //angleL -= scale * (kfL * 20.0 + 10);
                this.m_posV.setXYZ(0.0, this.m_bgLong, 0.0);
                this.m_entityBGL.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_entitySGL.setPosition(this.m_posV);
                this.m_entitySGL.setRotationXYZ(0.0, 0.0, this.m_angleL);
                this.m_entitySGL.update();
                this.m_angleR -= -sgAngle + sgOffsetAngle;
                //angleR -= scale * (kfR * 20.0 + 10);
                this.m_posV.setXYZ(0.0, this.m_bgLong, 0.0);
                this.m_entityBGR.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_entitySGR.setPosition(this.m_posV);
                this.m_entitySGR.setRotationXYZ(0.0, 0.0, this.m_angleR);
                this.m_entitySGR.update();
            }
        }        
    }
}
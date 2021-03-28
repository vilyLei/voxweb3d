/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as DirecUnitT from "../../app/robot/DirecUnit";

import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import DirecUnit = DirecUnitT.app.robot.DirecUnit;

export namespace app
{
    export namespace robot
    {
        export class CoreFrameAxis
        {
            private m_engityCore:DisplayEntity = null;
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
            constructor(){}

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
            initialize(entity:DisplayEntity,centerPos:Vector3D,halfWidth:number):void
            {
                if(this.m_engityCore == null)
                {
                    this.m_engityCore = entity;
                    this.m_centerPos.copyFrom(centerPos);
                    this.m_engityCore.setPosition(centerPos);
                    this.m_halfWidth = halfWidth;
                    this.m_halfSize.x = halfWidth;
                    this.m_direc.initialize();
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
            private m_posV:Vector3D = new Vector3D();
            run(time:number):void
            {
                this.m_direc.calc(time);
                //console.log("direc.factor: "+this.m_direc.factor);
                let factor:number = this.m_direc.factor;
                let scale:number = this.m_angScale;
                let coreAngle:number = 30.0 * scale;
                let bgAngle:number = factor * 30.0 * scale;
                let bgOffsetAngle:number = 10.0 * scale;
                let sgAngle:number = factor * 40.0 * scale;
                let sgOffsetAngle:number = 20.0 * scale;

                this.m_angleL = -bgAngle + bgOffsetAngle;
                this.m_angleR = bgAngle + bgOffsetAngle;

                this.m_engityCore.setRotationXYZ(0.0, coreAngle * factor, 0.0);
                this.m_engityCore.update();

                this.m_posV.setXYZ(0.0,0.0, -this.m_halfWidth);
                this.m_engityCore.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_entityBGL.setPosition(this.m_posV);
                this.m_entityBGL.setRotationXYZ(0.0,0.0,this.m_angleL);
                this.m_entityBGL.update();

                this.m_posV.setXYZ(0.0,0.0, this.m_halfWidth);
                this.m_engityCore.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_entityBGR.setPosition(this.m_posV);
                this.m_entityBGR.setRotationXYZ(0.0,0.0,this.m_angleR);
                this.m_entityBGR.update();
                
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
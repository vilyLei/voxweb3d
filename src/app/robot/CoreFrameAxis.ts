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

                }
            }
            
            getInitedTime():number
            {
                return this.m_direc.getInitedTime();
            }
            resetPose():void
            {
                //let scale:number = this.m_angScale;
                //this.m_angScale = 0.0;
                this.m_direc.reset();
                this.m_direc.factor = 0.0;
                this.run(0.0);
                this.m_direc.factor = 0.0;
                //this.m_angScale = scale;
            }
            private m_posV:Vector3D = new Vector3D();
            run(time:number):void
            {
                let factor:number = this.m_direc.factor;
                let scale:number = this.m_angScale;
                let coreAngle:number = 30.0 * scale;
                let bgAngle:number = factor * 30.0 * scale;
                let bgOffsetAngle:number = 10.0 * scale;
                let sgAngle:number = factor * 40.0 * scale;
                let sgOffsetAngle:number = 20.0 * scale;

                let angleL:number = -bgAngle + bgOffsetAngle;
                let angleR:number = bgAngle + bgOffsetAngle;

                this.m_direc.calc(time);
                this.m_engityCore.setRotationXYZ(0.0, coreAngle * factor, 0.0);
                this.m_engityCore.update();

                this.m_posV.setXYZ(0.0,0.0, -this.m_halfWidth);
                this.m_engityCore.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_entityBGL.setPosition(this.m_posV);
                //this.m_entityBGL.setRotationXYZ(0.0,0.0,this.m_direc.angle * -1.0 + 30.0);
                this.m_entityBGL.setRotationXYZ(0.0,0.0,angleL);
                this.m_entityBGL.update();

                this.m_posV.setXYZ(0.0,0.0, this.m_halfWidth);
                this.m_engityCore.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_entityBGR.setPosition(this.m_posV);
                //this.m_entityBGR.setRotationXYZ(0.0,0.0,this.m_direc.angle * 1.0 + 30.0);
                this.m_entityBGR.setRotationXYZ(0.0,0.0,angleR);
                this.m_entityBGR.update();
                
                angleL -= sgAngle + sgOffsetAngle;
                this.m_posV.setXYZ(0.0, this.m_bgLong, 0.0);
                this.m_entityBGL.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_entitySGL.setPosition(this.m_posV);
                //this.m_entitySGL.setRotationXYZ(0.0, 0.0, -30.0 - (this.m_direc.angle * -0.2));
                this.m_entitySGL.setRotationXYZ(0.0, 0.0, angleL);
                this.m_entitySGL.update();
                
                angleR -= -sgAngle + sgOffsetAngle;
                this.m_posV.setXYZ(0.0, this.m_bgLong, 0.0);
                this.m_entityBGR.getToParentMatrix().transformVector3Self(this.m_posV);
                this.m_entitySGR.setPosition(this.m_posV);
                //this.m_entitySGR.setRotationXYZ(0.0, 0.0, -30.0 - (this.m_direc.angle * 0.2));
                this.m_entitySGR.setRotationXYZ(0.0, 0.0, angleR);
                this.m_entitySGR.update();
                
            }
        }        
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";
import * as MathConstT from "../../vox/math/MathConst";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../../vox/entity/Axis3DEntity";
import * as DisplayEntityContainerT from "../../vox/entity/DisplayEntityContainer";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as ArmFrameAxisT from "../../app/robot/ArmFrameAxis";
import * as IPartStoreT from "../../app/robot/IPartStore";
import * as DegreeTweenT from "../../vox/utils/DegreeTween";

import Vector3D = Vector3T.vox.math.Vector3D;
import MathConst = MathConstT.vox.math.MathConst;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import ArmFrameAxis = ArmFrameAxisT.app.robot.ArmFrameAxis;
import IPartStore = IPartStoreT.app.robot.IPartStore;
import DegreeTween = DegreeTweenT.vox.utils.DegreeTween;

export namespace app
{
    export namespace robot
    {
        // arm
        export class TwoARbtModule
        {
            private m_sc:RendererScene = null;
            private m_time:number = 0;
            private m_attPos:Vector3D = new Vector3D();
            private m_pos:Vector3D = new Vector3D();
            private m_tempV:Vector3D = new Vector3D();

            private m_coreFAxis:ArmFrameAxis = new ArmFrameAxis();
            private m_container:DisplayEntityContainer = null;
            private m_containerL:DisplayEntityContainer = new DisplayEntityContainer();
            private m_containerR:DisplayEntityContainer = new DisplayEntityContainer();
            private m_degreeTween:DegreeTween = new DegreeTween();
            private m_partStore:IPartStore = null;
            
            private m_attackLock:boolean = false;
            private m_timeSpeed:number = 3.0;
            private m_nextTime:number = 0;
            private m_testAxis:Axis3DEntity;
            constructor(container:DisplayEntityContainer = null)
            {
                if(container == null)
                {
                    this.m_container = new DisplayEntityContainer();
                }
                else
                {
                    this.m_container = container;
                }
            }
            getContainer():DisplayEntityContainer
            {
                return this.m_container;
            }
            
            setVisible(boo:boolean):void
            {
                this.m_container.setVisible(boo);
            }
            getVisible():boolean
            {
                return this.m_container.getVisible();
            }
            setCoreAngle(angle:number):void
            {
                this.m_coreFAxis.setCoreAngle(angle);
            }
            setBgAngle(angle:number, OffsetAngle:number,angleDirec:number):void
            {
                this.m_coreFAxis.setBgAngle(angle,OffsetAngle,angleDirec);
            }
            setSgOffsetAngle(angle:number, OffsetAngle:number,angleDirec:number):void
            {
                this.m_coreFAxis.setSgOffsetAngle(angle,OffsetAngle,angleDirec);
            }
            setAngleDirec(bgAngleDirec:number,sgAngleDirec:number):void
            {
                this.m_coreFAxis.setAngleDirec(bgAngleDirec, sgAngleDirec);
            }
            toPositive():void
            {
                this.m_coreFAxis.toPositive();
            }
            toNegative():void
            {
                this.m_coreFAxis.toNegative();
            }
            setDuration(duration:number):void
            {
                this.m_coreFAxis.setDuration(duration);
            }
            getDuration():number
            {
                return this.m_coreFAxis.getDuration();
            }
            setRotationY(rotation:number):void
            {
                this.m_container.setRotationY(rotation);
            }
            setTime(time:number):void
            {
                this.m_time = time;
            }
            initialize(sc:RendererScene,renderProcessIndex:number,partStore:IPartStore = null,offsetPos:Vector3D = null):void
            {
                if(this.m_sc == null && partStore != null)
                {
                    this.m_timeSpeed = 3.0 * 0.7;
                    this.m_sc = sc;
                    this.m_partStore = partStore;
                    sc.addContainer(this.m_container,renderProcessIndex);

                    let halfW:number = partStore.getCoreWidth() * 0.5;

                    let coreEntity:DisplayEntity = partStore.getEngityCore();
                    let bgL:DisplayEntity = partStore.getEngityBGL();
                    let bgR:DisplayEntity = partStore.getEngityBGR();
                    let sgL:DisplayEntity = partStore.getEngitySGL();
                    let sgR:DisplayEntity = partStore.getEngitySGR();
                    this.m_container.addEntity(coreEntity);
                    this.m_container.addChild(this.m_containerL);
                    this.m_container.addChild(this.m_containerR);
                    this.m_containerL.setZ(-halfW);
                    this.m_containerR.setZ(halfW);
                    this.m_containerL.addEntity(bgL);
                    this.m_containerL.addEntity(sgL);
                    this.m_containerR.addEntity(bgR);
                    this.m_containerR.addEntity(sgR);

                    let axis:Axis3DEntity = new Axis3DEntity();
                    axis.initialize(30.0);
                    axis.setXYZ(100,130,0.0);
                    this.m_container.addEntity(axis);

                    this.m_testAxis = axis;

                    axis = new Axis3DEntity();
                    axis.initialize(200.0);
                    axis.setXYZ(0,30,0.0);
                    this.m_container.addEntity(axis);


                    let pv:Vector3D = new Vector3D();
                    pv.copyFrom(partStore.getCoreCenter());
                    if(offsetPos != null)
                    {
                        pv.addBy(offsetPos);
                    }
                    this.m_coreFAxis.initialize(coreEntity, pv, 0.0);
                    this.m_coreFAxis.setBG(bgL,bgR, partStore.getBGLong());
                    this.m_coreFAxis.setSG(sgL,sgR);

                    this.m_degreeTween.bindTarget(this.m_container);
                }
            }
            setXYZ(px:number,py:number,pz:number):void
            {
                this.m_container.setXYZ(px,py,pz);
            }
            setPosition(position:Vector3D):void
            {
                this.m_container.setPosition(position);
            }
            getPosition(position:Vector3D):void
            {
                this.m_container.getPosition(position);
            }
            setAttPos(position:Vector3D):void
            {
                this.m_attPos.copyFrom(position);
            }
            setAttPosXYZ(px:number,py:number,pz:number):void
            {
                this.m_attPos.setXYZ(px,py,pz);
            }
            getAttPos():Vector3D
            {
                return this.m_attPos;
            }
            getLEndPos(outV:Vector3D,k:number):void
            {
                this.m_coreFAxis.getLEndPos(outV,k);
                this.m_attackLock = false;
            }
            getREndPos(outV:Vector3D,k:number):void
            {
                this.m_coreFAxis.getREndPos(outV,k);
                this.m_attackLock = false;
            }
            isAttackLock():boolean
            {
                return this.m_attackLock;
            }
            private m_armDegree:number = 390.0;
            private updateAttPose():void
            {
                //console.log("A this.m_attPos: ",this.m_attPos);
                
                this.m_degreeTween.runRotYByDstPos(this.m_attPos);
                this.m_attackLock = this.m_degreeTween.isEnd();
                if(this.m_degreeTween.isDegreeChanged())
                {
                    this.m_container.update();
                }

                this.m_container.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
                this.m_tempV.y = 0.0;
                let kf:number = this.m_tempV.dot(Vector3D.X_AXIS);
                if(kf > 50.0)
                {
                    this.m_containerL.getPosition(this.m_pos);
                    this.m_tempV.scaleVecTo(Vector3D.X_AXIS,kf);
                    let degree:number = MathConst.GetDegreeByXY(this.m_pos.x - this.m_tempV.x, this.m_tempV.z - this.m_pos.z) + 180;
    
                    this.m_containerL.setRotationY(degree);
                    this.m_containerL.update();
                    this.m_containerR.setRotationY(-degree);
                    this.m_containerR.update();
                    
                    this.m_containerL.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
                    let py:number = this.m_tempV.y;
                    this.m_tempV.y = 0.0;
                    kf = this.m_tempV.dot(Vector3D.X_AXIS);
                    if(kf > 15.0)
                    {
                        this.m_tempV.scaleVecTo(Vector3D.X_AXIS, kf);
                        this.m_tempV.y = py;
                        this.m_coreFAxis.setAttLPos(this.m_tempV);
                    }
    
                    this.m_containerR.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
                    //console.log("R m_tempV.y: "+this.m_tempV);
                    py = this.m_tempV.y;
                    this.m_tempV.y = 0.0;
                    kf = this.m_tempV.dot(Vector3D.X_AXIS);
                    if(kf > 15.0)
                    {
                        this.m_tempV.scaleVecTo(Vector3D.X_AXIS, kf);
                        this.m_tempV.y = py;
                        this.m_coreFAxis.setAttRPos(this.m_tempV);
                    }
                }

            }
            resetPose():void
            {
                this.m_coreFAxis.resetPose();
                this.m_time = this.m_coreFAxis.getOriginTime();
            }
            resetNextOriginPose():void
            {
                this.m_nextTime = this.m_coreFAxis.getNextOriginTime(this.m_time);
            }
            setRecoilDegreeL(degree:number):void
            {
                this.m_coreFAxis.setRecoilDegreeL(degree);
            }
            setRecoilDegreeR(degree:number):void
            {
                this.m_coreFAxis.setRecoilDegreeR(degree);
            }
            runAtt(moveEnabled:boolean):void
            {
                this.updateAttPose();
                this.m_container.update();
                if(moveEnabled)
                {
                    this.m_coreFAxis.runAtt(this.m_time, true);
                    this.m_time += this.m_timeSpeed;
                }
                else
                {
                    this.m_coreFAxis.runAtt(this.m_time, false);
                    //this.m_coreFAxis.runPartAtt();
                }
            }
            run():void
            {
                this.m_container.update();
                this.m_coreFAxis.run(this.m_time);
                this.m_time += this.m_timeSpeed;
            }
            update():void
            {
                this.m_container.update();
            }
            isResetFinish():boolean
            {
                return this.m_time >= this.m_nextTime;
            }
            runToReset():void
            {
                if(this.m_time >= this.m_nextTime)
                {
                    this.m_time = this.m_nextTime;
                }
                this.m_container.update();
                this.m_coreFAxis.run(this.m_time);
                this.m_time += this.m_timeSpeed;
            }
        }
    }
}
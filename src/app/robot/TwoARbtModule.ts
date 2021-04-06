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

import Vector3D = Vector3T.vox.math.Vector3D;
import MathConst = MathConstT.vox.math.MathConst;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import ArmFrameAxis = ArmFrameAxisT.app.robot.ArmFrameAxis;
import IPartStore = IPartStoreT.app.robot.IPartStore;

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
            private m_partStore:IPartStore = null;
            
            private m_timeSpeed:number = 3.0;
            private m_nextTime:number = 0;
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
                    this.m_containerL.addEntity(axis);

                    let pv:Vector3D = new Vector3D();
                    pv.copyFrom(partStore.getCoreCenter());
                    if(offsetPos != null)
                    {
                        pv.addBy(offsetPos);
                    }
                    this.m_coreFAxis.initialize(coreEntity, pv, 0.0);
                    this.m_coreFAxis.setBG(bgL,bgR, partStore.getBGLong());
                    this.m_coreFAxis.setSG(sgL,sgR);

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
                this.updateAttPose();
            }
            setAttPosXYZ(px:number,py:number,pz:number):void
            {
                //this.m_container.getPosition(this.m_pos);
                //let degree:number = -MathConst.GetDegreeByXY(px - this.m_pos.x, pz - this.m_pos.z);
                //console.log("degree: "+degree);
                this.m_attPos.setXYZ(px,py,pz);
                this.updateAttPose();
            }
            getAttPos():Vector3D
            {
                return this.m_attPos;
            }
            getLEndPos(outV:Vector3D):void
            {
                this.m_coreFAxis.getLEndPos(outV);
            }
            getREndPos(outV:Vector3D):void
            {
                this.m_coreFAxis.getREndPos(outV);
            }
            private updateAttPose():void
            {
                //console.log("A this.m_attPos: ",this.m_attPos);
                this.m_container.getPosition(this.m_pos);
                let degree:number = -MathConst.GetDegreeByXY(this.m_attPos.x - this.m_pos.x, this.m_attPos.z - this.m_pos.z);
                //let degree:number = MathConst.GetDegreeByXY(this.m_pos.x - this.m_attPos.x, this.m_attPos.z - this.m_pos.z) + 180;
                this.setRotationY(degree);
                this.m_container.update();
                ///*
                this.m_container.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
                this.m_containerL.getPosition(this.m_pos);
                degree = MathConst.GetDegreeByXY(this.m_pos.x - this.m_tempV.x, this.m_tempV.z - this.m_pos.z) + 180;
                //console.log("B degree: ",degree);
                this.m_containerL.setRotationY(degree);
                this.m_containerL.update();
                //degree = MathConst.GetDegreeByXY(this.m_tempV.x - this.m_pos.x, this.m_tempV.z - this.m_pos.z);
                //this.m_containerR.getPosition(this.m_pos);
                //degree = MathConst.GetDegreeByXY(this.m_pos.x - this.m_tempV.x, this.m_tempV.z - this.m_pos.z) + 180;
                this.m_containerR.setRotationY(-degree);
                this.m_containerR.update();
                
                //*/
                this.m_containerL.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
                this.m_coreFAxis.setAttLPos(this.m_tempV);
                this.m_containerR.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
                this.m_coreFAxis.setAttRPos(this.m_tempV);
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
            runAtt():void
            {
                this.updateAttPose();
                this.m_container.update();
                this.m_coreFAxis.runAtt(this.m_time);
                this.m_time += this.m_timeSpeed;
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
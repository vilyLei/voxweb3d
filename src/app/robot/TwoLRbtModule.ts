/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import RendererScene from "../../vox/scene/RendererScene";
import * as CoreFrameAxisT from "../../app/robot/CoreFrameAxis";
import IPartStore from "../../app/robot/IPartStore";
import IPoseture from "../../app/robot/poseture/IPoseture";
import TwoLegPostureCtrl from "../../app/robot/poseture/TwoLegPostureCtrl";

//import Vector3D = Vector3T.vox.math.Vector3D;
//import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
//import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
import CoreFrameAxis = CoreFrameAxisT.app.robot.CoreFrameAxis;
//import IPartStore = IPartStoreT.app.robot.IPartStore;
//import IPoseture = IPosetureT.app.robot.poseture.IPoseture;
//import TwoLegPostureCtrl = TwoLegPostureCtrlT.app.robot.poseture.TwoLegPostureCtrl;

export namespace app
{
    export namespace robot
    {
        // leg
        export class TwoLRbtModule implements IPoseture
        {
            private m_sc:RendererScene = null;
            private m_time:number = 0;

            private m_coreFAxis:CoreFrameAxis = new CoreFrameAxis();
            private m_container:DisplayEntityContainer = null;
            private m_partStore:IPartStore = null;
            
            private m_timeSpeed:number = 3.0;
            private m_nextTime:number = 0;

            //degreeTween:DegreeTween = new DegreeTween();
            postureCtrl:TwoLegPostureCtrl = new TwoLegPostureCtrl();
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
            getRotationY():number
            {
                return this.m_container.getRotationY();
            }
            runByPos(pos:Vector3D,finished:boolean):void
            {
                this.postureCtrl.runByPos(pos,finished);
            }
            runByDegree(degree:number,finished:boolean):void
            {
                this.postureCtrl.runByDegree(degree,finished);
            }
            isPoseRunning():boolean
            {
                return this.postureCtrl.isRunning();
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

                    let coreEntity:DisplayEntity = partStore.getEngityCore();
                    let bgL:DisplayEntity = partStore.getEngityBGL();
                    let bgR:DisplayEntity = partStore.getEngityBGR();
                    let sgL:DisplayEntity = partStore.getEngitySGL();
                    let sgR:DisplayEntity = partStore.getEngitySGR();
                    this.m_container.addEntity(coreEntity);
                    this.m_container.addEntity(bgL);
                    this.m_container.addEntity(bgR);
                    this.m_container.addEntity(sgL);
                    this.m_container.addEntity(sgR);
                    let pv:Vector3D = new Vector3D();
                    pv.copyFrom(partStore.getCoreCenter());
                    if(offsetPos != null)
                    {
                        pv.addBy(offsetPos);
                    }
                    this.m_coreFAxis.initialize(coreEntity, pv, partStore.getCoreWidth() * 0.5);
                    this.m_coreFAxis.setBG(bgL,bgR, partStore.getBGLong());
                    this.m_coreFAxis.setSG(sgL,sgR);

                    this.postureCtrl.bindTarget(this);
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
            resetPose():void
            {
                this.m_coreFAxis.resetPose();
                this.m_time = this.m_coreFAxis.getOriginTime();
            }
            resetNextOriginPose():void
            {
                this.m_nextTime = this.m_coreFAxis.getNextOriginTime(this.m_time);
            }
            run():void
            {
                this.m_container.update();
                this.m_coreFAxis.run(this.m_time);
                this.m_time += this.m_timeSpeed;
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
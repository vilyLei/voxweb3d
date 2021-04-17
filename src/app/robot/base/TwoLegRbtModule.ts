/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../../vox/math/Vector3D";
import * as DisplayEntityT from "../../../vox/entity/DisplayEntity";
import * as DisplayEntityContainerT from "../../../vox/entity/DisplayEntityContainer";
import * as RendererSceneT from "../../../vox/scene/RendererScene";
import * as CoreFrameAxisT from "../../../app/robot/base/TwoLegBone";
import * as IPartStoreT from "../../../app/robot/IPartStore";
import * as IPosetureT from "../../../app/robot/poseture/IPoseture";
import * as IAttackDstT from "../../../app/robot/attack/IAttackDst";
import * as TwoLegPostureCtrlT from "../../../app/robot/poseture/TwoLegPostureCtrl";
import * as IRbtModuleT from "../../../app/robot/base/IRbtModule";

import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import TwoLegBone = CoreFrameAxisT.app.robot.base.TwoLegBone;
import IPartStore = IPartStoreT.app.robot.IPartStore;
import IPoseture = IPosetureT.app.robot.poseture.IPoseture;
import IAttackDst = IAttackDstT.app.robot.attack.IAttackDst;
import TwoLegPostureCtrl = TwoLegPostureCtrlT.app.robot.poseture.TwoLegPostureCtrl;
import IRbtModule = IRbtModuleT.app.robot.base.IRbtModule;

export namespace app
{
    export namespace robot
    {
        export namespace base
        {
        // tow legs
        export class TwoLegRbtModule implements IRbtModule,IPoseture
        {
            private m_sc:RendererScene = null;
            private m_time:number = 0;

            private m_bone:TwoLegBone = new TwoLegBone();
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
            setAttackDst(dst:IAttackDst):void
            {

            }
            setVisible(boo:boolean):void
            {
                this.m_container.setVisible(boo);
            }
            getVisible():boolean
            {
                return this.m_container.getVisible();
            }
            toPositive():void
            {
                this.m_bone.toPositive();
            }
            toNegative():void
            {
                this.m_bone.toNegative();
            }
            setRotationY(rotation:number):void
            {
                this.m_container.setRotationY(rotation);
            }
            getRotationY():number
            {
                return this.m_container.getRotationY();
            }
            direcByPos(pos:Vector3D,finished:boolean):void
            {
                this.postureCtrl.runByPos(pos,finished);
            }
            direcByDegree(degree:number,finished:boolean):void
            {
                this.postureCtrl.runByDegree(degree,finished);
            }
            setDstDirecDegree(degree:number):void
            {
            }
            isPoseRunning():boolean
            {
                return this.postureCtrl.isRunning();
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
                    this.m_bone.initialize(coreEntity, pv, partStore.getCoreWidth() * 0.5);
                    this.m_bone.setBG(bgL,bgR, partStore.getBGLong());
                    this.m_bone.setSG(sgL,sgR);

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
                this.m_bone.resetPose();
                this.m_time = this.m_bone.getOriginTime();
            }
            resetNextOriginPose():void
            {
                this.m_nextTime = this.m_bone.getNextOriginTime(this.m_time);
            }
            run(moveEnabled:boolean):void
            {
                this.m_container.update();
                this.m_bone.run(this.m_time);
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
                this.m_bone.run(this.m_time);
                this.m_time += this.m_timeSpeed;
            }
        }
        }
    }
}
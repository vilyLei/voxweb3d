/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as DisplayEntityContainerT from "../../vox/entity/DisplayEntityContainer";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as DirectXZModuleT from "../../voxmotion/primitive/DirectXZModule";
import * as CoreFrameAxisT from "../../app/robot/CoreFrameAxis";
import * as IPartStoreT from "../../app/robot/IPartStore";

import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import DirectXZModule = DirectXZModuleT.voxmotion.primitive.DirectXZModule;
import CoreFrameAxis = CoreFrameAxisT.app.robot.CoreFrameAxis;
import IPartStore = IPartStoreT.app.robot.IPartStore;

export namespace app
{
    export namespace robot
    {
        export class BoFrameAxis
        {
            private m_sc:RendererScene = null;
            private m_time:number = 0;

            private m_coreFAxis:CoreFrameAxis = new CoreFrameAxis();
            private m_container:DisplayEntityContainer = null;
            private m_partStore:IPartStore = null;
            
            private m_awake:boolean = true;
            private m_awakeFlag:boolean = true;
            private m_tickModule:DirectXZModule = new DirectXZModule();
            private m_speed:number = 3.0;
            private m_timeSpeed:number = 3.0;

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
            setTime(time:number):void
            {
                this.m_time = time;
            }
            initialize(sc:RendererScene,partStore:IPartStore = null,offsetPos:Vector3D = null):void
            {
                if(this.m_sc == null && partStore != null)
                {
                    this.m_sc = sc;
                    this.m_partStore = partStore;
                    sc.addContainer(this.m_container);

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

                    this.m_tickModule.setSpeed(this.m_speed);
                    this.m_tickModule.syncTargetUpdate = false;
                    this.m_tickModule.bindTarget(this.m_container);
                    this.m_tickModule.setVelocityFactor(0.02,0.03);
                }
            }
            setXYZ(px:number,py:number,pz:number):void
            {
                this.m_container.setXYZ(px,py,pz);
                this.m_tickModule.setCurrentXYZ(px,py,pz);
            }
            setPosition(position:Vector3D):void
            {
                this.m_container.setPosition(position);
                this.m_tickModule.setCurrentPosition(position);
            }
            getPosition(position:Vector3D):void
            {
                this.m_container.getPosition(position);
            }
            resetPose():void
            {
                this.m_coreFAxis.resetPose();
            }
            run():void
            {
                if(this.m_awakeFlag)
                {
                    if(this.m_awake)
                    {
                        this.m_tickModule.run();
                        this.m_awake = this.m_tickModule.isMoving();
                        
                        this.m_container.update();
                        this.m_coreFAxis.run(this.m_time);
                        this.m_time += this.m_timeSpeed;
                    }
                    else
                    {
                        this.m_coreFAxis.resetPose();
                        this.m_awakeFlag = false;
                    }
                }
            }
            
            moveToXZ(px:number,pz:number):void
            {
                this.m_tickModule.toXZ(px,pz);
                this.wake();
            }
            isAwake():boolean
            {
                return this.m_awake;
            }
            wake():void
            {
                this.m_awake = true;
                this.m_awakeFlag = true;
            }
            sleep():void
            {
                this.m_awake = false;
            }
        }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";
import * as DisplayEntityContainerT from "../../vox/entity/DisplayEntityContainer";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as DirectXZModuleT from "../../voxmotion/primitive/DirectXZModule";
import * as IPartStoreT from "../../app/robot/IPartStore";
import * as TwoLRbtModuleT from "../../app/robot/TwoLRbtModule";

import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import DirectXZModule = DirectXZModuleT.voxmotion.primitive.DirectXZModule;
import IPartStore = IPartStoreT.app.robot.IPartStore;
import TwoLRbtModule = TwoLRbtModuleT.app.robot.TwoLRbtModule;

export namespace app
{
    export namespace robot
    {
        export class TwoFeetUnit
        {
            private m_awake:boolean = true;
            private m_awakeFlag:boolean = true;
            private m_tickModule:DirectXZModule = new DirectXZModule();
            private m_speed:number = 3.0;

            private m_rbtModule:TwoLRbtModule = null;
            constructor()
            {
                this.m_rbtModule = new TwoLRbtModule();
            }
            getContainer():DisplayEntityContainer
            {
                return this.m_rbtModule.getContainer();
            }
            toPositive():void
            {
                this.m_rbtModule.toPositive();
            }
            toNegative():void
            {
                this.m_rbtModule.toNegative();
            }
            setDuration(duration:number):void
            {
                this.m_rbtModule.setDuration(duration);
            }
            getDuration():number
            {
                return this.m_rbtModule.getDuration();
            }
            setTime(time:number):void
            {
                this.m_rbtModule.setTime(time);
            }
            initialize(sc:RendererScene,renderProcessIndex:number,partStore:IPartStore = null,offsetPos:Vector3D = null):void
            {
                if(sc != null && partStore != null)
                {
                    this.m_rbtModule.initialize(sc,renderProcessIndex,partStore,offsetPos);
                    this.m_tickModule.setSpeed(this.m_speed);
                    this.m_tickModule.syncTargetUpdate = false;
                    this.m_tickModule.bindTarget(this.m_rbtModule.getContainer());
                    this.m_tickModule.setVelocityFactor(0.02,0.03);
                }
            }
            setXYZ(px:number,py:number,pz:number):void
            {
                this.m_rbtModule.setXYZ(px,py,pz);
                this.m_tickModule.setCurrentXYZ(px,py,pz);
            }
            setPosition(position:Vector3D):void
            {
                this.m_rbtModule.setPosition(position);
                this.m_tickModule.setCurrentPosition(position);
            }
            getPosition(position:Vector3D):void
            {
                this.m_rbtModule.getPosition(position);
            }
            resetPose():void
            {
                this.m_rbtModule.resetPose();
            }
            run():void
            {
                if(this.m_awakeFlag)
                {
                    if(this.m_awake)
                    {
                        this.m_tickModule.run();
                        this.m_awake = this.m_tickModule.isMoving();
                        this.m_rbtModule.run();
                        if(!this.m_awake)
                        {
                            this.m_rbtModule.resetNextOriginPose();
                        }
                    }
                    else
                    {
                        this.m_rbtModule.runToReset();
                        if(this.m_rbtModule.isResetFinish())
                        {
                            this.m_awakeFlag = false;
                        }
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
                if(!this.m_awake)
                {
                    
                }
                this.m_awake = true;
                this.m_awakeFlag = true;
            }
            sleep():void
            {
                this.m_awake = false;
            }
            //*/
        }
    }
}
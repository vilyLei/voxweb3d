/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import RendererScene from "../../vox/scene/RendererScene";
import DirectXZModule from "../../voxmotion/primitive/DirectXZModule";
import IPartStore from "../../app/robot/IPartStore";
import TwoLRbtModule from "../../app/robot/TwoLRbtModule";

export default class SixFeetUnit
{
    private m_awake:boolean = true;
    private m_awakeFlag:boolean = true;
    private m_tickModule:DirectXZModule = new DirectXZModule();
    private m_speed:number = 3.0;

    private m_rbtModule:TwoLRbtModule = null;
    private m_rbtModule1:TwoLRbtModule = null;
    private m_rbtModule2:TwoLRbtModule = null;
    constructor()
    {
        this.m_rbtModule = new TwoLRbtModule();
        this.m_rbtModule1 = new TwoLRbtModule(this.m_rbtModule.getContainer());
        this.m_rbtModule2 = new TwoLRbtModule(this.m_rbtModule.getContainer());
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
    initialize(sc:RendererScene,renderProcessIndex:number,partStore0:IPartStore,partStore1:IPartStore,partStore2:IPartStore,dis:number = 100.0):void
    {
        if(sc != null && partStore0 != null && partStore1 != null)
        {
            let offsetPos:Vector3D = new Vector3D(-dis,0.0,0.0);
            this.m_rbtModule.initialize(sc,renderProcessIndex,partStore0,offsetPos);
            offsetPos.x = 0.0;
            this.m_rbtModule1.initialize(sc,renderProcessIndex,partStore1,offsetPos);
            this.m_rbtModule1.toNegative();
            offsetPos.x = dis;
            this.m_rbtModule2.initialize(sc,renderProcessIndex,partStore2,offsetPos);
            this.m_rbtModule2.toPositive();

            this.m_tickModule.setSpeed(this.m_speed);
            this.m_tickModule.syncTargetUpdate = false;
            this.m_tickModule.setTarget(this.m_rbtModule.getContainer());
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
        this.m_rbtModule1.resetPose();
        this.m_rbtModule2.resetPose();
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
                this.m_rbtModule1.run();
                this.m_rbtModule2.run();
                if(!this.m_awake)
                {
                    this.m_rbtModule.resetNextOriginPose();
                    this.m_rbtModule1.resetNextOriginPose();
                    this.m_rbtModule2.resetNextOriginPose();
                }
            }
            else
            {
                if(this.m_rbtModule.isResetFinish())
                {
                    this.m_awakeFlag = false;
                    this.m_rbtModule.resetPose();
                    this.m_rbtModule1.resetPose();
                    this.m_rbtModule2.resetPose();
                }
                else
                {
                    this.m_rbtModule.runToReset();
                    this.m_rbtModule1.runToReset();
                    this.m_rbtModule2.runToReset();
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
            this.m_rbtModule.toPositive();
            this.m_rbtModule1.toNegative();
            this.m_rbtModule2.toPositive();
        }
        this.m_awake = true;
        this.m_awakeFlag = true;                
    }
    sleep():void
    {
        this.m_awake = false;
    }
}
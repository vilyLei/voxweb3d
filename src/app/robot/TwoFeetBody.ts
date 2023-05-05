/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import RendererScene from "../../vox/scene/RendererScene";
import DirectXZModule from "../../voxmotion/primitive/DirectXZModule";
import IPartStore from "../../app/robot/IPartStore";
import TwoLRbtModule from "../../app/robot/TwoLRbtModule";

export default class TwoFeetBody
{
    private m_awake:boolean = true;
    private m_awakeFlag:boolean = true;
    private m_tickModule:DirectXZModule = new DirectXZModule();
    private m_speed:number = 3.0;

    private m_legModule:TwoLRbtModule = null;
    private m_armModule:TwoLRbtModule = null;
    constructor()
    {
        this.m_legModule = new TwoLRbtModule();
        this.m_armModule = new TwoLRbtModule(this.m_legModule.getContainer());
    }
    getLegModule():TwoLRbtModule
    {
        return this.m_legModule;
    }
    getArmModule():TwoLRbtModule
    {
        return this.m_armModule;
    }
    getContainer():DisplayEntityContainer
    {
        return this.m_legModule.getContainer();
    }
    toPositive():void
    {
        this.m_legModule.toPositive();
    }
    toNegative():void
    {
        this.m_legModule.toNegative();
    }
    setDuration(duration:number):void
    {
        this.m_legModule.setDuration(duration);
    }
    getDuration():number
    {
        return this.m_legModule.getDuration();
    }
    setTime(time:number):void
    {
        this.m_legModule.setTime(time);
    }
    initialize(sc:RendererScene,renderProcessIndex:number,partStore0:IPartStore,partStore1:IPartStore,dis:number = 100.0):void
    {
        if(sc != null && partStore0 != null && partStore1 != null)
        {
            let offsetPos:Vector3D = new Vector3D(0.0,0.0,0.0);
            this.m_legModule.initialize(sc,renderProcessIndex,partStore0,offsetPos);
            this.m_legModule.toPositive();
            offsetPos.y = dis;
            this.m_armModule.initialize(sc,renderProcessIndex,partStore1,offsetPos);
            this.m_armModule.toNegative();
            this.m_armModule.setAngleDirec(1.0,-1.0);

            this.m_tickModule.setSpeed(this.m_speed);
            this.m_tickModule.syncTargetUpdate = false;
            this.m_tickModule.setTarget(this.m_legModule.getContainer());
            this.m_tickModule.setVelocityFactor(0.02,0.03);
        }
    }
    setXYZ(px:number,py:number,pz:number):void
    {
        this.m_legModule.setXYZ(px,py,pz);
        this.m_tickModule.setCurrentXYZ(px,py,pz);
    }
    setPosition(position:Vector3D):void
    {
        this.m_legModule.setPosition(position);
        this.m_tickModule.setCurrentPosition(position);
    }
    getPosition(position:Vector3D):void
    {
        this.m_legModule.getPosition(position);
    }
    resetPose():void
    {
        this.m_legModule.resetPose();
        this.m_armModule.resetPose();
    }
    private m_count:number = Math.round(Math.random() * 50 + 30);
    run():void
    {
        if(this.m_count < 1)
        {
            this.m_count = Math.round(Math.random() * 200 + 50);
            this.moveToXZ(Math.random() * 900.0 - 450,Math.random() * 900.0 - 450);
        }
        else
        {
            this.m_count--;
        }
        if(this.m_awakeFlag)
        {
            if(this.m_awake)
            {
                this.m_tickModule.run();
                this.m_awake = this.m_tickModule.isMoving();
                
                this.m_legModule.run();
                this.m_armModule.run();
                if(!this.m_awake)
                {
                    this.m_legModule.resetNextOriginPose();
                    this.m_armModule.resetNextOriginPose();
                }
            }
            else
            {
                if(this.m_legModule.isResetFinish())
                {
                    this.m_awakeFlag = false;
                    this.m_legModule.resetPose();
                    this.m_armModule.resetPose();
                }
                else
                {
                    this.m_legModule.runToReset();
                    this.m_armModule.runToReset();
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
            this.m_legModule.toPositive();
            this.m_armModule.toNegative();
        }
        this.m_awake = true;
        this.m_awakeFlag = true;
        
    }
    sleep():void
    {
        this.m_awake = false;
    }
}
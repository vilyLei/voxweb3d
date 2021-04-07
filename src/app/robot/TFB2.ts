/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as DisplayEntityContainerT from "../../vox/entity/DisplayEntityContainer";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as DirectXZModuleT from "../../voxmotion/primitive/DirectXZModule";
import * as IPartStoreT from "../../app/robot/IPartStore";
import * as TwoLRbtModuleT from "../../app/robot/TwoLRbtModule";
import * as TwoARbtModuleT from "../../app/robot/TwoARbtModule";
import * as WeapMoudleT from "../../app/robot/WeapMoudle";
import * as CampTypeT from "../../app/robot/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import DirectXZModule = DirectXZModuleT.voxmotion.primitive.DirectXZModule;
import IPartStore = IPartStoreT.app.robot.IPartStore;
import TwoLRbtModule = TwoLRbtModuleT.app.robot.TwoLRbtModule;
import TwoARbtModule = TwoARbtModuleT.app.robot.TwoARbtModule;
import WeapMoudle = WeapMoudleT.app.robot.WeapMoudle;
import CampType = CampTypeT.app.robot.CampType;


export namespace app
{
    export namespace robot
    {
        export class TFB2
        {
            private m_awake:boolean = true;
            private m_awakeFlag:boolean = true;
            private m_tickModule:DirectXZModule = new DirectXZModule();
            private m_speed:number = 3.0;
            private m_pos:Vector3D = new Vector3D();
            private m_beginPos:Vector3D = new Vector3D();
            private m_endPos:Vector3D = new Vector3D();
            private m_attPos:Vector3D = new Vector3D();

            private m_legModule:TwoLRbtModule = null;
            private m_armModule:TwoARbtModule = null;

            static readonly FREE_RUN:number = 1001;
            static readonly ATTACK_RUN:number = 1002;
            private m_runMode:number = 1002;
            
            weap:WeapMoudle = null;
            constructor()
            {
                this.m_legModule = new TwoLRbtModule();
                this.m_armModule = new TwoARbtModule();
            }
            getLegModule():TwoLRbtModule
            {
                return this.m_legModule;
            }
            getArmModule():TwoARbtModule
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
                    this.weap = new WeapMoudle(sc);

                    let offsetPos:Vector3D = new Vector3D(0.0,0.0,0.0);
                    this.m_legModule.initialize(sc,renderProcessIndex,partStore0,offsetPos);
                    this.m_legModule.toPositive();
                    //this.m_legModule.setVisible(false);
                    offsetPos.y = dis;
                    this.m_armModule.initialize(sc,renderProcessIndex,partStore1,offsetPos);
                    this.m_armModule.toNegative();
                    this.m_armModule.setAngleDirec(1.0,-1.0);

                    this.m_tickModule.setSpeed(this.m_speed);
                    this.m_tickModule.syncTargetUpdate = false;
                    this.m_tickModule.bindTarget(this.m_legModule.getContainer());
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
            setAttPos(position:Vector3D):void
            {
                this.m_attPos.copyFrom(position);
                this.m_armModule.setAttPos(position);
            }
            setAttPosXYZ(px:number,py:number,pz:number):void
            {
                this.m_attPos.setXYZ(px,py,pz);
                this.m_armModule.setAttPosXYZ(px,py,pz);
            }
            getLEndPos(outV:Vector3D,k:number):void
            {
                this.m_armModule.getLEndPos(outV,k);
            }
            getREndPos(outV:Vector3D,k:number):void
            {
                this.m_armModule.getREndPos(outV,k);
            }
            resetPose():void
            {
                this.m_legModule.resetPose();
                this.m_armModule.resetPose();
            }
            private m_count:number = Math.round(Math.random() * 50 + 30);
            private freeTest():void
            {
                //  if(this.m_count < 1)
                //  {
                //      this.m_count = Math.round(Math.random() * 200 + 50);
                //      this.moveToXZ(Math.random() * 900.0 - 450,Math.random() * 900.0 - 450);
                //  }
                //  else
                //  {
                //      this.m_count--;
                //  }
            }
            run():void
            {
                switch(this.m_runMode)
                {
                    case TFB2.ATTACK_RUN:
                        this.attackRun();
                        break;
                    case TFB2.FREE_RUN:
                        this.freeRun();
                        break;
                    default:
                }
            }
            private m_attDelay:number = 0;
            private m_attWeapFlag:boolean = true;
            attackRun():void
            {
                //this.freeTest();
                let moveFlag:boolean = false;
                if(this.m_awakeFlag)
                {
                    if(this.m_awake)
                    {
                        this.m_tickModule.run();
                        this.m_awake = this.m_tickModule.isMoving();
                        
                        this.m_legModule.run();
                        moveFlag = true;

                        if(!this.m_awake)
                        {
                            this.m_legModule.resetNextOriginPose();
                        }
                    }
                    else
                    {
                        if(this.m_legModule.isResetFinish())
                        {
                            this.m_awakeFlag = false;
                            this.m_legModule.resetPose();
                        }
                        else
                        {
                            this.m_legModule.runToReset();
                        }
                    }
                }
                if(moveFlag)
                {
                    this.m_legModule.getPosition(this.m_pos);
                    this.m_armModule.setPosition(this.m_pos);
                }
                this.m_armModule.runAtt(moveFlag);
                if(this.m_armModule.isAttackLock())
                {
                    // att to do
                    if(this.m_attDelay < 1)
                    {
                        if(this.m_attWeapFlag)
                        {
                            this.m_armModule.getLEndPos(this.m_beginPos,1.0);
                            //this.m_armModule.getLEndPos(this.m_endPos,3.0);
                        }
                        else
                        {
                            this.m_armModule.getREndPos(this.m_beginPos,1.0);
                            //this.m_armModule.getREndPos(this.m_endPos,3.0);
                        }
                        this.m_attWeapFlag = !this.m_attWeapFlag;
                        //console.log("this.m_beginPos,this.m_attPos: ",this.m_beginPos,this.m_attPos);
                        this.weap.createAtt(0,this.m_beginPos,this.m_attPos,null,CampType.Blue);
                        //this.weap.createAtt(0,this.m_beginPos,this.m_endPos);
                        this.m_attDelay = 20;
                    }
                    this.m_attDelay --;
                }
                else
                {
                    this.m_attDelay = 0;
                }
                this.weap.run();
            }
            freeRun():void
            {
                //this.freeTest();

                if(this.m_awakeFlag)
                {
                    if(this.m_awake)
                    {
                        this.m_tickModule.run();
                        this.m_awake = this.m_tickModule.isMoving();
                        let degree:number = this.m_tickModule.getDirecDegree();
                        this.m_legModule.run();
                        this.m_legModule.getPosition(this.m_pos);
                        this.m_armModule.setPosition(this.m_pos);
                        this.m_armModule.setRotationY(degree);
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
                    //if(this.m_runMode == TFB2.FREE_RUN)this.m_armModule.toNegative();
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
    }
}
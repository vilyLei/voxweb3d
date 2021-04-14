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
import * as CampT from "../../app/robot/Camp";
import * as IRoleCampT from "../../app/robot/IRoleCamp";
import * as IAttackDstT from "../../app/robot/IAttackDst";
import * as TriggerClockT from "../../vox/utils/TriggerClock";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import DirectXZModule = DirectXZModuleT.voxmotion.primitive.DirectXZModule;
import IPartStore = IPartStoreT.app.robot.IPartStore;
import TwoLRbtModule = TwoLRbtModuleT.app.robot.TwoLRbtModule;
import TwoARbtModule = TwoARbtModuleT.app.robot.TwoARbtModule;
import WeapMoudle = WeapMoudleT.app.robot.WeapMoudle;
import CampType = CampT.app.robot.CampType;
import CampFindMode = CampT.app.robot.CampFindMode;
import IRoleCamp = IRoleCampT.app.robot.IRoleCamp;
import IAttackDst = IAttackDstT.app.robot.IAttackDst;
import TriggerClock = TriggerClockT.vox.utils.TriggerClock;


export namespace app
{
    export namespace robot
    {
        export class TFB2
        {
            private m_moving:boolean = true;
            private m_movingFlag:boolean = true;
            private m_tickModule:DirectXZModule = new DirectXZModule();
            private m_speed:number = 4.5;
            private m_pos:Vector3D = new Vector3D();
            private m_beginPos:Vector3D = new Vector3D();
            private m_endPos:Vector3D = new Vector3D();
            private m_attPos:Vector3D = new Vector3D();

            private m_legModule:TwoLRbtModule = null;
            private m_armModule:TwoARbtModule = null;
            private m_attackLock:TriggerClock = new TriggerClock();

            static readonly FREE_RUN:number = 1001;
            static readonly ATTACK_RUN:number = 1002;
            private m_runMode:number = 1002;

            attackDis:number = 50;
            radius:number = 100;
            campType:CampType = CampType.Blue;

            roleCamp:IRoleCamp = null;
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
                    this.m_tickModule.syncDirecUpdate = false;
                    this.m_tickModule.bindTarget(this.m_legModule.getContainer());
                    this.m_tickModule.setVelocityFactor(0.02,0.03);

                    this.m_attackLock.setPeriod(12);
                    this.m_attackLock.setTriggerTimeAt(0,6);
                    this.m_attackLock.setTriggerTimeAt(1,3);
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
            getEndPosAt(index:number, outV:Vector3D,k:number):void
            {
                this.m_armModule.getEndPosAt(index, outV,k);
            }
            resetPose():void
            {
                this.m_legModule.resetPose();
                this.m_armModule.resetPose();
            }
            private m_count:number = Math.round(Math.random() * 50 + 30);
            private m_fixPos:Vector3D = new Vector3D();
            private freeTest():void
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
                        break;
                }
            }
            private attackMove(readyAttack:boolean):boolean
            {
                let unlockDst:boolean = true;

                if(readyAttack && this.roleCamp.distance > 0.4 * (this.attackDis + this.radius))
                {
                    unlockDst = false;
                }
                else if(this.m_tickModule.isMoving())
                {
                    this.m_movingFlag = true;
                }
                let moveFlag:boolean = false;
                if(this.m_movingFlag)
                {
                    if(this.m_moving && unlockDst)
                    {
                        moveFlag = true;
                        // 执行移动控制过程
                        this.m_tickModule.run();
                        this.m_moving = this.m_tickModule.isMoving();

                        // 执行走动动作
                        if(readyAttack)
                        {
                            this.m_legModule.postureCtrl.runByPos(this.m_attPos,false);
                        }
                        else
                        {
                            this.m_legModule.postureCtrl.runByDegree(this.m_tickModule.getDirecDegree(),false);
                        }
                    }
                    else
                    {
                        if(readyAttack)
                        {
                            this.m_legModule.postureCtrl.runByPos(this.m_attPos,true);
                        }
                        else
                        {
                            this.m_legModule.postureCtrl.runByDegree(this.m_tickModule.getDirecDegree(),true);
                        }
                        this.m_movingFlag = this.m_legModule.postureCtrl.isRunning();                        
                    }
                }
                else
                {
                    // attack 进行时保持上部和下部朝向一致
                    if(readyAttack && Math.abs(this.m_legModule.getRotationY()-this.m_armModule.getRotationY()) > 50.0)
                    {
                        this.m_movingFlag = true;
                    }
                }
                return moveFlag;
            }
            private attack(attDst:IAttackDst, readyAttack:boolean, moveFlag:boolean):void
            {

                this.m_attackLock.run();
                if(readyAttack && this.m_armModule.isAttackLock())
                {
                    //if((!this.m_movingFlag || !moveFlag) && Math.abs(this.m_legModule.getRotationY()-this.m_armModule.getRotationY()) > 50.0)
                    //  if(!moveFlag && Math.abs(this.m_legModule.getRotationY()-this.m_armModule.getRotationY()) > 50.0)
                    //  {
                    //      this.m_movingFlag = true;
                    //  }
                    let index:number = this.m_attackLock.getTriggerIndex();
                    if(index > -1)
                    {
                        // attack 姿态控制
                        this.m_armModule.getEndPosAt(index,this.m_beginPos,1.0);
                        this.m_armModule.setRecoilDegreeAt(index, 8);
                        this.weap.createAtt(0,this.m_beginPos,this.m_attPos,attDst, this.campType);
                    }
                }
            }
            private armRun(readyAttack:boolean, attDst:IAttackDst, moveFlag:boolean):void
            {
                if(moveFlag)
                {
                    // 同步上半身和下半身的坐标
                    this.m_legModule.getPosition(this.m_pos);
                    this.m_armModule.setPosition(this.m_pos);
                    // 目标朝向和leg一致
                    this.m_armModule.setDstDirecDegree(this.m_tickModule.getDirecDegree());
                }
                if(readyAttack)
                {
                    attDst.getAttackPos(this.m_attPos);
                    this.m_armModule.attachDst();
                    this.m_armModule.setAttPos(this.m_attPos);
                }
                else
                {
                    this.m_armModule.detachDst();
                }
                this.m_armModule.runAtt(moveFlag);
                if(readyAttack)
                {
                    this.attack(attDst,readyAttack, moveFlag);
                }
            }
            attackRun():void
            {
                let attDst:IAttackDst = this.roleCamp.findAttDst(this.m_pos,this.attackDis + this.radius,CampFindMode.XOZ,CampType.Red);
                
                let readyAttack:boolean = attDst != null;

                let moveFlag:boolean = this.attackMove(readyAttack);

                this.armRun(readyAttack, attDst, moveFlag);
                
                if(moveFlag || readyAttack)
                {
                    this.m_count = 30;
                    //this.m_legModule.getPosition(this.m_fixPos);                    
                }
                else
                {
                    this.freeTest();
                }
                //  this.weap.run();
            }
            freeRun():void
            {
                //this.freeTest();

                if(this.m_movingFlag)
                {
                    if(this.m_moving)
                    {
                        this.m_tickModule.run();
                        this.m_moving = this.m_tickModule.isMoving();
                        let degree:number = this.m_tickModule.getDirecDegree();
                        this.m_legModule.run();
                        this.m_legModule.getPosition(this.m_pos);
                        this.m_armModule.setPosition(this.m_pos);
                        this.m_armModule.setRotationY(degree);
                        this.m_armModule.run();
                        if(!this.m_moving)
                        {
                            this.m_legModule.resetNextOriginPose();
                            this.m_armModule.resetNextOriginPose();
                        }
                    }
                    else
                    {
                        if(this.m_legModule.isResetFinish())
                        {
                            this.m_movingFlag = false;
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
            moveToXZ(px:number,pz:number,force:boolean = false):void
            {
                this.m_tickModule.toXZ(px,pz);
                this.wake();
            }
            isAwake():boolean
            {
                return this.m_moving;
            }
            wake():void
            {
                if(!this.m_moving)
                {
                    this.m_legModule.toPositive();
                    this.m_armModule.toNegative();
                }
                this.m_moving = true;
                this.m_movingFlag = true;
                
            }
            sleep():void
            {
                this.m_moving = false;
            }
        }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import RendererScene from "../../vox/scene/RendererScene";
import DirectXZModule from "../../voxmotion/primitive/DirectXZModule";
import IPartStore from "../../app/robot/IPartStore";
import TwoLegRbtModule from "../../app/robot/base/TwoLegRbtModule";
import TwoArmRbtModule from "../../app/robot/base/TwoArmRbtModule";
import {CampType} from "../../app/robot/camp/Camp";
import IRoleCamp from "../../app/robot/IRoleCamp";
import IAttackDst from "../../app/robot/attack/IAttackDst";
import FireCtrlRadar from "../../app/robot/attack/FireCtrlRadar";
import ITerrain from "../../app/robot/scene/ITerrain";

export namespace app
{
    export namespace robot
    {
        export class TFB2 implements IAttackDst
        {
            private m_isMoving:boolean = true;
            private m_movingFlag:boolean = true;
            private m_tickModule:DirectXZModule = new DirectXZModule();
            private m_speed:number = 4.5;
            private m_beginPos:Vector3D = new Vector3D();
            private m_endPos:Vector3D = new Vector3D();
            private m_attPos:Vector3D = new Vector3D();

            private m_legModule:TwoLegRbtModule = null;
            private m_armModule:TwoArmRbtModule = null;

            static readonly FREE_RUN:number = 1001;
            static readonly ATTACK_RUN:number = 1002;
            private m_runMode:number = 1002;

            private m_findRadar:FireCtrlRadar = new FireCtrlRadar();

            position:Vector3D = new Vector3D();
            attackDis:number = 50;
            radius:number = 100;
            lifeTime:number = 3000;
            campType:CampType = CampType.Blue;

            terrain:ITerrain = null;
            roleCamp:IRoleCamp = null;
            constructor()
            {
            }
            
            getContainer():DisplayEntityContainer
            {
                return this.m_legModule.getContainer();
            }
            initialize(sc:RendererScene,renderProcessIndex:number,partStore0:IPartStore,partStore1:IPartStore,dis:number = 100.0):void
            {
                if(sc != null && partStore0 != null && partStore1 != null)
                {
                    this.m_legModule = new TwoLegRbtModule();
                    this.m_armModule = new TwoArmRbtModule();

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

                    this.m_findRadar.dstCamp = this.roleCamp;
                    this.m_findRadar.srcRole = this;
                    this.m_findRadar.campType = this.campType;
                }
            }
            setXYZ(px:number,py:number,pz:number):void
            {
                this.m_armModule.setXYZ(px,py,pz);
                this.m_legModule.setXYZ(px,py,pz);
                this.m_tickModule.setCurrentXYZ(px,py,pz);
            }
            setPosition(position:Vector3D):void
            {
                this.m_armModule.setPosition(position);
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
            private attackMove(readyAttack:boolean, optionalDegree:number):boolean
            {
                
                let state:boolean = true;
                // 如果接近目标则暂停
                if(readyAttack && this.roleCamp.distance > 0.4 * (this.attackDis + this.radius))
                {
                    state = false;
                }
                else if(this.m_tickModule.isMoving())
                {
                    this.m_movingFlag = true;
                }

                let moveFlag:boolean = false;
                if(this.m_movingFlag)
                {
                    optionalDegree = readyAttack ? optionalDegree : this.m_tickModule.getDirecDegree();
                    state = this.m_isMoving && state;
                    if(state)
                    {
                        moveFlag = true;
                        // 执行移动控制过程
                        this.m_tickModule.run();
                        this.m_isMoving = this.m_tickModule.isMoving();
                        this.m_legModule.getPosition(this.position);
                    }
                    //  执行leg动动作
                    this.m_legModule.direcByDegree(optionalDegree,!state);
                    this.m_movingFlag = moveFlag?true:this.m_legModule.isPoseRunning();
                }
                else
                {
                    // attack 进行时保持上部和下部朝向一致
                    if(readyAttack && Math.abs(this.m_legModule.getRotationY() - optionalDegree) > 50.0)
                    {
                        this.m_movingFlag = true;
                    }
                }
                return moveFlag;
            }
            // 需要移动的时候才会执行
            private armMove(pos:Vector3D,direcDegree:number):void
            {
                // 同步上半身和下半身的坐标
                this.m_armModule.setPosition(pos);
                // 目标朝向和leg一致
                this.m_armModule.setDstDirecDegree( direcDegree );
            }
            private attackRun():void
            {
                let direcDegree:number = this.m_armModule.getRotationY();
                let attDst:IAttackDst = this.m_findRadar.findAttDst(direcDegree);

                this.m_armModule.setAttackDst(attDst);

                let moveEnabled:boolean = this.attackMove(attDst != null, direcDegree);
                if(moveEnabled)
                {
                    this.armMove(this.position,this.m_legModule.getRotationY());
                }
                this.m_armModule.run(moveEnabled);
                
                if(moveEnabled || attDst != null)
                {
                    this.m_count = 30;
                    this.m_fixPos.copyFrom(this.position);
                }
                else
                {
                    if(this.m_count < 1)
                    {
                        this.m_runMode = TFB2.FREE_RUN;
                    }
                    this.m_count--;
                }
            }
            
            private m_count:number = Math.round(Math.random() * 20 + 20);
            private m_fixPos:Vector3D = new Vector3D();
            private freeRunTest():void
            {
                if(this.m_count < 1)
                {
                    this.m_count = Math.round(Math.random() * 30 + 30);
                    //let pos:Vector3D = this.terrain.getFreePos();
                    this.moveToXZ(this.m_fixPos.x + (Math.random() * 500.0) - 250.0, this.m_fixPos.z + (Math.random() * 500.0) - 250.0);
                }
                else
                {
                    this.m_count--;
                }
            }
            private freeRun():void
            {
                let direcDegree:number = this.m_armModule.getRotationY();
                let attDst:IAttackDst = this.m_findRadar.testAttDst(direcDegree);
                let moveEnabled:boolean = this.attackMove(false, direcDegree);
                if(moveEnabled)
                {
                    this.armMove(this.position,this.m_legModule.getRotationY());
                }
                this.m_armModule.run(moveEnabled);
                if(!moveEnabled)this.freeRunTest();
                if(attDst != null)
                {
                    this.m_runMode = TFB2.ATTACK_RUN;
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
            moveToXZ(px:number,pz:number,force:boolean = false):void
            {
                this.m_tickModule.toXZ(px,pz);
                if(force)
                {
                    this.m_runMode = TFB2.ATTACK_RUN;
                }
                this.wake();
            }
            isAwake():boolean
            {
                return this.m_isMoving;
            }
            wake():void
            {
                if(!this.m_isMoving)
                {
                    this.m_legModule.toPositive();
                    this.m_armModule.toNegative();
                }
                this.m_isMoving = true;
                this.m_movingFlag = true;
                
            }
            sleep():void
            {
                this.m_isMoving = false;
            }

            setVisible(visible:boolean):void
            {
                this.m_legModule.setVisible(visible);
                this.m_armModule.setVisible(visible);
            }
            // 获得被击中位置
            getHitPos(outPos:Vector3D):void
            {

            }
            // 获得击中位置
            getDestroyedPos(outPos:Vector3D):void
            {

            }
            consume(power:number):void
            {

            }
            attackTest():boolean
            {
                return true;
            }
        }
    }
}
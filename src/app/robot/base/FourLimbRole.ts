/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../../vox/math/MathConst";
import * as Vector3T from "../../../vox/math/Vector3D";
import * as RendererSceneT from "../../../vox/scene/RendererScene";
import * as IPartStoreT from "../../../app/robot/IPartStore";
import * as TwoLegRbtModuleT from "../../../app/robot/base/TwoLegRbtModule";
import * as TwoArmRbtModuleT from "../../../app/robot/base/TwoArmRbtModule";
import * as IAttackDstT from "../../../app/robot/attack/IAttackDst";
import * as FireCtrlRadarT from "../../../app/robot/attack/FireCtrlRadar";
import * as RbtRoleT from "../../../app/robot/base/RbtRole";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import IPartStore = IPartStoreT.app.robot.IPartStore;
import TwoLegRbtModule = TwoLegRbtModuleT.app.robot.base.TwoLegRbtModule;
import TwoArmRbtModule = TwoArmRbtModuleT.app.robot.base.TwoArmRbtModule;

import IAttackDst = IAttackDstT.app.robot.attack.IAttackDst;
import FireCtrlRadar = FireCtrlRadarT.app.robot.attack.FireCtrlRadar;
import RbtRole = RbtRoleT.app.robot.base.RbtRole;

export namespace app
{
    export namespace robot
    {
        export namespace base
        {
            export class FourLimbRole extends RbtRole implements IAttackDst
            {
                private m_legModule:TwoLegRbtModule = null;
                private m_armModule:TwoArmRbtModule = null;
                
                constructor()
                {
                    super();
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

                        this.m_moveModule.setSpeed(this.m_speed);
                        this.m_moveModule.syncTargetUpdate = false;
                        this.m_moveModule.syncDirecUpdate = false;
                        this.m_moveModule.bindTarget(this.m_legModule.getContainer());
                        this.m_moveModule.setVelocityFactor(0.02,0.03);

                        let findRadar:FireCtrlRadar = new FireCtrlRadar();
                        findRadar.dstCamp = this.roleCamp;
                        findRadar.srcRole = this;
                        findRadar.campType = this.campType;

                        this.m_findRadar = findRadar;
                        this.m_motionModule = this.m_legModule;
                        this.m_attackModule = this.m_armModule;
                    }
                }
                wake():void
                {
                    if(!this.m_isMoving)
                    {
                        this.m_legModule.toPositive();
                        this.m_armModule.toNegative();
                    }
                    super.wake();
                }
                // 获得被击中位置
                getHitPos(outPos:Vector3D):void
                {
                }
                // 获得被击毁位置
                getDestroyedPos(outPos:Vector3D):void
                {
                }
                consume(power:number):void
                {
                    this.lifeTime -= power;
                }
                attackTest():boolean
                {
                    return true;
                }

            }
        }
    }
}
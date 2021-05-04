/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../../vox/math/MathConst";
import * as Vector3T from "../../../vox/math/Vector3D";
import * as RendererSceneT from "../../../vox/scene/RendererScene";
import * as DisplayEntityT from "../../../vox/entity/DisplayEntity";
import * as TrackWheelChassisT from "../../../app/robot/base/TrackWheelChassis";
import * as TrackWheelUpperBodyT from "../../../app/robot/base/TrackWheelUpperBody";
import * as IAttackDstT from "../../../app/robot/attack/IAttackDst";
import * as RbtRoleT from "../../../app/robot/base/RbtRole";
import * as BoxGroupTrackT from "../../../voxanimate/primitive/BoxGroupTrack";
import * as FireCtrlRadarT from "../../../app/robot/attack/FireCtrlRadar";
import * as TrackWheelWeaponBodyT from "../../../app/robot/base/TrackWheelWeaponBody";
import * as TrackWheelChassisBodyT from "../../../app/robot/base/TrackWheelChassisBody";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import TrackWheelChassis = TrackWheelChassisT.app.robot.base.TrackWheelChassis;
import TrackWheelUpperBody = TrackWheelUpperBodyT.app.robot.base.TrackWheelUpperBody;

import IAttackDst = IAttackDstT.app.robot.attack.IAttackDst;
import RbtRole = RbtRoleT.app.robot.base.RbtRole;
import BoxGroupTrack = BoxGroupTrackT.voxanimate.primtive.BoxGroupTrack;
import FireCtrlRadar = FireCtrlRadarT.app.robot.attack.FireCtrlRadar;
import TrackWheelWeaponBody = TrackWheelWeaponBodyT.app.robot.base.TrackWheelWeaponBody;
import TrackWheelChassisBody = TrackWheelChassisBodyT.app.robot.base.TrackWheelChassisBody;

export namespace app
{
    export namespace robot
    {
        export namespace base
        {
            export class TrackWheelRole extends RbtRole implements IAttackDst
            {
                private m_renderProcessIndex:number = 0;
                private m_legModule:TrackWheelChassis = null;
                private m_armModule:TrackWheelUpperBody = null;

                private m_srcTrackWheel:BoxGroupTrack = null;
                constructor()
                {
                    super();
                    
                    this.m_legModule = new TrackWheelChassis();
                    this.m_armModule = new TrackWheelUpperBody();
                    this.m_motionModule = this.m_legModule;
                    this.m_attackModule = this.m_armModule;
                }
                initializeFrom(srcRole:TrackWheelRole):void
                {
                    if(srcRole != null)
                    {
                        this.campType = srcRole.campType;
                        this.lifeTime = srcRole.lifeTime;
                        this.attackDis = srcRole.attackDis;
                        this.radius = srcRole.radius;
                        //this.initialize(srcRole.getRendererScene(), srcRole.m_renderProcessIndex, srcRole.m_srcTrackWheel, null, upperrEntity);
                    }
                }
                initialize(sc:RendererScene,renderProcessIndex:number,srcTrackWheel:BoxGroupTrack, weapBody:TrackWheelWeaponBody,chassisBody:TrackWheelChassisBody, dis:number = 50.0):void
                {
                    if(this.m_rscene == null && sc != null)
                    {
                        this.m_rscene = sc;
                        this.m_srcTrackWheel = srcTrackWheel;

                        let offsetPos:Vector3D = new Vector3D(0.0,0.0,0.0);
                        this.m_legModule.initialize(sc,renderProcessIndex, chassisBody, this.m_srcTrackWheel, dis, offsetPos);
                        this.m_armModule.initialize(sc,renderProcessIndex, weapBody, offsetPos);

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
                    }
                }
                wake():void
                {
                    super.wake();
                }
                // 获得被击中位置
                getHitPos(outPos:Vector3D):void
                {
                    outPos.copyFrom(this.position);
                    outPos.y += 50;
                }
                // 获得被击毁位置
                getDestroyedPos(outPos:Vector3D):void
                {
                    outPos.copyFrom(this.position);
                    outPos.y += 30;
                }
                consume(power:number):void
                {
                    this.lifeTime -= power;
                    if(this.lifeTime < 1)
                    {
                        this.sleep();
                    }
                }
                attackTest():boolean
                {
                    return true;
                }

            }
        }
    }
}
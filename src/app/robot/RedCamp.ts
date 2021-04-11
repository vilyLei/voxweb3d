/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as IRoleCampT from "../../app/robot/IRoleCamp";
import * as IAttackDstT from "../../app/robot/IAttackDst";
import * as CampT from "../../app/robot/Camp";
import * as AssetsModuleT from "../../app/robot/assets/AssetsModule";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as EruptionEffectPoolT from "../../particle/effect/EruptionEffectPool";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import IRoleCamp = IRoleCampT.app.robot.IRoleCamp;
import IAttackDst = IAttackDstT.app.robot.IAttackDst;
import CampType = CampT.app.robot.CampType;
import CampFindMode = CampT.app.robot.CampFindMode;
import AssetsModule = AssetsModuleT.app.robot.assets.AssetsModule;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import EruptionEffectPool = EruptionEffectPoolT.particle.effect.EruptionEffectPool;

export namespace app
{
    export namespace robot
    {
        export class RedCamp implements IRoleCamp
        {
            private m_rsc:RendererScene = null;
            private m_roles:IAttackDst[] = [];
            private m_freeRoles:IAttackDst[] = [];
            private m_tempV0:Vector3D = new Vector3D();
            private m_eff0Pool:EruptionEffectPool = null;
            distance:number = 0.0;
            constructor()
            {
            }
            initialize(rsc:RendererScene):void
            {
                if(this.m_rsc == null)
                {
                    this.m_rsc = rsc;

                    if(this.m_eff0Pool == null)
                    {
                        //  let texFlame:TextureProxy = this.m_textures[8];//"static/assets/testEFT4.jpg"
                        //  let texSolid:TextureProxy = this.m_textures[3];
                        this.m_eff0Pool = new EruptionEffectPool();
                        this.m_eff0Pool.timeSpeed = 15.0;
                        this.m_eff0Pool.initialize(this.m_rsc,1, 60,50,
                            AssetsModule.GetImageTexByUrl("static/assets/testEFT4.jpg"),
                            AssetsModule.GetImageTexByUrl("static/assets/stones_02.png"),
                            true);
                        //  this.m_eff0Pool.createEffect(null);
                    }
                }
            }
            addRole(role:IAttackDst):void
            {
                this.m_roles.push(role);
            }
            findAttDst(pos:Vector3D, radius:number,findMode:CampFindMode,dstCampType:CampType):IAttackDst
            {
                if(dstCampType == CampType.Red)
                {
                    let i:number = 0;
                    let list:IAttackDst[] = this.m_roles;
                    let len:number = list.length;
                    let role:IAttackDst = null;
                    let dis:number;
                    for(; i < len; ++i)
                    {
                        role = list[i];
                        if(role.lifeTime > 0)
                        {
                            dis = radius + role.radius;
                            dis *= dis;
                            this.m_tempV0.subVecsTo(pos, role.position);
                            this.distance = this.m_tempV0.getLengthSquared();
                            if(dis >= this.distance)
                            {
                                this.distance = Math.sqrt(this.distance);
                                //console.log("find a role in red camp.");
                                return role;
                            }
                        }
                        else
                        {
                            console.log("del a role, because of its life time value is less 0.");
                            role.getDestroyPos(this.m_tempV0);
                            this.m_eff0Pool.createEffect(this.m_tempV0);
                            //m_tempV0
                            list.splice(i,1);
                            i --;
                            len --;
                            this.m_freeRoles.push(role);
                            role.setVisible(false);
                        }
                    }
                }
                return null;
            }
            run():void
            {
                this.m_eff0Pool.run();
            }
        }
    }
}
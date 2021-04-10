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

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import IRoleCamp = IRoleCampT.app.robot.IRoleCamp;
import IAttackDst = IAttackDstT.app.robot.IAttackDst;
import CampType = CampT.app.robot.CampType;
import CampFindMode = CampT.app.robot.CampFindMode;

export namespace app
{
    export namespace robot
    {
        export class RedCamp implements IRoleCamp
        {
            private m_roles:IAttackDst[] = [];
            private m_freeRoles:IAttackDst[] = [];
            private m_tempV0:Vector3D = new Vector3D();
            constructor()
            {
            }
            initialize():void
            {
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
                            //console.log();
                            if(dis >= this.m_tempV0.getLengthSquared())
                            {
                                //console.log("find a role in red camp.");
                                return role;
                            }
                        }
                        else
                        {
                            console.log("del a role, because of its life time value is less 0.");
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
            }
        }
    }
}
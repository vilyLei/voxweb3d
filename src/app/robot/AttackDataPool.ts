/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as IAttackDstT from "../../app/robot/attack/IAttackDst";
import * as TriggerDataT from "../../app/robot/TriggerData";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import IAttackDst = IAttackDstT.app.robot.attack.IAttackDst;
import TriggerData = TriggerDataT.app.robot.TriggerData;

export namespace app
{
    export namespace robot
    {
        export class AttackDataPool
        {
            private static s_ins:AttackDataPool = null;
            dataList:TriggerData[] = [];
            private constructor()
            {
                if(AttackDataPool.s_ins != null)
                {
                    throw Error("Error!");
                }
                AttackDataPool.s_ins = this;
            }
            static GetInstance():AttackDataPool
            {
                if(AttackDataPool.s_ins != null)
                {
                    return AttackDataPool.s_ins;
                }
                return new AttackDataPool();
            }
            addTriggerData(data:TriggerData):void
            {
                if(data.status == 0)
                {
                    console.log("add a TriggerData ins.");
                    data.status = 1;
                    this.dataList.push(data);
                }
            }
        }
    }
}
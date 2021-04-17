/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as IAttackDstT from "../../app/robot/attack/IAttackDst";
import * as CampTypeT from "../../app/robot/camp/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import IAttackDst = IAttackDstT.app.robot.attack.IAttackDst;
import CampType = CampTypeT.app.robot.camp.CampType;

export namespace app
{
    export namespace robot
    {
        export class TriggerData
        {
            campType:CampType = CampType.Blue;
            attackDst:IAttackDst = null;
            dstPos:Vector3D = new Vector3D();
            bulType:number = 0;
            delayTime:number = 2;
            value:number = 30;

            status:number = 0;
            constructor()
            {
            }
            reset():void
            {
                this.delayTime = 2;
                this.status = 0;
            }
            trigger():boolean
            {
                if(this.delayTime > 0)
                {
                    this.delayTime--;                    
                }
                return this.delayTime < 1;
            }

        }
    }
}
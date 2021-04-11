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
        export class BlueCamp implements IRoleCamp
        {
            distance:number = 0.0;
            constructor()
            {
            }
            initialize():void
            {
            }
            findAttDst(pos:Vector3D, radius:number, findMode:CampFindMode,dstCampType:CampType):IAttackDst
            {
                if(dstCampType == CampType.Blue)
                {

                }
                return null;
            }
            run():void
            {
            }
        }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as CampTypeT from "../../app/robot/Camp";
import * as IAttackDstT from "../../app/robot/IAttackDst";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import CampType = CampTypeT.app.robot.CampType;
import CampFindMode = CampTypeT.app.robot.CampFindMode;
import IAttackDst = IAttackDstT.app.robot.IAttackDst;

export namespace app
{
    export namespace robot
    {
        export interface IRoleCamp
        {
            distance:number;
            findAttDst(pos:Vector3D, radius:number, findMode:CampFindMode,dstCampType:CampType):IAttackDst;
            run():void;
        }
    }
}
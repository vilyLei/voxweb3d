/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../../vox/math/MathConst";
import * as Vector3T from "../../../vox/math/Vector3D";
import * as CampT from "../../../app/robot/Camp";
import * as IRoleCampT from "../../../app/robot/IRoleCamp";
import * as IAttackDstT from "../../../app/robot/attack/IAttackDst";

import Vector3D = Vector3T.vox.math.Vector3D;
import CampType = CampT.app.robot.CampType;
import IRoleCamp = IRoleCampT.app.robot.IRoleCamp;
import IAttackDst = IAttackDstT.app.robot.attack.IAttackDst;
import CampFindMode = CampT.app.robot.CampFindMode;

export namespace app
{
    export namespace robot
    {
        export namespace attack
        {
            export interface IDstFinder
            {
                resetState():void;
                setDelayTime(delayTime:number):void;
                testAttDst(direcDegree:number):IAttackDst;
                findAttDst(direcDegree:number):IAttackDst;
                findNextDst():IAttackDst;
            }
        }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as CampTypeT from "../../app/robot/camp/Camp";
import * as IAttackDstT from "../../app/robot/attack/IAttackDst";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import CampType = CampTypeT.app.robot.camp.CampType;
import CampFindMode = CampTypeT.app.robot.camp.CampFindMode;
import IAttackDst = IAttackDstT.app.robot.attack.IAttackDst;

export namespace app
{
    export namespace robot
    {
        export interface IRoleCamp
        {
            distance:number;
            testSpecAttDst(role:IAttackDst, pos:Vector3D, radius:number,findMode:CampFindMode,dstCampType:CampType,direcDegree:number,fov:number):IAttackDst;
            testAttDst( pos:Vector3D, radius:number,findMode:CampFindMode,dstCampType:CampType,direcDegree:number,fov:number):IAttackDst;
            findAttDst(pos:Vector3D, radius:number, findMode:CampFindMode,dstCampType:CampType,direcDegree:number,fov:number):IAttackDst;
            run():void;
        }
    }
}
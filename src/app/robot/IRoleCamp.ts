/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import {CampType,CampFindMode} from "../../app/robot/camp/Camp";
import IAttackDst from "../../app/robot/attack/IAttackDst";

export default interface IRoleCamp
{
    distance:number;
    testSpecAttDst(role:IAttackDst, pos:Vector3D, radius:number,findMode:CampFindMode,srcCampType:CampType,direcDegree:number,fov:number):IAttackDst;
    testAttDst( pos:Vector3D, radius:number,findMode:CampFindMode,srcCampType:CampType,direcDegree:number,fov:number):IAttackDst;
    findAttDst(pos:Vector3D, radius:number, findMode:CampFindMode,srcCampType:CampType,direcDegree:number,fov:number):IAttackDst;
    run():void;
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import IRoleCamp from "../../../app/robot/IRoleCamp";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import { CampType, CampFindMode } from "../../../app/robot/camp/Camp";

export default class BlueCamp implements IRoleCamp {
    distance: number = 0.0;
    constructor() {
    }
    initialize(): void {
    }
    testAttDst(pos: Vector3D, radius: number, findMode: CampFindMode, dstCampType: CampType, direcDegree: number, fov: number = -1): IAttackDst {
        return null;
    }
    testSpecAttDst(role: IAttackDst, pos: Vector3D, radius: number, findMode: CampFindMode, dstCampType: CampType, direcDegree: number, fov: number = -1): IAttackDst {
        return null;
    }
    findAttDst(pos: Vector3D, radius: number, findMode: CampFindMode, dstCampType: CampType, direcDegree: number, fov: number = -1): IAttackDst {
        if (dstCampType == CampType.Blue) {

        }
        return null;
    }
    run(): void {
    }
}
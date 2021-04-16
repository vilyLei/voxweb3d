/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../../vox/math/Vector3D";
import * as CampT from "../../../app/robot/Camp";

import Vector3D = Vector3T.vox.math.Vector3D;
import CampType = CampT.app.robot.CampType;

export namespace app
{
    export namespace robot
    {
        export namespace scene
        {
            export interface ITerrain
            {
                getFreePos(fixPos:Vector3D):Vector3D;
            }
        }
    }
}
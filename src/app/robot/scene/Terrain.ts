/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../../vox/math/Vector3D";
import * as CampT from "../../../app/robot/Camp";
import * as ITerrainT from "../../../app/robot/scene/ITerrain";

import Vector3D = Vector3T.vox.math.Vector3D;
import CampType = CampT.app.robot.CampType;
import ITerrain = ITerrainT.app.robot.scene.ITerrain;

export namespace app
{
    export namespace robot
    {
        export namespace scene
        {
            export class Terrain implements ITerrain
            {
                private m_freePos:Vector3D = new Vector3D();
                constructor(){}
                getFreePos():Vector3D
                {
                    this.m_freePos.setXYZ(Math.random() * 900.0 - 450.0,0.0,Math.random() * 900.0 - 450.0);
                    return this.m_freePos;
                }
            }
        }
    }
}
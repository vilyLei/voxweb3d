/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import ITerrain from "../../../app/robot/scene/ITerrain";
export default class Terrain implements ITerrain
{
    private m_freePos:Vector3D = new Vector3D();
    constructor(){}
    getFreePos(fixPos:Vector3D):Vector3D
    {
        //this.m_freePos.setXYZ(Math.random() * 900.0 - 450.0,0.0,Math.random() * 900.0 - 450.0);
        this.m_freePos.setXYZ(fixPos.x + (Math.random() * 500.0) - 250.0, 0.0, fixPos.z + (Math.random() * 500.0) - 250.0);
        return this.m_freePos;
    }
}
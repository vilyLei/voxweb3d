/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// Ray pick selection obj
import * as Vector3DT from "../../vox/geom/Vector3";
import * as IRenderEntityT from "../../vox/entity/IRenderEntity";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import IRenderEntity = IRenderEntityT.vox.entity.IRenderEntity;

export namespace vox
{
    export namespace scene
    {
        export class RaySelectedNode
        {
            constructor(){}
            entity:IRenderEntity = null;
            // object space hit position
            lpv:Vector3D = new Vector3D();
            // world space hit position
            wpv:Vector3D = new Vector3D();
            dis:number = 0.0;
        }
    }
}
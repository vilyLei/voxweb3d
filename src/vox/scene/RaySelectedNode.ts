/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// Ray pick selection obj
import Vector3D from "../../vox/math/Vector3D";
import IRenderEntity from "../../vox/render/IRenderEntity";

export default class RaySelectedNode
{
    constructor(){}
    entity:IRenderEntity = null;
    // object space hit position
    lpv:Vector3D = new Vector3D();
    // world space hit position
    wpv:Vector3D = new Vector3D();
    dis:number = 0.0;
}
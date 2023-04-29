/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// Ray pick selection obj
import IVector3D from "../../vox/math/IVector3D";
import IRenderEntity from "../../vox/render/IRenderEntity";

export default interface IRaySelectedNode {

    entity: IRenderEntity;
    // object space hit position
    lpv: IVector3D;
    // world space hit position
    wpv: IVector3D;
    dis: number;
    flag: number;
}
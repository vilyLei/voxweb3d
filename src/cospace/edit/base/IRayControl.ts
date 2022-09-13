/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import {ISelectable} from "./ISelectable";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

/**
 * the behavior normalization of an entity that controlled by ray
 */
interface IRayControl extends ISelectable {
    moveByRay(rpv: IVector3D, rtv: IVector3D): void
}
export { IRayControl };
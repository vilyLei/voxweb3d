/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import {ISelectable} from "../../voxeditor/base/ISelectable";
import IEntityTransform from "../../vox/entity/IEntityTransform";

/**
 * the behavior normalization of an entity that controlled by ray
 */
interface IRayControl extends ISelectable {
    setTarget(target: IEntityTransform): void;
    moveByRay(rpv: Vector3D, rtv: Vector3D): void
}
export { IRayControl };
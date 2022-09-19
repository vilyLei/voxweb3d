/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IUserEditController } from "../base/IUserEditController";


/**
 * 在三个坐标轴上拖动
 */
interface IDragRotationController extends IUserEditController {

    /**
     * example: the value is 0.05
     */
    fixSize: number;
    radius: number;
    pickTestAxisRadius: number;
    
    moveByRay(rpv: IVector3D, rtv: IVector3D): void;
}
export { IDragRotationController }
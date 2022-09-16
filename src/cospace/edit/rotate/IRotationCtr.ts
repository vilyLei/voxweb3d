/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRayControl } from "../base/IRayControl";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IVector3D from "../../../vox/math/IVector3D";


/**
 * 在三个坐标轴上旋转
 */
interface IRotationCtr extends IRayControl {
    
    run(camera: IRenderCamera, rtv: IVector3D): void;
}

export { IRotationCtr }
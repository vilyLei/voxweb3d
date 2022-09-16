/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRayControl } from "../base/IRayControl";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";


/**
 * 在三个坐标轴上旋转
 */
interface IRotationCtr extends IRayControl {
    
    run(camera: IRenderCamera): void;
}

export { IRotationCtr }
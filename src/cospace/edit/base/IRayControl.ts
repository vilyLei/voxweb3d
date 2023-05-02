/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import {ISelectable} from "./ISelectable";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";

/**
 * the behavior normalization of an entity that controlled by ray
 */
interface IRayControl extends ISelectable {
    moveByRay(rpv: IVector3D, rtv: IVector3D): void;
    run(camera: IRenderCamera, rtv: IVector3D): void;
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
}
export { IRayControl };
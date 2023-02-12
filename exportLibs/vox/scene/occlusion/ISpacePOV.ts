/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// Project Occlusion Volume

import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";

export default interface ISpacePOV {
    status: number;
    enabled: boolean;
    updateOccData(): void;
    getOccRadius(): number;
    getOccCenter(): IVector3D;
    addSubPov(pov: ISpacePOV): void
    cameraTest(camera: IRenderCamera): void;
    begin(): void;
    test(bounds: IAABB, cullMask: number): void;
}

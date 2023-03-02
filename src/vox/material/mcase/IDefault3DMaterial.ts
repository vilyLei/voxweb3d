/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColorMaterial from "./IColorMaterial";
import IColor4 from "../IColor4";

export default interface IDefault3DMaterial extends IColorMaterial {
    name: string;
    vertColorEnabled: boolean;
    vtxMatrixTransform: boolean;
    setUVOffset(px: number, py: number): void;
    setUVScale(sx: number, sy: number): void;
}
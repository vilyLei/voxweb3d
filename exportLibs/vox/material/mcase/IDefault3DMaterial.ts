/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColorMaterial from "./IColorMaterial";
import IColor4 from "../IColor4";

export default interface IDefault3DMaterial extends IColorMaterial {

    vertColorEnabled: boolean;
    vtxMatrixTransform: boolean;
}
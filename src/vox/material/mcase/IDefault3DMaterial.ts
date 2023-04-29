/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColorMaterial from "./IColorMaterial";
import IColor4 from "../IColor4";

export default interface IDefault3DMaterial extends IColorMaterial {
    name: string;
    /**
     * the default value is false
     */
    vertColorEnabled: boolean;
    /**
     * the default value is true
     */
    vtxMatrixTransform: boolean;
    /**
     * the default value is enpty string
     */
	fragBodyTailCode: string;
    /**
     * the default value is enpty string
     */
	fragHeadTailCode: string;
    /**
     * the default value is false
     */
    alignScreen?: boolean;
    /**
     * the default value is false
     */
    fixAlignScreen? :boolean;
    /**
     * the default value is false
     */
    mapLodEnabled?: boolean;
    setUVOffset(px: number, py: number): void;
    setUVScale(sx: number, sy: number): void;
    setTextureLodLevel?(lodLv: number): void;
}

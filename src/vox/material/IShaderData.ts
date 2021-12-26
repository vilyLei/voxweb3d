
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformLine from "../../vox/material/code/UniformLine";
import ShaderCompileInfo from "../../vox/material/code/ShaderCompileInfo";

export default interface IShaderData {

    adaptationShaderVersion: boolean;
    preCompileInfo: ShaderCompileInfo;
    getVSCodeStr(): string;
    getFSCodeStr(): string;
    getLayoutBit(): number;
    getMid(): number;
    getFragOutputTotal(): number;
    getAttriSizeList(): number[];
    getTexUniformNames(): string[];
    getUniforms(): UniformLine[];

    haveCommonUniform(): boolean;
    getAttriNSList(): string[];
    getUid(): number;
    getTexTotal(): number;
    // use texture true or false
    haveTexture(): boolean;
    // recode shader uniform including status
    dataUniformEnabled: boolean;

    getLocationsTotal(): number;
    getUniformTypeNameByNS(ns: string): string;
    getUniformTypeByNS(ns: string): number;
    hasUniformByName(ns: string): boolean;
    getUniformLengthByNS(ns: string): number;
    getUniqueShaderName(): string;
}
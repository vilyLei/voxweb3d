/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import IShaderUniformData from "../IShaderUniformData";
import IRenderTexture from "../../render/texture/IRenderTexture";

interface IUniformComp {

    initialize(): void;
    use(shaderBuilder: IShaderCodeBuilder): void;
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[]): IRenderTexture[];
    reset(): void;
    destroy(): void;
    getUniqueNSKeyString(): string;
    clone(): IUniformComp;
    getParams(): Float32Array;
    getParamsTotal(): number;
    buildShaderUniformData(data: IShaderUniformData): void;
}
export { IUniformComp };
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import IShaderCodeObject from "./IShaderCodeObject";
import ShaderUniformData from "./ShaderUniformData";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

interface IMaterialDecorator {
    
    lightEnabled: boolean;
    shadowReceiveEnabled: boolean;
    fogEnabled: boolean;
    glossinessEnabeld: boolean;
    // texturesTotal: number;

    buildBufParams(): void;
    createTextureList(coder: IShaderCodeBuilder): IRenderTexture[];
    buildShader(coder: IShaderCodeBuilder): void;
    createUniformData(): ShaderUniformData;
    getShaderCodeObjectUUID(): ShaderCodeUUID;
    getShaderCodeObject(): IShaderCodeObject;
    getUniqueName(): string;
    // destroy(): void;
    
}
export { IMaterialDecorator }
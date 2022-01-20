/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../vox/material/ShaderUniformData";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { ShaderTextureBuilder } from "../../vox/material/ShaderTextureBuilder";

interface ISimpleMaterialDecorator {
    /**
     * the  default  value is false
     */
    vertColorEnabled: boolean;
    /**
     * the  default  value is false
     */
    premultiplyAlpha: boolean;
    /**
     * the  default  value is false
     */
    fogEnabled: boolean;
    
    buildBufParams(): void;
    /**
     * user build textures list
     */
    buildTextureList(builder: ShaderTextureBuilder): void;
    buildShader(coder: IShaderCodeBuilder): void;
    /**
     * @returns local uniform data
     */
    createUniformData(): ShaderUniformData;
    /**
     * @returns unique name string
     */
    getUniqueName(): string;
    
}
export { ISimpleMaterialDecorator }
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderUniformData from "../../vox/material/IShaderUniformData";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { IShaderTextureBuilder } from "../../vox/material/IShaderTextureBuilder";

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
    buildTextureList(builder: IShaderTextureBuilder): void;
    buildShader(coder: IShaderCodeBuilder): void;
    /**
     * @returns local uniform data
     */
    createUniformData(): IShaderUniformData;
    /**
     * @returns unique name string
     */
    getUniqueName(): string;
    
}
export { ISimpleMaterialDecorator }
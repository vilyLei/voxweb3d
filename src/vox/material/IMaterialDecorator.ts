/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import IShaderCodeObject from "../../vox/material/IShaderCodeObject";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { ShaderTextureBuilder } from "../../vox/material/ShaderTextureBuilder";

interface IMaterialDecorator {
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
    shadowReceiveEnabled: boolean;
    /**
     * the  default  value is false
     */
    lightEnabled: boolean;
    /**
     * the  default  value is false
     */
    fogEnabled: boolean;
    /**
     * the  default  value is false
     */
    envAmbientLightEnabled: boolean;
    /**
     * the  default  value is false
     */
    brightnessOverlayEnabeld: boolean;
    /**
     * the default value is true
     */
    glossinessEnabeld: boolean;

    buildBufParams(): void;
    /**
     * @returns textures list
     */
    createTextureList(builder: ShaderTextureBuilder): void;
    buildShader(coder: IShaderCodeBuilder): void;
    /**
     * @returns local uniform data
     */
    createUniformData(): ShaderUniformData;
    /**
     * get shader code object uuid, it is defined in the system
     * @returns shader code object uuid
     */
    getShaderCodeObjectUUID(): ShaderCodeUUID;
    /**
     * get custom shader code object
     * @returns shader code object
     */
    getShaderCodeObject(): IShaderCodeObject;
    /**
     * @returns unique name string
     */
    getUniqueName(): string;
    // destroy(): void;
    
}
export { IMaterialDecorator }
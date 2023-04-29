/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import IShaderCodeObject from "../../vox/material/IShaderCodeObject";
import IShaderUniformData from "../../vox/material/IShaderUniformData";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { IShaderTextureBuilder } from "../../vox/material/IShaderTextureBuilder";
import { IUniformComp } from "../../vox/material/component/IUniformComp";

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

    vertUniform?: IUniformComp;
    
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
     * get shader code object uuid, it is defined in the system
     * @returns shader code object uuid
     */
    // getShaderCodeObjectUUID(): ShaderCodeUUID;
    getShaderCodeObjectUUID(): string;
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
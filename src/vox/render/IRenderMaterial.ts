/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderData from "../../vox/material/IShaderData";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import IShaderUniform from "../../vox/material/IShaderUniform";
import IRenderTexture from "../../vox/render/IRenderTexture";
interface IRenderMaterial
{
    __$troMid:number;
    __$uniform:IShaderUniform;
    initializeByCodeBuf(textureEnabled:boolean):void;
    createSharedUniforms():IShaderUniform[];
    createSelfUniformData():ShaderUniformData;
    hasShaderData():boolean;
    getShaderData():IShaderData;
    getTextureList():IRenderTexture[];
    getCodeBuf():ShaderCodeBuffer;
    __$attachThis():void;
    __$detachThis():void;
}
export default IRenderMaterial;
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IShaderDataT from "../../vox/material/IShaderData";
import * as ShaderCodeBufferT from "../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as IRenderTextureT from "../../vox/render/IRenderTexture";

import IShaderData = IShaderDataT.vox.material.IShaderData;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import IRenderTexture = IRenderTextureT.vox.render.IRenderTexture;

export namespace vox
{
    export namespace render
    {
        export interface IRenderMaterial
        {
            __$troMid:number;
            __$uniform:IShaderUniform;
            initializeByCodeBuf(textureEnabled:boolean):void;
            createSharedUniform():IShaderUniform;
            createSelfUniformData():ShaderUniformData;
            hasShaderData():boolean;
            getShaderData():IShaderData;
            getTextureList():IRenderTexture[];
            getCodeBuf():ShaderCodeBuffer;
        }
    }
}
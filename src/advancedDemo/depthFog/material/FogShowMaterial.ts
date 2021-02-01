/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace advancedDemo
{
    export namespace depthFog
    {
        export namespace material
        {
            class FogShowShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:FogShowShaderBuffer = new FogShowShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("FogShowShaderBuffer::initialize()...");
                    this.m_uniqueName = "FogShowShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
uniform sampler2D u_sampler2;\n\
uniform sampler2D u_sampler3;\n\
in vec2 v_texUV;\n\
layout(location = 0) out vec4 OutputColor;\n\
void main()\n\
{\n\
    vec4 farColor4 = texture(u_sampler0, v_texUV);\n\
    vec4 nearColor4 = texture(u_sampler1, v_texUV);\n\
    vec4 middColor4 = texture(u_sampler2, v_texUV);\n\
    vec4 color4 = texture(u_sampler3, v_texUV);\n\
    if(farColor4.w > 0.0001)\n\
    {\n\
        nearColor4.w = (nearColor4.w < 0.001)?0.001:nearColor4.w;\n\
        vec4 fogColor4 = vec4(0.8,0.8,0.8,0.0);\n\
        float factor = clamp((farColor4.w - nearColor4.w)/0.8,0.0,1.0);\n\
        float dis = farColor4.w - nearColor4.w;\n\
        //float k = clamp(pow(dis,1.0),0.0,1.0);\n\
        float k = (clamp(dis,0.0,1.0),1.0);\n\
        k = clamp( ((min(middColor4.w, farColor4.w) - nearColor4.w) * k) / (farColor4.w - nearColor4.w), 0.0, 1.0 );\n\
        k = pow(factor,1.0) * pow(k,3.0);\n\
        //OutputColor = vec4(fogColor4.xyz * 0.0 + color4.xyz, 1.0);\n\
        OutputColor = vec4(fogColor4.xyz * k + (1.0 - k) * color4.xyz, 1.0);\n\
        //OutputColor = vec4(vec3(0.0,k * 1.1,0.0), 1.0);\n\
        //OutputColor = vec4(vec3(0.0,farColor4.w,0.0), 1.0);\n\
    }else{\n\
        OutputColor = color4;\n\
    }\n\
}\n\
";
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) in vec3 a_vs;\n\
layout(location = 1) in vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
out vec2 v_texUV;\n\
void main()\n\
{\n\
gl_Position = u_objMat * vec4(a_vs,1.0);\n\
v_texUV = vec2(a_uvs.x,a_uvs.y);\n\
}\n\
";
                    return vtxCode;
                }
                getUniqueShaderName()
                {
                    //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
                    return this.m_uniqueName;
                }
                toString():string
                {
                    return "[FogShowShaderBuffer()]";
                }

                static GetInstance():FogShowShaderBuffer
                {
                    return FogShowShaderBuffer.___s_instance;
                }
            }
            
            export class FogShowMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return FogShowShaderBuffer.GetInstance();
                }
                private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
                
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.m_colorArray];
                    return oum;
                }
            }
        }
    }
}
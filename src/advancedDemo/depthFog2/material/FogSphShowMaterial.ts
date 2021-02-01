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
    export namespace depthFog2
    {
        export namespace material
        {
            class FogSphShowShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:FogSphShowShaderBuffer = new FogSphShowShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("FogSphShowShaderBuffer::initialize()...");
                    this.m_uniqueName = "FogSphShowShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
uniform vec4 u_color;\n\
in vec2 v_texUV;\n\
layout(location = 0) out vec4 OutputColor;\n\
void main()\n\
{\n\
    vec4 color4 = texture(u_sampler0, v_texUV);\n\
    vec4 factor4 = texture(u_sampler1, v_texUV);\n\
    vec4 fogColor4 = u_color;// * vec4(1.0,0.1,0.5,1.0);\n\
    OutputColor = vec4(fogColor4.xyz * factor4.xyz + (1.0 - factor4.xyz) * color4.xyz, 1.0);\n\
    //OutputColor = vec4(0.0 * fogColor4.xyz * factor4.xxx + (1.0 - factor4.xxx) * color4.xyz, 1.0);\n\
    //OutputColor = vec4(0.0 * fogColor4.xyz * factor4.xyz + (1.0 - factor4.xyz) * color4.xyz, 1.0);\n\
    //OutputColor = vec4(fogColor4.xyz * (1.0 - factor4.xyz) + factor4.xyz * color4.xyz, 1.0);\n\
    //OutputColor = vec4(factor4.xyz * factor4.w,1.0);\n\
    //OutputColor = vec4(factor4.xyz,1.0);\n\
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
                    return "[FogSphShowShaderBuffer()]";
                }

                static GetInstance():FogSphShowShaderBuffer
                {
                    return FogSphShowShaderBuffer.___s_instance;
                }
            }
            
            export class FogSphShowMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return FogSphShowShaderBuffer.GetInstance();
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
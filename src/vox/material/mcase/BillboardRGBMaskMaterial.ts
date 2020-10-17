/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as BillboardMaterialT from "../../../vox/material/mcase/BillboardMaterial";

import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import BillboardMaterial = BillboardMaterialT.vox.material.mcase.BillboardMaterial;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class BillboardRGBMaskShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    this.m_uniqueName = "BillboardRGBMaskShader";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
in vec4 v_colorMult;\n\
in vec4 v_colorOffset;\n\
in vec2 v_texUV;\n\
layout(location = 0) out vec4 FragColor;\n\
void main()\n\
{\n\
vec4 color = texture(u_sampler0, v_texUV);\n\
vec4 maskColor = texture(u_sampler1, v_texUV);\n\
color.rgb = max(color.rgb * v_colorMult.xyz + v_colorOffset.xyz,0.0) * maskColor.xyz;\n\
color.rgb *= color.rgb;\n\
color.rgb *= 1.1;\n\
color.a = maskColor.a;\n\
FragColor = color;\n\
}\n\
"
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) in vec2 a_vs;\n\
layout(location = 1) in vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
uniform vec4 u_billParam[3];\n\
out vec4 v_colorMult;\n\
out vec4 v_colorOffset;\n\
out vec2 v_texUV;\n\
void main()\n\
{\n\
vec4 temp = u_billParam[0];\n\
float cosv = cos(temp.z);\n\
float sinv = sin(temp.z);\n\
vec2 vtx = vec2(a_vs.x * temp.x, a_vs.y * temp.y);\n\
vec2 vtx_pos = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);\n\
vec4 pos = u_viewMat * u_objMat * vec4(0.0,0.0,0.0,1.0);\n\
pos.xy += vtx_pos.xy;\n\
gl_Position =  u_projMat * pos;\n\
v_texUV = a_uvs;\n\
v_colorMult = u_billParam[1];\n\
v_colorOffset = u_billParam[2];\n\
}\n\
"
                    return vtxCode;
                }
                getUniqueShaderName():string
                {
                    return this.m_uniqueName;
                }
                toString():string
                {
                    return "[BillboardRGBMaskShaderBuffer()]";
                }
                private static ___s_instance:BillboardRGBMaskShaderBuffer = new BillboardRGBMaskShaderBuffer();
                static GetInstance():BillboardRGBMaskShaderBuffer
                {
                    if(BillboardRGBMaskShaderBuffer.___s_instance != null)
                    {
                        return BillboardRGBMaskShaderBuffer.___s_instance;
                    }
                    BillboardRGBMaskShaderBuffer.___s_instance = new BillboardRGBMaskShaderBuffer();
                    return BillboardRGBMaskShaderBuffer.___s_instance;
                }
            }

            export class BillboardRGBMaskMaterial extends BillboardMaterial
            {
                constructor()
                {
                    super();
                }
                getCodeBuf():ShaderCodeBuffer
                {
                    let buf:ShaderCodeBuffer = BillboardRGBMaskShaderBuffer.GetInstance();        
                    return buf;
                }                
            }
        }
    }
}
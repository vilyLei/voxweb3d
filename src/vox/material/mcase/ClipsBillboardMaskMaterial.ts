/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import * as ClipsBillboardMaterialT from "../../../vox/material/mcase/ClipsBillboardMaterial";

//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ClipsBillboardMaterial = ClipsBillboardMaterialT.vox.material.mcase.ClipsBillboardMaterial;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class ClipsBillboardMaskShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }                
                private m_uniqueName:string = "";
                alphaEnabled:boolean = false;
                clipFollowEnabled:boolean = true;
                initialize(texEnabled:boolean):void
                {
                    this.m_uniqueName = "ClipsBillboardMaskShader";
                    if(this.alphaEnabled)
                    {
                        this.m_uniqueName += "_alpha";
                    }
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
in vec4 v_texUV;\n\
layout(location = 0) out vec4 FragColor;\n\
void main()\n\
{\n\
";
                    if(this.clipFollowEnabled)
                    {
                        fragCode +=
"\
vec4 color = texture(u_sampler0, v_texUV.xy);\n\
";
                    }
                    else
                    {
                        fragCode +=
"\
vec4 color = texture(u_sampler0, v_texUV.zw);\n\
";
                    }
                    if(this.alphaEnabled)
                    {
                        fragCode +=
"\
vec4 maskColor = texture(u_sampler1, v_texUV.xy);\n\
color.rgb = max(color.rgb * v_colorMult.xyz + v_colorOffset.xyz,0.0);\n\
color.a = maskColor.a;\n\
";
                    }
                    else
                    {
                        fragCode +=
"\
vec4 maskColor = texture(u_sampler1, v_texUV.xy);\n\
color.rgb = max(color.rgb * v_colorMult.xyz + v_colorOffset.xyz,0.0) * maskColor.xyz;\n\
";
                    }
                    fragCode +=
"\
FragColor = color;\n\
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
layout(location = 0) in vec2 a_vs;\n\
layout(location = 1) in vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
uniform vec4 u_billParam[3];\n\
out vec4 v_colorMult;\n\
out vec4 v_colorOffset;\n\
out vec4 v_texUV;\n\
vec2 getGridUV(float t, vec2 uv, vec2 rc)\n\
{\n\
    vec2 dv = 1.0 / rc;\n\
    float index = floor(t * rc.x * rc.y);\n\
    index = index/rc.y;\n\
    float r = floor(index);\n\
    float c = floor(fract(index) * rc.y);\n\
    uv.x = dv.y * (c + uv.x);\n\
    uv.y = dv.x * (r + uv.y);\n\
    return uv;\n\
}\n\
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
v_colorMult = u_billParam[1];\n\
v_colorOffset = u_billParam[2];\n\
v_texUV.xy = getGridUV(v_colorOffset.w,a_uvs.xy,vec2(floor(temp.w),floor(10.1 * fract(temp.w))));\n\
v_texUV.zw = a_uvs.xy;\n\
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
                    return "[ClipsBillboardMaskShaderBuffer()]";
                }
                private static ___s_instance:ClipsBillboardMaskShaderBuffer = new ClipsBillboardMaskShaderBuffer();
                static GetInstance():ClipsBillboardMaskShaderBuffer
                {
                    if(ClipsBillboardMaskShaderBuffer.___s_instance != null)
                    {
                        return ClipsBillboardMaskShaderBuffer.___s_instance;
                    }
                    ClipsBillboardMaskShaderBuffer.___s_instance = new ClipsBillboardMaskShaderBuffer();
                    return ClipsBillboardMaskShaderBuffer.___s_instance;
                }
            }

            export class ClipsBillboardMaskMaterial extends ClipsBillboardMaterial
            {
                private m_alphaEnabled:boolean = false;
                private m_clipFollowEnabled:boolean = false;
                constructor(alphaEnabled:boolean = false,clipFollowEnabled:boolean = false)
                {
                    super();
                    this.m_alphaEnabled = alphaEnabled;
                    this.m_clipFollowEnabled = clipFollowEnabled;
                }
                getCodeBuf():ShaderCodeBuffer
                {
                    let buf:ClipsBillboardMaskShaderBuffer = ClipsBillboardMaskShaderBuffer.GetInstance();
                    buf.alphaEnabled = this.m_alphaEnabled;
                    buf.clipFollowEnabled = this.m_clipFollowEnabled;
                    return buf;
                }
            }
        }
    }
}
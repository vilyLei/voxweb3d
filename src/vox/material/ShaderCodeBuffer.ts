/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderTextureT from '../../vox/render/IRenderTexture';

import IRenderTexture = IRenderTextureT.vox.render.IRenderTexture;

export namespace vox
{
    export namespace material
    {
        export class ShaderCodeBuffer
        {
            private static ___s_csBuf:ShaderCodeBuffer = null;
            constructor()
            {
            }
            private m_texList:IRenderTexture[] = null;
            private m_texEnabled:boolean = true;
            initialize(texEnabled:boolean):void
            {
                if(ShaderCodeBuffer.___s_csBuf != null)
                {
                    if(ShaderCodeBuffer.___s_csBuf != this)
                    {
                        ShaderCodeBuffer.___s_csBuf.initialize(texEnabled);
                    }
                }
                this.m_texEnabled = texEnabled;
            }
            setIRenderTextureList(texList:IRenderTexture[]):void
            {
                this.m_texList = texList;
            }
            getIRenderTextureList():IRenderTexture[]
            {
                return this.m_texList;
            }
            buildShader():void
            {
            }
            getFragShaderCode():string
            {
                if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getFragShaderCode();
                //
                let codeStr:string = "";
                if(this.m_texEnabled)
                {
                    codeStr = 
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform vec4 u_color;\n\
in vec2 v_uvs;\n\
layout(location = 0) out vec4 FragColor;\n\
void main(){\n\
    FragColor = u_color * texture(u_sampler0, v_uvs);\n\
}\n\
";
                }
                else
                {
                    codeStr = 
"\
#version 300 es\n\
precision mediump float;\n\
uniform vec4 u_color;\n\
layout(location = 0) out vec4 FragColor;\n\
void main(){\n\
    FragColor = u_color;\n\
}\n\
";

                }
                return codeStr;
            }
            getVtxShaderCode():string
            {
                if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getVtxShaderCode();
                //
                let codeStr:string = "";
                if(this.m_texEnabled)
                {
                    codeStr =
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) in vec3 a_vs;\n\
layout(location = 1) in vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
out vec2 v_uvs;\n\
void main(){\n\
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);\n\
    v_uvs = a_uvs;\n\
}\n\
";
                }
                else
                {
                   
codeStr =
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) in vec3 a_vs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
void main(){\n\
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);\n\
}\n\
";
                }
                return codeStr;
            }
            getUniqueShaderName():string
            {
                if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getUniqueShaderName();
                if(this.m_texEnabled)
                {
                    return "vox_default_shd_tex";
                }                
                return "vox_default_shd";
            }
            toString():string
            {
                return "[ShaderCodeBuffer()]";
            }
            static UseShaderBuffer(buf:ShaderCodeBuffer):void
            {
                ShaderCodeBuffer.___s_csBuf = buf;
            }
        }
    }
}
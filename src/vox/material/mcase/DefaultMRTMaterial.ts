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


export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class DefaultMRTShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:DefaultMRTShaderBuffer = new DefaultMRTShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("DefaultMRTShaderBuffer::initialize()...");
                    this.m_uniqueName = "DefaultMRTShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = "";
                    if(RendererDeviece.IsWebGL2())
                    {
                    fragCode =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
in vec2 v_uvs;\n\
layout(location = 0) out vec4 FragColor0;\n\
layout(location = 1) out vec4 FragColor1;\n\
void main()\n\
{\n\
    vec4 color = texture(u_sampler0, v_uvs);\n\
    FragColor0 = vec4(color.rgb,1.0);\n\
    FragColor1 = vec4(1.0 - color.rgb * color.rgb * color.rgb,1.0);\n\
}\n\
";
                    }
                    else
                    {
                        fragCode =
"\
#extension GL_EXT_draw_buffers: require\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
varying vec2 v_uvs;\n\
void main()\n\
{\n\
    vec4 color = texture2D(u_sampler0, v_uvs);\n\
    gl_FragData[0] = vec4(color.rgb,1.0);\n\
    gl_FragData[1] = vec4(1.0 - color.rgb * color.rgb * color.rgb,1.0);\n\
}\n\
";
                    }
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = "";
                    if(RendererDeviece.IsWebGL2())
                    {
                        vtxCode =
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
    mat4 viewMat4 = u_viewMat * u_objMat;\n\
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);\n\
    gl_Position = u_projMat * viewPos;\n\
    v_uvs = a_uvs;\n\
}\n\
";
                    }
                    else
                    {
                        vtxCode =
"\
precision mediump float;\n\
attribute vec3 a_vs;\n\
attribute vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
varying vec2 v_uvs;\n\
void main(){\n\
    mat4 viewMat4 = u_viewMat * u_objMat;\n\
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);\n\
    gl_Position = u_projMat * viewPos;\n\
    v_uvs = a_uvs;\n\
}\n\
";
                    }
                    return vtxCode;
                }
                getUniqueShaderName()
                {
                    //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
                    return this.m_uniqueName;
                }
                toString():string
                {
                    return "[DefaultMRTShaderBuffer()]";
                }

                static GetInstance():DefaultMRTShaderBuffer
                {
                    return DefaultMRTShaderBuffer.___s_instance;
                }
            }
            
            export class DefaultMRTMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return DefaultMRTShaderBuffer.GetInstance();
                }
                colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
                
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.dataSizeList = [1];
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.colorArray];
                    return oum;
                }
            }
        }
    }
}
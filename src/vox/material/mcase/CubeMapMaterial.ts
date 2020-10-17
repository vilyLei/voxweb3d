/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class CubeMapShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:CubeMapShaderBuffer = null;
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("CubeMapShaderBuffer::initialize()...");
                    this.m_uniqueName = "CubeMapShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
uniform samplerCube u_sampler0;\n\
uniform vec4 u_color;\n\
in vec3 v_nvs;\n\
layout(location = 0) out vec4 FragColor;\n\
void main()\n\
{\n\
vec4 color4 = texture(u_sampler0, v_nvs) * u_color;\n\
FragColor = color4 * 0.5 + 0.5 * vec4(abs(v_nvs),1.0);\n\
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
layout(location = 2) in vec3 a_nvs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
out vec3 v_nvs;\n\
void main()\n\
{\n\
    vec4 wpos = u_objMat * vec4(a_vs,1.0);\n\
    gl_Position = u_projMat * u_viewMat * wpos;\n\
    v_nvs = a_nvs;\n\
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
                    return "[CubeMapShaderBuffer()]";
                }

                static GetInstance():CubeMapShaderBuffer
                {
                    if(CubeMapShaderBuffer.___s_instance != null)
                    {
                        return CubeMapShaderBuffer.___s_instance;
                    }
                    CubeMapShaderBuffer.___s_instance = new CubeMapShaderBuffer();
                    return CubeMapShaderBuffer.___s_instance;
                }
            }
            
            export class CubeMapMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return CubeMapShaderBuffer.GetInstance();
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
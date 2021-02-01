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
            export class CubeMapMRTShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:CubeMapMRTShaderBuffer = new CubeMapMRTShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("CubeMapMRTShaderBuffer::initialize()...");
                    this.m_uniqueName = "CubeMapMRTShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform vec4 u_color;\n\
in vec3 v_nv;\n\
in vec2 v_uvs;\n\
layout(location = 0) out vec4 OutputColor0;\n\
layout(location = 1) out vec4 OutputColor1;\n\
layout(location = 2) out vec4 OutputColor2;\n\
layout(location = 3) out vec4 OutputColor3;\n\
layout(location = 4) out vec4 OutputColor4;\n\
layout(location = 5) out vec4 OutputColor5;\n\
void main()\n\
{\n\
OutputColor0 = texture(u_sampler0, v_uvs.xy) * u_color;\n\
OutputColor1 = vec4(1.0,0.0,0.0,1.0);\n\
OutputColor2 = vec4(0.0,1.0,0.0,1.0);\n\
OutputColor3 = vec4(0.0,0.0,1.0,1.0);\n\
OutputColor4 = vec4(1.0,0.0,1.0,1.0);\n\
OutputColor5 = vec4(1.0,1.0,0.0,1.0);\n\
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
out vec3 v_nv;\n\
out vec2 v_uvs;\n\
void main()\n\
{\n\
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);\n\
    v_nv = a_nvs;\n\
    v_uvs = a_uvs;\n\
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
                    return "[CubeMapMRTShaderBuffer()]";
                }

                static GetInstance():CubeMapMRTShaderBuffer
                {
                    return CubeMapMRTShaderBuffer.___s_instance;
                }
            }
            
            export class CubeMapMRTMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {
                    return CubeMapMRTShaderBuffer.GetInstance();
                }
                colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.colorArray];
                    return oum;
                }
            }
        }
    }
}
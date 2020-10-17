/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderCodeBufferT from "../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../vox/material/MaterialBase";

import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace demo
{
    export namespace material
    {
        export class ScrDepBaseShaderBuffer extends ShaderCodeBuffer
        {
            constructor()
            {
                super();
            }
            private static ___s_instance:ScrDepBaseShaderBuffer = null;
            private m_uniqueName:string = "";
            initialize(texEnabled:boolean):void
            {
                //console.log("ScrDepBaseShaderBuffer::initialize()...");
                this.m_uniqueName = "ScrDepBaseShd";
            }
            getFragShaderCode():string
            {
                let fragCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
in vec4 v_color;\n\
layout(location = 0) out vec4 FragColor;\n\
void main()\n\
{\n\
    FragColor = vec4(vec3(v_color.w * 0.01,0.0,1.0), v_color.w);\n\
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
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
out vec4 v_color;\n\
void main()\n\
{\n\
    vec4 viewPv = u_viewMat * u_objMat * vec4(a_vs, 1.0);\n\
    gl_Position = u_projMat * viewPv;\n\
    v_color = vec4(abs(viewPv.xyz),length(viewPv.xyz));\n\
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
                return "[ScrDepBaseShaderBuffer()]";
            }

            static GetInstance():ScrDepBaseShaderBuffer
            {
                if(ScrDepBaseShaderBuffer.___s_instance != null)
                {
                    return ScrDepBaseShaderBuffer.___s_instance;
                }
                ScrDepBaseShaderBuffer.___s_instance = new ScrDepBaseShaderBuffer();
                return ScrDepBaseShaderBuffer.___s_instance;
            }
        }
            
        export class ScrDepBaseMaterial extends MaterialBase
        {
            constructor()
            {
                super();
            }
            getCodeBuf():ShaderCodeBuffer
            {
                return ScrDepBaseShaderBuffer.GetInstance();
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
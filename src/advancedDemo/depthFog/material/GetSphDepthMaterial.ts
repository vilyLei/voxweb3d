/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
//import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
//import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace advancedDemo
{
    export namespace depthFog
    {
        export namespace material
        {
            class GetSphDepthShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:GetSphDepthShaderBuffer = new GetSphDepthShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("GetSphDepthShaderBuffer::initialize()...");
                    this.m_uniqueName = "GetSphDepthShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
in vec4 v_posV;\n\
layout(location = 0) out vec4 FragColor;\n\
void main()\n\
{\n\
    FragColor = vec4(v_posV.xyz, v_posV.w);\n\
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
out vec4 v_posV;\n\
void main(){\n\
    vec4 posV = u_objMat * vec4(a_vs, 1.0);\n\
    vec4 viewPv = u_viewMat * posV;\n\
    gl_Position = u_projMat * viewPv;\n\
    v_posV = vec4(viewPv.xyz,length(viewPv.xyz));\n\
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
                    return "[GetSphDepthShaderBuffer()]";
                }

                static GetInstance():GetSphDepthShaderBuffer
                {
                    return GetSphDepthShaderBuffer.___s_instance;
                }
            }
            
            export class GetSphDepthMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return GetSphDepthShaderBuffer.GetInstance();
                }
            }
        }
    }
}
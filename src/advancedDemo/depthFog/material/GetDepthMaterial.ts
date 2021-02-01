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
            class GetDepthShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:GetDepthShaderBuffer = new GetDepthShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("GetDepthShaderBuffer::initialize()...");
                    this.m_uniqueName = "GetDepthShd";
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
    FragColor = vec4(v_color.xyz, v_color.w);\n\
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
uniform vec4 u_cameraParam;\n\
out vec4 v_color;\n\
void main(){\n\
    vec4 posV = u_objMat * vec4(a_vs, 1.0);\n\
    vec4 viewPv = u_viewMat * posV;\n\
    gl_Position = u_projMat * viewPv;\n\
    // u_cameraParam.y is camera far plane distance.\n\
    v_color = vec4(viewPv.xyz,length(viewPv.xyz)/u_cameraParam.y);\n\
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
                    return "[GetDepthShaderBuffer()]";
                }

                static GetInstance():GetDepthShaderBuffer
                {
                    return GetDepthShaderBuffer.___s_instance;
                }
            }
            
            export class GetDepthMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return GetDepthShaderBuffer.GetInstance();
                }
            }
        }
    }
}
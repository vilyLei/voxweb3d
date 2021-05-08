/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../vox/render/RendererDeviece";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
//import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
////import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace demo
{
    export namespace material
    {
            export class PSDepthShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:PSDepthShaderBuffer = new PSDepthShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("PSDepthShaderBuffer::initialize()...");
                    this.m_uniqueName = "PSDepthShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) out vec4 FragColor0;\n\
in vec4 v_depthV;\n\
void main()\n\
{\n\
    FragColor0 = v_depthV;\n\
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
out vec4 v_depthV;\n\
void main(){\n\
    mat4 viewMat4 = u_viewMat * u_objMat;\n\
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);\n\
    gl_Position = u_projMat * viewPos;\n\
    v_depthV = vec4(vec3(1.0),length(viewPos.xyz)/u_cameraParam.y);\n\
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
                    return "[PSDepthShaderBuffer()]";
                }

                static GetInstance():PSDepthShaderBuffer
                {
                    return PSDepthShaderBuffer.___s_instance;
                }
            }
            
            export class PSDepthMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return PSDepthShaderBuffer.GetInstance();
                }
            }
        }
}
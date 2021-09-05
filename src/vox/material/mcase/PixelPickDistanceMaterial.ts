/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
//import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

//import RendererDevice = RendererDeviceT.vox.render.RendererDevice;
//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
////import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class PixelPickDistanceShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static s_instance:PixelPickDistanceShaderBuffer = new PixelPickDistanceShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("PixelPickDistanceShaderBuffer::initialize()...");
                    this.m_uniqueName = "PixelPickDistanceShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = "";
                    if(RendererDevice.IsWebGL2())
                    {
                    fragCode =
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) out vec4 FragColor0;\n\
void main()\n\
{\n\
    FragColor0 = vec4(vec3(1.0,0.5,0.6),1.0);\n\
}\n\
";
                    }
                    else
                    {
                        fragCode =
"\
precision mediump float;\n\
void main()\n\
{\n\
    gl_FragColor = vec4(vec3(1.0,0.5,0.6),1.0);\n\
}\n\
";
                    }
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = "";
                    if(RendererDevice.IsWebGL2())
                    {
                        vtxCode =
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) in vec3 a_vs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
void main(){\n\
    mat4 viewMat4 = u_viewMat * u_objMat;\n\
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);\n\
    gl_Position = u_projMat * viewPos;\n\
}\n\
";
                    }
                    else
                    {
                        vtxCode =
"\
precision mediump float;\n\
attribute vec3 a_vs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
void main(){\n\
    mat4 viewMat4 = u_viewMat * u_objMat;\n\
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);\n\
    gl_Position = u_projMat * viewPos;\n\
}\n\
";
                    }
                    return vtxCode;
                }
                getUniqueShaderName(): string
                {
                    //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
                    return this.m_uniqueName;
                }
                toString():string
                {
                    return "[PixelPickDistanceShaderBuffer()]";
                }

                static GetInstance():PixelPickDistanceShaderBuffer
                {
                    return PixelPickDistanceShaderBuffer.s_instance;
                }
            }
            
            export class PixelPickDistanceMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return PixelPickDistanceShaderBuffer.GetInstance();
                }
            }
        }
    }
}
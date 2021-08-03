/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../../vox/render/RendererDeviece";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";

//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
//import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
//import Color4 = Color4T.vox.material.Color4;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace advancedDemo
{
    export namespace depthLight
    {
        export namespace material
        {
            class FogDepthUVShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static s_instance:FogDepthUVShaderBuffer = new FogDepthUVShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("FogDepthUVShaderBuffer::initialize()...");
                    this.m_uniqueName = "FogDepthUV";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform vec4 u_param[2];\n\
in vec4 v_color;\n\
in vec2 v_uv;\n\
layout(location = 0) out vec4 FragColor0;\n\
layout(location = 1) out vec4 FragColor1;\n\
void main()\n\
{\n\
    FragColor1 = vec4(v_color.xyz, v_color.w);\n\
    vec4 color4 = texture(u_sampler0, v_uv * u_param[0].xy);\n\
    color4.xyz *= u_param[1].xyz;\n\
    FragColor0 = color4;\n\
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
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
uniform vec4 u_cameraParam;\n\
out vec4 v_color;\n\
out vec2 v_uv;\n\
void main(){\n\
    vec4 posV = u_objMat * vec4(a_vs, 1.0);\n\
    vec4 viewPv = u_viewMat * posV;\n\
    gl_Position = u_projMat * viewPv;\n\
    v_color = vec4(viewPv.xyz,length(viewPv.xyz)/u_cameraParam.y);\n\
    v_uv = a_uvs;\n\
}\n\
";
                    return vtxCode;
                }
                getUniqueShaderName(): string
                {
                    //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
                    return this.m_uniqueName;
                }
                toString():string
                {
                    return "[FogDepthUVShaderBuffer()]";
                }

                static GetInstance():FogDepthUVShaderBuffer
                {
                    return FogDepthUVShaderBuffer.s_instance;
                }
            }
            
            export class FogDepthUVMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {
                    return FogDepthUVShaderBuffer.GetInstance();
                }
                private m_param:Float32Array = new Float32Array([1.0,1.0,0.0,0.0, 1.0,1.0,1.0,1.0]);
                
                setRGBColor(pcolor:Color4):void
                {
                    this.m_param[4] = pcolor.r;
                    this.m_param[5] = pcolor.g;
                    this.m_param[6] = pcolor.b;
                }
                setFRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_param[4] = pr;
                    this.m_param[5] = pg;
                    this.m_param[6] = pb;
                }
                setUVScale(scaleU:number,scaleV:number):void
                {
                    this.m_param[0] = scaleU;
                    this.m_param[1] = scaleV;
                }
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_param"];
                    oum.dataList = [this.m_param];
                    return oum;
                }
            }
        }
    }
}
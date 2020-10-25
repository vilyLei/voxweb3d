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

export namespace example
{
    export namespace material
    {
        export namespace base
        {
            export class TwoPngTexShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:TwoPngTexShaderBuffer = null;
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("TwoPngTexShaderBuffer::initialize()...");
                    this.m_uniqueName = "TwoPngTexShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
uniform vec4 u_color;\n\
in vec2 v_uvs;\n\
layout(location = 0) out vec4 FragColor;\n\
void main(){\n\
    vec2 puv = v_uvs * 1.0;\n\
    //  vec3 color3 = texture(u_sampler0, puv).xyz;\n\
    //  color3 *= u_color.xyz;\n\
    //  FragColor = vec4(color3 + vec3(0.1),u_color.w);\n\
    vec4 color4A = texture(u_sampler0, puv) * u_color;\n\
    vec4 color4B = texture(u_sampler1, puv) * u_color;\n\
    vec4 color4 = vec4(1.0);\n\
    //color4.xyz = color4A.xyz * (1.0 - color4B.w) + color4B.w * color4B.xyz;\n\
    color4.xyz = mix(color4A.xyz,color4B.xyz,color4B.w);\n\
    //color4.xyz = mix(color4A.xyz,color4B.xyz,color4B.w*color4B.w);\n\
    //color4.xyz = mix(color4B.xyz,color4A.xyz,color4B.w);\n\
    FragColor = color4;\n\
    //FragColor = color4B;\n\
}\n\
";
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
"\
#version 300 es\n\
precision highp float;\n\
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
                    return vtxCode;
                }
                getUniqueShaderName()
                {
                    //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
                    return this.m_uniqueName;
                }
                toString():string
                {
                    return "[TwoPngTexShaderBuffer()]";
                }

                static GetInstance():TwoPngTexShaderBuffer
                {
                    if(TwoPngTexShaderBuffer.___s_instance != null)
                    {
                        return TwoPngTexShaderBuffer.___s_instance;
                    }
                    TwoPngTexShaderBuffer.___s_instance = new TwoPngTexShaderBuffer();
                    return TwoPngTexShaderBuffer.___s_instance;
                }
            }
            export class TwoPngTexMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return TwoPngTexShaderBuffer.GetInstance();
                }
                private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
                setRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_colorArray[0] = pr;
                    this.m_colorArray[1] = pg;
                    this.m_colorArray[2] = pb;
                }
                setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
                {
                    this.m_colorArray[0] = pr;
                    this.m_colorArray[1] = pg;
                    this.m_colorArray[2] = pb;
                    this.m_colorArray[3] = pa;
                }
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.dataSizeList = [1];
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.m_colorArray];
                    return oum;
                }

            }
        }
    }
}
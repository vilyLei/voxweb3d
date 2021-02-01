/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as Color4T from "../../../vox/material/Color4";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace advancedDemo
{
    export namespace depthFog
    {
        export namespace material
        {
            class FogSphBlendFactorShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:FogSphBlendFactorShaderBuffer = new FogSphBlendFactorShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("FogSphBlendFactorShaderBuffer::initialize()...");
                    this.m_uniqueName = "FogSphBlendFactorShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
uniform sampler2D u_sampler2;\n\
uniform vec4 u_color;\n\
in vec2 v_texUV;\n\
layout(location = 0) out vec4 OutputColor;\n\
void main()\n\
{\n\
    vec4 farColor4 = texture(u_sampler0, v_texUV);\n\
    vec4 nearColor4 = texture(u_sampler1, v_texUV);\n\
    vec4 middColor4 = texture(u_sampler2, v_texUV);\n\
    if(farColor4.w > 0.1)\n\
    {\n\
        float dis = max(farColor4.w - nearColor4.w, 0.0);\n\
        float factor = clamp(dis/u_color.w,0.0,1.0);\n\
        float k = pow(factor,3.0) * clamp( max(min(middColor4.w,farColor4.w) - nearColor4.w, 0.0) / (dis + 1.0), 0.0, 1.0 );\n\
        //OutputColor = vec4(1.0,1.0,1.0, k * 0.7 + 0.3 * (sin(k * 10.0)));\n\
        OutputColor = vec4(u_color.xyz, k);\n\
    }else{\n\
        OutputColor = vec4(0.0);\n\
    }\n\
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
out vec2 v_texUV;\n\
void main()\n\
{\n\
gl_Position = u_objMat * vec4(a_vs,1.0);\n\
v_texUV = vec2(a_uvs.x,a_uvs.y);\n\
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
                    return "[FogSphBlendFactorShaderBuffer()]";
                }

                static GetInstance():FogSphBlendFactorShaderBuffer
                {
                    return FogSphBlendFactorShaderBuffer.___s_instance;
                }
            }
            
            export class FogSphBlendFactorMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                setRadius(pr:number):void
                {
                    this.m_colorArray[3] = pr * 2.0;
                }
                setRGBColor(pcolor:Color4):void
                {
                    this.m_colorArray[0] = pcolor.r;
                    this.m_colorArray[1] = pcolor.g;
                    this.m_colorArray[2] = pcolor.b;
                }
                setRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_colorArray[0] = pr;
                    this.m_colorArray[1] = pg;
                    this.m_colorArray[2] = pb;
                }
                getCodeBuf():ShaderCodeBuffer
                {        
                    return FogSphBlendFactorShaderBuffer.GetInstance();
                }
                private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,2500.0]);
                
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.m_colorArray];
                    return oum;
                }
            }
        }
    }
}
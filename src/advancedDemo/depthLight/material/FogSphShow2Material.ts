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
            class FogSphShow2ShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:FogSphShow2ShaderBuffer = new FogSphShow2ShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("FogSphShow2ShaderBuffer::initialize()...");
                    this.m_uniqueName = "FogSphShow2Shd";
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
    vec4 color4 = texture(u_sampler0, v_texUV);\n\
    vec4 factor4 = texture(u_sampler1, v_texUV);\n\
    vec4 fogColor4 = u_color;\n\
    fogColor4.xyz = texture(u_sampler2, v_texUV).xyz;\n\
    //OutputColor = vec4(fogColor4.xyz * factor4.xyz + (1.0 - factor4.xyz) * color4.xyz, 1.0);\n\
    OutputColor = vec4(fogColor4.xyz * factor4.x + (1.0 - factor4.x) * color4.xyz, 1.0);\n\
    //OutputColor = vec4((1.0 - factor4.xxx) * fogColor4.xyz + color4.xyz * factor4.xxx, 1.0);\n\
    //OutputColor = vec4(fogColor4.xyz * factor4.xxx * 0.6 + color4.xyz, 1.0);\n\
    //OutputColor = vec4(factor4.xyz, 1.0);\n\
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
                    return "[FogSphShow2ShaderBuffer()]";
                }

                static GetInstance():FogSphShow2ShaderBuffer
                {
                    return FogSphShow2ShaderBuffer.___s_instance;
                }
            }
            
            export class FogSphShow2Material extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return FogSphShow2ShaderBuffer.GetInstance();
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
                private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
                
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
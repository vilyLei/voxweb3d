/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../vox/render/RendererDeviece";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import Color4 from "../../vox/material/Color4";
import MaterialBase from "../../vox/material/MaterialBase";

//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
//import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
//import Color4 = Color4T.vox.material.Color4;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace demo
{
        export namespace material
        {
            class ScreenRectShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static s_instance:ScreenRectShaderBuffer = new ScreenRectShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("ScreenRectShaderBuffer::initialize()...");
                    this.m_uniqueName = "ScreenRectShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform vec4 u_color;\n\
layout(location = 0) out vec4 OutputColor;\n\
void main()\n\
{\n\
    OutputColor = u_color;\n\
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
void main()\n\
{\n\
gl_Position = u_objMat * vec4(a_vs,1.0);\n\
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
                    return "[ScreenRectShaderBuffer()]";
                }

                static GetInstance():ScreenRectShaderBuffer
                {
                    return ScreenRectShaderBuffer.s_instance;
                }
            }
            
            export class ScreenRectMaterial extends MaterialBase
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
                    this.m_colorArray[3] = pcolor.a;
                }
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
                getCodeBuf():ShaderCodeBuffer
                {
                    return ScreenRectShaderBuffer.GetInstance();
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
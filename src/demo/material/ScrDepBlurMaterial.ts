/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
//import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace demo
{
    export namespace material
    {
            export class ScrDepBlurShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:ScrDepBlurShaderBuffer = null;
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("ScrDepBlurShaderBuffer::initialize()...");
                    this.m_uniqueName = "ScrDepBlurShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
"\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
uniform sampler2D u_sampler2;\n\
uniform vec4 u_color;\n\
varying vec2 v_texUV;\n\
void main()\n\
{\n\
    vec4 blurColor4 = texture2D(u_sampler0, v_texUV);\n\
    vec4 depthColor4 = texture2D(u_sampler1, v_texUV);\n\
    vec4 baseColor4 = texture2D(u_sampler2, v_texUV);\n\
    float k = (depthColor4.w - 1000.0) / 1000.0;\n\
    if(k > 1.0 || depthColor4.r < 0.5) k = 1.0;\n\
    if(k < 0.0) k = 0.0;\n\
    gl_FragColor = (vec4(baseColor4.xyz * (1.0 - k) + k * blurColor4.xyz, 1.0) * u_color);\n\
}\n\
";
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
"\
precision mediump float;\n\
attribute vec3 a_vs;\n\
attribute vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
varying vec2 v_texUV;\n\
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
                    return "[ScrDepBlurShaderBuffer()]";
                }

                static GetInstance():ScrDepBlurShaderBuffer
                {
                    if(ScrDepBlurShaderBuffer.___s_instance != null)
                    {
                        return ScrDepBlurShaderBuffer.___s_instance;
                    }
                    ScrDepBlurShaderBuffer.___s_instance = new ScrDepBlurShaderBuffer();
                    return ScrDepBlurShaderBuffer.___s_instance;
                }
            }
            
            export class ScrDepBlurMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return ScrDepBlurShaderBuffer.GetInstance();
                }
                colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
                
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.colorArray];
                    return oum;
                }
            }
    }
}
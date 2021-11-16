/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
//import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

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
                private static s_instance:TwoPngTexShaderBuffer = null;
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("TwoPngTexShaderBuffer::initialize()...");
                    this.m_uniqueName = "TwoPngTexShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform vec4 u_color;
in vec2 v_uvs;
layout(location = 0) out vec4 FragColor;
void main(){
    vec2 puv = v_uvs * 1.0;
    vec4 color4A = texture(u_sampler0, puv);
    vec4 color4B = texture(u_sampler1, puv);
    vec4 color4 = vec4(1.0);
    color4.xyz = color4A.xyz * sign(color4B.w);
    FragColor = color4 * u_color;
    FragColor.a = color4B.w;
}
`;
                    return fragCode;
                }
                getVertShaderCode():string
                {
                    let vtxCode:string = 
`#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uvs;
void main(){
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
    v_uvs = a_uvs;
}
`;
                    return vtxCode;
                }
                getUniqueShaderName(): string
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
                    if(TwoPngTexShaderBuffer.s_instance != null)
                    {
                        return TwoPngTexShaderBuffer.s_instance;
                    }
                    TwoPngTexShaderBuffer.s_instance = new TwoPngTexShaderBuffer();
                    return TwoPngTexShaderBuffer.s_instance;
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
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.m_colorArray];
                    return oum;
                }

            }
        }
    }
}
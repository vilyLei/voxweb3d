/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class PixelPickIndexShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:PixelPickIndexShaderBuffer = new PixelPickIndexShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("PixelPickIndexShaderBuffer::initialize()...");
                    this.m_uniqueName = "PixelPickIndexShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
`#version 300 es
precision highp float;
uniform vec4 u_param;
in vec3 v_viewPos;
//in float v_length;
layout(location = 0) out vec4 FragColor0;
void main()
{
    vec4 p = vec4(length(v_viewPos.xyz));
    p.x = floor(p.x)/256.0;
    p.y = floor(fract(p.x) * 256.0)/255.0;
    p.x = floor(p.x) / 255.0;
    p.z = fract(p.z);
    FragColor0 = vec4(p.xyz,u_param.w);
}
`;
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
`#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_viewPos;
//out float v_length;
void main(){
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    v_viewPos = viewPos.xyz;
    //v_length = length(viewPos.xyz);
    gl_Position = u_projMat * viewPos;
}
`;
                    return vtxCode;
                }
                getUniqueShaderName()
                {
                    //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
                    return this.m_uniqueName;
                }
                toString():string
                {
                    return "[PixelPickIndexShaderBuffer()]";
                }

                static GetInstance():PixelPickIndexShaderBuffer
                {
                    return PixelPickIndexShaderBuffer.___s_instance;
                }
            }
            
            export class PixelPickIndexMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {
                    return PixelPickIndexShaderBuffer.GetInstance();
                }
                private m_paramArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
                private m_1over255:number = 1.0/255.0;
                setIndex(index:number):void
                {
                    this.m_paramArray[3] = index * this.m_1over255;
                }
                getIndex():number
                {
                    return this.m_paramArray[3]/this.m_1over255;
                }
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_param"];
                    oum.dataList = [this.m_paramArray];
                    return oum;
                }
            }
        }
    }
}
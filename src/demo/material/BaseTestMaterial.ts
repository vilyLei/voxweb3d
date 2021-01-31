/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace demo
{
    export namespace material
    {
            export class BaseTestShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:BaseTestShaderBuffer = new BaseTestShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("BaseTestShaderBuffer::initialize()...");
                    this.m_uniqueName = "BaseTestShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
`
precision mediump float;
uniform sampler2D u_sampler0;
//uniform sampler2D u_sampler1;
//uniform vec4 u_cameraParam;
uniform vec4 u_colors[2];
//  The common structure uniform is the bad implements, it is low runtime performeance, because:
//  gl.getUniformLocation(shd_program, u_baseParam.color);
//  gl.getUniformLocation(shd_program, u_baseParam.offset);
//  struct BaseParam {
//      vec3 color;
//      vec3 offset;
//  };
//  uniform BaseParam u_baseParam;
//  The base type uniform array or ubo are usually recommended.
varying vec2 v_uvs;

void main()
{
    vec4 color4 = texture2D(u_sampler0, v_uvs);
    color4 *= u_colors[0];
    gl_FragColor = color4;
}
`;
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
`
precision mediump float;
attribute vec3 a_vs;
attribute vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
varying vec2 v_uvs;
void main(){
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;
    v_uvs = a_uvs;
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
                    return "[BaseTestShaderBuffer()]";
                }

                static GetInstance():BaseTestShaderBuffer
                {
                    return BaseTestShaderBuffer.___s_instance;
                }
            }
            
            export class BaseTestMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {
                    return BaseTestShaderBuffer.GetInstance();
                }
                private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0, 800.0,600.0,0.0,0.0]);
                private m_baseParam:Float32Array = new Float32Array([1.0,1.0,1.0, 0.0,0.0,0.0]);
                setStageSize(pw:number,ph:number):void
                {
                    this.m_colorArray[4] = pw;
                    this.m_colorArray[5] = ph;
                }
                setPeelEanbled(boo:boolean):void
                {
                    this.m_colorArray[6] = boo?1.0:0.0;
                }
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.dataSizeList = [2];
                    oum.uniformNameList = ["u_colors"];
                    oum.dataList = [this.m_colorArray];
                    return oum;
                }
            }
    }
}
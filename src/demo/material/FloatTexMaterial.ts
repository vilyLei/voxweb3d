/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

class FloatTexRenderShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:FloatTexRenderShaderBuffer = null;
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("FloatTexRenderShaderBuffer::initialize()...");
        this.m_uniqueName = "FloatTexMaterialShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform vec4 u_color;
in vec2 v_uv;
//  in vec4 v_color;
layout(location = 0) out vec4 FragColor;
void main(){
vec4 color4 = texture(u_sampler0, v_uv) * u_color;
FragColor = color4;
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
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uv;
//out vec4 v_color;
void main(){
v_uv = a_uvs;
//  v_color = texture(u_sampler0, v_uv);
//  vec4 wpos = vec4(a_vs.xyz,1.0);
//  wpos.x += v_color.x;
//  gl_Position = u_projMat * u_viewMat * u_objMat * wpos;
gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs.xyz,1.0);
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
        return "[FloatTexRenderShaderBuffer()]";
    }

    static GetInstance():FloatTexRenderShaderBuffer
    {
        if(FloatTexRenderShaderBuffer.___s_instance != null)
        {
            return FloatTexRenderShaderBuffer.___s_instance;
        }
        FloatTexRenderShaderBuffer.___s_instance = new FloatTexRenderShaderBuffer();
        return FloatTexRenderShaderBuffer.___s_instance;
    }
}
export default class FloatTexMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    getCodeBuf():ShaderCodeBuffer
    {
        return FloatTexRenderShaderBuffer.GetInstance();
    }
    private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    private m_posParam:Float32Array = new Float32Array([1.0/16,0.0,0.0,0.0]);
    private m_texSize:number = 16.0;
    setTexSize(size:number):void
    {
        this.m_texSize = size;
        this.m_posParam[0] = 1.0 / size;
    }
    setPosAt(index:number):void
    {
        this.m_posParam[1] = index;
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
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import MaterialBase from "../../vox/material/MaterialBase";

class RttCircleShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:RttCircleShaderBuffer = null;
    private m_uniqueName:string = "";
    private m_hasTex:boolean = false;
    initialize(texEnabled:boolean):void
    {
        //console.log("RttCircleShaderBuffer::initialize()... texEnabled: "+texEnabled);
        this.m_uniqueName = "RttCircleShd";
        this.m_hasTex = texEnabled;
        if(texEnabled)
        {
            this.m_uniqueName += "_tex";
        }
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`
precision mediump float;
uniform sampler2D u_sampler0;
varying vec2 v_texUV;
uniform vec4 u_colors[2];
uniform vec4 u_stSize;
void main()
{
vec2 sv2 = vec2(gl_FragCoord.x/u_stSize.x,gl_FragCoord.y/u_stSize.y);
float dis = length(u_stSize.zw - gl_FragCoord.xy);
vec4 color4 = texture2D(u_sampler0, v_texUV * 0.0 + sv2);
//color4.xyz = 1.5 * color4.xzy * color4.xyz;
color4.w = min(u_colors[0].w * min(8.0 - 3.8 * dis / u_colors[1].w, 1.0), 1.0);
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
varying vec2 v_texUV;
void main()
{
gl_Position = vec4(a_vs,1.0);
v_texUV = a_uvs;
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
        return "[RttCircleShaderBuffer()]";
    }

    static GetInstance():RttCircleShaderBuffer
    {
        if(RttCircleShaderBuffer.s_instance != null)
        {
            return RttCircleShaderBuffer.s_instance;
        }
        RttCircleShaderBuffer.s_instance = new RttCircleShaderBuffer();
        return RttCircleShaderBuffer.s_instance;
    }
}

export default class RttCircleMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {
        return RttCircleShaderBuffer.GetInstance();
    }
    private m_colorArray:Float32Array = new Float32Array([1.0,0.0,1.0,1.0, 0.0,0.0,0.0,60.0]);
    private m_stSizeArray:Float32Array = new Float32Array([800.0,600.0,0.0,0.0]);
    setStageSize(pw:number,ph:number):void
    {
        this.m_stSizeArray[0] = pw;
        this.m_stSizeArray[1] = ph;
    }
    setRaius(pr:number):void
    {
        this.m_colorArray[7] = pr;
    }
    setAlpha(pr:number):void
    {
        this.m_colorArray[3] = pr;
    }
    setPosXY(px:number,py:number):void
    {
        this.m_stSizeArray[2] = px;
        this.m_stSizeArray[3] = py;
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
        if(this.getTextureList() == null)
        {
            return null;
        }
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_colors","u_stSize"];
        oum.dataList = [this.m_colorArray, this.m_stSizeArray];
        return oum;
    }
}
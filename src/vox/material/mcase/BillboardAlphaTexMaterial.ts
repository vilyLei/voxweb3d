/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../../vox/math/MathConst";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";

class BillboardAlphaTexShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        this.m_uniqueName = "BillboardAlphaTexShader";
    }
    getFragShaderCode():string
    {
        let fragCode:string =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
in vec4 v_colorMult;
in vec2 v_texUV;
layout(location = 0) out vec4 FragColor;
void main()
{
FragColor = vec4(v_colorMult.xyz,v_colorMult.a * texture(u_sampler0, v_texUV).a);
}
`;
        return fragCode;
    }
    getVertShaderCode():string
    {
        let vtxCode:string = 
`#version 300 es
precision mediump float;
layout(location = 0) in vec2 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[2];
out vec4 v_colorMult;
out vec2 v_texUV;
void main()
{
vec4 temp = u_billParam[0];
float cosv = cos(temp.z);
float sinv = sin(temp.z);
vec2 vtx = vec2(a_vs.x * temp.x, a_vs.y * temp.y);
vec2 vtx_pos = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
vec4 pos = u_viewMat * u_objMat * vec4(0.0,0.0,0.0,1.0);
pos.xy += vtx_pos.xy;
gl_Position =  u_projMat * pos;
v_texUV = a_uvs;
v_colorMult = u_billParam[1];
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[BillboardAlphaTexShaderBuffer()]";
    }
    private static s_instance:BillboardAlphaTexShaderBuffer = new BillboardAlphaTexShaderBuffer();
    static GetInstance():BillboardAlphaTexShaderBuffer
    {
        if(BillboardAlphaTexShaderBuffer.s_instance != null)
        {
            return BillboardAlphaTexShaderBuffer.s_instance;
        }
        BillboardAlphaTexShaderBuffer.s_instance = new BillboardAlphaTexShaderBuffer();
        return BillboardAlphaTexShaderBuffer.s_instance;
    }
}

export default class BillboardAlphaTexMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    private m_rz:number = 0;
    private m_uniformData:Float32Array = new Float32Array([1.0,1.0,0.0,1.0, 1.0,1.0,1.0,1.0]);
    private m_color:Color4 = new Color4(1.0,1.0,1.0,1.0);
    private m_brightness:number = 1.0;

    getCodeBuf():ShaderCodeBuffer
    {
        let buf:ShaderCodeBuffer = BillboardAlphaTexShaderBuffer.GetInstance();        
        return buf;
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_billParam"];
        oum.dataList = [this.m_uniformData];
        return oum;
    }

    setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        //this.m_color.a = pa;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
        this.m_uniformData[7] = pa;
    }
    setRGB3f(pr:number,pg:number,pb:number)
    {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
    }
    setAlpha(pa:number):void
    {
        this.m_uniformData[7] = pa;
    }
    getAlpha():number
    {
        return this.m_uniformData[6];
    }
    setBrightness(brighness:number):void
    {
        this.m_brightness = brighness;
        this.m_uniformData[4] = this.m_color.r * brighness;
        this.m_uniformData[5] = this.m_color.g * brighness;
        this.m_uniformData[6] = this.m_color.b * brighness;
    }
    getBrightness():number
    {
        return this.m_brightness;
    }
    getRotationZ():number{return this.m_rz;};
    setRotationZ(degrees:number):void
    {
        this.m_rz = degrees;
        this.m_uniformData[2] = degrees * MathConst.MATH_PI_OVER_180;
    }
    getScaleX():number{return this.m_uniformData[0];}
    getScaleY():number{return this.m_uniformData[1];}
    setScaleX(p:number):void{this.m_uniformData[0] = p;}
    setScaleY(p:number):void{this.m_uniformData[1] = p;}
    setScaleXY(sx:number,sy:number):void
    {
        this.m_uniformData[0] = sx;
        this.m_uniformData[1] = sy;
    }
    getUniformData():Float32Array
    {
        return this.m_uniformData;
    }

    destroy()
    {
        super.destroy();
        this.m_uniformData = null;
    }
}
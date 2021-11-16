/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../../vox/math/MathConst";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";
import BillboardFSBase from "../../../vox/material/mcase/BillboardFSBase";

export class Billboard3TexMixShaderBuffer extends ShaderCodeBuffer
{
    billFS:BillboardFSBase = new BillboardFSBase();
    clipEnabled:boolean = false;
    constructor()
    {
        super();
    }
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        this.m_uniqueName = "BillboardShader";
    }
    getFragShaderCode():string
    {
        ///*
        let fragCode0:string =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
`;
        let fragCode01:string = "";
        if(!this.clipEnabled)
        {
            fragCode01 =
`
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;
`;
        }
let fragCode2a0:string = this.billFS.getMixThreeColorsCode() +
`
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec4 v_param0;
in vec4 v_param1;
in vec2 v_texUV;
layout(location = 0) out vec4 FragColor;
void main()
{
`;
        let fragCode2a1:string = "";
        if(this.clipEnabled)
        {
            fragCode2a1 =
`
    vec2 puv = v_texUV * v_param0.xy;
    vec4 color = texture(u_sampler0, puv + v_param0.zw);
    vec4 color1 = texture(u_sampler0, puv + v_param1.xy);
    vec4 color2 = texture(u_sampler0, puv + v_param1.zw);
`;
        }
        else
        {
            fragCode2a1 =
`
    vec4 color = texture(u_sampler0, v_texUV);
    vec4 color1 = texture(u_sampler1, v_texUV);
    vec4 color2 = texture(u_sampler2, v_texUV);
`;
        }
let fragCode2a2:string =
`
    color = mixThreeColors(color,color1,color2,fract(v_colorOffset.w));
    vec3 offsetColor = v_colorOffset.rgb;
    vec4 fv4 = v_colorMult.wwww;
`;
        let fadeCode:string = this.billFS.getBrnAndAlphaCode("fv4");
        let fragCode3:string =
`
    FragColor = color;
}
`;
        return fragCode0 + fragCode01 + fragCode2a0 + fragCode2a1 + fragCode2a2 + fadeCode + fragCode3;
//*/
    }
    getVertShaderCode():string
    {
        let paramTotal:number = this.clipEnabled?5:3;
        let vtxCode:string = 
`#version 300 es
precision mediump float;
layout(location = 0) in vec2 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[`+paramTotal+`];
out vec4 v_colorMult;
out vec4 v_colorOffset;
out vec4 v_param0;
out vec4 v_param1;
out vec2 v_texUV;
void main()
{
    vec4 temp = u_billParam[0];
    float cosv = cos(temp.z);
    float sinv = sin(temp.z);
    vec2 vtx = a_vs.xy * temp.xy;
    vec2 vtx_pos = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
    vec4 pos = u_viewMat * u_objMat * vec4(0.0,0.0,0.0,1.0);
    pos.xy += vtx_pos.xy;
    gl_Position =  u_projMat * pos;
    v_texUV = a_uvs;
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
    v_param0 = u_billParam[3];
    v_param1 = u_billParam[4];
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        return this.m_uniqueName + "_"+this.billFS.getBrnAlphaStatus()+(this.clipEnabled?"c":"");
    }
    toString():string
    {
        return "[Billboard3TexMixShaderBuffer()]";
    }
    private static s_instance:Billboard3TexMixShaderBuffer = new Billboard3TexMixShaderBuffer();
    static GetInstance():Billboard3TexMixShaderBuffer
    {
        if(Billboard3TexMixShaderBuffer.s_instance != null)
        {
            return Billboard3TexMixShaderBuffer.s_instance;
        }
        Billboard3TexMixShaderBuffer.s_instance = new Billboard3TexMixShaderBuffer();
        return Billboard3TexMixShaderBuffer.s_instance;
    }
}

export default class Billboard3TexMixMaterial extends MaterialBase
{
    private m_brightnessEnabled:boolean = true;
    private m_alphaEnabled:boolean = false;
    private m_clipEnabled:boolean = false;
    private m_rz:number = 0;
    private m_uniformData:Float32Array = new Float32Array([1.0,1.0,0.0,1.0, 1.0,1.0,1.0, 1.0, 0.0,0.0,0.0, 0.0]);
    constructor(brightnessEnabled:boolean = true,alphaEnabled:boolean = false,clipEnabled:boolean = false)
    {
        super();
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_clipEnabled = clipEnabled;
        if(clipEnabled)
        {
            this.m_uniformData = new Float32Array([
                1.0,1.0,0.0,1.0, 1.0,1.0,1.0, 1.0, 0.0,0.0,0.0, 0.0,
                0.5,0.5,
                0.0,0.0,
                0.5,0.0,
                0.0,0.5]);
        }
        else
        {
            this.m_uniformData = new Float32Array([1.0,1.0,0.0,1.0, 1.0,1.0,1.0, 1.0, 0.0,0.0,0.0, 0.0]);
        }
    }
    getCodeBuf():ShaderCodeBuffer
    {
        let buf:Billboard3TexMixShaderBuffer = Billboard3TexMixShaderBuffer.GetInstance();
        buf.clipEnabled = this.m_clipEnabled;
        buf.billFS.setBrightnessAndAlpha(this.m_brightnessEnabled,this.m_alphaEnabled);
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
        this.m_uniformData[4] = pr;
        this.m_uniformData[5] = pg;
        this.m_uniformData[6] = pb;
        this.m_uniformData[7] = pa;
    }
    setRGB3f(pr:number,pg:number,pb:number)
    {
        this.m_uniformData[4] = pr;
        this.m_uniformData[5] = pg;
        this.m_uniformData[6] = pb;
    }
    setFadeFactor(pa:number):void
    {
        this.m_uniformData[7] = pa;
    }
    getFadeFactor():number
    {
        return this.m_uniformData[7];
    }
    setMixFactor(pa:number):void
    {
        this.m_uniformData[11] = pa;
    }
    getMixFactor():number
    {
        return this.m_uniformData[11];
    }
    setClipUVSize(du:number, dv:number):void
    {
        if(this.m_clipEnabled)
        {
            this.m_uniformData[12] = du;
            this.m_uniformData[13] = dv;
        }
    }
    setClipUVPosAt(i:number, pu:number, pv:number):void
    {
        if(this.m_clipEnabled && i >= 0 && i < 3)
        {
            i *= 2;
            this.m_uniformData[14 + i] = pu;
            this.m_uniformData[15 + i] = pv;
        }
    }
    setRGBAOffset4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_uniformData[8] = pr;
        this.m_uniformData[9] = pg;
        this.m_uniformData[10] = pb;
        this.m_uniformData[11] = pa;
    }
    setRGBOffset3f(pr:number,pg:number,pb:number):void
    {
        this.m_uniformData[8] = pr;
        this.m_uniformData[9] = pg;
        this.m_uniformData[10] = pb;
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
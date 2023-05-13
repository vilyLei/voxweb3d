/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../../vox/math/MathConst";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class Rect2DShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:Rect2DShaderBuffer = null;
    private m_uniqueName:string = "";
    private m_hasTex:boolean = false;
    centerAlignEnabled:boolean = false;
    vertColorEnabled:boolean = false;
    initialize(texEnabled:boolean):void
    {
        console.log("Rect2DShaderBuffer::initialize()... texEnabled: "+texEnabled);
        this.m_uniqueName = "Rect2DShd";
        this.m_hasTex = texEnabled;
        if(texEnabled) this.m_uniqueName += "_tex";
        if(this.centerAlignEnabled) this.m_uniqueName += "_center";
        if(this.vertColorEnabled) this.m_uniqueName += "_vtxColor";
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`
precision mediump float;
varying vec4 v_color;
`;
        if(this.m_hasTex)
        {

            fragCode +=
`
uniform sampler2D u_sampler0;
varying vec2 v_texUV;
`;
        }
        fragCode +=
`
void main()
{
`;
        if(this.m_hasTex)
        {
            fragCode +=
`
    gl_FragColor = texture2D(u_sampler0, v_texUV) * v_color;
`;
        }
        else
        {
            fragCode +=
`
    gl_FragColor = v_color;
`;
        }
        fragCode +=
`
}
`;
        return fragCode;
    }
    getVertShaderCode():string
    {
        let vtxCode:string = 
`
precision mediump float;
attribute vec3 a_vs;
uniform vec4 u_stageParam;
uniform vec4 u_params[3];
varying vec4 v_color;
`;
        if(this.m_hasTex)
        {
            vtxCode +=
`
attribute vec2 a_uvs;
varying vec2 v_texUV;
`;
        }
        if(this.vertColorEnabled)
        {
            vtxCode +=
`
attribute vec3 a_cvs;
`;
        }
        vtxCode +=
`
void main()
{
    vec4 pv4 = vec4(a_vs.xyz,1.0);
    pv4.xy *= u_params[1].xy;
    float cosv = cos(u_params[1].w);
    float sinv = sin(u_params[1].w);
    pv4.xy = vec2(pv4.x * cosv - pv4.y * sinv, pv4.x * sinv + pv4.y * cosv);
    pv4.xy += u_params[0].xy;
    pv4.xy *= u_stageParam.xy;
`;

if(!this.centerAlignEnabled)
{
vtxCode +=
`
    pv4.xy += -1.0;
`;
}
vtxCode +=
`
    gl_Position = pv4;
`;
        if(this.m_hasTex)
        {
            vtxCode +=
`
    v_texUV = vec2(a_uvs.x, 1.0 - a_uvs.y);
`;
        }
        vtxCode +=
`
    v_color = u_params[2];
`;
        if(this.vertColorEnabled)
        {
            vtxCode +=
`
    v_color.xyz *= a_cvs.xyz;
`;
        }
        vtxCode +=
`
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
        return "[Rect2DShaderBuffer()]";
    }

    static GetInstance():Rect2DShaderBuffer
    {
        if(Rect2DShaderBuffer.s_instance != null)
        {
            return Rect2DShaderBuffer.s_instance;
        }
        Rect2DShaderBuffer.s_instance = new Rect2DShaderBuffer();
        return Rect2DShaderBuffer.s_instance;
    }
}

export default class Rect2DMaterial extends MaterialBase
{
    private m_centerAlignEnabled:boolean = false;
    private m_vertColorEnabled:boolean = false;
    constructor(centerAlignEnabled:boolean = false,vertColorEnabled:boolean = false)
    {
        super();
        this.m_centerAlignEnabled = centerAlignEnabled;
        this.m_vertColorEnabled = vertColorEnabled;
    }
    private m_r:number = 0.0
    getCodeBuf():ShaderCodeBuffer
    {
        let buf: Rect2DShaderBuffer = Rect2DShaderBuffer.GetInstance();
        buf.centerAlignEnabled = this.m_centerAlignEnabled;
        buf.vertColorEnabled = this.m_vertColorEnabled;
        return buf;
    }
    private m_paramArray:Float32Array = new Float32Array([0.0,0.0,0.0,0.0, 1.0,1.0,0.0,0.0, 1.0,1.0,1.0,1.0]);
    setXY(px:number,py:number):void
    {
        this.m_paramArray[0] = px;
        this.m_paramArray[1] = py;
    }
    setX(px:number):void
    {
        this.m_paramArray[0] = px;
    }
    setY(py:number):void
    {
        this.m_paramArray[1] = py;
    }
    getX():number
    {
        return this.m_paramArray[0];
    }
    getY():number
    {
        return this.m_paramArray[1];
    }
    setScale(s:number):void
    {
        this.m_paramArray[4] = s;
        this.m_paramArray[5] = s;
    }
    setScaleXY(sx:number,sy:number):void
    {
        this.m_paramArray[4] = sx;
        this.m_paramArray[5] = sy;
    }
    setScaleX(sx:number):void
    {
        this.m_paramArray[4] = sx;
    }
    setScaleY(sy:number):void
    {
        this.m_paramArray[5] = sy;
    }
    getScaleX():number
    {
        return this.m_paramArray[4];
    }
    getScaleY():number
    {
        return this.m_paramArray[5];
    }
    setRotation(pr:number):void
    {
        this.m_r = pr;
        this.m_paramArray[7] = MathConst.MATH_PI_OVER_180 * pr;
    }
    getRotation():number
    {
        return this.m_r;
    }

    setRGB3f(pr:number,pg:number,pb:number):void
    {
        this.m_paramArray[8] = pr;
        this.m_paramArray[9] = pg;
        this.m_paramArray[10] = pb;
    }
    setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_paramArray[8] = pr;
        this.m_paramArray[9] = pg;
        this.m_paramArray[10] = pb;
        this.m_paramArray[11] = pa;
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_paramArray];
        return oum;
    }
}
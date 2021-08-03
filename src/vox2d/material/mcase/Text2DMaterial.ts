/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../../vox/math/MathConst";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import MaterialBase from "../../../vox/material/MaterialBase";

class Text2DShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:Text2DShaderBuffer = null;
    private m_uniqueName:string = "";
    private m_hasTex:boolean = false;
    initialize(texEnabled:boolean):void
    {
        this.m_uniqueName = "Text2DShd";
        this.m_hasTex = texEnabled;
        if(texEnabled)
        {
            this.m_uniqueName += "_tex";
        }
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
in vec4 v_color;\n\
";
        if(this.m_hasTex)
        {

            fragCode +=
"\
uniform sampler2D u_sampler0;\n\
in vec2 v_texUV;\n\
layout(location = 0) out vec4 FragColor;\n\
";
        }
        fragCode +=
"\
void main()\n\
{\n\
";
        if(this.m_hasTex)
        {
            fragCode +=
"\
float pa = pow(texture(u_sampler0, v_texUV).a,0.8);\n\
FragColor = vec4(v_color.xyz, min(v_color.w * pa,1.0));\n\
";
        }
        else
        {
            fragCode +=
"\
FragColor = v_color;\n\
";
        }
        fragCode +=
"\
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
layout(location = 0) in vec2 a_vs;\n\
uniform vec4 u_stageParam;\n\
uniform vec4 u_params[3];\n\
out vec4 v_color;\n\
";
        if(this.m_hasTex)
        {
            vtxCode +=
"\
layout(location = 1) in vec2 a_uvs;\n\
out vec2 v_texUV;\n\
";
        }
        vtxCode +=
"\
void main()\n\
{\n\
vec4 pv4 = vec4(a_vs.xy,0.0,1.0);\n\
pv4.xy *= u_params[1].xy;\n\
float cosv = cos(u_params[1].w);\n\
float sinv = sin(u_params[1].w);\n\
pv4.xy = vec2(pv4.x * cosv - pv4.y * sinv, pv4.x * sinv + pv4.y * cosv);\n\
pv4.xy += u_params[0].xy;\n\
pv4.xy *= u_stageParam.xy;\n\
pv4.xy += -1.0;\n\
gl_Position = pv4;\n\
";
        if(this.m_hasTex)
        {
            vtxCode +=
"\
v_texUV = a_uvs.xy;\n\
";
        }
        vtxCode +=
"\
v_color = u_params[2];\n\
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
        return "[Text2DShaderBuffer()]";
    }

    static GetInstance():Text2DShaderBuffer
    {
        if(Text2DShaderBuffer.___s_instance != null)
        {
            return Text2DShaderBuffer.___s_instance;
        }
        Text2DShaderBuffer.___s_instance = new Text2DShaderBuffer();
        return Text2DShaderBuffer.___s_instance;
    }
}

export default class Text2DMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    private m_rotation:number = 0.0;
    private m_r:number = 0.0;
    private m_g:number = 0.0;
    private m_b:number = 0.0;
    private m_brightness:number = 1.0;
    getCodeBuf():ShaderCodeBuffer
    {
        return Text2DShaderBuffer.GetInstance();
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
        this.m_rotation = pr;
        this.m_paramArray[7] = MathConst.MATH_PI_OVER_180 * pr;
    }
    getRotation():number
    {
        return this.m_rotation;
    }

    setRGB3f(pr:number,pg:number,pb:number):void
    {
        this.m_r = pr;
        this.m_g = pg;
        this.m_b = pb;
        this.m_paramArray[8] = pr * this.m_brightness;
        this.m_paramArray[9] = pg * this.m_brightness;
        this.m_paramArray[10] = pb * this.m_brightness;
    }
    setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_r = pr;
        this.m_g = pg;
        this.m_b = pb;
        this.m_paramArray[8] = pr * this.m_brightness;
        this.m_paramArray[9] = pg * this.m_brightness;
        this.m_paramArray[10] = pb * this.m_brightness;
        this.m_paramArray[11] = pa;
    }
    
    setAlpha(pa:number):void
    {
        this.m_paramArray[11] = pa;
    }
    getAlpha():number
    {
        return this.m_paramArray[6];
    }
    setBrightness(brighness:number):void
    {
        this.m_brightness = brighness;
        this.m_paramArray[4] = this.m_r * brighness;
        this.m_paramArray[5] = this.m_g * brighness;
        this.m_paramArray[6] = this.m_b * brighness;
    }
    getBrightness():number
    {
        return this.m_brightness;
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_paramArray];
        return oum;
    }
}
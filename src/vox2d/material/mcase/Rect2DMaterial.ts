/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../../vox/math/MathConst";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as ShaderGlobalUniformT from "../../../vox/material/ShaderGlobalUniform";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";
import * as RenderProxyT from '../../../vox/render/RenderProxy';

import MathConst = MathConstT.vox.math.MathConst;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import ShaderGlobalUniform = ShaderGlobalUniformT.vox.material.ShaderGlobalUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox2d
{
    export namespace material
    {
        export namespace mcase
        {
            export class Rect2DShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:Rect2DShaderBuffer = null;
                private m_uniqueName:string = "";
                private m_hasTex:boolean = false;
                centerAlignEnabled:boolean = false;
                initialize(texEnabled:boolean):void
                {
                    console.log("Rect2DShaderBuffer::initialize()... texEnabled: "+texEnabled);
                    this.m_uniqueName = "Rect2DShd";
                    this.m_hasTex = texEnabled;
                    if(texEnabled)
                    {
                        this.m_uniqueName += "_tex";
                    }
                    if(this.centerAlignEnabled)
                    {
                        this.m_uniqueName += "_center";
                    }
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
"\
precision mediump float;\n\
varying vec4 v_color;\n\
";
                    if(this.m_hasTex)
                    {

                        fragCode +=
"\
uniform sampler2D u_sampler0;\n\
varying vec2 v_texUV;\n\
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
    gl_FragColor = texture2D(u_sampler0, v_texUV) * v_color;\n\
";
                    }
                    else
                    {
                        fragCode +=
"\
    gl_FragColor = v_color;\n\
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
precision mediump float;\n\
attribute vec3 a_vs;\n\
uniform vec4 u_stageParam;\n\
uniform vec4 u_params[3];\n\
varying vec4 v_color;\n\
";
                    if(this.m_hasTex)
                    {
                        vtxCode +=
"\
attribute vec2 a_uvs;\n\
varying vec2 v_texUV;\n\
";
                    }
                    vtxCode +=
"\
void main()\n\
{\n\
    vec4 pv4 = vec4(a_vs.xyz,1.0);\n\
    pv4.xy *= u_params[1].xy;\n\
    float cosv = cos(u_params[1].w);\n\
    float sinv = sin(u_params[1].w);\n\
    pv4.xy = vec2(pv4.x * cosv - pv4.y * sinv, pv4.x * sinv + pv4.y * cosv);\n\
    pv4.xy += u_params[0].xy;\n\
    pv4.xy *= u_stageParam.xy;\n\
";
if(!this.centerAlignEnabled)
{
    vtxCode +=
"\
    pv4.xy += -1.0;\n\
";
}
    vtxCode +=
"\
    gl_Position = pv4;\n\
";
                    if(this.m_hasTex)
                    {
                        vtxCode +=
"\
    v_texUV = vec2(a_uvs.x, 1.0 - a_uvs.y);\n\
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
                    return "[Rect2DShaderBuffer()]";
                }

                static GetInstance():Rect2DShaderBuffer
                {
                    if(Rect2DShaderBuffer.___s_instance != null)
                    {
                        return Rect2DShaderBuffer.___s_instance;
                    }
                    Rect2DShaderBuffer.___s_instance = new Rect2DShaderBuffer();
                    return Rect2DShaderBuffer.___s_instance;
                }
            }
            
            export class Rect2DMaterial extends MaterialBase
            {
                private m_centerAlignEnabled:boolean = false;
                constructor(centerAlignEnabled:boolean = false)
                {
                    super();
                    this.m_centerAlignEnabled = centerAlignEnabled;
                }
                private m_r:number = 0.0
                getCodeBuf():ShaderCodeBuffer
                {
                    Rect2DShaderBuffer.GetInstance().centerAlignEnabled = this.m_centerAlignEnabled;
                    return Rect2DShaderBuffer.GetInstance();
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
                createSharedUniform():ShaderGlobalUniform
                {
                    return null;
                }
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_params"];
                    oum.dataList = [this.m_paramArray];
                    return oum;
                }
            }
        }
    }
}
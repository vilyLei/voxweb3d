/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/




import * as MathConstT from "../../../vox/math/MathConst";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
//import * as ShaderUniformT from "../../../vox/material/ShaderUniform";
import * as Color4T from "../../../vox/material/Color4";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import MathConst = MathConstT.vox.math.MathConst;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
//import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class BillboardFlowShaderBuffer extends ShaderCodeBuffer
            {
                private m_brightnessEnabled:boolean = true;
                private m_alphaEnabled:boolean = false;
                private m_flag:number = 0;
                constructor()
                {
                    super();
                }
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    this.m_uniqueName = "BillboardFlowShader";
                }
                setParam(brightnessEnabled:boolean, alphaEnabled:boolean):void
                {
                    this.m_brightnessEnabled = brightnessEnabled;
                    this.m_alphaEnabled = alphaEnabled;
                    this.m_flag = 0;
                    if(this.m_brightnessEnabled && this.m_alphaEnabled)
                    {
                        this.m_flag = 1;
                    }
                    else if(this.m_brightnessEnabled)
                    {
                        this.m_flag = 2;
                    }
                    else if(this.m_alphaEnabled)
                    {
                        this.m_flag = 3;
                    }
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec4 v_texUV;
layout(location = 0) out vec4 FragColor;
void main()
{
    vec4 color = texture(u_sampler0, v_texUV.xy);
    color.rgb = max(color.rgb * v_colorMult.xyz + v_colorOffset.xyz,0.0);
`;

                let fadeCode:string;
                if(this.m_flag == 1)
                {
                    fadeCode = 
 `
    color *= v_texUV.zzzz;
`;
                }
                else if(this.m_flag == 2)
                {
                    fadeCode = 
 `
    color.rgb *= v_texUV.zzz;
`;
                }
                else if(this.m_flag == 3)
                {
                    fadeCode = 
 `
    color.a *= v_texUV.z;
`;
                }
                let endCode:string = 
`
    FragColor = color;
}
`;
                    return fragCode + fadeCode + endCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
`#version 300 es
precision mediump float;
layout(location = 0) in vec4 a_vs;
layout(location = 1) in vec4 a_vs2;
layout(location = 2) in vec2 a_uvs;
layout(location = 3) in vec4 a_uvs2;
layout(location = 4) in vec4 a_nvs;
layout(location = 5) in vec4 a_nvs2;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[3];
out vec4 v_colorMult;
out vec4 v_colorOffset;
out vec4 v_texUV;
void main()
{
    vec4 temp = u_billParam[0];
    float time = max(a_nvs.w * temp.z - a_uvs2.w, 0.0);
    float kf = fract(time/a_uvs2.x);
    time = kf * a_uvs2.x;
    kf = min(kf/a_uvs2.y,1.0) * (1.0 - max((kf-a_uvs2.z)/(1.0 - a_uvs2.z),0.0));
    vec2 vtx = a_vs.xy * temp.xy * vec2(a_vs.z + kf * a_vs.w);
    vec4 pos = u_viewMat * u_objMat * vec4(a_vs2.xyz + (a_nvs.xyz + a_nvs2.xyz * vec3(time)) * vec3(time),1.0);
    pos.xy += vtx.xy;
    gl_Position =  u_projMat * pos;
    v_texUV = vec4(a_uvs.xy, kf * a_vs2.w,kf);
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
}
`;
                    return vtxCode;
                }
                getUniqueShaderName():string
                {
                    return this.m_uniqueName + "_"+this.m_flag;
                }
                toString():string
                {
                    return "[BillboardFlowShaderBuffer()]";
                }
                private static ___s_instance:BillboardFlowShaderBuffer = new BillboardFlowShaderBuffer();
                static GetInstance():BillboardFlowShaderBuffer
                {
                    if(BillboardFlowShaderBuffer.___s_instance != null)
                    {
                        return BillboardFlowShaderBuffer.___s_instance;
                    }
                    BillboardFlowShaderBuffer.___s_instance = new BillboardFlowShaderBuffer();
                    return BillboardFlowShaderBuffer.___s_instance;
                }
            }

            export class BillboardFlowMaterial extends MaterialBase
            {
                private m_brightnessEnabled:boolean = true;
                private m_alphaEnabled:boolean = false;
                constructor(brightnessEnabled:boolean = true,alphaEnabled:boolean = false)
                {
                    super();
                    this.m_brightnessEnabled = brightnessEnabled;
                    this.m_alphaEnabled = alphaEnabled;
                }
                private m_time:number = 0;
                private m_uniformData:Float32Array = new Float32Array([1.0,1.0,0.0,1.0, 1.0,1.0,1.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0]);
                private m_color:Color4 = new Color4(1.0,1.0,1.0,1.0);
                private m_brightness:number = 1.0;

                getCodeBuf():ShaderCodeBuffer
                {
                    let buf:BillboardFlowShaderBuffer = BillboardFlowShaderBuffer.GetInstance();
                    buf.setParam(this.m_brightnessEnabled, this.m_alphaEnabled);
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

                setRGBAOffset4f(pr:number,pg:number,pb:number,pa:number):void
                {
                    //this.m_colorOffset.r = pr;
                    //this.m_colorOffset.g = pg;
                    //this.m_colorOffset.b = pb;
                    //this.m_colorOffset.a = pa;
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
                setAcceleration(accX:number,accY:number,accZ:number):void
                {
                    this.m_uniformData[12] = accX;
                    this.m_uniformData[13] = accY;
                    this.m_uniformData[14] = accZ;
                }
                getTime():number{return this.m_time;};
                setTime(time:number):void
                {
                    this.m_time = time;
                    this.m_uniformData[2] = time;
                }
                timeAddOffset(offsetTime:number):void
                {
                    this.m_time += offsetTime;
                    this.m_uniformData[2] = this.m_time;
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
        }
    }
}
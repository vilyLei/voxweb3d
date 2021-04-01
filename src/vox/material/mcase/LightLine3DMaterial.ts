/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/




import * as MathConstT from "../../../vox/math/MathConst";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as Color4T from "../../../vox/material/Color4";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";
import MathConst = MathConstT.vox.math.MathConst;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class LightLine3DShaderBuffer extends ShaderCodeBuffer
            {
                //billFS:LightLine3DFSBase = new LightLine3DFSBase();
                constructor()
                {
                    super();
                }
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    this.m_uniqueName = "LightLine3DShader";
                }
                getFragShaderCode():string
                {
                    let fragCode0:string =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
in vec2 v_texUV;
layout(location = 0) out vec4 FragColor;
void main()
{
vec4 color = texture(u_sampler0, v_texUV);
FragColor = color;
}
`;
                    return fragCode0;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
`#version 300 es
precision mediump float;
layout(location = 0) in vec4 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_param;
out vec2 v_texUV;
void main()
{
    vec4 pv0 = u_viewMat * u_objMat * vec4(a_vs.xyz,1.0);
    vec4 pv1 = u_viewMat * u_objMat * vec4(a_nvs.xyz,1.0);
    vec4 dv = pv1 - pv0;
    if(a_vs.w > 0.0){
      pv1.x = dv.y;
      pv1.y = -dv.x;
    }else{
      pv1.x = -dv.y;
      pv1.y = dv.x;
    }
    pv0.xyz += normalize(pv1.xyz) * abs(a_vs.w);
    gl_Position = u_projMat * pv0;
    v_texUV = a_uvs * u_param.xy + u_param.zw;
}
`;
                    return vtxCode;
                }
                getUniqueShaderName():string
                {
                    return this.m_uniqueName;// + "_"+this.billFS.getBrnAlphaStatus();
                }
                toString():string
                {
                    return "[LightLine3DShaderBuffer()]";
                }
                private static ___s_instance:LightLine3DShaderBuffer = new LightLine3DShaderBuffer();
                static GetInstance():LightLine3DShaderBuffer
                {
                    if(LightLine3DShaderBuffer.___s_instance != null)
                    {
                        return LightLine3DShaderBuffer.___s_instance;
                    }
                    LightLine3DShaderBuffer.___s_instance = new LightLine3DShaderBuffer();
                    return LightLine3DShaderBuffer.___s_instance;
                }
            }

            export class LightLine3DMaterial extends MaterialBase
            {
                private m_brightnessEnabled:boolean = true;
                private m_alphaEnabled:boolean = false;
                constructor(brightnessEnabled:boolean = true,alphaEnabled:boolean = false)
                {
                    super();
                    this.m_brightnessEnabled = brightnessEnabled;
                    this.m_alphaEnabled = alphaEnabled;
                }
                
                private m_uniformData:Float32Array = new Float32Array([1.0,1.0,0.0,0.0]);
                getCodeBuf():ShaderCodeBuffer
                {
                    let buf:LightLine3DShaderBuffer = LightLine3DShaderBuffer.GetInstance();
                    //buf.billFS.setBrightnessAndAlpha(this.m_brightnessEnabled,this.m_alphaEnabled);
                    return buf;
                }
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_param"];
                    oum.dataList = [this.m_uniformData];
                    return oum;
                }
                setUVParam(uScale:number,vScale:number,uOffset:number,vOffset:number):void
                {
                    this.m_uniformData[0] = uScale;
                    this.m_uniformData[1] = vScale;
                    this.m_uniformData[2] = uOffset;
                    this.m_uniformData[3] = vOffset;
                }
                setUVScale(uScale:number,vScale:number):void
                {
                    this.m_uniformData[0] = uScale;
                    this.m_uniformData[1] = vScale;
                }
                setUVOffset(uOffset:number,vOffset:number):void
                {
                    this.m_uniformData[2] = uOffset;
                    this.m_uniformData[3] = vOffset;
                }
                /*
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
                //*/
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
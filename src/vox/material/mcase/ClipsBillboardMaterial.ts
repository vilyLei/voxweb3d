/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/




import MathConst from "../../../vox/math/MathConst";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
//import ShaderUniform from "../../../vox/material/ShaderUniform";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";

//import MathConst = MathConstT.vox.math.MathConst;
//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
//import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
////import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
//import Color4 = Color4T.vox.material.Color4;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class ClipsBillboardShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    this.m_uniqueName = "ClipsBillboardShader";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
in vec4 v_colorMult;\n\
in vec4 v_colorOffset;\n\
in vec2 v_texUV;\n\
layout(location = 0) out vec4 FragColor;\n\
void main()\n\
{\n\
vec4 color = texture(u_sampler0, v_texUV);\n\
color.rgb = max(color.rgb * v_colorMult.xyz + v_colorOffset.xyz,0.0);\n\
FragColor = color;\n\
}\n\
"
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) in vec2 a_vs;\n\
layout(location = 1) in vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
uniform vec4 u_billParam[3];\n\
out vec4 v_colorMult;\n\
out vec4 v_colorOffset;\n\
out vec2 v_texUV;\n\
vec2 getGridUV(float t, vec2 uv, vec2 rc)\n\
{\n\
    vec2 dv = 1.0 / rc;\n\
    float index = floor(t * rc.x * rc.y);\n\
    index = index/rc.y;\n\
    float r = floor(index);\n\
    float c = floor(fract(index) * rc.y);\n\
    uv.x = dv.y * (c + uv.x);\n\
    uv.y = dv.x * (r + uv.y);\n\
    return uv;\n\
}\n\
void main()\n\
{\n\
vec4 temp = u_billParam[0];\n\
float cosv = cos(temp.z);\n\
float sinv = sin(temp.z);\n\
vec2 vtx = vec2(a_vs.x * temp.x, a_vs.y * temp.y);\n\
vec2 vtx_pos = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);\n\
vec4 pos = u_viewMat * u_objMat * vec4(0.0,0.0,0.0,1.0);\n\
pos.xy += vtx_pos.xy;\n\
gl_Position =  u_projMat * pos;\n\
v_colorMult = u_billParam[1];\n\
v_colorOffset = u_billParam[2];\n\
v_texUV = getGridUV(v_colorOffset.w,a_uvs.xy,vec2(floor(temp.w),floor(10.1 * fract(temp.w))));\n\
}\n\
"
                    return vtxCode;
                }
                getUniqueShaderName():string
                {
                    return this.m_uniqueName;
                }
                toString():string
                {
                    return "[ClipsBillboardShaderBuffer()]";
                }
                private static ___s_instance:ClipsBillboardShaderBuffer = new ClipsBillboardShaderBuffer();
                static GetInstance():ClipsBillboardShaderBuffer
                {
                    if(ClipsBillboardShaderBuffer.___s_instance != null)
                    {
                        return ClipsBillboardShaderBuffer.___s_instance;
                    }
                    ClipsBillboardShaderBuffer.___s_instance = new ClipsBillboardShaderBuffer();
                    return ClipsBillboardShaderBuffer.___s_instance;
                }
            }

            export class ClipsBillboardMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                private m_rz:number = 0;
                private m_uniformData:Float32Array = new Float32Array([1.0,1.0,0.0,1.1, 1.0,1.0,1.0,0.0, 0.0,0.0,0.0,0.0]);
                private m_color:Color4 = new Color4(1.0,1.0,1.0,1.0);
                private m_brightness:number = 1.0;

                getCodeBuf():ShaderCodeBuffer
                {
                    let buf:ShaderCodeBuffer = ClipsBillboardShaderBuffer.GetInstance();        
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
                setClipsRNCN(rn:number, cn:number):void
                {
                    //this.m_uniformData[2] = rn;
                    this.m_uniformData[3] = rn + 0.1 * cn;
                }
                setPlayTime(t:number):void
                {
                    this.m_uniformData[11] = t;
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
        }
    }
}
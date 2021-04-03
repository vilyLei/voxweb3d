/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/




import * as MathConstT from "../../../vox/math/MathConst";
import * as Vector3DT from "../../../vox/math/Vector3D";
import * as BillboardFSBaseT from "../../../vox/material/mcase/BillboardFSBase";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as Color4T from "../../../vox/material/Color4";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import BillboardFSBase = BillboardFSBaseT.vox.material.mcase.BillboardFSBase;
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
            export class BillboardLine3DShaderBuffer extends ShaderCodeBuffer
            {
                billFS:BillboardFSBase = new BillboardFSBase();
                constructor()
                {
                    super();
                }
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    this.m_uniqueName = "BillboardLine3DShader";
                }
                getFragShaderCode():string
                {
                    
                    let fragCode0:string =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec4 v_texUV;
in vec2 v_fadeV;
layout(location = 0) out vec4 FragColor;
void main()
{
vec4 color = texture(u_sampler0, v_texUV.xy);
vec3 offsetColor = v_colorOffset.rgb;
float kf = v_texUV.z;
//kf = min(kf / 0.3, 1.0) * (1.0 - max((kf - 0.7)/(1.0 - 0.7),0.0));
kf = min(kf / v_fadeV.x, 1.0) * (1.0 - max((kf - v_fadeV.y)/(1.0 - v_fadeV.y),0.0));
vec4 fv4 = vec4(v_colorMult.w * kf);
`;
                    let fadeCode:string = this.billFS.getBrnAndAlphaCode("fv4");
                    let fragCode2:string =
`
FragColor = color;
}
`;
                    return fragCode0 + fadeCode + fragCode2;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string =
`#version 300 es
precision mediump float;
const vec4  direcV = vec4(1.0,-1.0,-1.0,1.0);

layout(location = 0) in vec2 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[6];
out vec4 v_texUV;
out vec4 v_colorMult;
out vec4 v_colorOffset;
out vec2 v_fadeV;
void main()
{
    int i = int(a_vs.x);
    mat4 voMat4 = u_viewMat * u_objMat;
    vec4 pv0 = voMat4 * vec4(u_billParam[i].xyz,1.0);
    vec4 pv1 = voMat4 * vec4(u_billParam[i+1].xyz,1.0);
    pv1.xy = pv1.xy - pv0.xy;
    pv1.xy = pv1.yx * (a_vs.y > 0.0 ? direcV.xy : direcV.zw);
    pv0.xy += normalize(pv1.xy) * abs(u_billParam[3].w);
    gl_Position = u_projMat * pv0;
    vec2 puv = a_uvs * u_billParam[0].xy;
    float cosv = u_billParam[1].w;
    float sinv = u_billParam[2].w;
    puv = vec2(puv.x * cosv - puv.y * sinv, puv.x * sinv + puv.y * cosv);
    v_texUV.xy = puv + u_billParam[0].zw;
    v_texUV.zw = a_uvs;
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
    v_fadeV = vec2(u_billParam[4].w, u_billParam[5].w);
}
`;
                    return vtxCode;
                }
                getUniqueShaderName():string
                {
                    return this.m_uniqueName + "_"+this.billFS.getBrnAlphaStatus();
                }
                toString():string
                {
                    return "[BillboardLine3DShaderBuffer()]";
                }
                private static ___s_instance:BillboardLine3DShaderBuffer = new BillboardLine3DShaderBuffer();
                static GetInstance():BillboardLine3DShaderBuffer
                {
                    if(BillboardLine3DShaderBuffer.___s_instance != null)
                    {
                        return BillboardLine3DShaderBuffer.___s_instance;
                    }
                    BillboardLine3DShaderBuffer.___s_instance = new BillboardLine3DShaderBuffer();
                    return BillboardLine3DShaderBuffer.___s_instance;
                }
            }

            export class BillboardLine3DMaterial extends MaterialBase
            {
                private m_brightnessEnabled:boolean = true;
                private m_alphaEnabled:boolean = false;
                private m_beginPos:Vector3D = new Vector3D();
                private m_endPos:Vector3D = new Vector3D();
                private m_endPos2:Vector3D = new Vector3D();
                private m_uvRotation:number = 0;
                constructor(brightnessEnabled:boolean = true,alphaEnabled:boolean = false)
                {
                    super();
                    this.m_brightnessEnabled = brightnessEnabled;
                    this.m_alphaEnabled = alphaEnabled;
                }
                
                private m_uniformData:Float32Array = new Float32Array([
                    1.0,1.0,0.0,0.0,        // uscale,vscale,uoffset,voffset
                    1.0,1.0,1.0, 1.0,        // rgb scale coefficient: r,g,b, and uv rotation cos value
                    0.0,0.0,0.0, 0.0,        // rgb offset: r,g,b, and uv rotation sin value

                    0.0,0.0,0.0, 10.0,      // begin pos x,y,z, line half width
                    100.0,0.0,0.0, 0.3,     // end pos x,y,z, fade in value
                    200.0,0.0,0.0, 0.7,     // second end pos x,y,z, fade out value
                ]);
                getCodeBuf():ShaderCodeBuffer
                {
                    let buf:BillboardLine3DShaderBuffer = BillboardLine3DShaderBuffer.GetInstance();
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
                setBeginAndEndPos(beginPos:Vector3D, endPos:Vector3D):void
                {
                    this.m_beginPos.copyFrom(beginPos);
                    this.m_endPos.copyFrom(endPos);
                    this.m_endPos2.subVecsTo(endPos,beginPos);
                    this.m_endPos2.addBy(endPos);

                    this.m_uniformData[12] = beginPos.x;
                    this.m_uniformData[13] = beginPos.y;
                    this.m_uniformData[14] = beginPos.z;
                    
                    this.m_uniformData[16] = endPos.x;
                    this.m_uniformData[17] = endPos.y;
                    this.m_uniformData[18] = endPos.z;

                    
                    this.m_uniformData[20] = this.m_endPos2.x;
                    this.m_uniformData[21] = this.m_endPos2.y;
                    this.m_uniformData[22] = this.m_endPos2.z;
                }
                
                setBeginPos(beginPos:Vector3D):void
                {
                    this.m_beginPos.copyFrom(beginPos);
                    this.m_endPos2.subVecsTo(this.m_endPos,beginPos);
                    this.m_endPos2.addBy(this.m_endPos);

                    this.m_uniformData[12] = beginPos.x;
                    this.m_uniformData[13] = beginPos.y;
                    this.m_uniformData[14] = beginPos.z;
                    
                    this.m_uniformData[20] = this.m_endPos2.x;
                    this.m_uniformData[21] = this.m_endPos2.y;
                    this.m_uniformData[22] = this.m_endPos2.z;
                }
                setEndPos(endPos:Vector3D):void
                {
                    
                    this.m_endPos.copyFrom(endPos);
                    this.m_endPos2.subVecsTo(endPos,this.m_beginPos);
                    this.m_endPos2.addBy(endPos);

                    this.m_uniformData[16] = endPos.x;
                    this.m_uniformData[17] = endPos.y;
                    this.m_uniformData[18] = endPos.z;
                    
                    this.m_uniformData[20] = this.m_endPos2.x;
                    this.m_uniformData[21] = this.m_endPos2.y;
                    this.m_uniformData[22] = this.m_endPos2.z;
                }
                
                setLineWidth(lineWidth:number):void
                {
                    this.m_uniformData[15] = 0.5 * lineWidth;
                }
                getLineWidth():number
                {
                    return this.m_uniformData[15];
                }
                setUVRotation(uvDegree:number):void
                {
                    this.m_uvRotation = uvDegree;
                    uvDegree = MathConst.DegreeToRadian(uvDegree);
                    //7,11
                    this.m_uniformData[7] = Math.cos(uvDegree);
                    this.m_uniformData[11] = Math.sin(uvDegree);
                }
                getUVRotation():number
                {
                    return this.m_uvRotation;
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
                setRGB3f(pr:number,pg:number,pb:number)
                {
                    this.m_uniformData[4] = pr;
                    this.m_uniformData[5] = pg;
                    this.m_uniformData[6] = pb;
                }
                setFadeRange(fadeMin:number, fadeMax:number):void
                {
                    this.m_uniformData[19] = fadeMin;
                    this.m_uniformData[23] = fadeMax;
                }
                setFadeFactor(pa:number):void
                {
                    this.m_uniformData[7] = pa;
                }
                getFadeFactor():number
                {
                    return this.m_uniformData[7];
                }

                setRGBOffset3f(pr:number,pg:number,pb:number):void
                {
                    this.m_uniformData[8] = pr;
                    this.m_uniformData[9] = pg;
                    this.m_uniformData[10] = pb;
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
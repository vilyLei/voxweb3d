/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import TextureProxy from "../../../vox/texture/TextureProxy";
import MaterialBase from "../../../vox/material/MaterialBase";
import * as ParalLightDataT from "../light/ParalLightData";

import ParalLightData = ParalLightDataT.voxvat.demo.light.ParalLightData;

export namespace voxvat
{
    export namespace demo
    {
        export namespace material
        {
            export class DirtyIronShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static s_instance:DirtyIronShaderBuffer = new DirtyIronShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("DirtyIronShaderBuffer::initialize()...");
                    this.m_uniqueName = "DirtyIronShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = "";
                    fragCode =
`#version 300 es
precision mediump float;
precision mediump int;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;
uniform sampler2D u_sampler3;
in vec2 v_uvs;
in vec3 v_viewVS;
in vec3 v_lightData[16];
in vec3 v_mToVNVS;
layout(location = 0) out vec4 fragOutput0;
uniform vec4 fV4U_0[6];
uniform vec4 fV4U_1[33];
vec3 getFragAdsCookTorLight(vec3 viewDir,vec3 lightPos,vec3 srcColor,vec3 lightColor, vec3 paramVec3, vec3 specVec3,vec3 pnvs)
{
    vec3 lightDirVec3 = lightPos - v_viewVS;
    float disFloat = length(lightDirVec3);
    lightDirVec3 = normalize(lightDirVec3);
    float NdotL = max(dot(pnvs, lightDirVec3), 0.0);
    lightPos = NdotL * srcColor * lightColor;
    vec3 H = normalize(lightDirVec3 + viewDir);
    float fv = dot(viewDir,H);
    float NDotH = dot(pnvs, H);
    float NDotH2 = NDotH * NDotH;
    float m = fV4U_0[2].x;
    float fValue = m + (1.0 - m) * pow(1.0 - fv,5.0);
    m = pow(fV4U_0[2].y,2.0);
    float dValue = exp((NDotH2 - 1.0)/(m * NDotH2)) / (m * NDotH2 * NDotH2);
    m = 2.0 * NDotH / fv;
    fv = dot(viewDir,pnvs);
    m = (fValue * dValue * min(1.0, min(m * NdotL, m * fv))) / fv;
    lightColor = specVec3 * NdotL * lightColor * m;
    lightColor = lightColor * pow(max(NDotH, 0.0), fV4U_0[2].z);
    disFloat = 1.0 / (1.0 + paramVec3.x * disFloat + paramVec3.y * disFloat * disFloat);
    return (lightPos * fV4U_0[3].x + lightColor * fV4U_0[3].y) * disFloat * paramVec3.z;
}
void main()
{
vec4 result4_1 = vec4(0.0);
vec4 color4;
vec2 puvs = fV4U_0[5].xy * v_uvs.xy;
color4 = texture(u_sampler0, puvs);
result4_1 = color4;
vec4 mTexSpecVec4 = color4;
color4 = texture(u_sampler1, puvs);
result4_1 = color4;
result4_1.xyz = result4_1.xyz * fV4U_0[0].x;
result4_1.xyz = pow(result4_1.xyz, vec3(fV4U_0[1].x));
vec4 mMaskFragFactorV4 = clamp(result4_1,0.0,1.0);
color4 = texture(u_sampler2, puvs);
result4_1 = color4;
vec4 mMaskFragSrcV4 = color4;
vec4 tex_54_color4 = texture(u_sampler3, puvs);
color4 = tex_54_color4;
vec3 temp_0_RDV3 = mTexSpecVec4.xyz;
vec3 temp_2_RDV3 = normalize(-v_viewVS);
vec3 dstVec3 = vec3(0.0);
int kInt = 1;
for (int i = 0; i < 16; ++i)
{
    dstVec3 += getFragAdsCookTorLight(temp_2_RDV3,v_lightData[i],color4.xyz,fV4U_1[kInt].xyz,fV4U_1[kInt+1].xyz, temp_0_RDV3,v_mToVNVS);
    kInt += 2;
}
color4.xyz = dstVec3.xyz;
result4_1.xyz = (color4.xyz + tex_54_color4.xyz * 0.3);
result4_1.xyz = mMaskFragSrcV4.xyz * mMaskFragFactorV4.x + fV4U_0[4].xyz * result4_1.xyz * (1.0 - mMaskFragFactorV4.x);
fragOutput0 = result4_1;
}
`;
                    return fragCode;
                }
                getVertShaderCode():string
                {
                    let vtxCode:string = "";
                    vtxCode =
`#version 300 es
precision mediump float;
precision mediump int;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uvs;
out vec3 v_viewVS;
out vec3 v_lightData[16];
out vec3 v_mToVNVS;
uniform vec4 vV4U_0[16];
void main()
{
vec4 result4_0 = vec4(0.0);
vec4 vtxVec4;
vtxVec4 = vec4(a_vs.xyz,1.0);
mat4 mModelMat = u_objMat;
vtxVec4 = mModelMat * vtxVec4;
mat4 mViewMat = u_viewMat;
mat4 mModToVMMat = mViewMat * mModelMat;
mat3 mModToVMMat3 = mat3(mModToVMMat);
mat3 mInvMToVMMat3 = inverse(mModToVMMat3);
vtxVec4 = mViewMat * vtxVec4;
vec4 vsViewPos = vtxVec4;
mat4 mProjMat = u_projMat;
vtxVec4 = mProjMat * vtxVec4;
for(int i = 0; i < 16;i++)
{
    v_lightData[i] = (mViewMat * vec4(vV4U_0[i].xyz,1.0)).xyz;
}
result4_0 = vtxVec4;
gl_Position = result4_0;
v_uvs = a_uvs;
v_viewVS = vsViewPos.xyz;
v_mToVNVS = a_nvs.xyz * mInvMToVMMat3;
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
                    return "[DirtyIronShaderBuffer()]";
                }

                static GetInstance():DirtyIronShaderBuffer
                {
                    return DirtyIronShaderBuffer.s_instance;
                }
            }
            
            export class DirtyIronMaterial extends MaterialBase
            {
                private m_mparamData:Float32Array = new Float32Array(6 * 4);
                constructor()
                {
                    super();
                }
                
                initData():void
                {
                    // BlendFuncDyn_Scale
                    this.setParamAt(0.9 + Math.random() * 0.6,1.0,1.0,1.0, 0);
                    // VatBlendFuncDyn_Pow
                    this.setParamAt(3.0,1.0,1.0,1.0, 1);
                    // params
                    this.setParamAt(0.5, 0.5 + Math.random() * 4.0, 8.0 + Math.random() * 32.0, 0.0, 2);
                    // light factor
                    this.setParamAt(0.5,1.8, 16.0, 0.0, 3);
                    // base color
                    this.setParamAt(Math.random() + 0.8,Math.random() + 0.8,Math.random() + 0.8,1.0,4);
                    // uv scale
                    this.setParamAt(1.0,1.0,1.0,1.0,5);
                }
                setMaterialTex(lightGlossTex:TextureProxy, blendMaskTex:TextureProxy,blendSrcTex:TextureProxy,blendDstTex:TextureProxy):void
                {
                    this.setTextureList([lightGlossTex,blendMaskTex,blendSrcTex,blendDstTex]);
                }
                setUVScale(uscale:number,vscale:number):void
                {
                    this.m_mparamData[20] = uscale;
                    this.m_mparamData[21] = vscale;
                }
                setRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_mparamData[16] = pr;
                    this.m_mparamData[17] = pg;
                    this.m_mparamData[18] = pb;
                }
                setParamAt(p0:number,p1:number,p2:number,p3:number, i:number):void
                {
                    i *= 4;
                    this.m_mparamData[i++] = p0;
                    this.m_mparamData[i++] = p1;
                    this.m_mparamData[i++] = p2;
                    this.m_mparamData[i] = p3;
                }

                getCodeBuf():ShaderCodeBuffer
                {
                    return DirtyIronShaderBuffer.GetInstance();
                }
                
                createSharedUniforms():ShaderGlobalUniform[]
                {
                    // let headU:ShaderGlobalUniform = new ShaderGlobalUniform();
                    // headU.uniformNameList = ["vV4U_0","fV4U_1"];
                    // headU.copyDataFromProbe(ParalLightData.getUProbe());
                    // return [headU];
                    return null;
                }
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["fV4U_0"];
                    oum.dataList = [this.m_mparamData];
                    return oum;
                }
            }
        }
    }
}
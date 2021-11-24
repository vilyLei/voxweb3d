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
import MaterialBase from "../../../vox/material/MaterialBase";
import RenderProxy from '../../../vox/render/RenderProxy';
import * as ParalLightDataT from "../light/ParalLightData";

import ParalLightData = ParalLightDataT.voxvat.demo.light.ParalLightData;

export namespace voxvat
{
    export namespace demo
    {
        export namespace material
        {
            export class ParalMap2ShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static s_instance:ParalMap2ShaderBuffer = new ParalMap2ShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("ParalMap2ShaderBuffer::initialize()...");
                    this.m_uniqueName = "ParalMap2Shd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = "";
                    fragCode =
`
#version 300 es
precision mediump float;
precision mediump int;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;
uniform sampler2D u_sampler3;
in vec2 v_uvs;
in vec3 v_vTBNViewVSDir;
in vec3 v_viewVS;
in vec3 v_lightData[16];
in mat3 v_VTBNM3;
layout(location = 0) out vec4 fragOutput0;
uniform vec4 fV4U_0[6];
uniform vec4 fV4U_1[33];
vec2 paralOccRayMarchDep2(vec2 puvs, vec3 viewDir,vec4 occParam)
{
    float depthValue = 1.0 - texture(u_sampler1, puvs).r;
    float numLayers = mix(occParam.x, occParam.y, max(dot(vec3(0.0, 0.0, 1.0), viewDir),0.0));
    float layerHeight = occParam.z / numLayers;
    vec2 tuv = (viewDir.xy * occParam.w) / numLayers;  
    float ph = 0.0;
    while(ph < depthValue)
    {
        puvs -= tuv;
        depthValue = 1.0 - texture(u_sampler1, puvs).r;
        ph += layerHeight;
    }
    tuv += puvs;
    depthValue -= ph;
    ph = 1.0 - texture(u_sampler1, tuv).r - ph + layerHeight;
    float weight = depthValue / (depthValue - ph);
    return tuv * weight + puvs * (1.0 - weight);
}
vec3 getFragAdsCookTorLight(vec3 viewDir,vec3 lightPos,vec3 srcColor,vec3 lightColor, vec3 paramVec3, vec3 specVec3,vec3 pnvs)
{
    vec3 lightDirVec3 = lightPos - v_viewVS;
    float factor = length(lightDirVec3);
    lightDirVec3 = v_VTBNM3 * normalize(lightDirVec3);
    float NdotL = max(dot(pnvs, lightDirVec3), 0.0);
    lightPos = NdotL * srcColor * lightColor;
    vec3 H = normalize(lightDirVec3 + viewDir);
    float fv = dot(viewDir,H);
    float NDotH = dot(pnvs, H);
    float NDotH2 = NDotH * NDotH;
    // Fresnel
    float m = fV4U_0[4].x;
    float fValue = m + (1.0 - m) * pow(1.0 - fv,5.0);
    // roughness
    m = fV4U_0[4].y;
    m *= m
    float dValue = exp((NDotH2 - 1.0)/(m * NDotH2)) / (m * NDotH2 * NDotH2);
    m = 2.0 * NDotH / fv;
    fv = dot(viewDir,pnvs);
    m = (fValue * dValue * min(1.0, min(m * NdotL, m * fv))) / fv;
    lightColor = specVec3 * NdotL * lightColor * m;
    lightColor = lightColor * pow(max(NDotH, 0.0), fV4U_0[4].z);
    factor = 1.0 / (1.0 + paramVec3.x * factor + paramVec3.y * factor * factor);
    return (lightPos * fV4U_0[5].x + lightColor * fV4U_0[5].y) * factor * paramVec3.z;
}
void main()
{
vec4 result4_1 = vec4(0.0);
vec4 color4;
color4 = texture(u_sampler0, v_uvs.xy);
result4_1 = color4;
vec4 mTexSpecVec4 = color4;
vec4 texUV4;
texUV4.xy = (v_uvs.xy * fV4U_0[0].xy) + fV4U_0[0].zw;
vec4 mTexGUVV4 = vec4(paralOccRayMarchDep2(texUV4.xy,-v_vTBNViewVSDir.xyz,fV4U_0[3]), 0.0,0.0);
color4 = texture(u_sampler2, mTexGUVV4.xy);
result4_1 = color4;
result4_1.xyz = normalize(2.0 * color4.xyz - 1.0);
vec4 mTexNormVec4 = result4_1;
vec4 tex_56_color4 = texture(u_sampler3, mTexGUVV4.xy);
color4 = tex_56_color4;
vec3 temp_0_RDV3 = mTexSpecVec4.xyz;
vec3 temp_2_RDV3 = v_VTBNM3 * normalize(-v_viewVS);
vec3 temp_1_RDV3 = mTexNormVec4.xyz;
vec3 dstVec3 = vec3(0.0);
int kInt = 1;
for (int i = 0; i < 16; ++i)
{
    dstVec3 += getFragAdsCookTorLight(temp_2_RDV3,v_lightData[i],color4.xyz,fV4U_1[kInt].xyz,fV4U_1[kInt+1].xyz, temp_0_RDV3,temp_1_RDV3);
    kInt += 2;
}
color4.xyz = dstVec3.xyz;
result4_1.xyz = (color4.xyz * 0.7 + fV4U_0[1].xyz * tex_56_color4.xyz * 0.1);
fragOutput0 = result4_1;
}
`;
                    return fragCode;
                }
                getVertShaderCode():string
                {
                    let vtxCode:string = "";
                    vtxCode =
`
#version 300 es
precision mediump float;
precision mediump int;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
layout(location = 3) in vec3 a_tvs;
layout(location = 4) in vec3 a_tvs2;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uvs;
out vec3 v_vTBNViewVSDir;
out vec3 v_viewVS;
out vec3 v_lightData[16];
out mat3 v_VTBNM3;
uniform vec4 vV4U_0[16];
//out vec3 v_vec3;
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
vtxVec4 = mViewMat * vtxVec4;
vec4 vsViewPos = vtxVec4;
mat4 mProjMat = u_projMat;
vtxVec4 = mProjMat * vtxVec4;
mat3 mMToVTBN3 = transpose(mat3(
    mModToVMMat3 * a_tvs,
    mModToVMMat3 * a_tvs2,
    mModToVMMat3 * a_nvs
));
for(int i = 0; i < 16;i++)
{
    v_lightData[i] = (mViewMat * vec4(vV4U_0[i].xyz,1.0)).xyz;
}
result4_0 = vtxVec4;
gl_Position = result4_0;
v_uvs = a_uvs;
v_vTBNViewVSDir = normalize(mMToVTBN3 * vsViewPos.xyz);
v_viewVS = vsViewPos.xyz;
v_VTBNM3 = mMToVTBN3;
//v_vec3 = abs(a_tvs.xyz);
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
                    return "[ParalMap2ShaderBuffer()]";
                }

                static GetInstance():ParalMap2ShaderBuffer
                {
                    return ParalMap2ShaderBuffer.s_instance;
                }
            }
            
            export class ParalMap2Material extends MaterialBase
            {
                private m_mparamData:Float32Array = new Float32Array(6 * 4);
                constructor()
                {
                    super();
                }
                
                initData():void
                {
                    let m_scaleU:number = 1.0;
                    let m_scaleV:number = 1.0;
                    // uv scale and translation
                    this.setParamAt(m_scaleU,m_scaleV, 0.0,0.0, 0);
                    // color
                    this.setParamAt(Math.random() + 0.8,Math.random() + 0.8,Math.random() + 0.8,1.0, 1);
                    let blendK:number = Math.random();
                    this.setParamAt(blendK,1.0 - blendK, 1.0,1.0, 2);
                    // Parallax func param
                    this.setParamAt(1.0,10.0,2.0,0.1, 3);
                    this.setParamAt(0.5, 1.0 + Math.random() * 4.0, 8.0 + Math.random() * 32.0, 0.0, 4);
                    // light factor
                    this.setParamAt(0.5,0.6, 16.0,0.0, 5);
                }
                setUVScale(uscale:number,vscale:number):void
                {
                    this.m_mparamData[0] = uscale;
                    this.m_mparamData[1] = vscale;
                }
                setRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_mparamData[4] = pr;
                    this.m_mparamData[5] = pg;
                    this.m_mparamData[6] = pb;
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
                    return ParalMap2ShaderBuffer.GetInstance();
                }
                
                createSharedUniforms():ShaderGlobalUniform[]
                {
                    let headU:ShaderGlobalUniform = new ShaderGlobalUniform();
                    headU.uniformNameList = ["vV4U_0","fV4U_1"];
                    headU.copyDataFromProbe(ParalLightData.getUProbe());
                    return [headU];
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
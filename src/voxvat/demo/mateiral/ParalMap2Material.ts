/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as ShaderGlobalUniformT from "../../../vox/material/ShaderGlobalUniform";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";
import * as RenderProxyT from '../../../vox/render/RenderProxy';
import * as ParalLightDataT from "../light/ParalLightData";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import ShaderGlobalUniform = ShaderGlobalUniformT.vox.material.ShaderGlobalUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
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
                private static ___s_instance:ParalMap2ShaderBuffer = new ParalMap2ShaderBuffer();
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
"\
#version 300 es\n\
precision mediump float;\n\
precision mediump int;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
uniform sampler2D u_sampler2;\n\
uniform sampler2D u_sampler3;\n\
in vec2 v_uvs;\n\
in vec3 v_vTBNViewVSDir;\n\
in vec3 v_viewVS;\n\
in vec3 v_lightData[16];\n\
in mat3 v_VTBNM3;\n\
layout(location = 0) out vec4 fragOutput0;\n\
uniform vec4 fV4U_0[6];\n\
uniform vec4 fV4U_1[33];\n\
vec2 paralOccRayMarchDep2(vec2 puvs, vec3 viewDir,vec4 occParam)\n\
{\n\
    float depthValue = 1.0 - texture(u_sampler1, puvs).r;\n\
    float numLayers = mix(occParam.x, occParam.y, max(dot(vec3(0.0, 0.0, 1.0), viewDir),0.0));\n\
    float layerHeight = occParam.z / numLayers;\n\
    vec2 tuv = (viewDir.xy * occParam.w) / numLayers;  \n\
    float ph = 0.0;\n\
    while(ph < depthValue)\n\
    {\n\
        puvs -= tuv;\n\
        depthValue = 1.0 - texture(u_sampler1, puvs).r;\n\
        ph += layerHeight;\n\
    }\n\
    tuv += puvs;\n\
    depthValue -= ph;\n\
    ph = 1.0 - texture(u_sampler1, tuv).r - ph + layerHeight;\n\
    float weight = depthValue / (depthValue - ph);\n\
    return tuv * weight + puvs * (1.0 - weight);\n\
}\n\
vec3 getFragAdsCookTorLight(vec3 viewDir,vec3 lightPos,vec3 srcColor,vec3 lightColor, vec3 paramVec3, vec3 specVec3,vec3 pnvs)\n\
{\n\
    vec3 lightDirVec3 = lightPos - v_viewVS;\n\
    float disFloat = length(lightDirVec3);\n\
    lightDirVec3 = v_VTBNM3 * normalize(lightDirVec3);\n\
    float NdotL = max(dot(pnvs, lightDirVec3), 0.0);\n\
    lightPos = NdotL * srcColor * lightColor;\n\
    vec3 H = normalize(lightDirVec3 + viewDir);\n\
    float fv = dot(viewDir,H);\n\
    float NDotH = dot(pnvs, H);\n\
    float NDotH2 = NDotH * NDotH;\n\
    float m = fV4U_0[4].x;\n\
    float fValue = m + (1.0 - m) * pow(1.0 - fv,5.0);\n\
    m = pow(fV4U_0[4].y,2.0);\n\
    float dValue = exp((NDotH2 - 1.0)/(m * NDotH2)) / (m * NDotH2 * NDotH2);\n\
    m = 2.0 * NDotH / fv;\n\
    fv = dot(viewDir,pnvs);\n\
    m = (fValue * dValue * min(1.0, min(m * NdotL, m * fv))) / fv;\n\
    lightColor = specVec3 * NdotL * lightColor * m;\n\
    lightColor = lightColor * pow(max(NDotH, 0.0), fV4U_0[4].z);\n\
    disFloat = 1.0 / (1.0 + paramVec3.x * disFloat + paramVec3.y * disFloat * disFloat);\n\
    return (lightPos * fV4U_0[5].x + lightColor * fV4U_0[5].y) * disFloat * paramVec3.z;\n\
}\n\
void main()\n\
{\n\
vec4 result4_1 = vec4(0.0);\n\
vec4 color4;\n\
color4 = texture(u_sampler0, v_uvs.xy);\n\
result4_1 = color4;\n\
vec4 mTexSpecVec4 = color4;\n\
vec4 texUV4;\n\
texUV4.xy = (v_uvs.xy * fV4U_0[0].xy) + fV4U_0[0].zw;\n\
vec4 mTexGUVV4 = vec4(paralOccRayMarchDep2(texUV4.xy,-v_vTBNViewVSDir.xyz,fV4U_0[3]), 0.0,0.0);\n\
color4 = texture(u_sampler2, mTexGUVV4.xy);\n\
result4_1 = color4;\n\
result4_1.xyz = normalize(2.0 * color4.xyz - 1.0);\n\
vec4 mTexNormVec4 = result4_1;\n\
vec4 tex_56_color4 = texture(u_sampler3, mTexGUVV4.xy);\n\
color4 = tex_56_color4;\n\
vec3 temp_0_RDV3 = mTexSpecVec4.xyz;\n\
vec3 temp_2_RDV3 = v_VTBNM3 * normalize(-v_viewVS);\n\
vec3 temp_1_RDV3 = mTexNormVec4.xyz;\n\
vec3 dstVec3 = vec3(0.0);\n\
int kInt = 1;\n\
for (int i = 0; i < 16; ++i)\n\
{\n\
    dstVec3 += getFragAdsCookTorLight(temp_2_RDV3,v_lightData[i],color4.xyz,fV4U_1[kInt].xyz,fV4U_1[kInt+1].xyz, temp_0_RDV3,temp_1_RDV3);\n\
    kInt += 2;\n\
}\n\
color4.xyz = dstVec3.xyz;\n\
result4_1.xyz = (color4.xyz * 0.7 + fV4U_0[1].xyz * tex_56_color4.xyz * 0.1);\n\
fragOutput0 = result4_1;\n\
}\n\
";
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = "";
                    vtxCode =
"\
#version 300 es\n\
precision mediump float;\n\
precision mediump int;\n\
layout(location = 0) in vec3 a_vs;\n\
layout(location = 1) in vec2 a_uvs;\n\
layout(location = 2) in vec3 a_nvs;\n\
layout(location = 3) in vec3 a_tvs;\n\
layout(location = 4) in vec3 a_tvs2;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
out vec2 v_uvs;\n\
out vec3 v_vTBNViewVSDir;\n\
out vec3 v_viewVS;\n\
out vec3 v_lightData[16];\n\
out mat3 v_VTBNM3;\n\
uniform vec4 vV4U_0[16];\n\
//out vec3 v_vec3;\n\
void main()\n\
{\n\
vec4 result4_0 = vec4(0.0);\n\
vec4 vtxVec4;\n\
vtxVec4 = vec4(a_vs.xyz,1.0);\n\
mat4 mModelMat = u_objMat;\n\
vtxVec4 = mModelMat * vtxVec4;\n\
mat4 mViewMat = u_viewMat;\n\
mat4 mModToVMMat = mViewMat * mModelMat;\n\
mat3 mModToVMMat3 = mat3(mModToVMMat);\n\
vtxVec4 = mViewMat * vtxVec4;\n\
vec4 vsViewPos = vtxVec4;\n\
mat4 mProjMat = u_projMat;\n\
vtxVec4 = mProjMat * vtxVec4;\n\
mat3 mMToVTBN3 = transpose(mat3(\n\
    mModToVMMat3 * a_tvs,\n\
    mModToVMMat3 * a_tvs2,\n\
    mModToVMMat3 * a_nvs\n\
));\n\
for(int i = 0; i < 16;i++)\n\
{\n\
    v_lightData[i] = (mViewMat * vec4(vV4U_0[i].xyz,1.0)).xyz;\n\
}\n\
result4_0 = vtxVec4;\n\
gl_Position = result4_0;\n\
v_uvs = a_uvs;\n\
v_vTBNViewVSDir = normalize(mMToVTBN3 * vsViewPos.xyz);\n\
v_viewVS = vsViewPos.xyz;\n\
v_VTBNM3 = mMToVTBN3;\n\
//v_vec3 = abs(a_tvs.xyz);\n\
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
                    return "[ParalMap2ShaderBuffer()]";
                }

                static GetInstance():ParalMap2ShaderBuffer
                {
                    return ParalMap2ShaderBuffer.___s_instance;
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
                
                createSharedUniform(rc:RenderProxy):ShaderGlobalUniform
                {
                    let headU:ShaderGlobalUniform = new ShaderGlobalUniform();
                    headU.uniformNameList = ["vV4U_0","fV4U_1"];
                    headU.copyDataFromProbe(ParalLightData.getUProbe());
                    return headU;
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
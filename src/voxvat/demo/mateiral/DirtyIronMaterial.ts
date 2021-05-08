/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../../vox/render/RendererDeviece";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import TextureProxy from "../../../vox/texture/TextureProxy";
import MaterialBase from "../../../vox/material/MaterialBase";
import RenderProxy from '../../../vox/render/RenderProxy';
import * as ParalLightDataT from "../light/ParalLightData";

//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
//import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
//import ShaderGlobalUniform = ShaderGlobalUniformT.vox.material.ShaderGlobalUniform;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
//import RenderProxy = RenderProxyT.vox.render.RenderProxy;
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
                private static ___s_instance:DirtyIronShaderBuffer = new DirtyIronShaderBuffer();
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
"\
#version 300 es\n\
precision mediump float;\n\
precision mediump int;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
uniform sampler2D u_sampler2;\n\
uniform sampler2D u_sampler3;\n\
in vec2 v_uvs;\n\
in vec3 v_viewVS;\n\
in vec3 v_lightData[16];\n\
in vec3 v_mToVNVS;\n\
layout(location = 0) out vec4 fragOutput0;\n\
uniform vec4 fV4U_0[6];\n\
uniform vec4 fV4U_1[33];\n\
vec3 getFragAdsCookTorLight(vec3 viewDir,vec3 lightPos,vec3 srcColor,vec3 lightColor, vec3 paramVec3, vec3 specVec3,vec3 pnvs)\n\
{\n\
    vec3 lightDirVec3 = lightPos - v_viewVS;\n\
    float disFloat = length(lightDirVec3);\n\
    lightDirVec3 = normalize(lightDirVec3);\n\
    float NdotL = max(dot(pnvs, lightDirVec3), 0.0);\n\
    lightPos = NdotL * srcColor * lightColor;\n\
    vec3 H = normalize(lightDirVec3 + viewDir);\n\
    float fv = dot(viewDir,H);\n\
    float NDotH = dot(pnvs, H);\n\
    float NDotH2 = NDotH * NDotH;\n\
    float m = fV4U_0[2].x;\n\
    float fValue = m + (1.0 - m) * pow(1.0 - fv,5.0);\n\
    m = pow(fV4U_0[2].y,2.0);\n\
    float dValue = exp((NDotH2 - 1.0)/(m * NDotH2)) / (m * NDotH2 * NDotH2);\n\
    m = 2.0 * NDotH / fv;\n\
    fv = dot(viewDir,pnvs);\n\
    m = (fValue * dValue * min(1.0, min(m * NdotL, m * fv))) / fv;\n\
    lightColor = specVec3 * NdotL * lightColor * m;\n\
    lightColor = lightColor * pow(max(NDotH, 0.0), fV4U_0[2].z);\n\
    disFloat = 1.0 / (1.0 + paramVec3.x * disFloat + paramVec3.y * disFloat * disFloat);\n\
    return (lightPos * fV4U_0[3].x + lightColor * fV4U_0[3].y) * disFloat * paramVec3.z;\n\
}\n\
void main()\n\
{\n\
vec4 result4_1 = vec4(0.0);\n\
vec4 color4;\n\
vec2 puvs = fV4U_0[5].xy * v_uvs.xy;\n\
color4 = texture(u_sampler0, puvs);\n\
result4_1 = color4;\n\
vec4 mTexSpecVec4 = color4;\n\
color4 = texture(u_sampler1, puvs);\n\
result4_1 = color4;\n\
result4_1.xyz = result4_1.xyz * fV4U_0[0].x;\n\
result4_1.xyz = pow(result4_1.xyz, vec3(fV4U_0[1].x));\n\
vec4 mMaskFragFactorV4 = clamp(result4_1,0.0,1.0);\n\
color4 = texture(u_sampler2, puvs);\n\
result4_1 = color4;\n\
vec4 mMaskFragSrcV4 = color4;\n\
vec4 tex_54_color4 = texture(u_sampler3, puvs);\n\
color4 = tex_54_color4;\n\
vec3 temp_0_RDV3 = mTexSpecVec4.xyz;\n\
vec3 temp_2_RDV3 = normalize(-v_viewVS);\n\
vec3 dstVec3 = vec3(0.0);\n\
int kInt = 1;\n\
for (int i = 0; i < 16; ++i)\n\
{\n\
    dstVec3 += getFragAdsCookTorLight(temp_2_RDV3,v_lightData[i],color4.xyz,fV4U_1[kInt].xyz,fV4U_1[kInt+1].xyz, temp_0_RDV3,v_mToVNVS);\n\
    kInt += 2;\n\
}\n\
color4.xyz = dstVec3.xyz;\n\
result4_1.xyz = (color4.xyz + tex_54_color4.xyz * 0.3);\n\
result4_1.xyz = mMaskFragSrcV4.xyz * mMaskFragFactorV4.x + fV4U_0[4].xyz * result4_1.xyz * (1.0 - mMaskFragFactorV4.x);\n\
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
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
out vec2 v_uvs;\n\
out vec3 v_viewVS;\n\
out vec3 v_lightData[16];\n\
out vec3 v_mToVNVS;\n\
uniform vec4 vV4U_0[16];\n\
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
mat3 mInvMToVMMat3 = inverse(mModToVMMat3);\n\
vtxVec4 = mViewMat * vtxVec4;\n\
vec4 vsViewPos = vtxVec4;\n\
mat4 mProjMat = u_projMat;\n\
vtxVec4 = mProjMat * vtxVec4;\n\
for(int i = 0; i < 16;i++)\n\
{\n\
    v_lightData[i] = (mViewMat * vec4(vV4U_0[i].xyz,1.0)).xyz;\n\
}\n\
result4_0 = vtxVec4;\n\
gl_Position = result4_0;\n\
v_uvs = a_uvs;\n\
v_viewVS = vsViewPos.xyz;\n\
v_mToVNVS = a_nvs.xyz * mInvMToVMMat3;\n\
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
                    return "[DirtyIronShaderBuffer()]";
                }

                static GetInstance():DirtyIronShaderBuffer
                {
                    return DirtyIronShaderBuffer.___s_instance;
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
                
                createSharedUniform():ShaderGlobalUniform
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
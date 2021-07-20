/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../vox/render/RendererDeviece";
import GLSLConverter from "../../vox/material/code/GLSLConverter";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import { DefaultPBRShaderCode } from "./DefaultPBRShaderCode";
import Color4 from "../../vox/material/Color4";

class DefaultPBRShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: DefaultPBRShaderBuffer = new DefaultPBRShaderBuffer();
    private m_uniqueName: string = "";
    private m_has2DMap: boolean = false;

    woolEnabled: boolean = true;
    toneMappingEnabled: boolean = true;
    envMapEnabled: boolean = true;
    scatterEnabled: boolean = true;
    specularBleedEnabled: boolean = true;
    metallicCorrection: boolean = true;
    gammaCorrection: boolean = true;
    absorbEnabled: boolean = false;
    normalNoiseEnabled: boolean = false;
    pixelNormalNoiseEnabled: boolean = false;
    mirrorProjEnabled: boolean = false;
    diffuseMapEnabled: boolean = false;
    normalMapEnabled: boolean = false;

    pointLightsTotal: number = 4;
    parallelLightsTotal: number = 0;
    texturesTotal: number = 1;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "DefaultPBRShd";
        this.adaptationShaderVersion = false;
        console.log("DefaultPBRShaderBuffer::initialize()...，adaptationShaderVersion: ", this.adaptationShaderVersion);
    }
    getFragShaderCode(): string {
        //  console.log("DefaultPBR",DefaultPBR);
        //  console.log("DefaultPBR.frag",DefaultPBR.frag);
        //  console.log("DefaultPBR end.");

        let fragCode: string = "";
        if (RendererDeviece.IsWebGL2()) {
            fragCode = "#version 300 es";
        }
        if (RendererDeviece.IsWebGL1()) {

            fragCode +=
`
#extension GL_OES_standard_derivatives : enable
#extension GL_EXT_shader_texture_lod : enable
#define VOX_IN varying
#define VOX_TextureCubeLod textureCubeLodEXT
#define VOX_Texture2DLod texture2DLodEXT
#define VOX_Texture2D texture2D
precision highp float;
`;
        }
        else {

            fragCode +=
`
#define VOX_OUT out
#define VOX_IN in
#define VOX_TextureCubeLod textureLod
#define VOX_Texture2DLod textureLod
#define VOX_Texture2D texture
precision highp float;
`;
        }
        
        let mirrorProjEnabled: boolean = this.mirrorProjEnabled && this.texturesTotal > 1;
        // 毛料表面效果
        if (this.woolEnabled) fragCode += "\n#define VOX_WOOL";
        if (this.toneMappingEnabled) fragCode += "\n#define VOX_TONE_MAPPING";
        if (this.envMapEnabled) fragCode += "\n#define VOX_ENV_MAP";
        if (this.scatterEnabled) fragCode += "\n#define VOX_SCATTER";
        if (this.specularBleedEnabled) fragCode += "\n#define VOX_SPECULAR_BLEED";
        if (this.metallicCorrection) fragCode += "\n#define VOX_METALLIC_CORRECTION";
        if (this.gammaCorrection) fragCode += "\n#define VOX_GAMMA_CORRECTION";
        if (this.absorbEnabled) fragCode += "\n#define VOX_ABSORB";
        if (this.pixelNormalNoiseEnabled) fragCode += "\n#define VOX_PIXEL_NORMAL_NOISE";
        
        let texIndex: number = 1;
        if (this.diffuseMapEnabled && this.texturesTotal > 1) fragCode += "\n#define VOX_DIFFUSE_MAP u_sampler"+(texIndex++);
        if (this.normalMapEnabled && this.texturesTotal > 1) {
            fragCode += "\n#define VOX_USE_NORMALE_MAP";
            fragCode += "\n#define VOX_NORMAL_MAP u_sampler"+(texIndex++);
        }
        if (mirrorProjEnabled) fragCode += "\n#define VOX_MIRROR_PROJ_MAP u_sampler"+(texIndex++);

        console.log("this.texturesTotal: ", this.texturesTotal);

        let lightsTotal: number = this.pointLightsTotal + this.parallelLightsTotal;
        if (this.pointLightsTotal > 0) fragCode += "\n#define VOX_POINT_LIGHTS_TOTAL " + this.pointLightsTotal;
        else fragCode += "\n#define VOX_POINT_LIGHTS_TOTAL 0";
        if (this.parallelLightsTotal > 0) fragCode += "\n#define VOX_PARALLEL_LIGHTS_TOTAL " + this.parallelLightsTotal;
        else fragCode += "\n#define VOX_PARALLEL_LIGHTS_TOTAL 0";
        if (lightsTotal > 0) fragCode += "\n#define VOX_LIGHTS_TOTAL " + lightsTotal;
        else fragCode += "\n#define VOX_LIGHTS_TOTAL 0";

        let codeHead: string = "";
        if (RendererDeviece.IsWebGL1()) {
            codeHead += "\n#define FragOutColor gl_FragColor";
        }
        else {
            codeHead += "\nout vec4 FragOutColor;";
        }
        codeHead += "\nuniform samplerCube u_sampler0;";
        if (this.texturesTotal > 1) {
            this.m_has2DMap = true;
            for (let i: number = 1; i < this.texturesTotal; ++i) {
                codeHead += "\nuniform sampler2D u_sampler" + i + ";";
            }
            codeHead += "\nVOX_IN vec2 v_uv;";
        }

        if (mirrorProjEnabled) {
            codeHead += "\nuniform vec4 u_stageParam;";
            codeHead += "\nuniform vec4 u_mirrorProjNV;";
        }

        codeHead += DefaultPBRShaderCode.frag_head;
        //  const regExp3:RegExp = /\bVOX_IN\b/g;
        //  codeHead = codeHead.replace(regExp3, "varying");
        //  //VOX_IN
        let codeBody: string = DefaultPBRShaderCode.frag_body;
        return fragCode + codeHead + codeBody;
    }
    getVtxShaderCode(): string {

        let vtxCode: string = "";
        if (RendererDeviece.IsWebGL2()) {
            vtxCode ="#version 300 es"
        }
        vtxCode +=
`
precision highp float;
`;
        if (this.normalNoiseEnabled) vtxCode += "\n#define VOX_NORMAL_NOISE";
        if (this.texturesTotal > 1) vtxCode += "\n#define VOX_USE_2D_MAP";

        vtxCode += "\n";
        if (RendererDeviece.IsWebGL1()) {
            
            vtxCode +=
`
#define VOX_OUT varying
attribute vec3 a_vs;
attribute vec3 a_nvs;
`;
                if (this.m_has2DMap) {
                    vtxCode +=
`
attribute vec2 a_uvs;
uniform vec4 u_paramLocal[2];
`;
            }
            vtxCode += "\n"+GLSLConverter.__glslInverseMat3;
            vtxCode += "\n"+GLSLConverter.__glslInverseMat4;
        }
        else {

            vtxCode +=
`
#define VOX_OUT out
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec3 a_nvs;
`;
            if (this.m_has2DMap) {
                vtxCode +=
`
layout(location = 2) in vec2 a_uvs;
uniform vec4 u_paramLocal[2];
`;
            }
            
        }
        vtxCode +=
 `
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

VOX_OUT vec3 v_worldPos;
VOX_OUT vec3 v_worldNormal;
VOX_OUT vec3 v_camPos;
`;
        if (this.m_has2DMap) {
            vtxCode +=
`
VOX_OUT vec2 v_uv;
`;
        }
        vtxCode += DefaultPBRShaderCode.vert_head;
        vtxCode += DefaultPBRShaderCode.vert_body;
        
        return vtxCode;
    }
    getUniqueShaderName() {
        let ns: string = this.m_uniqueName;

        if (this.woolEnabled) ns += "_wool";
        if (this.toneMappingEnabled) ns += "_toneMapping";
        if (this.envMapEnabled) ns += "_envMap";
        if (this.scatterEnabled) ns += "_scatter";
        if (this.specularBleedEnabled) ns += "_specBleed";
        if (this.metallicCorrection) ns += "_metCorr";
        if (this.gammaCorrection) ns += "_gammaCorr";
        if (this.absorbEnabled) ns += "_absorb";
        if (this.pixelNormalNoiseEnabled) ns += "_pixelNNoise";
        if (this.mirrorProjEnabled && this.texturesTotal > 1) ns += "_mirPrj";
        if (this.normalNoiseEnabled) ns += "_nNoise";

        if (this.pointLightsTotal > 0) ns += "_" + this.pointLightsTotal;
        if (this.parallelLightsTotal > 0) ns += "_" + this.parallelLightsTotal;

        ns += "_T" + this.texturesTotal;
        this.m_uniqueName = ns;
        return ns;
    }
    toString(): string {
        return "[DefaultPBRShaderBuffer()]";
    }

    static GetInstance(): DefaultPBRShaderBuffer {
        return DefaultPBRShaderBuffer.___s_instance;
    }
}

export default class DefaultPBRMaterial extends MaterialBase {

    private m_pointLightsTotal: number = 4;
    private m_parallelLightsTotal: number = 0;
    private m_envMapWidth: number = 128;
    private m_envMapHeight: number = 128;
    private m_albedo: Float32Array = new Float32Array([0.2, 0.2, 0.2, 0.0]);
    private m_params: Float32Array = new Float32Array([
        0.0, 0.0, 1.0, 0.02,        // [metallic,roughness,ao, pixel noise intensity]
        1.0,                        // tone map exposure
        0.1,                        // reflectionIntensity
        1.0,                        // frontColorScale
        1.0,                        // sideColorScale

        0.1, 0.1, 0.1,              // ambient factor x,y,z
        1.0,                        // scatterIntensity
        1.0, 1.0, 1.0,              // env map specular color factor x,y,z
        0.07                        // envMap lod mipMapLv parameter((100.0 * fract(0.07)) - (100.0 * fract(0.07)) * k + floor(0.07))
    ]);
    private m_paramLocal: Float32Array = new Float32Array(
        [
            0.0, 0.0, 0.0, 1.0      // f0.r,f0.g,f0.b, mormalMapIntentity(0.0,1.0)
            ,1.0, 1.0, 0.0, 0.0     // uv scaleX, uv scaleY, undefined, undefined
        ]);
    private m_camPos: Float32Array = new Float32Array([500.0, 500.0, 500.0, 1.0]);
    private m_mirrorProjNV: Float32Array = new Float32Array([0.0, 1.0, 0.0, 1.0]);
    private m_lightPositions: Float32Array;
    private m_lightColors: Float32Array;

    woolEnabled: boolean = false;
    toneMappingEnabled: boolean = true;
    envMapEnabled: boolean = true;
    // 模拟镜面高光部分出现的表面散射
    scatterEnabled: boolean = true;
    specularBleedEnabled: boolean = true;
    // 是否开启 metalness 修正
    metallicCorrection: boolean = true;
    // 是否开启 gamma矫正
    gammaCorrection: boolean = true;
    // 是否开启吸收光能的模式
    absorbEnabled: boolean = true;
    /**
     * vtx normal noise
     */
    normalNoiseEnabled: boolean = false;
    /**
     * frag normal noise
     */
    pixelNormalNoiseEnabled: boolean = false;
    mirrorProjEnabled: boolean = false;
    diffuseMapEnabled: boolean = false;
    normalMapEnabled: boolean = false;

    constructor(pointLightsTotal: number = 2, parallelLightsTotal: number = 0) {
        super();
        this.m_pointLightsTotal = pointLightsTotal;
        this.m_parallelLightsTotal = parallelLightsTotal;

        let total: number = pointLightsTotal + parallelLightsTotal;
        if (total > 0) {
            this.m_lightPositions = new Float32Array(4 * total);
            this.m_lightColors = new Float32Array(4 * total);
        }
    }
    getCodeBuf(): ShaderCodeBuffer {
        let buf: DefaultPBRShaderBuffer = DefaultPBRShaderBuffer.GetInstance();
        buf.woolEnabled = this.woolEnabled;
        buf.toneMappingEnabled = this.toneMappingEnabled;
        buf.envMapEnabled = this.envMapEnabled;
        buf.scatterEnabled = this.scatterEnabled;
        buf.specularBleedEnabled = this.specularBleedEnabled;
        buf.metallicCorrection = this.metallicCorrection;
        buf.gammaCorrection = this.gammaCorrection;
        buf.absorbEnabled = this.absorbEnabled;
        buf.normalNoiseEnabled = this.normalNoiseEnabled;
        buf.pixelNormalNoiseEnabled = this.pixelNormalNoiseEnabled;
        buf.mirrorProjEnabled = this.mirrorProjEnabled;
        buf.diffuseMapEnabled = this.diffuseMapEnabled;
        buf.normalMapEnabled = this.normalMapEnabled;

        buf.pointLightsTotal = this.m_pointLightsTotal;
        buf.parallelLightsTotal = this.m_parallelLightsTotal;
        buf.texturesTotal = this.getTextureTotal();
        return buf;
    }
    copyFrom(dst: DefaultPBRMaterial): void {

        this.woolEnabled = dst.woolEnabled;
        this.toneMappingEnabled = dst.toneMappingEnabled;
        this.envMapEnabled = dst.envMapEnabled;
        this.scatterEnabled = dst.scatterEnabled;
        this.specularBleedEnabled = dst.specularBleedEnabled;
        this.metallicCorrection = dst.metallicCorrection;
        this.gammaCorrection = dst.gammaCorrection;
        this.absorbEnabled = dst.absorbEnabled;
        this.normalNoiseEnabled = dst.normalNoiseEnabled;
        this.pixelNormalNoiseEnabled = dst.pixelNormalNoiseEnabled;

        this.mirrorProjEnabled = dst.mirrorProjEnabled;
        this.diffuseMapEnabled = dst.diffuseMapEnabled;
        this.normalMapEnabled = dst.normalMapEnabled;

        this.m_pointLightsTotal = dst.m_pointLightsTotal;
        this.m_parallelLightsTotal = dst.m_parallelLightsTotal;
        if (dst.m_lightPositions != null) this.m_lightPositions = dst.m_lightPositions.slice();
        if (dst.m_lightColors != null) this.m_lightColors = dst.m_lightColors.slice();

        this.m_albedo = dst.m_albedo.slice();
        this.m_params = dst.m_params.slice();
        this.m_paramLocal = dst.m_paramLocal.slice();
        this.m_camPos = dst.m_camPos.slice();
        this.setTextureList(dst.getTextureList().slice());
    }
    
    seNormalMapIntensity(intensity: number): void {
        intensity = Math.min(Math.max(intensity, 0.0), 1.0);
        this.m_paramLocal[4] = intensity;
    }
    setPixelNormalNoiseIntensity(intensity: number): void {
        intensity = Math.min(Math.max(intensity, 0.0), 2.0);
        this.m_params[3] = intensity;
    }
    getPixelNormalNoiseIntensity(): number {
        return this.m_params[3];
    }
    setProjNV(nv: Vector3D): void {
        //console.log("nv: ",nv);
        this.m_mirrorProjNV[0] = nv.x;
        this.m_mirrorProjNV[1] = nv.y;
        this.m_mirrorProjNV[2] = nv.z;
    }
    /**
     * (lod mipmap level) = base + (maxMipLevel - k * maxMipLevel)
     * @param maxMipLevel envmap texture lod max mipmap level, the vaue is a int number
     * @param base envmap texture lod max mipmap level base, value range: -7.0 -> 12.0
     */
    setEnvMapLodMipMapLevel(maxMipLevel: number, base: number = 0.0): void {
        maxMipLevel = Math.min(Math.max(maxMipLevel, 0.0), 14.0);
        base = Math.min(Math.max(base, -7.0), 12.0);
        this.m_params[15] = Math.round(maxMipLevel) * 0.01 + base;
    }
    setEnvMapLodMipMapLevelWithSize(envMapWidth: number, envMapHeight: number, base: number = 0.0): void {
        this.m_envMapWidth = envMapWidth;
        this.m_envMapHeight = envMapHeight;
        base = Math.min(Math.max(base, -7.0), 12.0);
        this.m_params[15] = MathConst.GetMaxMipMapLevel(envMapWidth, envMapHeight) * 0.01 + base;
    }
    setScatterIntensity(value: number): void {

        this.m_params[11] = Math.min(Math.max(value, 0.01), 512.0);
    }
    getScatterIntensity(): number {

        return this.m_params[11];
    }
    setToneMapingExposure(value: number): void {

        this.m_params[4] = Math.min(Math.max(value, 0.1), 128.0);
    }
    getToneMapingExposure(): number {
        return this.m_params[4];
    }
    setReflectionIntensity(value: number): void {
        this.m_params[5] = Math.min(Math.max(value, 0.001), 1.0);
    }
    getReflectionIntensity(): number {
        return this.m_params[5];
    }

    setSurfaceIntensity(surfaceIntensity: number): void {

        this.m_params[6] = Math.min(Math.max(surfaceIntensity, 0.001), 32.0);
    }
    getSurfaceIntensity(): number {

        return this.m_params[6];
    }
    setSideIntensity(sideIntensity: number): void {
        this.m_params[7] = Math.min(Math.max(sideIntensity, 0.001), 32.0);
    }
    getSideIntensity(): number {
        return this.m_params[7];
    }
    setEnvSpecularColorFactor(fx: number, fy: number, fz: number): void {
        this.m_params[12] = fx;
        this.m_params[13] = fy;
        this.m_params[14] = fz;
    }
    getEnvSpecularColorFactor(colorFactor: Color4): void {
        colorFactor.r = this.m_params[12];
        colorFactor.g = this.m_params[13];
        colorFactor.b = this.m_params[14];
    }
    //ambient factor x,y,z
    setAmbientFactor(fx: number, fy: number, fz: number): void {
        this.m_params[8] = fx;
        this.m_params[9] = fy;
        this.m_params[10] = fz;
    }
    getAmbientFactor(colorFactor: Color4): void {
        colorFactor.r = this.m_params[8];
        colorFactor.g = this.m_params[9];
        colorFactor.b = this.m_params[10];
    }

    setMetallic(metallic: number): void {
        this.m_params[0] = Math.min(Math.max(metallic, 0.05), 1.0);
    }
    getMetallic(): number {
        return this.m_params[0];
    }
    setRoughness(roughness: number): void {
        this.m_params[1] = Math.min(Math.max(roughness, 0.05), 1.0);
    }
    getRoughness(): number {
        return this.m_params[1];
    }

    setAO(ao: number): void {
        this.m_params[2] = ao;
    }
    getAO(): number {
        return this.m_params[2];
    }
    setF0(f0x: number, f0y: number, f0z: number): void {

        this.m_paramLocal[0] = f0x;
        this.m_paramLocal[1] = f0y;
        this.m_paramLocal[2] = f0z;
    }
    getF0(colorFactor: Color4): void {
        
        colorFactor.r = this.m_paramLocal[0];
        colorFactor.g = this.m_paramLocal[1];
        colorFactor.b = this.m_paramLocal[2];
    }
    setUVScale(sx: number, sy: number): void {

        this.m_paramLocal[4] = sx;
        this.m_paramLocal[5] = sy;
    }
    getUVScale(scaleV:Vector3D): void {

        scaleV.x = this.m_paramLocal[4];
        scaleV.y = this.m_paramLocal[5];
    }
    setPointLightPosAt(i: number, px: number, py: number, pz: number): void {
        if (i >= 0 && i < this.m_pointLightsTotal) {
            i *= 4;
            this.m_lightPositions[i] = px;
            this.m_lightPositions[i + 1] = py;
            this.m_lightPositions[i + 2] = pz;
        }
    }
    setPointLightColorAt(i: number, pr: number, pg: number, pb: number): void {

        if (i >= 0 && i < this.m_pointLightsTotal) {
            i *= 4;
            this.m_lightColors[i] = pr;
            this.m_lightColors[i + 1] = pg;
            this.m_lightColors[i + 2] = pb;
        }
    }

    setParallelLightDirecAt(i: number, px: number, py: number, pz: number): void {

        if (i >= 0 && i < this.m_parallelLightsTotal) {
            i += this.m_pointLightsTotal;
            i *= 4;
            this.m_lightPositions[i] = px;
            this.m_lightPositions[i + 1] = py;
            this.m_lightPositions[i + 2] = pz;
        }
    }
    setParallelLightColorAt(i: number, pr: number, pg: number, pb: number): void {

        if (i >= 0 && i < this.m_parallelLightsTotal) {
            i += this.m_pointLightsTotal;
            i *= 4;
            this.m_lightColors[i] = pr;
            this.m_lightColors[i + 1] = pg;
            this.m_lightColors[i + 2] = pb;
        }
    }

    setAlbedoColor(pr: number, pg: number, pb: number): void {
        this.m_albedo[0] = pr;
        this.m_albedo[1] = pg;
        this.m_albedo[2] = pb;
    }
    getAlbedoColor(colorFactor: Color4): void {
        
        colorFactor.r = this.m_albedo[0];
        colorFactor.g = this.m_albedo[1];
        colorFactor.b = this.m_albedo[2];
    }
    setCamPos(pos: Vector3D): void {

        this.m_camPos[0] = pos.x;
        this.m_camPos[1] = pos.y;
        this.m_camPos[2] = pos.z;
    }
    createSelfUniformData(): ShaderUniformData {

        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_params", "u_lightPositions", "u_lightColors", "u_camPos", "u_paramLocal", "u_mirrorProjNV"];
        oum.dataList = [this.m_albedo, this.m_params, this.m_lightPositions, this.m_lightColors, this.m_camPos, this.m_paramLocal, this.m_mirrorProjNV];
        return oum;
    }
}
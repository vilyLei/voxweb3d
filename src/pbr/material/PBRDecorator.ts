/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeObject from "../../vox/material/IShaderCodeObject";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import Color4 from "../../vox/material/Color4";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import { PBRShaderCode } from "./glsl/PBRShaderCode";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { ShaderTextureBuilder } from "../../vox/material/ShaderTextureBuilder";

class PBRDecorator implements IMaterialDecorator {

    private m_uniqueName: string = "PBR";
    private m_envMapWidth: number = 128;
    private m_envMapHeight: number = 128;

    private m_pbrParams: Float32Array = new Float32Array([
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
    private m_fragLocalParams: Float32Array = null;
    private m_parallaxParams: Float32Array = null;
    private m_mirrorParam: Float32Array = new Float32Array([
        0.0, 0.0, -1.0           // mirror view nv(x,y,z)
        , 1.0                   // mirror map lod level

        , 1.0, 0.3              // mirror scale, mirror mix scale
        , 0.0, 0.0              // undefine, undefine
    ]);
    ///////////////////////////////////////////////////////

    /**
     * the  default  value is false
     */
    vertColorEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    premultiplyAlpha: boolean = false;
    /**
     * the  default  value is false
     */
    shadowReceiveEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    lightEnabled: boolean = true;
    /**
     * the  default  value is false
     */
    fogEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    envAmbientLightEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    brightnessOverlayEnabeld: boolean = false;
    /**
     * the default value is true
     */
    glossinessEnabeld: boolean = true;


    specularEnvMap: IRenderTexture = null;
    diffuseMap: IRenderTexture = null;
    normalMap: IRenderTexture = null;
    mirrorMap: IRenderTexture = null;
    indirectEnvMap: IRenderTexture = null;
    parallaxMap: IRenderTexture = null;
    aoMap: IRenderTexture = null;
    roughnessMap: IRenderTexture = null;
    metalhnessMap: IRenderTexture = null;

    /**
     * add ao, roughness, metalness map uniform code
     */
    armMap: IRenderTexture = null;

    // glossinessEnabeld: boolean = true;
    woolEnabled: boolean = true;
    toneMappingEnabled: boolean = true;
    scatterEnabled: boolean = true;
    specularBleedEnabled: boolean = true;
    metallicCorrection: boolean = true;
    gammaCorrection: boolean = true;
    absorbEnabled: boolean = false;
    normalNoiseEnabled: boolean = false;
    pixelNormalNoiseEnabled: boolean = false;
    mirrorMapLodEnabled: boolean = false;
    //normalMapEnabled: boolean = false;
    hdrBrnEnabled: boolean = false;
    vtxFlatNormal: boolean = false;

    texturesTotal: number = 1;
    fragLocalParamsTotal: number = 2;
    parallaxParamIndex: number = 2;

    constructor() {

    }

    initialize(): void {

        ///*
        this.fragLocalParamsTotal = 2;
        this.parallaxParamIndex = 2;
        if (this.parallaxMap != null) {
            this.fragLocalParamsTotal += 1;
        }
        this.m_fragLocalParams = new Float32Array(this.fragLocalParamsTotal * 4);
        this.m_fragLocalParams.set(
            [
                0.0, 0.0, 0.0, 1.0,      // f0.r,f0.g,f0.b, mormalMapIntentity(0.0,1.0)
                0.2, 0.2, 0.2, 0.0       // albedo(r,g,b), undefined
            ],
            0
        );
        if (this.parallaxMap != null) {
            this.m_parallaxParams = this.m_fragLocalParams.subarray(this.parallaxParamIndex * 4, (this.parallaxParamIndex + 1) * 4);
            this.m_parallaxParams.set([1.0, 10.0, 2.0, 0.1]);
        }
        //*/
    }

    seNormalMapIntensity(intensity: number): void {
        intensity = Math.min(Math.max(intensity, 0.0), 1.0);
        this.m_fragLocalParams[4] = intensity;
    }
    setPixelNormalNoiseIntensity(intensity: number): void {
        intensity = Math.min(Math.max(intensity, 0.0), 2.0);
        this.m_pbrParams[3] = intensity;
    }
    getPixelNormalNoiseIntensity(): number {
        return this.m_pbrParams[3];
    }
    setMirrorViewNV(nv: Vector3D): void {
        this.m_mirrorParam[0] = nv.x;
        this.m_mirrorParam[1] = nv.y;
        this.m_mirrorParam[2] = nv.z;
    }
    setMirrorPlaneNV(nv: Vector3D): void {
        //  //console.log("nv: ",nv);
        //  this.m_mirrorParam[0] = nv.x;
        //  this.m_mirrorParam[1] = nv.y;
        //  this.m_mirrorParam[2] = nv.z;
    }
    setMirrorMapLodLevel(lodLv: number): void {
        this.m_mirrorParam[3] = lodLv;
    }
    setMirrorIntensity(intensity: number): void {
        this.m_mirrorParam[4] = Math.min(Math.max(intensity, 0.01), 2.0);
    }
    setMirrorMixFactor(factor: number): void {
        this.m_mirrorParam[5] = Math.min(Math.max(factor, 0.01), 2.0);
    }
    /**
     * (lod mipmap level) = base + (maxMipLevel - k * maxMipLevel)
     * @param maxMipLevel envmap texture lod max mipmap level, the vaue is a int number
     * @param base envmap texture lod max mipmap level base, value range: -7.0 -> 12.0
     */
    setEnvMapLodMipMapLevel(maxMipLevel: number, base: number = 0.0): void {
        maxMipLevel = Math.min(Math.max(maxMipLevel, 0.0), 14.0);
        base = Math.min(Math.max(base, -7.0), 12.0);
        this.m_pbrParams[15] = Math.round(maxMipLevel) * 0.01 + base;
    }
    setEnvMapLodMipMapLevelWithSize(envMapWidth: number, envMapHeight: number, base: number = 0.0): void {
        this.m_envMapWidth = envMapWidth;
        this.m_envMapHeight = envMapHeight;
        base = Math.min(Math.max(base, -7.0), 12.0);
        this.m_pbrParams[15] = MathConst.GetMaxMipMapLevel(envMapWidth, envMapHeight) * 0.01 + base;
    }
    setScatterIntensity(value: number): void {

        this.m_pbrParams[11] = Math.min(Math.max(value, 0.01), 512.0);
    }
    getScatterIntensity(): number {

        return this.m_pbrParams[11];
    }
    setToneMapingExposure(value: number): void {

        this.m_pbrParams[4] = Math.min(Math.max(value, 0.1), 128.0);
    }
    getToneMapingExposure(): number {
        return this.m_pbrParams[4];
    }
    setReflectionIntensity(value: number): void {
        this.m_pbrParams[5] = Math.min(Math.max(value, 0.001), 1.0);
    }
    getReflectionIntensity(): number {
        return this.m_pbrParams[5];
    }

    setSurfaceIntensity(surfaceIntensity: number): void {

        this.m_pbrParams[6] = Math.min(Math.max(surfaceIntensity, 0.001), 32.0);
    }
    getSurfaceIntensity(): number {
        return this.m_pbrParams[6];
    }
    /**
     * @param sideIntensity value: 0.1 -> 32.0
     */
    setSideIntensity(sideIntensity: number): void {
        this.m_pbrParams[7] = Math.min(Math.max(sideIntensity, 0.001), 32.0);
    }
    getSideIntensity(): number {
        return this.m_pbrParams[7];
    }
    setEnvSpecularColorFactor(fx: number, fy: number, fz: number): void {
        this.m_pbrParams[12] = fx;
        this.m_pbrParams[13] = fy;
        this.m_pbrParams[14] = fz;
    }
    getEnvSpecularColorFactor(colorFactor: Color4): void {
        colorFactor.r = this.m_pbrParams[12];
        colorFactor.g = this.m_pbrParams[13];
        colorFactor.b = this.m_pbrParams[14];
    }
    // ambient factor x,y,z
    setAmbientFactor(fr: number, fg: number, fb: number): void {
        this.m_pbrParams[8] = fr;
        this.m_pbrParams[9] = fg;
        this.m_pbrParams[10] = fb;
    }
    getAmbientFactor(colorFactor: Color4): void {
        colorFactor.r = this.m_pbrParams[8];
        colorFactor.g = this.m_pbrParams[9];
        colorFactor.b = this.m_pbrParams[10];
    }

    setMetallic(metallic: number): void {
        this.m_pbrParams[0] = Math.min(Math.max(metallic, 0.05), 1.0);
    }
    getMetallic(): number {
        return this.m_pbrParams[0];
    }
    setRoughness(roughness: number): void {
        this.m_pbrParams[1] = Math.min(Math.max(roughness, 0.05), 1.0);
    }
    getRoughness(): number {
        return this.m_pbrParams[1];
    }

    setAO(ao: number): void {
        this.m_pbrParams[2] = ao;
    }
    getAO(): number {
        return this.m_pbrParams[2];
    }
    setF0(f0x: number, f0y: number, f0z: number): void {

        this.m_fragLocalParams[0] = f0x;
        this.m_fragLocalParams[1] = f0y;
        this.m_fragLocalParams[2] = f0z;
    }
    getF0(colorFactor: Color4): void {

        colorFactor.r = this.m_fragLocalParams[0];
        colorFactor.g = this.m_fragLocalParams[1];
        colorFactor.b = this.m_fragLocalParams[2];
    }
    setAlbedoColor(pr: number, pg: number, pb: number): void {
        this.m_fragLocalParams[4] = pr;
        this.m_fragLocalParams[5] = pg;
        this.m_fragLocalParams[6] = pb;
    }
    getAlbedoColor(colorFactor: Color4): void {

        colorFactor.r = this.m_fragLocalParams[4];
        colorFactor.g = this.m_fragLocalParams[5];
        colorFactor.b = this.m_fragLocalParams[6];
    }

    /**
     * 设置顶点置换贴图参数
     * @param numLayersMin ray march 最小层数, default value is 1.0
     * @param numLayersMax ray march 最大层数, default value is 10.0
     * @param height ray march 总高度, default value is 2.0
     * @param stepFactor ray march 单步增量大小, default value is 0.1
     */
    setParallaxParams(numLayersMin: number = 1.0, numLayersMax: number = 10.0, height: number = 2.0, stepFactor: number = 0.1): void {
        if (this.m_parallaxParams != null) {
            this.m_parallaxParams[0] = numLayersMin;
            this.m_parallaxParams[1] = numLayersMax;
            this.m_parallaxParams[2] = height;
            this.m_parallaxParams[3] = stepFactor;
        }
    }

    buildBufParams(): void {
    }
    /**
     * user build textures list
     */
    buildTextureList(builder: ShaderTextureBuilder): void {

        builder.addSpecularEnvMap(this.specularEnvMap, true);
        builder.addDiffuseMap(this.diffuseMap);
        builder.addNormalMap(this.normalMap);
        builder.addParallaxMap(this.parallaxMap, this.parallaxParamIndex);

        builder.addAOMap( this.aoMap );
        builder.addRoughnessMap( this.roughnessMap );
        builder.addMetalnessMap( this.metalhnessMap );
        builder.addARMMap( this.armMap );

        builder.add2DMap( this.mirrorMap, "VOX_MIRROR_PROJ_MAP", true, true, false);
        builder.addCubeMap( this.indirectEnvMap, "VOX_INDIRECT_ENV_MAP", true, false);
    }
    buildShader(coder: IShaderCodeBuilder): void {

        coder.normalMapEnabled = this.normalMap != null;
        coder.mapLodEnabled = true;

        coder.useHighPrecious();

        let mirrorProjEnabled: boolean = this.mirrorMap != null && this.texturesTotal > 0;
        if (this.normalNoiseEnabled) coder.addDefine("VOX_NORMAL_NOISE","1");

        if (this.woolEnabled) coder.addDefine("VOX_WOOL","1");
        if (this.toneMappingEnabled) coder.addDefine("VOX_TONE_MAPPING","1");
        if (this.scatterEnabled) coder.addDefine("VOX_SCATTER","1");
        if (this.specularBleedEnabled) coder.addDefine("VOX_SPECULAR_BLEED","1");
        if (this.metallicCorrection) coder.addDefine("VOX_METALLIC_CORRECTION","1");
        if (this.gammaCorrection) coder.addDefine("VOX_GAMMA_CORRECTION","1");
        if (this.absorbEnabled) coder.addDefine("VOX_ABSORB","1");
        if (this.pixelNormalNoiseEnabled) coder.addDefine("VOX_PIXEL_NORMAL_NOISE","1");

        if (this.mirrorMapLodEnabled) coder.addDefine("VOX_MIRROR_MAP_LOD", "1");
        if (this.hdrBrnEnabled) coder.addDefine("VOX_HDR_BRN", "1");
        if (this.vtxFlatNormal) coder.addDefine("VOX_VTX_FLAT_NORMAL", "1");

        coder.addFragUniform("vec4", "u_fragLocalParams", this.fragLocalParamsTotal);
        coder.addFragUniform("vec4", "u_pbrParams", 4);

        if (mirrorProjEnabled) {
            coder.uniform.useStage(false, true);
            coder.addFragUniform("vec4", "u_mirrorParams", 2);
        }
        coder.vertMatrixInverseEnabled = true;
    }
    /**
     * @returns local uniform data
     */
    createUniformData(): ShaderUniformData {

        let sud: ShaderUniformData = new ShaderUniformData();
        sud.uniformNameList = ["u_pbrParams", "u_fragLocalParams", "u_mirrorParams"];
        sud.dataList = [this.m_pbrParams, this.m_fragLocalParams, this.m_mirrorParam];
        return sud;
    }
    /**
     * get shader code object uuid, it is defined in the system
     * @returns shader code object uuid
     */
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.PBR;
    }
    /**
     * get custom shader code object
     * @returns shader code object
     */
    getShaderCodeObject(): IShaderCodeObject {
        return PBRShaderCode;
    }
    /**
     * @returns unique name string
     */
    getUniqueName(): string {
        
        let ns: string = this.m_uniqueName;

        if (this.woolEnabled) ns += "_wl";
        if (this.toneMappingEnabled) ns += "TM";
        if (this.scatterEnabled) ns += "Sct";
        if (this.specularBleedEnabled) ns += "SpecBl";
        if (this.metallicCorrection) ns += "MetCorr";
        if (this.gammaCorrection) ns += "GmaCorr";
        if (this.absorbEnabled) ns += "Absorb";
        if (this.pixelNormalNoiseEnabled) ns += "PNNoise";
        
        if (this.normalNoiseEnabled) ns += "NNoise";
        if (this.indirectEnvMap != null) ns += "IndirEnv";
        if (this.shadowReceiveEnabled) ns += "Shadow";
        
        if (this.fogEnabled) ns += "Fog";
        if (this.hdrBrnEnabled) ns += "HdrBrn";
        if (this.vtxFlatNormal) ns += "vtxFlagN";
        if (this.mirrorMapLodEnabled) ns += "MirLod";
        
        this.m_uniqueName = ns;

        return this.m_uniqueName;
    }
    destroy(): void {

        this.m_pbrParams = null;
        this.m_fragLocalParams = null;
        this.m_mirrorParam = null;
    }
}
export { PBRDecorator }
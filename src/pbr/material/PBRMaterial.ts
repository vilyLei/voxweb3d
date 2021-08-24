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
import { PBRShaderCode } from "./glsl/PBRShaderCode";
import IPBRMaterial from "./IPBRMaterial";
import Color4 from "../../vox/material/Color4";

import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import ShaderCodeBuilder2 from "../../vox/material/code/ShaderCodeBuilder2";
import GlobalLightData from "../../light/base/GlobalLightData";
import ShadowVSMData from "../../shadow/vsm/material/ShadowVSMData";
import EnvLightData from "../../light/base/EnvLightData";
import UniformConst from "../../vox/material/UniformConst";

class PBRShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PBRShaderBuffer = new PBRShaderBuffer();
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
    mirrorMapLodEnabled: boolean = false;
    diffuseMapEnabled: boolean = false;
    normalMapEnabled: boolean = false;
    aoMapEnabled: boolean = false;
    indirectEnvMapEnabled: boolean = false;
    shadowReceiveEnabled: boolean = false;
    fogEnabled: boolean = false;
    hdrBrnEnabled: boolean = false;

    pointLightsTotal: number = 4;
    parallelLightsTotal: number = 0;
    texturesTotal: number = 1;

    lightData: GlobalLightData = null;
    vsmData: ShadowVSMData = null;
    envData: EnvLightData = null;

    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "PBRShd";
        this.adaptationShaderVersion = false;
        console.log("PBRShaderBuffer::initialize()...，adaptationShaderVersion: ", this.adaptationShaderVersion);
    }
    private m_codeBuilder:ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private buildThisCode():void
    {
        let coder:ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();
        coder.normalMapEanbled = this.normalMapEnabled;
        coder.mapLodEnabled = true;
        coder.useHighPrecious();
        
        let mirrorProjEnabled: boolean = this.mirrorProjEnabled && this.texturesTotal > 0;
        if (this.normalNoiseEnabled) coder.addDefine("VOX_NORMAL_NOISE");

        // 毛料表面效果
        if (this.woolEnabled) coder.addDefine("VOX_WOOL");
        if (this.toneMappingEnabled) coder.addDefine("VOX_TONE_MAPPING");
        if (this.scatterEnabled) coder.addDefine("VOX_SCATTER");
        if (this.specularBleedEnabled) coder.addDefine("VOX_SPECULAR_BLEED");
        if (this.metallicCorrection) coder.addDefine("VOX_METALLIC_CORRECTION");
        if (this.gammaCorrection) coder.addDefine("VOX_GAMMA_CORRECTION");
        if (this.absorbEnabled) coder.addDefine("VOX_ABSORB");
        if (this.pixelNormalNoiseEnabled) coder.addDefine("VOX_PIXEL_NORMAL_NOISE");
        
        let texIndex: number = 0;
        console.log("this.envMapEnabled,this.texturesTotal: ",this.envMapEnabled,this.texturesTotal);
        if (this.envMapEnabled && this.texturesTotal > 0) {
            coder.addDefine("VOX_ENV_MAP","u_sampler"+(texIndex++));
            coder.addTextureSampleCube();
        }
        if (this.diffuseMapEnabled) {
            this.m_has2DMap = true;
            coder.addDefine("VOX_DIFFUSE_MAP","u_sampler"+(texIndex++));
            coder.addTextureSample2D();
        }
        if (this.normalMapEnabled) {
            this.m_has2DMap = true;
            coder.addDefine("VOX_NORMAL_MAP","u_sampler"+(texIndex++));
            coder.addTextureSample2D();
        }
        if (this.aoMapEnabled) {
            this.m_has2DMap = true;
            coder.addDefine("VOX_AO_MAP","u_sampler"+(texIndex++));
            coder.addTextureSample2D();
        }
        if (this.m_has2DMap) {
            coder.addDefine("VOX_USE_2D_MAP");
        }
        if (mirrorProjEnabled) {
            coder.addDefine("VOX_MIRROR_PROJ_MAP", "u_sampler"+(texIndex++));
            coder.addTextureSample2D();
        }
        if (this.indirectEnvMapEnabled) {
            coder.addDefine("VOX_INDIRECT_ENV_MAP", "u_sampler"+(texIndex++));
            coder.addTextureSampleCube();
        }
        console.log("this.texturesTotal: ", this.texturesTotal, ", texIndex: ",texIndex);
        if (this.mirrorMapLodEnabled) coder.addDefine("VOX_MIRROR_MAP_LOD", "1");
        if (this.hdrBrnEnabled) coder.addDefine("VOX_HDR_BRN", "1");
        
        let lightsTotal: number = this.pointLightsTotal + this.parallelLightsTotal;
        if (this.pointLightsTotal > 0)  coder.addDefine("VOX_POINT_LIGHTS_TOTAL", ""+this.pointLightsTotal);
        else coder.addDefine("VOX_POINT_LIGHTS_TOTAL","0");
        if (this.parallelLightsTotal > 0) coder.addDefine("VOX_PARALLEL_LIGHTS_TOTAL", ""+this.parallelLightsTotal);
        else coder.addDefine("VOX_PARALLEL_LIGHTS_TOTAL","0");
        if (lightsTotal > 0) coder.addDefine("VOX_LIGHTS_TOTAL",""+lightsTotal);
        else coder.addDefine("VOX_LIGHTS_TOTAL", "0");

        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec3","a_nvs");
        if (this.m_has2DMap) {
            coder.addVertLayout("vec2","a_uvs");
            coder.addVertUniform("vec4","u_paramLocal[2]");
            coder.addVarying("vec2","v_uv");
        }
        coder.addFragUniform("vec4","u_paramLocal[2]");

        coder.addVarying("vec3","v_worldPos");
        coder.addVarying("vec3","v_worldNormal");
        coder.addVarying("vec3","v_camPos");

        if (mirrorProjEnabled) {
            coder.addFragUniformParam(UniformConst.StageParam);
            coder.addFragUniform("vec4","u_mirrorParams",2);
        }
        if(lightsTotal > 0) {
            this.lightData.useUniforms( coder );
        }
        if(this.fogEnabled && this.envData != null) {
            this.envData.useUniformsForFog( coder );
        }

        coder.vertMatrixInverseEnabled = true;
        
        coder.useVertSpaceMats(true,true,true);
        coder.addFragOutput("vec4","FragOutColor");
        if(this.shadowReceiveEnabled && this.vsmData != null) {
            this.vsmData.useUniforms( coder );
            coder.addDefine("VOX_VSM_MAP", "u_sampler"+(texIndex++));
            coder.addTextureSample2D();
        }

    }
    getFragShaderCode(): string {
        //  console.log("DefaultPBR",DefaultPBR);
        //  console.log("DefaultPBR.frag",DefaultPBR.frag);
        //  console.log("DefaultPBR end.");
        this.buildThisCode();

        this.m_codeBuilder.addFragMainCode(PBRShaderCode.frag_head);
        this.m_codeBuilder.addFragMainCode(PBRShaderCode.frag_body);
        return this.m_codeBuilder.buildFragCode();
    }
    getVtxShaderCode(): string {

        this.m_codeBuilder.addVertMainCode(PBRShaderCode.vert_head);
        this.m_codeBuilder.addVertMainCode(PBRShaderCode.vert_body);

        return this.m_codeBuilder.buildVertCode();
    }
    getUniqueShaderName(): string {

        let ns: string = this.m_uniqueName;

        if (this.woolEnabled) ns += "_wl";
        if (this.toneMappingEnabled) ns += "_tm";
        if (this.envMapEnabled) ns += "EnvM";
        if (this.scatterEnabled) ns += "Sct";
        if (this.specularBleedEnabled) ns += "SpecBl";
        if (this.metallicCorrection) ns += "MetCorr";
        if (this.gammaCorrection) ns += "GmaCorr";
        if (this.absorbEnabled) ns += "Absorb";
        if (this.pixelNormalNoiseEnabled) ns += "PNNoise";
        if (this.mirrorProjEnabled) ns += "MirPrj";
        if (this.normalNoiseEnabled) ns += "_nNoise";
        if (this.indirectEnvMapEnabled) ns += "IndirEnv";
        if (this.normalMapEnabled) ns += "NorMap";
        if (this.aoMapEnabled) ns += "AoMap";
        if (this.shadowReceiveEnabled) ns += "Shadow";
        if (this.fogEnabled) ns += "Fog";
        if (this.hdrBrnEnabled) ns += "HdrBrn";

        if (this.pointLightsTotal > 0) ns += "LP" + this.pointLightsTotal;
        if (this.parallelLightsTotal > 0) ns += "LD" + this.parallelLightsTotal;

        ns += "_T" + this.texturesTotal;
        this.m_uniqueName = ns;
        
        return ns;
    }
    toString(): string {
        return "[PBRShaderBuffer()]";
    }

    static GetInstance(): PBRShaderBuffer {
        return PBRShaderBuffer.s_instance;
    }
}

export default class PBRMaterial extends MaterialBase implements IPBRMaterial {

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
            ,1.0, 1.0, 1.0, 0.3     // uv scaleX, uv scaleY, undefine, undefine
        ]);
    private m_camPos: Float32Array = new Float32Array([500.0, 500.0, 500.0, 1.0]);
    private m_mirrorParam: Float32Array = new Float32Array(
        [
            0.0, 0.0, -1.0           // mirror view nv(x,y,z)
            , 1.0                   // mirror map lod level

            , 1.0, 0.3              // mirror scale, mirror mix scale
            , 0.0, 0.0              // undefine, undefine
        ]);
    private m_lightData: GlobalLightData;
    private m_vsmData: ShadowVSMData = null;
    private m_envData: EnvLightData = null;

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
    mirrorMapLodEnabled: boolean = false;
    diffuseMapEnabled: boolean = false;
    normalMapEnabled: boolean = false;
    aoMapEnabled: boolean = false;
    indirectEnvMapEnabled: boolean = false;
    shadowReceiveEnabled: boolean = false;
    fogEnabled: boolean = false;
    hdrBrnEnabled: boolean = false;
    constructor(pointLightsTotal: number = 2, parallelLightsTotal: number = 0) {
        super();
        this.m_pointLightsTotal = pointLightsTotal;
        this.m_parallelLightsTotal = parallelLightsTotal;
    }
    getCodeBuf(): ShaderCodeBuffer {
        
        let buf: PBRShaderBuffer = PBRShaderBuffer.GetInstance();
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
        buf.mirrorMapLodEnabled = this.mirrorMapLodEnabled;
        buf.diffuseMapEnabled = this.diffuseMapEnabled;
        buf.normalMapEnabled = this.normalMapEnabled;
        buf.aoMapEnabled = this.aoMapEnabled;
        buf.indirectEnvMapEnabled = this.indirectEnvMapEnabled;
        buf.shadowReceiveEnabled = this.shadowReceiveEnabled;
        buf.fogEnabled = this.fogEnabled;
        buf.hdrBrnEnabled = this.hdrBrnEnabled;

        buf.pointLightsTotal = this.m_pointLightsTotal;
        buf.parallelLightsTotal = this.m_parallelLightsTotal;
        buf.texturesTotal = this.getTextureTotal();

        buf.lightData = this.m_lightData;
        buf.vsmData = this.m_vsmData;
        buf.envData = this.m_envData;
        return buf;
    }
    copyFrom(dst: PBRMaterial, texEnabled:boolean = true): void {

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
        this.mirrorMapLodEnabled = dst.mirrorMapLodEnabled;
        this.diffuseMapEnabled = dst.diffuseMapEnabled;
        this.normalMapEnabled = dst.normalMapEnabled;
        this.aoMapEnabled = dst.aoMapEnabled;
        this.indirectEnvMapEnabled = dst.indirectEnvMapEnabled;
        this.shadowReceiveEnabled = dst.shadowReceiveEnabled;
        this.fogEnabled = dst.fogEnabled;
        this.hdrBrnEnabled = dst.hdrBrnEnabled;

        this.m_pointLightsTotal = dst.m_pointLightsTotal;
        this.m_parallelLightsTotal = dst.m_parallelLightsTotal;
        this.m_lightData = dst.m_lightData;
        this.m_vsmData = dst.m_vsmData;
        this.m_envData = dst.m_envData;

        if(this.m_albedo == null || this.m_albedo.length != dst.m_albedo.length) {
            this.m_albedo = dst.m_albedo.slice();
        }
        else {
            this.m_albedo.set(dst.m_albedo);
        }
        
        if(this.m_params == null || this.m_params.length != dst.m_params.length) {
            this.m_params = dst.m_params.slice();
        }
        else {
            this.m_params.set(dst.m_params);
        }
        if(this.m_paramLocal == null || this.m_paramLocal.length != dst.m_paramLocal.length) {
            this.m_paramLocal = dst.m_paramLocal.slice();
        }
        else {
            this.m_paramLocal.set(dst.m_paramLocal);
        }
        if(this.m_camPos == null || this.m_camPos.length != dst.m_camPos.length) {
            this.m_camPos = dst.m_camPos.slice();
        }
        else {
            this.m_camPos.set(dst.m_camPos);
        }
        if(this.m_mirrorParam == null || this.m_mirrorParam.length != dst.m_mirrorParam.length) {
            this.m_mirrorParam = dst.m_mirrorParam.slice();
        }
        else {
            this.m_mirrorParam.set(dst.m_mirrorParam);
        }
        if(texEnabled) {
            this.setTextureList(dst.getTextureList().slice());
        }
    }
    
    clone(): PBRMaterial {

        let dst: PBRMaterial = new PBRMaterial(this.m_pointLightsTotal,this.m_parallelLightsTotal);

        dst.woolEnabled = this.woolEnabled;
        dst.toneMappingEnabled = this.toneMappingEnabled;
        dst.envMapEnabled = this.envMapEnabled;
        dst.scatterEnabled = this.scatterEnabled;

        dst.specularBleedEnabled = this.specularBleedEnabled;
        dst.metallicCorrection = this.metallicCorrection;
        dst.gammaCorrection = this.gammaCorrection;
        dst.absorbEnabled = this.absorbEnabled;

        dst.normalNoiseEnabled = this.normalNoiseEnabled;
        dst.pixelNormalNoiseEnabled = this.pixelNormalNoiseEnabled;
        dst.mirrorProjEnabled = this.mirrorProjEnabled;
        dst.mirrorMapLodEnabled = this.mirrorMapLodEnabled;

        dst.diffuseMapEnabled = this.diffuseMapEnabled;
        dst.normalMapEnabled = this.normalMapEnabled;
        dst.aoMapEnabled = this.aoMapEnabled;
        dst.indirectEnvMapEnabled = this.indirectEnvMapEnabled;
        dst.shadowReceiveEnabled = this.shadowReceiveEnabled;

        dst.fogEnabled = this.fogEnabled;
        dst.m_pointLightsTotal = this.m_pointLightsTotal;
        dst.m_parallelLightsTotal = this.m_parallelLightsTotal;
        dst.m_lightData = this.m_lightData;
        dst.m_vsmData = this.m_vsmData;
        dst.m_envData = this.m_envData;

        dst.m_albedo.set(this.m_albedo);
        dst.m_params.set(this.m_params);
        dst.m_paramLocal.set(this.m_paramLocal);
        dst.m_camPos.set(this.m_camPos);
        dst.m_mirrorParam.set(this.m_mirrorParam);
        
        dst.setTextureList(this.getTextureList().slice());
        return dst;
    }

    setVSMData( vsm: ShadowVSMData ): void {
        this.m_vsmData = vsm;
    }
    setLightData(lightData: GlobalLightData): void {
        this.m_lightData = lightData;        
    }
    setEnvData( envData: EnvLightData ): void {
        this.m_envData = envData;
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
    createSharedUniforms():ShaderGlobalUniform[]
    {
        let glu: ShaderGlobalUniform = this.m_lightData.getGlobalUinform();
        glu.uns = this.getShdUniqueName();
        let list: ShaderGlobalUniform[] = [glu];
        if(this.shadowReceiveEnabled && this.m_vsmData != null) {
            glu = this.m_vsmData.getGlobalUinform();
            glu.uns = this.getShdUniqueName();
            list.push(glu);
        }
        if(this.fogEnabled && this.m_envData != null) {
            glu = this.m_envData.getGlobalUinform();
            glu.uns = this.getShdUniqueName();
            list.push(glu);
        }
        return list;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_params", "u_camPos", "u_paramLocal", "u_mirrorParams"];
        oum.dataList = [this.m_albedo, this.m_params, this.m_camPos, this.m_paramLocal, this.m_mirrorParam];
        return oum;
    }
}
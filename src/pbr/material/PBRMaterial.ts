/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import IPBRMaterial from "./IPBRMaterial";
import PBRShaderDecorator from "./PBRShaderDecorator";
import Color4 from "../../vox/material/Color4";

import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import GlobalLightData from "../../light/base/GlobalLightData";
import ShadowVSMData from "../../shadow/vsm/material/ShadowVSMData";
import EnvLightData from "../../light/base/EnvLightData";

class PBRShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PBRShaderBuffer = new PBRShaderBuffer();
    decorator: PBRShaderDecorator = null;
    
    initialize(texEnabled: boolean): void {
        this.adaptationShaderVersion = false;
    }
    
    getFragShaderCode(): string {
        
        return this.decorator.getFragShaderCode();
    }
    getVtxShaderCode(): string {
        return this.decorator.getVtxShaderCode();
    }
    getUniqueShaderName(): string {
        return this.decorator.getUniqueShaderName();
    }
    toString(): string {
        return "[PBRShaderBuffer()]";
    }

    static GetInstance(): PBRShaderBuffer {
        return PBRShaderBuffer.s_instance;
    }
}

export default class PBRMaterial extends MaterialBase implements IPBRMaterial {

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
    ///////////////////////////////////////////////////////

    decorator: PBRShaderDecorator = null;

    constructor() {
        super();
    }
    getCodeBuf(): ShaderCodeBuffer {

        //  this.decorator.vsmData = this.m_vsmData;
        //  this.decorator.envData = this.m_envData;
        this.decorator.texturesTotal = this.getTextureTotal();
        this.decorator.initialize();
        let buf: PBRShaderBuffer = PBRShaderBuffer.GetInstance();
        buf.decorator = this.decorator;
        return buf;
    }
    copyFrom(dst: PBRMaterial, texEnabled:boolean = true): void {

        if(this.decorator == null)this.decorator = new PBRShaderDecorator();
        this.decorator.copyFrom( dst.decorator );
        this.decorator.initialize();
        
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

        let dst: PBRMaterial = new PBRMaterial();
        if(dst.decorator == null)dst.decorator = new PBRShaderDecorator();
        dst.decorator.copyFrom( this.decorator );
        dst.decorator.initialize();

        dst.m_albedo.set(this.m_albedo);
        dst.m_params.set(this.m_params);
        dst.m_paramLocal.set(this.m_paramLocal);
        dst.m_camPos.set(this.m_camPos);
        dst.m_mirrorParam.set(this.m_mirrorParam);
        
        dst.setTextureList(this.getTextureList().slice());
        return dst;
    }
    /*
    setVSMData( vsm: ShadowVSMData ): void {
        this.m_vsmData = vsm;
    }
    setLightData(lightData: GlobalLightData): void {
        this.m_lightData = lightData;        
    }
    setEnvData( envData: EnvLightData ): void {
        this.m_envData = envData;
    }
    //*/
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
        return this.decorator.createSharedUniforms();
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_params", "u_camPos", "u_paramLocal", "u_mirrorParams"];
        oum.dataList = [this.m_albedo, this.m_params, this.m_camPos, this.m_paramLocal, this.m_mirrorParam];
        return oum;
    }
}
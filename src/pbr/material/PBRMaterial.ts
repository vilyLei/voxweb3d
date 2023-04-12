/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import IShaderCodeObject from "../../vox/material/IShaderCodeObject";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import IPBRMaterial from "./IPBRMaterial";
import PBRShaderDecorator from "./PBRShaderDecorator";
import Color4 from "../../vox/material/Color4";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

//  import { PBRShaderCode } from "./glsl/PBRShaderCode";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { UniformComp } from "../../vox/material/component/UniformComp";

class PBRShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance = new PBRShaderBuffer();
    decorator: PBRShaderDecorator = null;
    texturesTotal: number = 0;

    vertUniform: UniformComp = null;
    initialize(texEnabled: boolean): void {

        texEnabled = this.texturesTotal > 0;
        super.initialize( texEnabled );
        this.adaptationShaderVersion = false;
    }
    buildShader(): void {

        if(this.vertUniform != null) {
            this.vertUniform.use(this.m_coder);
            //this.m_coder.addVertUniform("vec4", "u_vertLocalParams", this.vertUniform.getParamsTotal());
        }
        this.decorator.buildShader( this.m_coder );
    }
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.PBR;
    }
    getUniqueShaderName(): string {
        if(this.vertUniform != null) {
            return this.decorator.getUniqueShaderName() + this.vertUniform.getUniqueNSKeyString();
        }
        else {
            return this.decorator.getUniqueShaderName();
        }
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

    decorator: PBRShaderDecorator = null;
    vertUniform: UniformComp = null;
    constructor() {
        super();
    }

    protected buildBuf(): void {

        console.log("PBRMaterial::buildBuf()...");
        let buf: PBRShaderBuffer = PBRShaderBuffer.GetInstance();
        let decorator = this.decorator;
        buf.lightEnabled = decorator.lightEnabled;
        buf.shadowReceiveEnabled = decorator.shadowReceiveEnabled;
        buf.fogEnabled = decorator.fogEnabled;
        buf.glossinessEnabeld = decorator.glossinessEnabeld;
        buf.buildPipelineParams();

        buf.decorator = decorator;
        buf.vertUniform = this.vertUniform;
        //buf.decorator.codeBuilder = buf.getShaderCodeBuilder();

        if(this.m_fragLocalParams == null) {
            this.initializeLocalData();
        }

        let list = decorator.createTextureList( buf.getShaderCodeBuilder() );
        if(this.vertUniform != null) this.vertUniform.getTextures(buf.getShaderCodeBuilder(), list);
        buf.getTexturesFromPipeline( list );

        super.setTextureList( list );
        buf.texturesTotal = list.length;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return PBRShaderBuffer.GetInstance();
    }
    initializeLocalData(): void {
        if(this.vertUniform != null) {
            this.vertUniform.initialize();
        }
        let decorator = this.decorator;
        decorator.fragLocalParamsTotal = 2;
        decorator.parallaxParamIndex = 2;
        if(decorator.parallaxMap != null) {
            decorator.fragLocalParamsTotal += 1;
        }
        this.m_fragLocalParams = new Float32Array(decorator.fragLocalParamsTotal * 4);
        this.m_fragLocalParams.set(
            [
                0.0, 0.0, 0.0, 1.0,      // f0.r,f0.g,f0.b, mormalMapIntentity(0.0,1.0)
                0.2, 0.2, 0.2, 0.0       // albedo(r,g,b), undefined
            ],
            0
        );
        if(decorator.parallaxMap != null) {
            this.m_parallaxParams = this.m_fragLocalParams.subarray(decorator.parallaxParamIndex * 4, (decorator.parallaxParamIndex + 1) * 4);
            this.m_parallaxParams.set([1.0, 10.0, 2.0, 0.1]);
        }
    }
    copyFrom(src: PBRMaterial): void {

        this.setMaterialPipeline(src.m_pipeLine);
        if(this.decorator == null)this.decorator = new PBRShaderDecorator();
        this.decorator.copyFrom( src.decorator );
        // console.log("copyFrom src: ",src);
        // console.log("copyFrom this: ",this);

        this.vertUniform = src.vertUniform;
        if(this.m_pbrParams == null || this.m_pbrParams.length != src.m_pbrParams.length) {
            this.m_pbrParams = src.m_pbrParams.slice();
        }
        else {
            this.m_pbrParams.set(src.m_pbrParams);
        }
        if(this.m_fragLocalParams == null || this.m_fragLocalParams.length != src.m_fragLocalParams.length) {
            this.m_fragLocalParams = src.m_fragLocalParams.slice();
        }
        else {
            this.m_fragLocalParams.set(src.m_fragLocalParams);
        }

        if(this.m_mirrorParam == null || this.m_mirrorParam.length != src.m_mirrorParam.length) {
            this.m_mirrorParam = src.m_mirrorParam.slice();
        }
        else {
            this.m_mirrorParam.set(src.m_mirrorParam);
        }
    }
    setTextureList(texList: IRenderTexture[]): void {
        //throw Error("Illegal operations !!!");
    }

    clone(): PBRMaterial {

        let m: PBRMaterial = new PBRMaterial();
        m.copyFrom( this );
        return m;
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
    //ambient factor x,y,z
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
    createSelfUniformData(): ShaderUniformData {

        let sud = new ShaderUniformData();
        sud.uniformNameList = ["u_pbrParams", "u_fragLocalParams", "u_mirrorParams"];
        sud.dataList = [this.m_pbrParams, this.m_fragLocalParams, this.m_mirrorParam];
        if(this.vertUniform != null) {
            this.vertUniform.buildShaderUniformData(sud);
        }
        return sud;
    }
    destroy(): void {

        this.vertUniform = null;
        this.m_pbrParams = null;
        this.m_fragLocalParams = null;
        this.m_mirrorParam = null;
        super.destroy();
    }
}

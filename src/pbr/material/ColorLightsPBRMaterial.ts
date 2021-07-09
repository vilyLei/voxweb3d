/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../vox/render/RendererDeviece";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import {ColorLightsPBR} from "./ColorLightsPBR";

class ColorLightsPBRShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: ColorLightsPBRShaderBuffer = new ColorLightsPBRShaderBuffer();
    private m_uniqueName: string = "";
    woolEnabled:boolean = true;
    toneMappingEnabled:boolean = true;
    envMapEnabled:boolean = true;
    scatterEnabled:boolean = true;
    specularBleedEnabled:boolean = true;
    metallicCorrection:boolean = true;
    gammaCorrection:boolean = true;
    absorbEnabled:boolean = false;
    normalNoiseEnabled:boolean = false;
    pixelNormalNoiseEnabled:boolean = false;
    
    pointLightsTotal: number = 4;
    parallelLightsTotal: number = 0;
    initialize(texEnabled: boolean): void {
        //console.log("ColorLightsPBRShaderBuffer::initialize()...");
        this.m_uniqueName = "ColorLightsPBRShd";
    }
    getFragShaderCode(): string {
        //  console.log("ColorLightsPBR",ColorLightsPBR);
        //  console.log("ColorLightsPBR.frag",ColorLightsPBR.frag);
        //  console.log("ColorLightsPBR end.");

        let fragCode: string =
`#version 300 es
precision highp float;
`;
        if(RendererDeviece.IsWebGL1()) {

            fragCode +=
`
#extension GL_EXT_shader_texture_lod : enable
#define VOX_TextureCubeLod textureCubeLodEXT
`;
        }
        else {
            
            fragCode +=
`
#define VOX_TextureCubeLod textureLod
`;
        }
        // 毛料表面效果
        if(this.woolEnabled) fragCode += "\n#define VOX_WOOL";
        if(this.toneMappingEnabled) fragCode += "\n#define VOX_TONE_MAPPING";
        if(this.envMapEnabled) fragCode += "\n#define VOX_ENV_MAP";
        if(this.scatterEnabled) fragCode += "\n#define VOX_SCATTER";
        if(this.specularBleedEnabled) fragCode += "\n#define VOX_SPECULAR_BLEED";
        if(this.metallicCorrection) fragCode += "\n#define VOX_METALLIC_CORRECTION";
        if(this.gammaCorrection) fragCode += "\n#define VOX_GAMMA_CORRECTION";
        if(this.absorbEnabled) fragCode += "\n#define VOX_ABSORB";
        if(this.pixelNormalNoiseEnabled) fragCode += "\n#define VOX_PIXEL_NORMAL_NOISE";

        let lightsTotal: number = this.pointLightsTotal + this.parallelLightsTotal;
        if(this.pointLightsTotal > 0) fragCode += "\n#define VOX_POINT_LIGHTS_TOTAL " + this.pointLightsTotal;
        else fragCode += "\n#define VOX_POINT_LIGHTS_TOTAL 0";
        if(this.parallelLightsTotal > 0) fragCode += "\n#define VOX_PARALLEL_LIGHTS_TOTAL " + this.parallelLightsTotal;
        else fragCode += "\n#define VOX_PARALLEL_LIGHTS_TOTAL 0";
        if(lightsTotal > 0) fragCode += "\n#define VOX_LIGHTS_TOTAL " + lightsTotal;
        else fragCode += "\n#define VOX_LIGHTS_TOTAL 0";

        fragCode += "\n";

        return fragCode + ColorLightsPBR.frag;
    }
    getVtxShaderCode(): string {
        let vtxCode: string =
`#version 300 es
precision highp float;
`;
        if(this.normalNoiseEnabled) vtxCode += "\n#define VOX_NORMAL_NOISE";

        vtxCode += "\n";
        vtxCode +=
`
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;

uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out vec3 v_worldPos;
out vec3 v_worldNormal;
out vec3 v_camPos;

const vec2 noise2 = vec2(12.9898,78.233);
const vec3 noise3 = vec3(12.9898,78.233,158.5453);
vec2 rand(vec2 seed) {

  float noiseX = (fract(sin(dot(seed, noise2)) * 43758.5453));
  float noiseY = (fract(sin(dot(seed, noise2 * 2.0)) * 43758.5453));
  return vec2(noiseX,noiseY);
}
vec3 rand(vec3 seed) {
  float noiseX = (fract(sin(dot(seed, noise3)) * 43758.5453));
  float noiseY = (fract(sin(dot(seed, noise3 * 2.0)) * 43758.5453));
  float noiseZ = (fract(sin(dot(seed, noise3 * 3.0)) * 43758.5453));
  return vec3(noiseX, noiseY, noiseZ);
}
void main(){
    
    vec4 wPos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wPos;
    gl_Position = u_projMat * viewPos;

    v_worldPos = wPos.xyz;
    
    v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    #ifdef VOX_NORMAL_NOISE
        v_worldNormal += (rand(a_nvs)) * 0.1;
    #endif
    v_camPos = (inverse(u_viewMat) * vec4(0.0,0.0,0.0, 1.0)).xyz;
}
`;
        return vtxCode;
    }
    getUniqueShaderName() {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        let ns: string = this.m_uniqueName;

        if(this.woolEnabled) ns += "_wool";
        if(this.toneMappingEnabled) ns += "_toneMapping";
        if(this.envMapEnabled) ns += "_envMap";
        if(this.scatterEnabled) ns += "_scatter";
        if(this.specularBleedEnabled) ns += "_specBleed";
        if(this.metallicCorrection) ns += "_metCorr";
        if(this.gammaCorrection) ns += "_gammaCorr";
        if(this.absorbEnabled) ns += "_absorb";
        if(this.pixelNormalNoiseEnabled) ns += "_pixelNNoise";
        if(this.normalNoiseEnabled) ns += "_nNoise";
        
        if(this.pointLightsTotal > 0) ns += "_" + this.pointLightsTotal;
        if(this.parallelLightsTotal > 0) ns += "_" + this.parallelLightsTotal;
        
        return ns;
    }
    toString(): string {
        return "[ColorLightsPBRShaderBuffer()]";
    }

    static GetInstance(): ColorLightsPBRShaderBuffer {
        return ColorLightsPBRShaderBuffer.___s_instance;
    }
}

export default class ColorLightsPBRMaterial extends MaterialBase {

    private m_pointLightsTotal: number = 4;
    private m_parallelLightsTotal: number = 0;
    private m_envMapWidth: number = 128;
    private m_envMapHeight: number = 128;
    private m_albedo: Float32Array = new Float32Array([0.2, 0.2, 0.2, 0.0]);
    private m_params: Float32Array = new Float32Array([
        0.0, 0.0, 1.0, 0.02,   // [metallic,roughness,ao, pixel noise intensity]
        1.0,                   // tone map exposure
        0.1,                   // reflectionIntensity
        1.0,                   // frontColorScale
        1.0,                   // sideColorScale

        0.1,0.1,0.1,           // ambient factor x,y,z
        1.0,                   // scatterIntensity
        1.0,1.0,1.0,           // env map specular color factor x,y,z
        0.07                   // envMap lod mipMapLv parameter((100.0 * fract(0.07)) - (100.0 * fract(0.07)) * k + floor(0.07))
        ]);
    private m_F0: Float32Array = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    private m_camPos: Float32Array = new Float32Array([500.0, 500.0, 500.0, 1.0]);
    private m_lightPositions: Float32Array;
    private m_lightColors: Float32Array;

    woolEnabled:boolean = false;    
    toneMappingEnabled:boolean = true;
    envMapEnabled:boolean = true;
    // 模拟镜面高光部分出现的表面散射
    scatterEnabled:boolean = true;
    specularBleedEnabled:boolean = true;
    // 是否开启 metalness 修正
    metallicCorrection:boolean = true;
    // 是否开启 gamma矫正
    gammaCorrection:boolean = true;
    // 是否开启吸收光能的模式
    absorbEnabled:boolean = true;
    normalNoiseEnabled:boolean = false;
    pixelNormalNoiseEnabled:boolean = false;
    
    constructor( pointLightsTotal: number = 2, parallelLightsTotal: number = 0 ) {
        super();
        this.m_pointLightsTotal = pointLightsTotal;
        this.m_parallelLightsTotal = parallelLightsTotal;

        let total: number = pointLightsTotal + parallelLightsTotal;
        if(total > 0) {
            this.m_lightPositions = new Float32Array(4 * total);
            this.m_lightColors = new Float32Array(4 * total);
        }
    }
    getCodeBuf(): ShaderCodeBuffer {
        let buf: ColorLightsPBRShaderBuffer = ColorLightsPBRShaderBuffer.GetInstance();
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

        buf.pointLightsTotal = this.m_pointLightsTotal;
        buf.parallelLightsTotal = this.m_parallelLightsTotal;
        return buf;
    }
    copyFrom(dst:ColorLightsPBRMaterial): void {
        
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

        this.m_pointLightsTotal = dst.m_pointLightsTotal;
        this.m_parallelLightsTotal = dst.m_parallelLightsTotal;
        if(dst.m_lightPositions != null)this.m_lightPositions = dst.m_lightPositions.slice();
        if(dst.m_lightColors != null)this.m_lightColors = dst.m_lightColors.slice();

        this.m_albedo = dst.m_albedo.slice();
        this.m_params = dst.m_params.slice();
        this.m_F0 = dst.m_F0.slice();
        this.m_camPos = dst.m_camPos.slice();
        this.setTextureList( dst.getTextureList().slice() );
    }
    setPixelNormalNoiseIntensity(intensity: number): void {
        intensity = Math.min(Math.max(intensity, 0.0), 2.0);
        this.m_params[3] = intensity;
    }
    /**
     * (lod mipmap level) = base + (maxMipLevel - k * maxMipLevel)
     * @param maxMipLevel envmap texture lod max mipmap level, the vaue is a int number
     * @param base envmap texture lod max mipmap level base, value range: -7.0 -> 12.0
     */
    setEnvMapLodMipMapLevel(maxMipLevel: number, base:number = 0.0): void {
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
    setToneMapingExposure(value: number): void {

        this.m_params[4] = Math.min(Math.max(value, 0.1), 128.0);
    }
    setReflectionIntensity(value: number): void {

        this.m_params[5] = Math.min(Math.max(value, 0.001), 1.0);
    }
    
    setSurfaceIntensity(surfaceIntensity: number): void {

        this.m_params[6] = Math.min(Math.max(surfaceIntensity, 0.001), 32.0);
    }
    setSideIntensity(sideIntensity: number): void {
        this.m_params[7] = Math.min(Math.max(sideIntensity, 0.001), 32.0);
    }
    setEnvSpecularColorFactor(fx:number, fy: number, fz:number):void {
        this.m_params[12] = fx;
        this.m_params[13] = fy;
        this.m_params[14] = fz;
    }
    //ambient factor x,y,z
    setAmbientFactor(fx:number, fy: number, fz:number):void {
        this.m_params[8] = fx;
        this.m_params[9] = fy;
        this.m_params[10] = fz;
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
    setF0(f0x: number, f0y: number, f0z: number): void {

        this.m_F0[0] = f0x;
        this.m_F0[1] = f0y;
        this.m_F0[2] = f0z;
    }
    setPointLightPosAt(i: number, px: number, py: number, pz: number): void {
        if(i >= 0 && i < this.m_pointLightsTotal) {
            i *= 4;
            this.m_lightPositions[i] = px;
            this.m_lightPositions[i + 1] = py;
            this.m_lightPositions[i + 2] = pz;
        }
    }
    setPointLightColorAt(i: number, pr: number, pg: number, pb: number): void {
        
        if(i >= 0 && i < this.m_pointLightsTotal) {
            i *= 4;
            this.m_lightColors[i] = pr;
            this.m_lightColors[i + 1] = pg;
            this.m_lightColors[i + 2] = pb;
        }
    }
    
    setParallelLightDirecAt(i: number, px: number, py: number, pz: number): void {

        if(i >= 0 && i < this.m_parallelLightsTotal) {
            i += this.m_pointLightsTotal;
            i *= 4;
            this.m_lightPositions[i] = px;
            this.m_lightPositions[i + 1] = py;
            this.m_lightPositions[i + 2] = pz;
        }
    }
    setParallelLightColorAt(i: number, pr: number, pg: number, pb: number): void {

        if(i >= 0 && i < this.m_parallelLightsTotal) {
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
    setCamPos(pos: Vector3D): void {

        this.m_camPos[0] = pos.x;
        this.m_camPos[1] = pos.y;
        this.m_camPos[2] = pos.z;
    }
    createSelfUniformData(): ShaderUniformData {

        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_params", "u_lightPositions", "u_lightColors", "u_camPos", "u_F0"];
        oum.dataList = [this.m_albedo, this.m_params, this.m_lightPositions, this.m_lightColors, this.m_camPos,this.m_F0];
        return oum;
    }
}
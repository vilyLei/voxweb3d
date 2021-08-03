/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";

export default interface IPBRMaterial {

    woolEnabled: boolean;
    toneMappingEnabled: boolean;
    envMapEnabled: boolean;
    // 模拟镜面高光部分出现的表面散射
    scatterEnabled: boolean;
    specularBleedEnabled: boolean;
    // 是否开启 metalness 修正
    metallicCorrection: boolean;
    // 是否开启 gamma矫正
    gammaCorrection: boolean;
    // 是否开启吸收光能的模式
    absorbEnabled: boolean;
    /**
     * vtx normal noise
     */
    normalNoiseEnabled: boolean;
    /**
     * frag normal noise
     */
    pixelNormalNoiseEnabled: boolean;
    mirrorProjEnabled: boolean;
    mirrorMapLodEnabled: boolean;
    diffuseMapEnabled: boolean;
    normalMapEnabled: boolean;
    indirectEnvMapEnabled: boolean;
    initializeByCodeBuf(texEnabled: boolean):void;
    copyFrom(dst: IPBRMaterial, texEnabled:boolean): void;
    clone(): IPBRMaterial;

    seNormalMapIntensity(intensity: number): void;
    setPixelNormalNoiseIntensity(intensity: number): void;
    getPixelNormalNoiseIntensity(): number;
    setMirrorPlaneNV(nv: Vector3D): void;
    setMirrorMapLodLevel(lodLv: number): void;
    setMirrorIntensity(intensity: number): void;
    setMirrorMixFactor(factor: number): void;
    /**
     * (lod mipmap level) = base + (maxMipLevel - k * maxMipLevel)
     * @param maxMipLevel envmap texture lod max mipmap level, the vaue is a int number
     * @param base envmap texture lod max mipmap level base, value range: -7.0 -> 12.0
     */
    setEnvMapLodMipMapLevel(maxMipLevel: number, base: number): void;
    setEnvMapLodMipMapLevelWithSize(envMapWidth: number, envMapHeight: number, base: number): void;
    setScatterIntensity(value: number): void;
    getScatterIntensity(): number;
    setToneMapingExposure(value: number): void;
    getToneMapingExposure(): number;
    setReflectionIntensity(value: number): void;
    getReflectionIntensity(): number;

    setSurfaceIntensity(surfaceIntensity: number): void;
    getSurfaceIntensity(): number;
    setSideIntensity(sideIntensity: number): void;
    getSideIntensity(): number;
    setEnvSpecularColorFactor(fx: number, fy: number, fz: number): void;
    getEnvSpecularColorFactor(colorFactor: Color4): void;
    //ambient factor x,y,z
    setAmbientFactor(fx: number, fy: number, fz: number): void;
    getAmbientFactor(colorFactor: Color4): void;

    setMetallic(metallic: number): void;
    getMetallic(): number;
    setRoughness(roughness: number): void;
    getRoughness(): number;

    setAO(ao: number): void;
    getAO(): number;
    setF0(f0x: number, f0y: number, f0z: number): void;
    getF0(colorFactor: Color4): void;
    setUVScale(sx: number, sy: number): void;
    getUVScale(scaleV:Vector3D): void;
    

    setAlbedoColor(pr: number, pg: number, pb: number): void;
    getAlbedoColor(colorFactor: Color4): void;
    
}
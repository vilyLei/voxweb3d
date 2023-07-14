/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeObject from "../../vox/material/IShaderCodeObject";
import IShaderUniformData from "../../vox/material/IShaderUniformData";
import IVector3D from "../../vox/math/IVector3D";
import IColor4 from "../../vox/material/IColor4";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { IShaderTextureBuilder } from "../../vox/material/IShaderTextureBuilder";

interface IPBRMaterialDecorator extends IMaterialDecorator {

    specularEnvMap: IRenderTexture;
    diffuseMap: IRenderTexture;
    normalMap: IRenderTexture;
    mirrorMap: IRenderTexture;
    indirectEnvMap: IRenderTexture;
    parallaxMap: IRenderTexture;
    aoMap: IRenderTexture;
    roughnessMap: IRenderTexture;
    metalhnessMap: IRenderTexture;

    /**
     * add ao, roughness, metalness map uniform code
     */
    armMap: IRenderTexture;

	/**
	 * the default value is true
	 */
    woolEnabled: boolean;
	/**
	 * the default value is true
	 */
    toneMappingEnabled: boolean;
	/**
	 * the default value is true
	 */
    scatterEnabled: boolean;
	/**
	 * the default value is true
	 */
    specularBleedEnabled: boolean;
	/**
	 * the default value is true
	 */
    metallicCorrection: boolean;
	/**
	 * the default value is true
	 */
    gammaCorrection: boolean;
	/**
	 * the default value is false
	 */
    absorbEnabled: boolean;
	/**
	 * the default value is false
	 */
    normalNoiseEnabled: boolean;
	/**
	 * the default value is false
	 */
    pixelNormalNoiseEnabled: boolean;
	/**
	 * the default value is false
	 */
    mirrorMapLodEnabled: boolean;
	/**
	 * the default value is false
	 */
    hdrBrnEnabled: boolean;
	/**
	 * the default value is false
	 */
    vtxFlatNormal: boolean;
	/**
	 * the default value is 1
	 */
    texturesTotal: number;
	/**
	 * the default value is 2
	 */
    fragLocalParamsTotal: number;
	/**
	 * the default value is 2
	 */
    parallaxParamIndex: number;
	initialize(): void;
    seNormalMapIntensity(intensity: number): void;
    setPixelNormalNoiseIntensity(intensity: number): void;
    getPixelNormalNoiseIntensity(): number;
    setMirrorViewNV(nv: IVector3D): void;
    setMirrorPlaneNV(nv: IVector3D): void;
    setMirrorMapLodLevel(lodLv: number): void;
    setMirrorIntensity(intensity: number): void;
    setMirrorMixFactor(factor: number): void;
    /**
     * (lod mipmap level) = base + (maxMipLevel - k * maxMipLevel)
     * @param maxMipLevel envmap texture lod max mipmap level, the vaue is a int number
     * @param base the default value is 0.0, the value is envmap texture lod max mipmap level base, value range: -7.0 -> 12.0
     */
    setEnvMapLodMipMapLevel(maxMipLevel: number, base?: number): void;
	/**
	 * @param envMapWidth
	 * @param envMapHeight
	 * @param base the default value is 0.0
	 */
    setEnvMapLodMipMapLevelWithSize(envMapWidth: number, envMapHeight: number, base?: number): void;
    setScatterIntensity(value: number): void;
    getScatterIntensity(): number;
    setToneMapingExposure(value: number): void;
    getToneMapingExposure(): number;
    setReflectionIntensity(value: number): void;
    getReflectionIntensity(): number;

    setSurfaceIntensity(surfaceIntensity: number): void;
    getSurfaceIntensity(): number;
    /**
     * @param sideIntensity value: 0.1 -> 32.0
     */
    setSideIntensity(sideIntensity: number): void;
    getSideIntensity(): number;
    setEnvSpecularColorFactor(fx: number, fy: number, fz: number): void;
    getEnvSpecularColorFactor(colorFactor: IColor4): void;
    setAmbientFactor(fr: number, fg: number, fb: number): void;
    getAmbientFactor(colorFactor: IColor4): void;

    setMetallic(metallic: number): void;
    getMetallic(): number;
    setRoughness(roughness: number): void;
    getRoughness(): number;

    setAO(ao: number): void;
    getAO(): number;
    setF0(f0x: number, f0y: number, f0z: number): void;
    getF0(colorFactor: IColor4): void;
    setAlbedoColor(pr: number, pg: number, pb: number): void;
    getAlbedoColor(colorFactor: IColor4): void;

    /**
     * 设置顶点置换贴图参数
     * @param numLayersMin ray march 最小层数, default value is 1.0
     * @param numLayersMax ray march 最大层数, default value is 10.0
     * @param height ray march 总高度, default value is 2.0
     * @param stepFactor ray march 单步增量大小, default value is 0.1
     */
    setParallaxParams(numLayersMin?: number, numLayersMax?: number, height?: number, stepFactor?: number): void;

    /**
     * user build textures list
     */
    buildTextureList(builder: IShaderTextureBuilder): void;
    buildShader(coder: IShaderCodeBuilder): void;
    /**
     * @returns local uniform data
     */
    createUniformData(): IShaderUniformData;
    /**
     * get shader code object uuid, it is defined in the system
     * @returns shader code object uuid
     */
    getShaderCodeObjectUUID(): ShaderCodeUUID;
    /**
     * get custom shader code object
     * @returns shader code object
     */
    getShaderCodeObject(): IShaderCodeObject;
    /**
     * @returns unique name string
     */
    getUniqueName(): string;
    destroy(): void;
}
export { IPBRMaterialDecorator }

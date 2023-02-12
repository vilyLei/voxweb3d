/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { IShaderCodeUniform } from "../../vox/material/code/IShaderCodeUniform";
import IRenderTexture from "../render/texture/IRenderTexture";
import { SpecularMode } from "./pipeline/SpecularMode";
import { ShadowMode } from "./pipeline/ShadowMode";

interface IShaderTextureBuilder {

    getCodeBuilder(): IShaderCodeBuilder;
    reset(): void;
    getTextures(): IRenderTexture[];
    getTexturesTotal(): number;
    /**
     * add diffuse map uniform code
     */
    addDiffuseMap(tex: IRenderTexture): void;
    /**
     * add normal map uniform code
     */
    addNormalMap(tex: IRenderTexture): void;
    /**
     * add parallax map uniform code
     * @param parallaxParamIndex parallax map parameter uniform data array index
     */
    addParallaxMap(tex: IRenderTexture, parallaxParamIndex: number): void;
    /**
     * add displacement map uniform code
     * @param parallaxParamIndex vec4 param array index in the vertex shader
     */
    addDisplacementMap(tex: IRenderTexture, displacementParamIndex: number): void;

    /**
     * add specular map uniform code
     * @param specularMode is SpecularMode type value, the default is SpecularMode.Default
     */
    addSpecularMap(tex: IRenderTexture, specularMode?: SpecularMode): void;
    /**
     * add shadow map uniform code
     * @param shadowMode is shadowMode type value, the default is ShadowMode.VSM
     */
    addShadowMap(tex: IRenderTexture, shadowMode?: ShadowMode): void;
    /**
     * add env specular cube map uniform code
     * @param cubeMap yes or no, the default is true
     */
    addSpecularEnvMap(tex: IRenderTexture, cubeMap?: boolean): void;
    /**
     * add ambient occlusion map uniform code
     */
    addAOMap(tex: IRenderTexture): void;
    /**
     * add roughness map uniform code
     */
    addRoughnessMap(tex: IRenderTexture): void;
    /**
     * add metalness map uniform code
     */
    addMetalnessMap(tex: IRenderTexture): void;

    /**
     * add ao, roughness, metalness map uniform code
     */
    addARMMap(tex: IRenderTexture): void;

    /**
     * add sampler2d texture uniform code
     * @param tex 2d IRenderTexture instance
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param map2DEnabled texture 2d enabled, the default vaule is true
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    add2DMap(tex: IRenderTexture, macroName?: string, map2DEnabled?: boolean, fragEnabled?: boolean, vertEnabled?: boolean): void;
    /**
     * add sampleCube texture uniform code
     * @param tex cube IRenderTexture instance
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    addCubeMap(tex: IRenderTexture, macroName?: string, fragEnabled?: boolean, vertEnabled?: boolean): void;
    /**
     * add sample3D texture uniform code
     * @param tex 3d IRenderTexture instance
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    add3DMap(tex: IRenderTexture, macroName?: string, fragEnabled?: boolean, vertEnabled?: boolean): void;
}
export { IShaderTextureBuilder }

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { SpecularMode } from "../pipeline/SpecularMode";
import { ShadowMode } from "../pipeline/ShadowMode";

interface IShaderCodeUniform {

    reset(): void;
    getUniqueNSKeyID(): number;
    getUniqueNSKeyString(): string;
    /**
     * apply camera position uniform in the shader,the uniform vec4 data: [x, y, z, w]
     * @param vertEnabled whether apply camera position uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply camera position uniform in the fragment shader, the default value is true
     */
    useCameraPosition(vertEnabled?: boolean, fragEnabled?: boolean): void;
    /**
     * apply view parameters uniform in the shader,the uniform vec4 data: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
     * @param vertEnabled whether apply view parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply view parameters uniform in the fragment shader, the default value is true
     */
    useViewPort(vertEnabled?: boolean, fragEnabled?: boolean): void;
    /**
     * apply frustum parameters uniform in the shader,the uniform vec4 data: [camera zNear,camera zFar, camera nearPlaneHalfWidth, camera nearPlaneHalfHeight]
     * @param vertEnabled whether apply frustum parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply frustum parameters uniform in the fragment shader, the default value is true
     */
    useFrustum(vertEnabled?: boolean, fragEnabled?: boolean): void;
    /**
     * apply stage parameters uniform in the shader,the uniform vec4 data: [2.0/stageWidth,2.0/stageHeight, stageWidth,stageHeight]
     * @param vertEnabled whether apply stage parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply stage parameters uniform in the fragment shader, the default value is true
     */
    useStage(vertEnabled?: boolean, fragEnabled?: boolean): void;

    /**
     * add diffuse map uniform code
     */
    addDiffuseMap(): void;
    /**
     * add normal map uniform code
     */
    addNormalMap(): void;
    /**
     * add parallax map uniform code
     * @param parallaxParamIndex parallax map parameter uniform data array index
     */
    addParallaxMap(parallaxParamIndex: number): void;
    /**
     * add displacement map uniform code
     * @param displacementParamIndex vec4 param array index in the vertex shader
     */
    addDisplacementMap(displacementParamIndex: number): void;
    /**
     * add specular map uniform code
     * @param specularMode is SpecularMode type value, the default is SpecularMode.Default
     */
    addSpecularMap(specularMode?: SpecularMode): void;
    /**
     * add shadow map uniform code
     * @param shadowMode is shadowMode type value, the default is ShadowMode.VSM
     */
    addShadowMap(shadowMode?: ShadowMode): void;
    /**
     * add fog color map uniform code
     */
    addFogColorMap(): void

    /**
     * add env specular cube map uniform code
     * @param cubeMap yes or no, the default is true
     */
    addSpecularEnvMap(cubeMap?: boolean): void;
    /**
     * add ambient occlusion map uniform code
     */
    addAOMap(): void;
    /**
     * add roughness map uniform code
     */
    addRoughnessMap(): void;
    /**
     * add metalness map uniform code
     */
    addMetalnessMap(): void;
    /**
     * add ao, roughness, metalness map uniform code
     */
    addARMMap(): void;
    /**
     * add Index of Refraction values map uniform code
     */
    addIORMap(): void;
    /**
     * add sampler2d texture uniform code
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param map2DEnabled texture 2d enabled, the default vaule is true
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    add2DMap(macroName?: string, map2DEnabled?: boolean, fragEnabled?: boolean, vertEnabled?: boolean): void;
    /**
     * add sampleCube texture uniform code
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    addCubeMap(macroName?: string, fragEnabled?: boolean, vertEnabled?: boolean): void;
    /**
     * add sample3D texture uniform code
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    add3DMap(macroName?: string, fragEnabled?: boolean, vertEnabled?: boolean): void;
}
export {IShaderCodeUniform};

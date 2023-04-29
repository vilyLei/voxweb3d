/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { IShaderCodeUniform } from "../../vox/material/code/IShaderCodeUniform";
import IRenderTexture from "../render/texture/IRenderTexture";
import { SpecularMode } from "./pipeline/SpecularMode";
import { ShadowMode } from "./pipeline/ShadowMode";
import { IShaderTextureBuilder } from "./IShaderTextureBuilder";

class ShaderTextureBuilder implements IShaderTextureBuilder {

    private m_coderBuilder: IShaderCodeBuilder = null;
    private m_uniform: IShaderCodeUniform = null;
    private m_texList: IRenderTexture[] = [];
    constructor(codeBuilder: IShaderCodeBuilder) {
        this.m_coderBuilder = codeBuilder;
        this.m_uniform = codeBuilder.uniform;
    }
    getCodeBuilder(): IShaderCodeBuilder {
        return this.m_coderBuilder;
    }
    reset(): void {
        this.m_texList = [];
    }
    getTextures(): IRenderTexture[] {
        return this.m_texList;
    }
    getTexturesTotal(): number {
        return this.m_texList.length;
    }
    /**
     * add diffuse map uniform code
     */
    addDiffuseMap(tex: IRenderTexture): void {
        if (tex != null) {
            this.m_uniform.addDiffuseMap();
            this.m_texList.push(tex);
        }
    }
    /**
     * add normal map uniform code
     */
    addNormalMap(tex: IRenderTexture): void {

        if (tex != null) {
            this.m_uniform.addNormalMap();
            this.m_texList.push(tex);
        }
    }
    /**
     * add parallax map uniform code
     * @param parallaxParamIndex parallax map parameter uniform data array index
     */
    addParallaxMap(tex: IRenderTexture, parallaxParamIndex: number): void {

        if (tex != null) {
            this.m_uniform.addParallaxMap(parallaxParamIndex);
            this.m_texList.push(tex);
        }
    }
    /**
     * add displacement map uniform code
     * @param parallaxParamIndex vec4 param array index in the vertex shader
     */
    addDisplacementMap(tex: IRenderTexture, displacementParamIndex: number): void {

        if (tex != null) {
            this.m_uniform.addDisplacementMap(displacementParamIndex);
            this.m_texList.push(tex);
        }
    }

    /**
     * add specular map uniform code
     * @param specularMode is SpecularMode type value, the default is SpecularMode.Default
     */
    addSpecularMap(tex: IRenderTexture, specularMode: SpecularMode = SpecularMode.Default): void {

        if (tex != null) {
            this.m_uniform.addSpecularMap(specularMode);
            this.m_texList.push(tex);
        }
    }
    /**
     * add shadow map uniform code
     * @param shadowMode is shadowMode type value, the default is ShadowMode.VSM
     */
    addShadowMap(tex: IRenderTexture, shadowMode: ShadowMode = ShadowMode.VSM): void {

        if (tex != null) {
            this.m_uniform.addShadowMap(shadowMode);
            this.m_texList.push(tex);
        }
    }
    /**
     * add env specular cube map uniform code
     * @param cubeMap yes or no, the default is true
     */
    addSpecularEnvMap(tex: IRenderTexture, cubeMap: boolean = true): void {

        if (tex != null) {
            this.m_uniform.addSpecularEnvMap(cubeMap);
            this.m_texList.push(tex);
        }
    }
    /**
     * add ambient occlusion map uniform code
     */
    addAOMap(tex: IRenderTexture): void {

        if (tex != null) {
            this.m_uniform.addAOMap();
            this.m_texList.push(tex);
        }
    }
    /**
     * add roughness map uniform code
     */
    addRoughnessMap(tex: IRenderTexture): void {

        if (tex != null) {
            this.m_uniform.addRoughnessMap();
            this.m_texList.push(tex);
        }
    }
    /**
     * add metalness map uniform code
     */
    addMetalnessMap(tex: IRenderTexture): void {

        if (tex != null) {
            this.m_uniform.addMetalnessMap();
            this.m_texList.push(tex);
        }
    }

    /**
     * add ao, roughness, metalness map uniform code
     */
    addARMMap(tex: IRenderTexture): void {

        if (tex != null) {
            this.m_uniform.addARMMap();
            this.m_texList.push(tex);
        }
    }

    /**
     * add sampler2d texture uniform code
     * @param tex 2d IRenderTexture instance
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param map2DEnabled texture 2d enabled, the default vaule is true
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    add2DMap(tex: IRenderTexture, macroName: string = "", map2DEnabled: boolean = true, fragEnabled: boolean = true, vertEnabled: boolean = false): void {
        if (tex != null) {
            this.m_uniform.add2DMap(macroName, map2DEnabled, fragEnabled, vertEnabled);
            this.m_texList.push(tex);
        }
    }
    /**
     * add sampleCube texture uniform code
     * @param tex cube IRenderTexture instance
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    addCubeMap(tex: IRenderTexture, macroName: string = "", fragEnabled: boolean = true, vertEnabled: boolean = false): void {
        if (tex != null) {
            this.m_uniform.addCubeMap(macroName, fragEnabled, vertEnabled);
            this.m_texList.push(tex);
        }
    }
    /**
     * add sample3D texture uniform code
     * @param tex 3d IRenderTexture instance
     * @param macroName shader code macro define name, the default vaule is empty string
     * @param fragEnabled fragment shader applying enabled, the default vaule is true
     * @param vertEnabled vertex shader applying enabled, the default vaule is false
     */
    add3DMap(tex: IRenderTexture, macroName: string = "", fragEnabled: boolean = true, vertEnabled: boolean = false): void {
        if (tex != null) {
            this.m_uniform.add3DMap(macroName, fragEnabled, vertEnabled);
            this.m_texList.push(tex);
        }
    }
}
export { ShaderTextureBuilder }
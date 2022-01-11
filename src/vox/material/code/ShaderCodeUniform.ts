
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { SpecularMode } from "../pipeline/SpecularMode";
import { ShadowMode } from "../pipeline/ShadowMode";
import IShaderCodeBuilder from "./IShaderCodeBuilder";
import UniformConst from "../UniformConst";
import { IShaderCodeUniform } from "./IShaderCodeUniform";

class ShaderCodeUniform implements IShaderCodeUniform {
    private m_codeBuilder: IShaderCodeBuilder = null;

    private m_uniqueNSKeyString: string = "";
    private m_uniqueNSKeys: Uint16Array = new Uint16Array(128);
    private m_uniqueNSKeysTotal: number = 16;
    private m_uniqueNSKeyFlag: boolean = false;
    constructor(){}
    
    __$setCodeBuilder(codeBuilder: IShaderCodeBuilder): void {
        this.m_codeBuilder = codeBuilder;
    }
    getUniqueNSKeyID(): number {

        if(this.m_uniqueNSKeyFlag) {
            let id: number = 31;
            for(let i: number = 0; i < this.m_uniqueNSKeysTotal; ++i) {
                id = id * 131 + this.m_uniqueNSKeys[i];
            }
            return id;
        }
        return 0;
    }
    getUniqueNSKeyString(): string {

        if(this.m_uniqueNSKeyFlag) {
            this.m_uniqueNSKeyString = "[" + this.m_uniqueNSKeys[0];
            for(let i: number = 1; i < this.m_uniqueNSKeysTotal; ++i) {
                //this.m_uniqueNSKeyString += "-"+this.m_uniqueNSKeys[i];
                this.m_uniqueNSKeyString += ""+this.m_uniqueNSKeys[i];
            }
            this.m_uniqueNSKeyString += "]";
            return this.m_uniqueNSKeyString;
        }
        return "";
    }
    reset(): void {
        
        if(this.m_uniqueNSKeyFlag) {
            for(let i: number = 0; i < this.m_uniqueNSKeysTotal; ++i) {
                this.m_uniqueNSKeys[i] = 0;
            }
            this.m_uniqueNSKeyFlag = false;
        }
    }
    /**
     * apply camera position uniform in the shader,the uniform vec4 data: [x, y, z, w]
     * @param vertEnabled whether apply camera position uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply camera position uniform in the fragment shader, the default value is true
     */
    useCameraPosition(vertEnabled: boolean = false, fragEnabled: boolean = true): void {

        if (vertEnabled) {
            this.m_codeBuilder.addVertUniformParam(UniformConst.CameraPosParam);
        }
        if (fragEnabled) {
            this.m_codeBuilder.addFragUniformParam(UniformConst.CameraPosParam);
        }
    }
    
    /**
     * apply view parameters uniform in the shader,the uniform vec4 data: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
     * @param vertEnabled whether apply view parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply view parameters uniform in the fragment shader, the default value is true
     */
    useViewPort(vertEnabled: boolean = false, fragEnabled: boolean = true): void {
        
        if (vertEnabled) {
            this.m_codeBuilder.addVertUniformParam(UniformConst.ViewportParam);
        }
        if (fragEnabled) {
            this.m_codeBuilder.addFragUniformParam(UniformConst.ViewportParam);
        }
    }
    /**
     * apply frustum parameters uniform in the shader,the uniform vec4 data: [camera zNear,camera zFar, camera nearPlaneHalfWidth, camera nearPlaneHalfHeight]
     * @param vertEnabled whether apply frustum parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply frustum parameters uniform in the fragment shader, the default value is true
     */
    useFrustum(vertEnabled: boolean = false, fragEnabled: boolean = true): void {
        
        if (vertEnabled) {
            this.m_codeBuilder.addVertUniformParam(UniformConst.FrustumParam);
        }
        if (fragEnabled) {
            this.m_codeBuilder.addFragUniformParam(UniformConst.FrustumParam);
        }
    }
    /**
     * apply stage parameters uniform in the shader,the uniform vec4 data: [2.0/stageWidth,2.0/stageHeight, stageWidth,stageHeight]
     * @param vertEnabled whether apply stage parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply stage parameters uniform in the fragment shader, the default value is true
     */
    useStage(vertEnabled: boolean, fragEnabled: boolean): void {
        
        if (vertEnabled) {
            this.m_codeBuilder.addVertUniformParam(UniformConst.StageParam);
        }
        if (fragEnabled) {
            this.m_codeBuilder.addFragUniformParam(UniformConst.StageParam);
        }
    }

    
    /**
     * add diffuse map uniform code
     */
    addDiffuseMap(): void {
        this.m_codeBuilder.addTextureSample2D("VOX_DIFFUSE_MAP", true, true, false);
        this.m_uniqueNSKeys[0] = 1;
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add normal map uniform code
     */
    addNormalMap(): void {
        this.m_codeBuilder.addTextureSample2D("VOX_NORMAL_MAP", true, true, false);
        this.m_codeBuilder.normalMapEnabled = true;
        this.m_uniqueNSKeys[1] = 1;
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add parallax map uniform code
     * @param parallaxParamIndex parallax map parameter uniform data array index
     */
    addParallaxMap(parallaxParamIndex: number): void {        
        this.m_codeBuilder.addTextureSample2D("VOX_PARALLAX_MAP", true, true, false);
        if(parallaxParamIndex >= 0) {
            this.m_codeBuilder.addDefine("VOX_PARALLAX_PARAMS_INDEX", "" + parallaxParamIndex);
            this.m_uniqueNSKeys[2] = 1 + (parallaxParamIndex << 1);
        }
        else {
            this.m_uniqueNSKeys[2] = 1;
        }
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add displacement map uniform code
     * @param parallaxParamIndex vec4 param array index in the vertex shader
     */
    addDisplacementMap(displacementParamIndex: number): void {
        this.m_codeBuilder.addTextureSample2D("VOX_DISPLACEMENT_MAP", true, false, true);
        if(displacementParamIndex >= 0) {
            this.m_codeBuilder.addDefine("VOX_DISPLACEMENT_PARAMS_INDEX", "" + displacementParamIndex);
            this.m_uniqueNSKeys[3] = 1 + (displacementParamIndex << 1);
        }
        else {
            this.m_uniqueNSKeys[3] = 1;
        }
        this.m_uniqueNSKeyFlag = true;
    }
    
    /**
     * add specular map uniform code
     * @param specularMode is SpecularMode type value, the default is SpecularMode.Default
     */
    addSpecularMap(specularMode: SpecularMode = SpecularMode.Default): void {
        this.m_codeBuilder.addTextureSample2D("VOX_SPECULAR_MAP", true, true, false);
        this.m_codeBuilder.addDefine("VOX_SPECULAR_MODE", "" + specularMode);
        this.m_uniqueNSKeys[5] = 1 + (specularMode << 1);
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add shadow map uniform code
     * @param shadowMode is shadowMode type value, the default is ShadowMode.VSM
     */
    addShadowMap(shadowMode: ShadowMode = ShadowMode.VSM): void {

        this.m_codeBuilder.addTextureSample2D("VOX_VSM_SHADOW_MAP", false, true, false);
        this.m_uniqueNSKeys[6] = 1 + (shadowMode << 1);
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add fog color map uniform code
     */
    addFogColorMap(): void {

        this.m_codeBuilder.addTextureSample2D("VOX_FOG_COLOR_MAP", true, true, false);
        this.m_uniqueNSKeys[7] = 1;
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add env specular cube map uniform code
     * @param cubeMap yes or no, the default is true
     */
    addspecularEnvMap(cubeMap: boolean = true): void {
        if(cubeMap) {
            this.m_codeBuilder.addTextureSampleCube("VOX_ENV_MAP", true, false);
        }
        else {
            this.m_codeBuilder.addTextureSample2D("VOX_ENV_MAP", true, true, false);
        }
        this.m_uniqueNSKeys[8] = 1;
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add ambient occlusion map uniform code
     */
    addAOMap(): void {
        this.m_codeBuilder.addTextureSample2D("VOX_AO_MAP", true, true, false);
        this.m_uniqueNSKeys[4] = 1;
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add roughness map uniform code
     */
    addRoughnessMap(): void {
        this.m_codeBuilder.addTextureSample2D("VOX_ROUGHNESS_MAP", true, true, false);
        this.m_uniqueNSKeys[9] = 1;
        this.m_uniqueNSKeyFlag = true;
    }
    /**
     * add metalness map uniform code
     */
     addMetalnessMap(): void {
        this.m_codeBuilder.addTextureSample2D("VOX_METALNESS_MAP", true, true, false);
        this.m_uniqueNSKeys[10] = 1;
        this.m_uniqueNSKeyFlag = true;
    }
    
    /**
     * add ao, roughness, metalness map uniform code
     */
     addARMMap(): void {
        this.m_codeBuilder.addTextureSample2D("VOX_ARM_MAP", true, true, false);
        this.m_uniqueNSKeys[11] = 1;
        this.m_uniqueNSKeyFlag = true;
     }
    
    add2DMap(macroName: string = "", map2DEnabled: boolean = true, fragEnabled: boolean = true, vertEnabled: boolean = false): void {
        this.m_codeBuilder.addTextureSample2D(macroName, map2DEnabled, fragEnabled, vertEnabled);
    }
    addCubeMap(macroName: string = "", fragEnabled: boolean = true, vertEnabled: boolean = false): void {
        this.m_codeBuilder.addTextureSampleCube(macroName, fragEnabled, vertEnabled);
    }
    add3DMap(macroName: string = "", fragEnabled: boolean = true, vertEnabled: boolean = false): void {
        this.m_codeBuilder.addTextureSample3D(macroName, fragEnabled, vertEnabled);
    }
}
export { ShaderCodeUniform };
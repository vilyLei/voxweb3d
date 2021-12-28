/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/../material/MaterialBase";

import { SpecularMode } from "../pipeline/SpecularMode";
import { AdvancedShaderCodeBuffer } from "../pipeline/AdvancedShaderCodeBuffer";
import Color4 from "../Color4";
import TextureProxy from "../../texture/TextureProxy";
import { VertUniformComp } from "../component/VertUniformComp";

export default class LambertLightMaterial extends MaterialBase {

    private static s_shaderCodeBuffer: AdvancedShaderCodeBuffer = null;

    private m_parallaxParams: Float32Array = null;
    private m_parallaxParamIndex: number = 1;

    private m_lightParamsArray: Float32Array = null;
    private m_fragLocalParams: Float32Array = null;
    private m_fragLocalParamsTotal: number = 1;
    private m_lightParamsIndex: number = 1;

    colorEnabled: boolean = true;
    normalEnabled: boolean = true;

    diffuseMap: TextureProxy = null;
    normalMap: TextureProxy = null;
    parallaxMap: TextureProxy = null;
    aoMap: TextureProxy = null;
    specularMap: TextureProxy = null;
    shadowMap: TextureProxy = null;

    specularMode: SpecularMode = SpecularMode.Default;

    lightEnabled: boolean = true;
    fogEnabled: boolean = false;

    vertUniform: VertUniformComp = null;
    constructor() {
        super();
        if(LambertLightMaterial.s_shaderCodeBuffer == null) {
            LambertLightMaterial.s_shaderCodeBuffer = new AdvancedShaderCodeBuffer();
        }
    }

    clone(): LambertLightMaterial {

        let material: LambertLightMaterial = new LambertLightMaterial();
        material.initializeByCodeBuf(false);
        material.copyFrom( this );
        return material;
    }
    copyFrom(src: LambertLightMaterial): void {

        this.m_pipeLine = src.m_pipeLine;

        this.colorEnabled = src.colorEnabled;
        this.lightEnabled = src.lightEnabled;
        this.fogEnabled = src.fogEnabled;
        this.normalEnabled = src.normalEnabled;
        this.vertUniform = src.vertUniform;

        if(this.diffuseMap == null) this.diffuseMap = src.diffuseMap;
        if(this.normalMap == null) this.normalMap = src.normalMap;
        if(this.parallaxMap == null) this.parallaxMap = src.parallaxMap;
        if(this.aoMap == null) this.aoMap = src.aoMap;
        if(this.specularMap == null) this.specularMap = src.specularMap;
        if(this.shadowMap == null) this.shadowMap = src.shadowMap;

        this.specularMode = src.specularMode;

        this.m_fragLocalParams = src.m_fragLocalParams.slice();

        let lightParamsIndex: number = 2;
        if (this.parallaxMap != null) {
            this.m_parallaxParams = this.m_fragLocalParams.subarray(lightParamsIndex * 4, (lightParamsIndex + 1) * 4);
            lightParamsIndex += 1;
        }
        if (this.lightEnabled) {
            this.m_lightParamsArray = this.m_fragLocalParams.subarray(lightParamsIndex * 4);
        }

        this.m_lightParamsIndex = src.m_lightParamsIndex;
        this.m_parallaxParamIndex = src.m_parallaxParamIndex;
        this.m_fragLocalParamsTotal = src.m_fragLocalParamsTotal;
        this.m_uniqueShaderName = src.m_uniqueShaderName;
    }
    protected buildTextureList(): TextureProxy[] {

        let buf: AdvancedShaderCodeBuffer = LambertLightMaterial.s_shaderCodeBuffer;
        buf.setIRenderTextureList([]);
        let textures: TextureProxy[] = null;
        if(this.vertUniform != null) {
            textures = this.vertUniform.getTextures();
        }
        else {
            //buf.addDisplacementMap( this.displacementMap, 1 );
        }

        buf.addDiffuseMap( this.diffuseMap );
        buf.addNormalMap( this.normalMap );
        buf.addParallaxMap( this.parallaxMap, this.m_parallaxParamIndex );
        buf.addAOMap( this.aoMap );
        buf.addSpecularMap( this.specularMap );
        buf.addShadowMap( this.shadowMap );

        let list = buf.getIRenderTextureList() as TextureProxy[];
        list = textures != null ? list.concat(textures) : list;
        return list;
    }
    initializeLocalData(): void {
        if(this.vertUniform != null) {
            this.vertUniform.initialize();
        }
        if (this.m_fragLocalParams == null) {

            this.m_fragLocalParamsTotal = 2;
            
            if (this.parallaxMap != null) {
                this.m_fragLocalParamsTotal += 1;
            }
            if (this.lightEnabled) {
                this.m_fragLocalParamsTotal += 3;
            }
            this.m_fragLocalParams = new Float32Array(this.m_fragLocalParamsTotal * 4);
            this.m_fragLocalParams.set([1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);
            let lightParamsIndex: number = 2;

            if (this.parallaxMap != null) {

                this.m_parallaxParams = this.m_fragLocalParams.subarray(lightParamsIndex * 4, (lightParamsIndex + 1) * 4);
                this.m_parallaxParams.set([1.0, 10.0, 2.0, 0.1]);
                this.m_parallaxParamIndex = lightParamsIndex;
                lightParamsIndex += 1;
            }
            if (this.lightEnabled) {

                this.m_lightParamsIndex = lightParamsIndex;
                this.m_lightParamsArray = this.m_fragLocalParams.subarray(lightParamsIndex * 4);
                this.m_lightParamsArray.set(
                    [
                        0.5, 0.5, 0.5, 32.0,        // specular color rgb, pow value
                        0.7, 0.3,                   // diffuse light color value factor, specular value factor
                        0.3, 0.7,                   // base color value factor, light value factor
                        0.01, 0.01, 0.01,           // ambient color
                        0.0                         // undefined
                    ]);
            }
        }
    }
    protected buildBuf(): void {

        if (this.m_fragLocalParams == null) {
            this.initializeLocalData();
        }
        let buf: AdvancedShaderCodeBuffer = LambertLightMaterial.s_shaderCodeBuffer;
        buf.colorEnabled = this.colorEnabled;
        buf.lightParamsIndex = this.m_lightParamsIndex;
        buf.lightEnabled = this.lightEnabled;
        buf.fogEnabled = this.fogEnabled;
        buf.normalEnabled = this.normalEnabled;
        buf.vertUniform = this.vertUniform;
        
        buf.shadowReceiveEnabled = this.shadowMap != null;
        buf.fragLocalParamsTotal = this.m_fragLocalParamsTotal;

        buf.buildFlag = this.m_uniqueShaderName == "";
        let texList = this.buildTextureList();        
        super.setTextureList( texList );
        buf.buildFlag = false;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return LambertLightMaterial.s_shaderCodeBuffer;
    }

    setSpecularColor(color: Color4): void {
        if (this.m_lightParamsArray != null) {
            this.m_lightParamsArray[0] = color.r;
            this.m_lightParamsArray[1] = color.g;
            this.m_lightParamsArray[2] = color.b;
        }
    }
    setSpecularIntensity(Intensity: number): void {
        if (this.m_lightParamsArray != null) {
            this.m_lightParamsArray[3] = Intensity;
        }
    }
    /**
     * 光照之前的颜色和光照之后颜色混合因子设置
     * @param lightFactor diffuse light 颜色混合因子, default value is 0.7
     * @param specularFactor specular light 颜色混合因子, default value is 0.3
     */
    setLightBlendFactor(baseColorFactor: number, lightFactor: number): void {
        if (this.m_lightParamsArray != null) {
            this.m_lightParamsArray[4] = baseColorFactor;
            this.m_lightParamsArray[5] = lightFactor;
        }
    }
    /**
     * 光照之前的颜色和光照之后颜色混合因子设置
     * @param baseColorFactor 光照之前的颜色混合因子, default value is 0.3
     * @param lightFactor 光照之后颜色混合因子, default value is 0.7
     */
    setBlendFactor(baseColorFactor: number, lightFactor: number): void {
        if (this.m_lightParamsArray != null) {
            this.m_lightParamsArray[6] = baseColorFactor;
            this.m_lightParamsArray[7] = lightFactor;
        }
    }
    /**
     * 设置环境光因子
     * @param fx ambient red factor
     * @param fy 
     * @param fz 
     */
    setAmbientFactor(fr: number, fg: number, fb: number): void {
        if (this.m_lightParamsArray != null) {
            this.m_lightParamsArray[8] = fr;
            this.m_lightParamsArray[9] = fg;
            this.m_lightParamsArray[10] = fb;
        }
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
    setColor(factor: Color4, bias: Color4 = null): void {
        if (factor != null) {
            this.m_fragLocalParams[0] = factor.r;
            this.m_fragLocalParams[1] = factor.g;
            this.m_fragLocalParams[2] = factor.b;
            this.m_fragLocalParams[3] = factor.a;
        }
        if (bias != null) {
            this.m_fragLocalParams[4] = bias.r;
            this.m_fragLocalParams[5] = bias.g;
            this.m_fragLocalParams[6] = bias.b;
            this.m_fragLocalParams[7] = bias.a;
        }
    }
    setColorAlpha(a: number): void {
        this.m_fragLocalParams[3] = a;
    }

    createSelfUniformData(): ShaderUniformData {
        
        //let vertLocalParams = this.vertUniform != null ? this.vertUniform.getParams() : this.m_vertLocalParams;
        let vertLocalParams = this.vertUniform != null ? this.vertUniform.getParams() : null;
        
        let oum: ShaderUniformData = new ShaderUniformData();
        
        if(vertLocalParams != null) {
            oum.uniformNameList = ["u_vertLocalParams", "u_fragLocalParams"];
            oum.dataList = [vertLocalParams, this.m_fragLocalParams];
        }
        else {
            oum.uniformNameList = ["u_fragLocalParams"];
            oum.dataList = [this.m_fragLocalParams];
        }

        return oum;
    }
    destroy(): void {
        super.destroy();
        
        // this.m_vertLocalParams = null;
        this.m_fragLocalParams = null;
        if(this.vertUniform != null) {
            this.vertUniform = null;
        }
    }

}
export { SpecularMode, LambertLightMaterial };
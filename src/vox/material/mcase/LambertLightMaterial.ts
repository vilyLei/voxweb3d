/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IAbstractShader from "../../../vox/material/IAbstractShader";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/../material/MaterialBase";
import UniformConst from "../UniformConst";

import { MaterialPipeType } from "../pipeline/MaterialPipeType";
import Color4 from "../Color4";
import TextureProxy from "../../texture/TextureProxy";
import { LambertLightShaderCode } from "./glsl/LambertLightShaderCode";
enum SpecularMode {
    /**
     * 使用设置的纯色 rgb 作为镜面光的颜色系数
     */
    Default = 1,
    /**
     * 使用 之前计算出来的 片段 color rgb 作为镜面光的颜色系数
     */
    FragColor = 2,
    /**
     * 使用 SpecularMap color rgb 作为镜面光的颜色系数
     */
    SpecularMapColor = 3
}
class LambertLightShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }

    private static s_instance: LambertLightShaderBuffer = new LambertLightShaderBuffer();
    private m_uniqueName: string = "";
    private m_pipeTypes: MaterialPipeType[] = null;
    private m_keysString: string = "";

    colorEnabled: boolean = true;
    diffuseMapEnabled: boolean = false;
    normalMapEnabled: boolean = false;
    parallaxMapEnabled: boolean = false;
    displacementMapEnabled: boolean = false;
    aoMapEnabled: boolean = false;
    specularMapEnabled: boolean = false;

    shadowReceiveEnabled: boolean = true;
    lightEnabled: boolean = true;
    fogEnabled: boolean = true;
    specularMode: SpecularMode = SpecularMode.Default;

    localParamsTotal: number = 2;
    texturesTotal: number = 0;
    parallaxParamIndex: number = 1;
    lightParamsIndex: number = 2;

    initialize(texEnabled: boolean): void {
        console.log("LambertLightShaderBuffer::initialize()...this.lightEnabled: ", this.lightEnabled);
        texEnabled = this.texturesTotal > 0;
        super.initialize(texEnabled);
        this.m_uniqueName = "LambertShd";
        if (texEnabled) this.m_uniqueName += "Tex";
        if (this.normalMapEnabled) this.m_uniqueName += "Nor";
        if (this.parallaxMapEnabled) this.m_uniqueName += "Para";
        if (this.displacementMapEnabled) this.m_uniqueName += "Disp";
        if (this.aoMapEnabled) this.m_uniqueName += "AO";
        if (this.specularMapEnabled) this.m_uniqueName += "Spec" + this.specularMode;
        if (this.fogEnabled) this.m_uniqueName += "Fog";
        if (this.shadowReceiveEnabled) this.m_uniqueName += "Shadow";
        this.m_uniqueName += "" + this.localParamsTotal;

        if (this.pipeline != null) {
            this.m_pipeTypes = [];
            if (this.lightEnabled) {
                this.m_pipeTypes.push(MaterialPipeType.GLOBAL_LIGHT);
            }
            if (this.shadowReceiveEnabled) {
                this.m_pipeTypes.push(MaterialPipeType.VSM_SHADOW);
            }
            if (this.fogEnabled) {
                this.m_pipeTypes.push(MaterialPipeType.FOG_EXP2);
            }

            this.pipeline.buildSharedUniforms(this.m_pipeTypes);
            this.pipeline.createKeys(this.m_pipeTypes);
            this.m_keysString = this.pipeline.getKeysString();
        }
    }

    private buildThisCode(): void {

        let coder = this.m_coder;
        coder.normalEanbled = true;
        coder.normalMapEanbled = true;
        coder.vertMatrixInverseEnabled = true;

        if (this.isTexEanbled()) {
            if (this.diffuseMapEnabled) {
                coder.addTextureSample2D("VOX_DIFFUSE_MAP");
            }
            if (this.normalMapEnabled && this.lightEnabled) {
                coder.addTextureSample2D("VOX_NORMAL_MAP");
            }
            if (this.parallaxMapEnabled && this.lightEnabled) {
                coder.addTextureSample2D("VOX_PARALLAX_MAP");
                coder.addDefine("VOX_PARALLAX_PARAMS_INDEX", "" + this.parallaxParamIndex);
            }

            if (this.displacementMapEnabled) {
                coder.addVertUniform("vec4", "u_displacement");
                coder.addTextureSample2D("VOX_DISPLACEMENT_MAP", true, false, true);
            }
            if (this.aoMapEnabled) {
                coder.addTextureSample2D("VOX_AO_MAP");
            }
            if (this.specularMapEnabled && this.lightEnabled) {

                coder.addTextureSample2D("VOX_SPECULAR_MAP");
                coder.addDefine("VOX_SPECULAR_MODE", "" + this.specularMode);
            }
            if (this.shadowReceiveEnabled) {
                coder.addTextureSample2D("VOX_VSM_SHADOW_MAP");
            }
        }
        coder.addVertUniform("vec4", "u_vtxParams", 2);
        coder.addFragUniform("vec4", "u_localParams", this.localParamsTotal);
        if (this.lightEnabled) {
            coder.addDefine("LIGHT_LOCAL_PARAMS_INDEX", "" + this.lightParamsIndex);
        }

        if (this.pipeline != null) {
            this.pipeline.addShaderCode( this.getShaderCodeObject() );
            this.pipeline.build(coder, this.m_pipeTypes);
        }
    }
    
    getShaderCodeObject(): IAbstractShader {
        return LambertLightShaderCode;
    }
    getFragShaderCode(): string {
        this.buildThisCode();
        return this.m_coder.buildFragCode();
    }
    getVtxShaderCode(): string {
        return this.m_coder.buildVertCode();
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName + this.m_keysString;
    }
    toString(): string {
        return "[LambertLightShaderBuffer()]";
    }

    static GetInstance(): LambertLightShaderBuffer {
        return LambertLightShaderBuffer.s_instance;
    }
}

export default class LambertLightMaterial extends MaterialBase {

    private m_parallaxArray: Float32Array = null;
    private m_lightParamsArray: Float32Array = null;
    private m_vtxParams: Float32Array = null;
    private m_fragParamssTotal: number = 1;
    private m_parallaxParamIndex: number = 1;
    private m_lightParamsIndex: number = 1;

    colorEnabled: boolean = true;

    diffuseMap: TextureProxy = null;
    normalMap: TextureProxy = null;
    parallaxMap: TextureProxy = null;
    displacementMap: TextureProxy = null;
    aoMap: TextureProxy = null;
    specularMap: TextureProxy = null;
    shadowMap: TextureProxy = null;
    specularMode: SpecularMode = SpecularMode.Default;

    lightEnabled: boolean = true;
    fogEnabled: boolean = false;

    constructor() {
        super();
    }

    initializeLocalData(): void {

        if (this.m_fragParams == null) {

            this.m_fragParamssTotal = 2;
            this.m_vtxParams = new Float32Array([
                1.0     // u scale
                ,1.0    // v scale
                ,0.0    // undefined
                ,0.0    // undefined

                ,10.0,0.0   // displacement scale, bias
                ,0.0,0.0    // undefined
            ]);
            if (this.displacementMap != null) {
                this.m_fragParamssTotal += 1;
            }
            if (this.parallaxMap != null) {
                this.m_fragParamssTotal += 1;
            }
            if (this.lightEnabled) {
                this.m_fragParamssTotal += 3;
            }
            this.m_fragParams = new Float32Array(this.m_fragParamssTotal * 4);
            this.m_fragParams.set([1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);
            let lightParamsIndex: number = 2;
            
            if (this.parallaxMap != null) {
                
                this.m_parallaxArray = this.m_fragParams.subarray(lightParamsIndex * 4, (lightParamsIndex + 1) * 4);
                this.m_parallaxArray.set([1.0, 10.0, 2.0, 0.1]);
                this.m_parallaxParamIndex = lightParamsIndex;
                lightParamsIndex += 1;
            }
            if (this.lightEnabled) {
                this.m_lightParamsIndex = lightParamsIndex;
                this.m_lightParamsArray = this.m_fragParams.subarray(lightParamsIndex * 4);
                this.m_lightParamsArray.set(
                    [
                        0.5, 0.5, 0.5, 32.0,    // specular color rgb, pow value
                        0.7, 0.3,                // light color value factor, specular value factor
                        0.001, 0.0001,          // attenuation factor 1, attenuation factor 2
                        0.3, 0.7,                // base color value factor, light value factor
                        0.0, 0.0                // undefined, undefined
                    ]);
            }
        }
    }
    protected buildBuf(): void {
        if (this.m_fragParams == null) {
            this.initializeLocalData();
        }
        let buf: LambertLightShaderBuffer = LambertLightShaderBuffer.GetInstance();

        buf.colorEnabled = this.colorEnabled;
        buf.diffuseMapEnabled = this.diffuseMap != null;
        buf.normalMapEnabled = this.normalMap != null;
        buf.parallaxMapEnabled = this.parallaxMap != null;
        buf.displacementMapEnabled = this.displacementMap != null;
        buf.aoMapEnabled = this.aoMap != null;
        buf.specularMapEnabled = this.specularMap != null;
        buf.shadowReceiveEnabled = this.shadowMap != null;
        buf.specularMode = this.specularMode;
        buf.parallaxParamIndex = this.m_parallaxParamIndex;
        buf.lightParamsIndex = this.m_lightParamsIndex;

        buf.lightEnabled = this.lightEnabled;
        buf.fogEnabled = this.fogEnabled;

        buf.localParamsTotal = this.m_fragParamssTotal;

        let texList: TextureProxy[] = [];
        if (this.diffuseMap != null) texList.push(this.diffuseMap);
        if (this.normalMap != null && this.lightEnabled) texList.push(this.normalMap);
        if (this.parallaxMap != null && this.lightEnabled) texList.push(this.parallaxMap);
        if (this.displacementMap != null) texList.push(this.displacementMap);
        if (this.aoMap != null) texList.push(this.aoMap);
        if (this.specularMap != null && this.lightEnabled) texList.push(this.specularMap);
        if (this.shadowMap != null) texList.push(this.shadowMap);
        super.setTextureList(texList);
        buf.texturesTotal = texList.length;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return LambertLightShaderBuffer.GetInstance();
    }

    private m_fragParams: Float32Array = null;
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
     * @param lightFactor 光照之前的颜色混合因子, default value is 0.7
     * @param specularFactor 光照之后颜色混合因子, default value is 0.3
     */
    setLightBlendFactor(baseColorFactor: number, lightFactor: number): void {
        if (this.m_lightParamsArray != null) {
            this.m_lightParamsArray[4] = baseColorFactor;
            this.m_lightParamsArray[5] = lightFactor;
        }
    }
    /**
     * ads 光照模型中顶点与点光源之间距离的二次方和三次方因子
     * @param factor2 顶点与点光源之间距离的二次方因子, default value is 0.001
     * @param factor3 顶点与点光源之间距离的三次方因子, default value is 0.0001
     */
    setLightIntensityFactors(factor2: number, factor3: number): void {
        if (this.m_lightParamsArray != null) {
            this.m_lightParamsArray[6] = factor2;
            this.m_lightParamsArray[7] = factor3;
        }
    }
    /**
     * 光照之前的颜色和光照之后颜色混合因子设置
     * @param baseColorFactor 光照之前的颜色混合因子, default value is 0.3
     * @param lightFactor 光照之后颜色混合因子, default value is 0.7
     */
    setBlendFactor(baseColorFactor: number, lightFactor: number): void {
        if (this.m_lightParamsArray != null) {
            this.m_lightParamsArray[8] = baseColorFactor;
            this.m_lightParamsArray[9] = lightFactor;
        }
    }
    setUVScale(uScale: number, vScale: number): void {
        if (this.m_vtxParams != null) {
            this.m_vtxParams[0] = uScale;
            this.m_vtxParams[1] = vScale;
        }
    }
    /**
     * 设置顶点置换贴图参数
     * @param scale 缩放值
     * @param bias 偏移量
     */
    setDisplacementParams(scale: number, bias: number): void {
        if (this.m_vtxParams != null) {
            this.m_vtxParams[4] = scale;
            this.m_vtxParams[5] = bias;
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
        if (this.m_parallaxArray != null) {
            this.m_parallaxArray[0] = numLayersMin;
            this.m_parallaxArray[1] = numLayersMax;
            this.m_parallaxArray[2] = height;
            this.m_parallaxArray[3] = stepFactor;
        }
    }
    setColor(factor: Color4, bias: Color4 = null): void {
        if (factor != null) {
            this.m_fragParams[0] = factor.r;
            this.m_fragParams[1] = factor.g;
            this.m_fragParams[2] = factor.b;
            this.m_fragParams[3] = factor.a;
        }
        if (bias != null) {
            this.m_fragParams[4] = bias.r;
            this.m_fragParams[5] = bias.g;
            this.m_fragParams[6] = bias.b;
            this.m_fragParams[7] = bias.a;
        }
    }
    setColorAlpha(a: number): void {
        this.m_fragParams[3] = a;
    }

    createSelfUniformData(): ShaderUniformData {

        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_localParams","u_vtxParams"];
        oum.dataList = [this.m_fragParams, this.m_vtxParams];
        
        return oum;
    }
    destroy(): void {
        super.destroy();
        this.m_fragParams = null;
    }

}
export { SpecularMode, LambertLightMaterial };
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/../material/MaterialBase";
import UniformConst from "../UniformConst";

import { MaterialPipeType } from "../pipeline/MaterialPipeType";
import IAbstractShader from "../../../vox/material/IAbstractShader";
import Color4 from "../Color4";
import TextureProxy from "../../texture/TextureProxy";
import {LambertLightShaderCode} from "./glsl/LambertLightShaderCode";

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
    displacementMapEnabled: boolean = false;
    aoMapEnabled: boolean = false;    
    specularMapEnabled: boolean = false;

    shadowReceiveEnabled: boolean = true;
    lightEnabled: boolean = true;
    fogEnabled: boolean = true;

    localParamsTotal: number = 2;
    texturesTotal: number = 0;

    initialize(texEnabled: boolean): void {
        console.log("LambertLightShaderBuffer::initialize()...this.lightEnabled: ",this.lightEnabled);
        texEnabled = this.texturesTotal > 0;
        super.initialize(texEnabled);
        this.m_uniqueName = "LambertShd";
        if(texEnabled) this.m_uniqueName += "Tex";
        if(this.normalMapEnabled) this.m_uniqueName += "Nor";
        if(this.displacementMapEnabled) this.m_uniqueName += "Disp";
        if(this.aoMapEnabled) this.m_uniqueName += "AO";
        if(this.specularMapEnabled) this.m_uniqueName += "Spec";
        if(this.fogEnabled) this.m_uniqueName += "Fog";
        if(this.shadowReceiveEnabled) this.m_uniqueName += "Shadow";
        this.m_uniqueName += "" + this.localParamsTotal;
        if(this.pipeline != null) {

            this.m_pipeTypes = [];
            if (this.lightEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.GLOBAL_LIGHT );
            }
            if (this.shadowReceiveEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.VSM_SHADOW );
            }
            if (this.fogEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.FOG_EXP2 );
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
            if(this.diffuseMapEnabled) {
                coder.addTextureSample2D("VOX_DIFFUSE_MAP");
            }
            if(this.normalMapEnabled && this.lightEnabled) {
                coder.addTextureSample2D("VOX_NORMAL_MAP");
            }
            if(this.displacementMapEnabled) {
                coder.addVertUniform("vec4", "u_displacement");
                coder.addTextureSample2D("VOX_DISPLACEMENT_MAP",true,false,true);
            }
            if(this.aoMapEnabled) {
                coder.addTextureSample2D("VOX_AO_MAP");
            }
            if(this.specularMapEnabled && this.lightEnabled) {
                coder.addTextureSample2D("VOX_SPECULAR_MAP");
            }
            if(this.shadowReceiveEnabled) {
                coder.addTextureSample2D("VOX_VSM_SHADOW_MAP");
            }
        }
        
        if(this.displacementMapEnabled) {
            coder.addVertAndFragUniform("vec4", "u_localParams", this.localParamsTotal);
        }
        else {
            coder.addFragUniform("vec4", "u_localParams", this.localParamsTotal);
        }
        if (this.lightEnabled) {
            let lightParamIndex: number = 2;
            if(this.displacementMapEnabled) {
                lightParamIndex = 3;
            }
            coder.addDefine("LIGHT_LOCAL_PARAMS_INDEX",""+lightParamIndex);
        }

        if(this.pipeline != null) {
            this.pipeline.addShaderCode(LambertLightShaderCode);
            this.pipeline.build(coder, this.m_pipeTypes);
        }
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

    private m_displacementArray: Float32Array = null;
    private m_lightParamsArray: Float32Array = null;
    private m_localParamsTotal: number = 1;

    colorEnabled: boolean = true;

    diffuseMap: TextureProxy = null;
    normalMap: TextureProxy = null;
    displacementMap: TextureProxy = null;
    aoMap: TextureProxy = null;
    specularMap: TextureProxy = null;
    shadowMap: TextureProxy = null;

    lightEnabled: boolean = true;
    fogEnabled: boolean = false;

    constructor() {
        super();
    }

    initializeLocalData(): void {

        if(this.m_localParam == null) {

            this.m_localParamsTotal = 2;
            if(this.displacementMap != null) {
                this.m_localParamsTotal += 1;
            }
            if(this.lightEnabled) {
                this.m_localParamsTotal += 3;
            }
            this.m_localParam = new Float32Array(this.m_localParamsTotal * 4);
            this.m_localParam.set([1.0,1.0,1.0,1.0, 0.0,0.0,0.0,0.0]);
            let lightParamsIndex: number = 2;
            if(this.displacementMap != null) {
                this.m_displacementArray = this.m_localParam.subarray(8,12);
                this.m_displacementArray.set([10.0, 0.0, 0.0, 0.0]);
                lightParamsIndex += 1;
            }
            if(this.lightEnabled) {
                this.m_lightParamsArray = this.m_localParam.subarray(lightParamsIndex * 4);
                this.m_lightParamsArray.set(
                    [
                        0.5, 0.5, 0.5, 32.0,    // specular color rgb, pow value
                        0.7,0.3,                // light color value factor, specular value factor
                        0.001, 0.0001,          // attenuation factor 1, attenuation factor 2
                        0.3,0.7,                // base color value factor, light value factor
                        0.0, 0.0                // undefined, undefined
                    ]);
            }
        }
    }
    protected buildBuf(): void {
        if(this.m_localParam == null) {
            this.initializeLocalData();
        }
        let buf: LambertLightShaderBuffer = LambertLightShaderBuffer.GetInstance();

        buf.colorEnabled = this.colorEnabled;
        buf.diffuseMapEnabled = this.diffuseMap != null;
        buf.normalMapEnabled = this.normalMap != null;
        buf.displacementMapEnabled = this.displacementMap != null;
        buf.aoMapEnabled = this.aoMap != null;
        buf.specularMapEnabled = this.specularMap != null;
        buf.shadowReceiveEnabled = this.shadowMap != null;

        buf.lightEnabled = this.lightEnabled;
        buf.fogEnabled = this.fogEnabled;

        buf.localParamsTotal = this.m_localParamsTotal;

        let texList: TextureProxy[] = [];
        if(this.diffuseMap != null) texList.push(this.diffuseMap);
        if(this.normalMap != null && this.lightEnabled) texList.push(this.normalMap);
        if(this.displacementMap != null) texList.push(this.displacementMap);
        if(this.aoMap != null) texList.push(this.aoMap);
        if(this.specularMap != null && this.lightEnabled) texList.push(this.specularMap);
        if(this.shadowMap != null) texList.push(this.shadowMap);
        super.setTextureList(texList);
        buf.texturesTotal = texList.length;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return LambertLightShaderBuffer.GetInstance();
    }

    private m_localParam: Float32Array = null;
    setSpecularColor(color: Color4): void {
        if(this.m_lightParamsArray != null) {
            this.m_lightParamsArray[0] = color.r;
            this.m_lightParamsArray[1] = color.g;
            this.m_lightParamsArray[2] = color.b;
        }
    }
    setSpecularIntensity(Intensity: number): void {
        if(this.m_lightParamsArray != null) {
            this.m_lightParamsArray[3] = Intensity;
        }
    }
    /**
     * 光照之前的颜色和光照之后颜色混合因子设置
     * @param lightFactor 光照之前的颜色混合因子, default value is 0.7
     * @param specularFactor 光照之后颜色混合因子, default value is 0.3
     */
    setLightBlendFactor(baseColorFactor: number, lightFactor: number): void {
        if(this.m_lightParamsArray != null) {
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
        if(this.m_lightParamsArray != null) {
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
        if(this.m_lightParamsArray != null) {
            this.m_lightParamsArray[8] = baseColorFactor;
            this.m_lightParamsArray[9] = lightFactor;
        }
    }
    /**
     * 设置顶点置换贴图参数
     * @param scale 缩放值
     * @param bias 偏移量
     */
    setDisplacementParams(scale: number, bias: number): void {
        if(this.m_displacementArray != null) {
            this.m_displacementArray[0] = scale;
            this.m_displacementArray[1] = bias;
        }
    }
    setColor(factor: Color4, bias: Color4 = null): void {
        if(factor != null) {
            this.m_localParam[0] = factor.r;
            this.m_localParam[1] = factor.g;
            this.m_localParam[2] = factor.b;
            this.m_localParam[3] = factor.a;
        }
        if(bias != null) {
            this.m_localParam[4] = bias.r;
            this.m_localParam[5] = bias.g;
            this.m_localParam[6] = bias.b;
            this.m_localParam[7] = bias.a;
        }
    }
    setColorAlpha(a: number): void {
        this.m_localParam[3] = a;
    }
    
    createSelfUniformData(): ShaderUniformData {

        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_localParams"];
        oum.dataList = [this.m_localParam];
        return oum;
    }
    destroy(): void {
        super.destroy();
        this.m_localParam = null;
    }

}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
import IShaderUniformData from "../../../vox/material/IShaderUniformData";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

import { IMaterialDecorator } from "../../../vox/material/IMaterialDecorator";
import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { ShaderTextureBuilder } from "../../../vox/material/ShaderTextureBuilder";

import { SpecularMode } from "../pipeline/SpecularMode";
import { UniformComp } from "../component/UniformComp";
import { IMatrix4 } from "../../math/IMatrix4";

export default class LambertLightDecorator implements IMaterialDecorator {

    private m_uniqueName: string = "lambert";

    private m_parallaxParams: Float32Array = null;
    private m_parallaxParamIndex: number = 1;

    private m_lightParamsArray: Float32Array = null;
    private m_fragLocalParams: Float32Array = null;
    private m_fragLocalParamsTotal: number = 1;
    private m_lightParamsIndex: number = 1;

    /**
     * the  default  value is false
     */
    vertColorEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    premultiplyAlpha: boolean = false;
    /**
     * the  default  value is false
     */
    shadowReceiveEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    lightEnabled: boolean = true;
    /**
     * the  default  value is false
     */
    fogEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    envAmbientLightEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    brightnessOverlayEnabeld: boolean = false;
    /**
     * the default value is true
     */
    glossinessEnabeld: boolean = true;


    colorEnabled: boolean = true;
    normalEnabled: boolean = true;

    diffuseMap: IRenderTexture = null;
    diffuseMap2: IRenderTexture = null;
    normalMap: IRenderTexture = null;
    parallaxMap: IRenderTexture = null;
    aoMap: IRenderTexture = null;
    specularMap: IRenderTexture = null;
    specularMode: SpecularMode = SpecularMode.Default;


    diffuseMap2Matrix: IMatrix4 = null;
    vertUniform: UniformComp = null;
    constructor() {

    }
    
    buildBufParams(): void {
    }
    /**
     * user build textures list
     */
    buildTextureList(builder: ShaderTextureBuilder): void {

        builder.addDiffuseMap(this.diffuseMap);
        if (this.diffuseMap2 != null) {
            let coder = builder.getCodeBuilder();
            if (this.diffuseMap2Matrix) {
                coder.addDefine("VOX_USE_DIFFUSEMAP2_MAT", "1");
                coder.addVarying("vec4", "v_map2Pos");
                coder.addVertUniform("mat4", "u_map2ViewMat");
                coder.addUniqueNSKeyString("M2VM");
            }
            builder.add2DMap(this.diffuseMap2, "VOX_DIFFUSE_MAP2", !this.diffuseMap2Matrix, true, false);
        }
        builder.addNormalMap(this.normalMap);
        builder.addParallaxMap(this.parallaxMap, this.m_parallaxParamIndex);

        builder.addAOMap(this.aoMap);
        builder.addSpecularMap(this.specularMap);
    }
    buildShader(coder: IShaderCodeBuilder): void {
        
        coder.addFragUniform("vec4", "u_fragLocalParams", this.m_fragLocalParamsTotal);
        if (this.lightEnabled) {
            coder.addDefine("VOX_LIGHT_LOCAL_PARAMS_INDEX", "" + this.m_lightParamsIndex);
        }
        if (this.vertColorEnabled) {
            coder.addVertLayout("vec3", "a_cvs");
            coder.addVarying("vec3", "v_cv");
        }
    }

    /**
     * get shader code object uuid, it is defined in the system
     * @returns shader code object uuid
     */
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.Lambert;
    }
    /**
     * get custom shader code object
     * @returns shader code object
     */
    getShaderCodeObject(): IShaderCodeObject {
        return null;
        // return PBRShaderCode;
    }

    createUniformData(): IShaderUniformData {

        let sud: IShaderUniformData = new ShaderUniformData();
        sud.uniformNameList = ["u_fragLocalParams"];
        sud.dataList = [this.m_fragLocalParams];
        if (this.vertUniform != null) {
            this.vertUniform.buildShaderUniformData(sud);
        }
        if (this.diffuseMap2Matrix != null) {
            sud.uniformNameList.push("u_map2ViewMat");
            sud.dataList.push(this.diffuseMap2Matrix.getLocalFS32());
        }

        return sud;
    }
    
    getUniqueName(): string {
        return this.m_uniqueName;
    }

    initialize(): void {
        if (this.vertUniform != null) {
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

        this.m_uniqueName = "lambert";
        if (this.colorEnabled) {
            this.m_uniqueName += "Col";
        }
        this.m_uniqueName += this.m_fragLocalParamsTotal;
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
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_fragLocalParams[0] = pr;
        this.m_fragLocalParams[1] = pg;
        this.m_fragLocalParams[2] = pb;
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

    destroy(): void {

        this.m_fragLocalParams = null;

        this.vertUniform = null;
        this.diffuseMap2Matrix = null;

        this.diffuseMap = null;
        this.diffuseMap2 = null;
        this.normalMap = null;
        this.parallaxMap = null;
        this.aoMap = null;
        this.specularMap = null;
    }

}
export { SpecularMode, LambertLightDecorator };
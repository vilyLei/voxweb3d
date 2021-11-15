/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IAbstractShader from "../../../vox/material/IAbstractShader";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import { MaterialPipeType } from "../pipeline/MaterialPipeType";
import Color4 from "../Color4";
import TextureProxy from "../../texture/TextureProxy";
import { SpecularMode } from "./SpecularMode";
import { LambertLightShaderCode } from "../mcase/glsl/LambertLightShaderCode";

class AdvancedShaderCodeBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }

    private m_uniqueName: string = "";
    pipeTypes: MaterialPipeType[] = null;
    keysString: string = "";

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

    fragLocalParamsTotal: number = 2;
    texturesTotal: number = 0;
    parallaxParamIndex: number = 1;
    lightParamsIndex: number = 2;
    addDiffuseMap(): void {
        
    }
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
        
        this.m_uniqueName += "" + this.fragLocalParamsTotal;

        if (this.pipeline != null) {
            this.pipeTypes = [];
            if (this.lightEnabled) {
                this.pipeTypes.push(MaterialPipeType.GLOBAL_LIGHT);
            }
            if (this.shadowReceiveEnabled) {
                this.pipeTypes.push(MaterialPipeType.VSM_SHADOW);
            }
            if (this.fogEnabled) {
                this.pipeTypes.push(MaterialPipeType.FOG_EXP2);
            }

            this.pipeline.buildSharedUniforms(this.pipeTypes);
            this.pipeline.createKeys(this.pipeTypes);
            this.keysString = this.pipeline.getKeysString();
        }
    }

    private buildThisCode(): void {

        let coder = this.m_coder;
        coder.normalEanbled = true;
        coder.normalMapEanbled = true;
        coder.vertMatrixInverseEnabled = true;

        if (this.isTexEanbled()) {
            // 可以将纹理数据、逻辑构造过程放在 material pipeline 中
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
        coder.addVertUniform("vec4", "u_vertLocalParams", 2);
        coder.addFragUniform("vec4", "u_fragLocalParams", this.fragLocalParamsTotal);
        if (this.lightEnabled) {
            coder.addDefine("VOX_LIGHT_LOCAL_PARAMS_INDEX", "" + this.lightParamsIndex);
        }

        if (this.pipeline != null) {
            this.pipeline.addShaderCode( this.getShaderCodeObject() );
            this.pipeline.build(coder, this.pipeTypes);
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
        return this.m_uniqueName + this.keysString;
    }
    toString(): string {
        return "[LambertLightShaderBuffer()]";
    }

}

export { AdvancedShaderCodeBuffer };
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
import { ShadowMode } from "./ShadowMode";

class AdvancedShaderCodeBuffer extends ShaderCodeBuffer {
    private m_uniqueName: string = "";
    
    colorEnabled: boolean = true;
    specularMode: SpecularMode = SpecularMode.Default;

    fragLocalParamsTotal: number = 2;
    parallaxParamIndex: number = 1;
    lightParamsIndex: number = 2;

    constructor() {
        super();
    }
    
    reset(): void {
        
        super.reset();
        
        this.m_coder.normalEanbled = true;
        this.m_coder.normalMapEanbled = true;
        this.m_coder.vertMatrixInverseEnabled = true;

        this.m_texList = [];
        this.m_uniqueName = "LambertShd";
    }
    addDiffuseMap(map: TextureProxy): void {

        if(map != null) {

            this.m_texList.push(map);
            this.pipeline.appendKeyString("Tex");
            this.m_coder.addDiffuseMap();
        }
    }
    addNormalMap(map: TextureProxy): void {

        if(map != null) {
            if(this.lightEnabled) {
                
                this.m_texList.push(map);
                this.pipeline.appendKeyString("Nor");
                this.m_coder.addNormalMap();
            }
        }
    }
    addParallaxMap(map: TextureProxy): void {

        if(map != null) {
            if(this.lightEnabled) {

                this.m_texList.push(map);
                this.pipeline.appendKeyString("Para");
                this.m_coder.addParallaxMap( this.parallaxParamIndex );
            }
        }
    }

    addDisplacementMap(map: TextureProxy): void {

        if(map != null) {

            this.m_texList.push(map);
            this.pipeline.appendKeyString("Disp");
            this.m_coder.addDisplacementMap();
        }
    }

    addAOMap(map: TextureProxy): void {

        if(map != null) {

            this.m_texList.push(map);
            this.pipeline.appendKeyString("AO");
            this.m_coder.addAOMap();
        }
    }

    addSpecularMap(map: TextureProxy): void {

        if(map != null) {
            if(this.lightEnabled) {

                this.m_texList.push(map);
                this.pipeline.appendKeyString( "Spec" + this.specularMode );
                this.m_coder.addSpecularMap(this.specularMode);
            }
        }
    }
    addShadowMap(map: TextureProxy): void {

        if(map != null) {

            this.m_texList.push(map);
            this.pipeline.appendKeyString( "Shadow" );
            this.m_coder.addShadowMap();
        }
    }

    initialize(texEnabled: boolean): void {

        texEnabled = this.m_texList != null && this.m_texList.length > 0;
        super.initialize(texEnabled);
        if(this.colorEnabled) {
            this.m_uniqueName += "Col";
        }
        this.m_uniqueName += this.fragLocalParamsTotal;

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

    buildShader(): void {

        this.m_coder.addVertUniform("vec4", "u_vertLocalParams", 2);
        this.m_coder.addFragUniform("vec4", "u_fragLocalParams", this.fragLocalParamsTotal);
        if (this.lightEnabled) {
            this.m_coder.addDefine("VOX_LIGHT_LOCAL_PARAMS_INDEX", "" + this.lightParamsIndex);
        }
    }
    
    getShaderCodeObject(): IAbstractShader {
        return LambertLightShaderCode;
    }
    getFragShaderCode(): string {
        return this.m_coder.buildFragCode();
    }
    getVertShaderCode(): string {
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
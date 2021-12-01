/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
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

    buildFlag: boolean = true;
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
            if(this.buildFlag) this.m_coder.addDiffuseMap();
        }
    }
    addNormalMap(map: TextureProxy): void {

        if(map != null && this.lightEnabled) {             
            this.m_texList.push(map);
            if(this.buildFlag) this.m_coder.addNormalMap();
        }
    }
    addParallaxMap(map: TextureProxy): void {

        if(map != null && this.lightEnabled) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_coder.addParallaxMap( this.parallaxParamIndex );
        }
    }

    addDisplacementMap(map: TextureProxy): void {

        if(map != null) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_coder.addDisplacementMap();
        }
    }

    addAOMap(map: TextureProxy): void {

        if(map != null) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_coder.addAOMap();
        }
    }

    addSpecularMap(map: TextureProxy): void {

        if(map != null && this.lightEnabled) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_coder.addSpecularMap(this.specularMode);
        }
    }
    addShadowMap(map: TextureProxy): void {

        if(map != null) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_coder.addShadowMap();
        }
    }

    initialize(texEnabled: boolean): void {

        texEnabled = this.m_texList != null && this.m_texList.length > 0;
        super.initialize(texEnabled);
        if(this.colorEnabled) {
            this.m_uniqueName += "Col";
        }
        this.m_uniqueName += this.fragLocalParamsTotal;
    }

    buildShader(): void {

        this.m_coder.addVertUniform("vec4", "u_vertLocalParams", 2);
        this.m_coder.addFragUniform("vec4", "u_fragLocalParams", this.fragLocalParamsTotal);
        if (this.lightEnabled) {
            this.m_coder.addDefine("VOX_LIGHT_LOCAL_PARAMS_INDEX", "" + this.lightParamsIndex);
        }
    }
    
    getShaderCodeObject(): IShaderCodeObject {
        return LambertLightShaderCode;
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
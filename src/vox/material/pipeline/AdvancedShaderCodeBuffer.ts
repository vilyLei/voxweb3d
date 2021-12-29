/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {ShaderCodeUUID} from "../../../vox/material/ShaderCodeUUID";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import TextureProxy from "../../texture/TextureProxy";
import { SpecularMode } from "./SpecularMode";
import { ShadowMode } from "./ShadowMode";
import { UniformComp } from "../component/UniformComp";

class AdvancedShaderCodeBuffer extends ShaderCodeBuffer {
    private m_uniqueName: string = "";
    
    colorEnabled: boolean = true;
    specularMode: SpecularMode = SpecularMode.Default;

    fragLocalParamsTotal: number = 2;
    lightParamsIndex: number = 2;

    normalEnabled: boolean = true;
    buildFlag: boolean = true;
    
    vertUniform: UniformComp = null;

    constructor() {
        super();
    }
    
    reset(): void {
        
        super.reset();
        
        this.m_coder.normalEnabled = true;
        this.m_coder.vertMatrixInverseEnabled = true;

        this.m_texList = [];
        this.m_uniqueName = "LambertShd";
    }
    addDiffuseMap(map: TextureProxy): void {

        if(map != null) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_uniform.addDiffuseMap();
        }
    }
    addNormalMap(map: TextureProxy): void {

        if(map != null && this.lightEnabled) {             
            this.m_texList.push(map);
            if(this.buildFlag) this.m_uniform.addNormalMap();
        }
    }
    addParallaxMap(map: TextureProxy, parallaxParamIndex: number = 0): void {

        if(map != null && this.lightEnabled) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_uniform.addParallaxMap( parallaxParamIndex );
        }
    }

    addDisplacementMap(map: TextureProxy, displacementParamIndex: number = 0): void {

        if(map != null) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_uniform.addDisplacementMap(displacementParamIndex);
        }
    }

    addAOMap(map: TextureProxy): void {

        if(map != null) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_uniform.addAOMap();
        }
    }

    addSpecularMap(map: TextureProxy): void {

        if(map != null && this.lightEnabled) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_uniform.addSpecularMap(this.specularMode);
        }
    }
    addShadowMap(map: TextureProxy): void {

        if(map != null) {
            this.m_texList.push(map);
            if(this.buildFlag) this.m_uniform.addShadowMap(ShadowMode.VSM);
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

        if(this.vertUniform != null) {
            this.vertUniform.use(this.m_coder);
        }        
        this.m_coder.addFragUniform("vec4", "u_fragLocalParams", this.fragLocalParamsTotal);
        if (this.lightEnabled) {
            this.m_coder.addDefine("VOX_LIGHT_LOCAL_PARAMS_INDEX", "" + this.lightParamsIndex);
        }
    }
    
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.Lambert;
    }
    getUniqueShaderName(): string {
        if(this.vertUniform != null) {
            return this.m_uniqueName + this.keysString + this.vertUniform.getUniqueNSKeyString();
        }
        else {
            return this.m_uniqueName + this.keysString;
        }
    }
    toString(): string {
        return "[LambertLightShaderBuffer()]";
    }

}

export { AdvancedShaderCodeBuffer };
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import ShaderCodeBuilder from "../../vox/material/code/ShaderCodeBuilder";
import UniformConst from "../../vox/material/UniformConst";
import TextureProxy from '../../vox/texture/TextureProxy';
import { ShadowMode } from "../../vox/material/pipeline/ShadowMode";

export default class PBRShaderDecorator {
    constructor() {
    }

    private m_uniqueName: string = "PBRShd";
    
    codeBuilder: ShaderCodeBuilder = null;
    specularEnvMap: TextureProxy = null;
    diffuseMap: TextureProxy = null;
    normalMap: TextureProxy = null;
    aoMap: TextureProxy = null;
    mirrorMap: TextureProxy = null;
    indirectEnvMap: TextureProxy = null;
    shadowMap: TextureProxy = null;
    parallaxMap: TextureProxy = null;
    roughnessMap: TextureProxy = null;

    woolEnabled: boolean = true;
    toneMappingEnabled: boolean = true;
    specularEnvMapEnabled: boolean = true;
    scatterEnabled: boolean = true;
    specularBleedEnabled: boolean = true;
    metallicCorrection: boolean = true;
    gammaCorrection: boolean = true;
    absorbEnabled: boolean = false;
    normalNoiseEnabled: boolean = false;
    pixelNormalNoiseEnabled: boolean = false;
    mirrorProjEnabled: boolean = false;
    mirrorMapLodEnabled: boolean = false;
    diffuseMapEnabled: boolean = false;
    normalMapEnabled: boolean = false;
    aoMapEnabled: boolean = false;
    indirectEnvMapEnabled: boolean = false;
    hdrBrnEnabled: boolean = false;
    vtxFlatNormal: boolean = false;

    lightEnabled: boolean = true;
    shadowReceiveEnabled: boolean = false;
    fogEnabled: boolean = false;
    texturesTotal: number = 1;
    
    fragLocalParamsTotal: number = 2;
    parallaxParamIndex: number = 2;

    createTextureList(): TextureProxy[] {
        
        let coder: ShaderCodeBuilder = this.codeBuilder;
        let uniform = coder.uniform;
        let texList: TextureProxy[] = [];

        if (this.specularEnvMapEnabled && this.specularEnvMap != null ) {
            texList.push( this.specularEnvMap );
            uniform.addspecularEnvMap(true);
            // console.log("VOX_ENV_MAP");
        }
        if ( this.diffuseMapEnabled && this.diffuseMap != null ) {
            texList.push( this.diffuseMap );
            uniform.addDiffuseMap();
            // console.log("VOX_DIFFUSE_MAP");
        }
        if (this.normalMapEnabled && this.normalMap != null) {
            texList.push( this.normalMap );
            uniform.addNormalMap();
            // console.log("VOX_NORMAL_MAP");
        }
        if (this.aoMapEnabled && this.aoMap != null) {
            texList.push( this.aoMap );
            uniform.addAOMap();
            // console.log("VOX_AO_MAP");
        }
        if (this.mirrorProjEnabled && this.mirrorMap != null) {
            texList.push( this.mirrorMap );
            uniform.add2DMap("VOX_MIRROR_PROJ_MAP",true, true ,false);
            // console.log("VOX_MIRROR_PROJ_MAP");
        }
        if ( this.indirectEnvMapEnabled && this.indirectEnvMap != null) {
            texList.push( this.indirectEnvMap );
            uniform.addCubeMap("VOX_INDIRECT_ENV_MAP",true ,false);
            // console.log("VOX_INDIRECT_ENV_MAP");
        }

        if (this.shadowReceiveEnabled && this.shadowMap != null) {
            texList.push( this.shadowMap );
            uniform.addShadowMap(ShadowMode.VSM);
            // console.log("VOX_VSM_SHADOW_MAP");
        }
        
        if(this.parallaxMap != null) {
            texList.push( this.parallaxMap );
            uniform.addParallaxMap( this.parallaxParamIndex );
        }
        if(this.roughnessMap != null) {
            texList.push( this.roughnessMap );
            uniform.addRoughnessMap();
        }

        this.texturesTotal = texList.length;
        //  console.log("this.texturesTotal: ",this.texturesTotal);
        return texList;
    }
    copyFrom(src: PBRShaderDecorator): void {

        this.woolEnabled = src.woolEnabled;
        this.toneMappingEnabled = src.toneMappingEnabled;
        this.specularEnvMapEnabled = src.specularEnvMapEnabled;
        this.scatterEnabled = src.scatterEnabled;
        this.specularBleedEnabled = src.specularBleedEnabled;
        this.metallicCorrection = src.metallicCorrection;
        this.gammaCorrection = src.gammaCorrection;
        this.absorbEnabled = src.absorbEnabled;
        this.normalNoiseEnabled = src.normalNoiseEnabled;
        this.pixelNormalNoiseEnabled = src.pixelNormalNoiseEnabled;
        this.mirrorProjEnabled = src.mirrorProjEnabled;
        this.mirrorMapLodEnabled = src.mirrorMapLodEnabled;
        this.diffuseMapEnabled = src.diffuseMapEnabled;
        this.normalMapEnabled = src.normalMapEnabled;
        this.aoMapEnabled = src.aoMapEnabled;
        this.indirectEnvMapEnabled = src.indirectEnvMapEnabled;
        this.shadowReceiveEnabled = src.shadowReceiveEnabled;
        this.fogEnabled = src.fogEnabled;
        this.hdrBrnEnabled = src.hdrBrnEnabled;
        this.vtxFlatNormal = src.vtxFlatNormal;
        
        this.fragLocalParamsTotal = src.fragLocalParamsTotal;
        
        if(this.specularEnvMap == null) this.specularEnvMap = src.specularEnvMap;
        if(this.diffuseMap == null) this.diffuseMap = src.diffuseMap;
        if(this.normalMap == null) this.normalMap = src.normalMap;
        if(this.aoMap == null) this.aoMap = src.aoMap;
        if(this.mirrorMap == null) this.mirrorMap = src.mirrorMap;
        if(this.indirectEnvMap == null && this.indirectEnvMapEnabled) this.indirectEnvMap = src.indirectEnvMap;

        if(this.shadowMap == null && this.shadowReceiveEnabled) this.shadowMap = src.shadowMap;
        
        if(this.parallaxMap == null) this.parallaxMap = src.parallaxMap;
        if(this.roughnessMap == null) this.roughnessMap = src.roughnessMap;
        // if(this.specularMap == null) this.specularMap = src.specularMap;
        
        this.lightEnabled = src.lightEnabled;
        this.texturesTotal = src.texturesTotal;

        //this.m_uniqueName = src.m_uniqueName;
    }
    buildShader(): void {

        let coder: ShaderCodeBuilder = this.codeBuilder;

        coder.normalMapEnabled = this.normalMapEnabled;
        coder.mapLodEnabled = true;

        coder.useHighPrecious();

        let mirrorProjEnabled: boolean = this.mirrorProjEnabled && this.texturesTotal > 0;
        if (this.normalNoiseEnabled) coder.addDefine("VOX_NORMAL_NOISE");

        if (this.woolEnabled) coder.addDefine("VOX_WOOL");
        if (this.toneMappingEnabled) coder.addDefine("VOX_TONE_MAPPING");
        if (this.scatterEnabled) coder.addDefine("VOX_SCATTER");
        if (this.specularBleedEnabled) coder.addDefine("VOX_SPECULAR_BLEED");
        if (this.metallicCorrection) coder.addDefine("VOX_METALLIC_CORRECTION");
        if (this.gammaCorrection) coder.addDefine("VOX_GAMMA_CORRECTION");
        if (this.absorbEnabled) coder.addDefine("VOX_ABSORB");
        if (this.pixelNormalNoiseEnabled) coder.addDefine("VOX_PIXEL_NORMAL_NOISE");

        if (this.mirrorMapLodEnabled) coder.addDefine("VOX_MIRROR_MAP_LOD", "1");
        if (this.hdrBrnEnabled) coder.addDefine("VOX_HDR_BRN", "1");
        if (this.vtxFlatNormal) coder.addDefine("VOX_VTX_FLAT_NORMAL", "1");

        coder.addFragUniform("vec4", "u_fragLocalParams", this.fragLocalParamsTotal);
        coder.addFragUniform("vec4", "u_pbrParams", 4);

        if (mirrorProjEnabled) {
            coder.addFragUniformParam( UniformConst.StageParam );
            coder.addFragUniform("vec4", "u_mirrorParams", 2);
        }
        coder.vertMatrixInverseEnabled = true;

    }
    
    getUniqueShaderName(): string {

        let ns: string = this.m_uniqueName;

        if (this.woolEnabled) ns += "_wl";
        if (this.toneMappingEnabled) ns += "TM";
        if (this.specularEnvMapEnabled) ns += "EnvM";
        if (this.scatterEnabled) ns += "Sct";
        if (this.specularBleedEnabled) ns += "SpecBl";
        if (this.metallicCorrection) ns += "MetCorr";
        if (this.gammaCorrection) ns += "GmaCorr";
        if (this.absorbEnabled) ns += "Absorb";
        if (this.pixelNormalNoiseEnabled) ns += "PNNoise";
        if (this.mirrorProjEnabled) ns += "MirPrj";
        if (this.normalNoiseEnabled) ns += "NNoise";
        if (this.indirectEnvMapEnabled) ns += "IndirEnv";
        if (this.normalMapEnabled) ns += "NorMap";
        if (this.aoMapEnabled) ns += "AoMap";
        if (this.shadowReceiveEnabled) ns += "Shadow";
        if (this.fogEnabled) ns += "Fog";
        if (this.hdrBrnEnabled) ns += "HdrBrn";
        if (this.vtxFlatNormal) ns += "vtxFlagN";
        console.log("getUNS(), this.texturesTotal: ",this.texturesTotal);
        ns += "_T" + this.texturesTotal;
        this.m_uniqueName = ns;

        return ns;
    }
    toString(): string {
        return "[PBRShaderBuffer()]";
    }
}

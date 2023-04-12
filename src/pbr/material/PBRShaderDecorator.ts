/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import UniformConst from "../../vox/material/UniformConst";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import PBRDecoratorParam from "./PBRDecoratorParam";

export default class PBRShaderDecorator {
    constructor() {
    }

    private m_uniqueName = "PBRShd";

    specularEnvMap: IRenderTexture = null;
    diffuseMap: IRenderTexture = null;
    normalMap: IRenderTexture = null;
    mirrorMap: IRenderTexture = null;
    indirectEnvMap: IRenderTexture = null;
    parallaxMap: IRenderTexture = null;
    aoMap: IRenderTexture = null;
    roughnessMap: IRenderTexture = null;
    metalhnessMap: IRenderTexture = null;
	/**
	 * Index of Refraction values
	 */
    iorMap: IRenderTexture = null;

    /**
     * add ao, roughness, metalness map uniform code
     */
    armMap: IRenderTexture = null;

    glossinessEnabeld = true;
    woolEnabled = true;
    toneMappingEnabled = true;
    specularEnvMapEnabled = true;
    scatterEnabled = true;
    specularBleedEnabled = true;
    metallicCorrection = true;
    gammaCorrection = true;
    absorbEnabled = false;
    normalNoiseEnabled = false;
    pixelNormalNoiseEnabled = false;
    mirrorProjEnabled = false;
    mirrorMapLodEnabled = false;
    diffuseMapEnabled = false;
    normalMapEnabled = false;
    aoMapEnabled = false;
    indirectEnvMapEnabled = false;
    hdrBrnEnabled = false;
    vtxFlatNormal = false;

    lightEnabled = true;
    shadowReceiveEnabled = false;
    fogEnabled = false;
    depthFogEnabled = false;
    texturesTotal = 1;

    fragLocalParamsTotal = 2;
    parallaxParamIndex = 2;

	initWithParam(param: PBRDecoratorParam): void {

		this.specularEnvMapEnabled = param.specularEnvMapEnabled;
		this.diffuseMapEnabled = param.diffuseMapEnabled;
		this.mirrorProjEnabled = param.mirrorProjEnabled;
		this.indirectEnvMapEnabled = param.indirectEnvMapEnabled;
		this.aoMapEnabled = param.aoMapEnabled;
		this.scatterEnabled = param.scatterEnabled;

		this.specularEnvMap = param.specularEnvMap;
		this.diffuseMap = param.diffuseMap;
		this.normalMap = param.normalMap;
		this.mirrorMap = param.mirrorMap;
		this.indirectEnvMap = param.indirectEnvMap;
		this.parallaxMap = param.parallaxMap;
		this.aoMap = param.aoMap;
		this.roughnessMap = param.roughnessMap;
		this.metalhnessMap = param.metalhnessMap;
		this.iorMap = param.iorMap;
		this.armMap = param.armMap;
	}
    createTextureList(coder: IShaderCodeBuilder): IRenderTexture[] {

        let uniform = coder.uniform;
        let texList: IRenderTexture[] = [];
        if(this.armMap != null) {
            this.aoMapEnabled = true;
        }

        if (this.specularEnvMapEnabled && this.specularEnvMap ) {
            texList.push( this.specularEnvMap );
            uniform.addSpecularEnvMap(true);
            // console.log("VOX_ENV_MAP");
        }
        if ( this.diffuseMapEnabled && this.diffuseMap ) {
            texList.push( this.diffuseMap );
            uniform.addDiffuseMap();
            // console.log("VOX_DIFFUSE_MAP");
        }
        if (this.normalMapEnabled && this.normalMap) {
            texList.push( this.normalMap );
            uniform.addNormalMap();
            // console.log("VOX_NORMAL_MAP");
        }

        if(this.parallaxMap) {
            texList.push( this.parallaxMap );
            uniform.addParallaxMap( this.parallaxParamIndex );
        }
        if (this.aoMapEnabled && this.aoMap) {
            texList.push( this.aoMap );
            uniform.addAOMap();
            // console.log("VOX_AO_MAP");
        }
        if(this.roughnessMap) {
            texList.push( this.roughnessMap );
            uniform.addRoughnessMap();
        }
        if(this.metalhnessMap) {
            texList.push( this.metalhnessMap );
            uniform.addMetalnessMap();
        }
        if(this.armMap) {
            texList.push( this.armMap );
            uniform.addARMMap();
        }
        if(this.iorMap) {
            texList.push( this.iorMap );
            uniform.addIORMap();
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

        if(this.parallaxMap == null) this.parallaxMap = src.parallaxMap;
        if(this.roughnessMap == null) this.roughnessMap = src.roughnessMap;
        // if(this.specularMap == null) this.specularMap = src.specularMap;

        this.lightEnabled = src.lightEnabled;
        this.texturesTotal = src.texturesTotal;

        //this.m_uniqueName = src.m_uniqueName;
    }
    buildShader(coder: IShaderCodeBuilder): void {

        //let coder: ShaderCodeBuilder = this.codeBuilder;

        coder.normalMapEnabled = this.normalMapEnabled;
        coder.mapLodEnabled = true;

        coder.useHighPrecious();

        let mirrorProjEnabled = this.mirrorProjEnabled && this.texturesTotal > 0;
        if (this.normalNoiseEnabled) coder.addDefine("VOX_NORMAL_NOISE","1");

        if (this.woolEnabled) coder.addDefine("VOX_WOOL","1");
        if (this.toneMappingEnabled) coder.addDefine("VOX_TONE_MAPPING","1");
        if (this.scatterEnabled) coder.addDefine("VOX_SCATTER","1");
        if (this.specularBleedEnabled) coder.addDefine("VOX_SPECULAR_BLEED","1");
        if (this.metallicCorrection) coder.addDefine("VOX_METALLIC_CORRECTION","1");
        if (this.gammaCorrection) coder.addDefine("VOX_GAMMA_CORRECTION","1");
        if (this.absorbEnabled) coder.addDefine("VOX_ABSORB","1");
        if (this.pixelNormalNoiseEnabled) coder.addDefine("VOX_PIXEL_NORMAL_NOISE","1");

        if (this.mirrorMapLodEnabled) coder.addDefine("VOX_MIRROR_MAP_LOD", "1");
        if (this.hdrBrnEnabled) coder.addDefine("VOX_HDR_BRN", "1");
        if (this.vtxFlatNormal) coder.addDefine("VOX_VTX_FLAT_NORMAL", "1");
        if (this.depthFogEnabled) coder.addDefine("VOX_DEPTH_FOG", "1");

        coder.addFragUniform("vec4", "u_fragLocalParams", this.fragLocalParamsTotal);
        coder.addFragUniform("vec4", "u_pbrParams", 4);

        if (mirrorProjEnabled) {
            coder.addFragUniformParam( UniformConst.StageParam );
            coder.addFragUniform("vec4", "u_mirrorParams", 2);
        }
        coder.vertMatrixInverseEnabled = true;

    }

    getUniqueShaderName(): string {

        let ns = this.m_uniqueName;

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

        ns += "_T" + this.texturesTotal;
        this.m_uniqueName = ns;

        return ns;
    }
}

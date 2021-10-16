/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { PBRShaderCode } from "./glsl/PBRShaderCode";

import ShaderCodeBuilder2 from "../../vox/material/code/ShaderCodeBuilder2";
import UniformConst from "../../vox/material/UniformConst";
import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";

export default class PBRShaderDecorator {
    constructor() {
    }

    codeBuilder: ShaderCodeBuilder2 = null;
    pipeline: MaterialPipeline = null;

    private m_uniqueName: string = "PBRShd";
    private m_has2DMap: boolean = false;
    private m_pipeTypes: MaterialPipeType[] = null;
    private m_keysString: string = "";

    woolEnabled: boolean = true;
    toneMappingEnabled: boolean = true;
    envMapEnabled: boolean = true;
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
    shadowReceiveEnabled: boolean = false;
    fogEnabled: boolean = false;
    hdrBrnEnabled: boolean = false;
    vtxFlatNormal: boolean = false;

    lightEnabled: boolean = true;

    texturesTotal: number = 1;

    initialize(): void {
        
        if(this.pipeline != null) {

            this.m_pipeTypes = [];
            if (this.lightEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.GLOBAL_LIGHT );
            }
            if(this.shadowReceiveEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.VSM_SHADOW );
            }
            if(this.fogEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.FOG_EXP2 );
            }
            this.pipeline.createKeys(this.m_pipeTypes);
            this.m_keysString = this.pipeline.getKeysString();
        }
    }
    copyFrom(src: PBRShaderDecorator): void {

        this.woolEnabled = src.woolEnabled;
        this.toneMappingEnabled = src.toneMappingEnabled;
        this.envMapEnabled = src.envMapEnabled;
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

        this.lightEnabled = src.lightEnabled;

        this.texturesTotal = src.texturesTotal;

        this.m_uniqueName = src.m_uniqueName;
        this.m_has2DMap = src.m_has2DMap;
    }
    private buildThisCode(): void {

        let coder: ShaderCodeBuilder2 = this.codeBuilder;

        coder.normalMapEanbled = this.normalMapEnabled;
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

        let texIndex: number = 0;
        console.log("this.envMapEnabled,this.texturesTotal: ", this.envMapEnabled, this.texturesTotal);
        if (this.envMapEnabled && this.texturesTotal > 0) {
            coder.addTextureSampleCube("VOX_ENV_MAP");
        }
        if (this.diffuseMapEnabled) {
            coder.addTextureSample2D("VOX_DIFFUSE_MAP");
        }
        if (this.normalMapEnabled) {
            coder.addTextureSample2D("VOX_NORMAL_MAP");
        }
        if (this.aoMapEnabled) {
            coder.addTextureSample2D("VOX_AO_MAP");
        }

        if (mirrorProjEnabled) {
            coder.addTextureSample2D("VOX_MIRROR_PROJ_MAP");
        }
        if (this.indirectEnvMapEnabled) {
            coder.addTextureSampleCube("VOX_INDIRECT_ENV_MAP");
        }
        console.log("this.texturesTotal: ", this.texturesTotal, ", texIndex: ", texIndex);
        if (this.mirrorMapLodEnabled) coder.addDefine("VOX_MIRROR_MAP_LOD", "1");
        if (this.hdrBrnEnabled) coder.addDefine("VOX_HDR_BRN", "1");
        if (this.vtxFlatNormal) coder.addDefine("VOX_VTX_FLAT_NORMAL", "1");

        coder.addVertLayout("vec3", "a_vs");

        this.m_has2DMap = coder.isHaveTexture2D();
        if (this.m_has2DMap) {
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVertUniform("vec4", "u_paramLocal", 2);
            coder.addVarying("vec2", "v_uv");
        }
        coder.addVertLayout("vec3", "a_nvs");

        coder.addFragUniform("vec4", "u_paramLocal", 2);
        coder.addFragUniform("vec4", "u_albedo");
        coder.addFragUniform("vec4", "u_params", 4);

        coder.addVarying("vec3", "v_worldPos");
        coder.addVarying("vec3", "v_worldNormal");

        coder.addFragUniformParam(UniformConst.CameraPosParam);

        if (mirrorProjEnabled) {
            coder.addFragUniformParam(UniformConst.StageParam);
            coder.addFragUniform("vec4", "u_mirrorParams", 2);
        }
        coder.vertMatrixInverseEnabled = true;

        coder.useVertSpaceMats(true, true, true);

        coder.addFragOutput("vec4", "FragColor0");

        if (this.shadowReceiveEnabled) {
            coder.addTextureSample2D("VOX_VSM_MAP", false);
        }

        coder.addShaderObject( PBRShaderCode );

        if(this.pipeline != null) {
            this.pipeline.build(coder, this.m_pipeTypes);
        }
    }
    getFragShaderCode(): string {
        this.buildThisCode();
        return this.codeBuilder.buildFragCode();
    }
    getVtxShaderCode(): string {
        return this.codeBuilder.buildVertCode();
    }
    getUniqueShaderName(): string {

        let ns: string = this.m_uniqueName;

        if (this.woolEnabled) ns += "_wl";
        if (this.toneMappingEnabled) ns += "TM";
        if (this.envMapEnabled) ns += "EnvM";
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
        ns += this.m_keysString;

        ns += "_T" + this.texturesTotal;
        this.m_uniqueName = ns;

        return ns;
    }
    toString(): string {
        return "[PBRShaderBuffer()]";
    }
}

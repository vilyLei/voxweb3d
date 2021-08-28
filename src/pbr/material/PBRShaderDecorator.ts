/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { PBRShaderCode } from "./glsl/PBRShaderCode";

import ShaderCodeBuilder2 from "../../vox/material/code/ShaderCodeBuilder2";
import GlobalLightData from "../../light/base/GlobalLightData";
import ShadowVSMData from "../../shadow/vsm/material/ShadowVSMData";
import EnvLightData from "../../light/base/EnvLightData";
import UniformConst from "../../vox/material/UniformConst";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";

export default class PBRShaderDecorator {
    constructor() {
    }
    
    private static s_codeBuilder:ShaderCodeBuilder2 = new ShaderCodeBuilder2();

    private m_uniqueName: string = "PBRShd";
    private m_has2DMap: boolean = false;

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

    pointLightsTotal: number = 4;
    parallelLightsTotal: number = 0;
    texturesTotal: number = 1;

    lightData: GlobalLightData = null;
    vsmData: ShadowVSMData = null;
    envData: EnvLightData = null;

    initialize(): void {
        if(this.lightData != null) {
            this.pointLightsTotal = this.lightData.getPointLightTotal();
            this.parallelLightsTotal = this.lightData.getDirecLightTotal();
        }
        else {
            this.pointLightsTotal = 0;
            this.parallelLightsTotal = 0;
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
    
        this.pointLightsTotal = src.pointLightsTotal;
        this.parallelLightsTotal = src.parallelLightsTotal;
        this.texturesTotal = src.texturesTotal;
    
        this.lightData = src.lightData;
        this.vsmData = src.vsmData;
        this.envData = src.envData;
        
        this.m_uniqueName = src.m_uniqueName;
        this.m_has2DMap = src.m_has2DMap;
    }
    private buildThisCode():void
    {
        let coder:ShaderCodeBuilder2 = PBRShaderDecorator.s_codeBuilder;
        coder.reset();
        coder.normalMapEanbled = this.normalMapEnabled;
        coder.mapLodEnabled = true;
        
        coder.useHighPrecious();
        
        let mirrorProjEnabled: boolean = this.mirrorProjEnabled && this.texturesTotal > 0;
        if (this.normalNoiseEnabled) coder.addDefine("VOX_NORMAL_NOISE");

        // 毛料表面效果
        if (this.woolEnabled) coder.addDefine("VOX_WOOL");
        if (this.toneMappingEnabled) coder.addDefine("VOX_TONE_MAPPING");
        if (this.scatterEnabled) coder.addDefine("VOX_SCATTER");
        if (this.specularBleedEnabled) coder.addDefine("VOX_SPECULAR_BLEED");
        if (this.metallicCorrection) coder.addDefine("VOX_METALLIC_CORRECTION");
        if (this.gammaCorrection) coder.addDefine("VOX_GAMMA_CORRECTION");
        if (this.absorbEnabled) coder.addDefine("VOX_ABSORB");
        if (this.pixelNormalNoiseEnabled) coder.addDefine("VOX_PIXEL_NORMAL_NOISE");
        
        let texIndex: number = 0;
        console.log("this.envMapEnabled,this.texturesTotal: ",this.envMapEnabled,this.texturesTotal);
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
        console.log("this.texturesTotal: ", this.texturesTotal, ", texIndex: ",texIndex);
        if (this.mirrorMapLodEnabled) coder.addDefine("VOX_MIRROR_MAP_LOD", "1");
        if (this.hdrBrnEnabled) coder.addDefine("VOX_HDR_BRN", "1");
        if (this.vtxFlatNormal) coder.addDefine("VOX_VTX_FLAT_NORMAL", "1");
        
        let lightsTotal: number = this.pointLightsTotal + this.parallelLightsTotal;
        if (this.pointLightsTotal > 0)  coder.addDefine("VOX_POINT_LIGHTS_TOTAL", ""+this.pointLightsTotal);
        else coder.addDefine("VOX_POINT_LIGHTS_TOTAL","0");
        if (this.parallelLightsTotal > 0) coder.addDefine("VOX_PARALLEL_LIGHTS_TOTAL", ""+this.parallelLightsTotal);
        else coder.addDefine("VOX_PARALLEL_LIGHTS_TOTAL","0");
        if (lightsTotal > 0) coder.addDefine("VOX_LIGHTS_TOTAL",""+lightsTotal);
        else coder.addDefine("VOX_LIGHTS_TOTAL", "0");

        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec3","a_nvs");
        
        this.m_has2DMap = coder.isHaveTexture2D();
        if (this.m_has2DMap) {
            coder.addVertLayout("vec2","a_uvs");
            coder.addVertUniform("vec4","u_paramLocal",2);
            coder.addVarying("vec2","v_uv");
        }
        coder.addFragUniform("vec4","u_paramLocal",2);
        coder.addFragUniform("vec4","u_albedo");
        coder.addFragUniform("vec4","u_params", 4);
        
        coder.addVarying("vec3","v_worldPos");
        coder.addVarying("vec3","v_worldNormal");
        coder.addVarying("vec3","v_camPos");

        if (mirrorProjEnabled) {
            coder.addFragUniformParam(UniformConst.StageParam);
            coder.addFragUniform("vec4","u_mirrorParams",2);
        }
        if(lightsTotal > 0) {
            this.lightData.useUniforms( coder );
        }
        if(this.fogEnabled && this.envData != null) {
            this.envData.useUniformsForFog( coder );
        }

        coder.vertMatrixInverseEnabled = true;
        
        coder.useVertSpaceMats(true,true,true);

        coder.addFragOutput("vec4","FragOutColor");
        if(this.shadowReceiveEnabled && this.vsmData != null) {
            this.vsmData.useUniforms( coder );
            coder.addTextureSample2D("VOX_VSM_MAP",false);
        }

    }
    getFragShaderCode(): string {
        
        this.buildThisCode();
        let coder:ShaderCodeBuilder2 = PBRShaderDecorator.s_codeBuilder;

        coder.addFragHeadCode(PBRShaderCode.frag_head);
        coder.addFragMainCode(PBRShaderCode.frag_body);
        return coder.buildFragCode();
    }
    getVtxShaderCode(): string {

        let coder:ShaderCodeBuilder2 = PBRShaderDecorator.s_codeBuilder;
        coder.addVertHeadCode(PBRShaderCode.vert_head);
        coder.addVertMainCode(PBRShaderCode.vert_body);

        return coder.buildVertCode();
    }
    
    createSharedUniforms():ShaderGlobalUniform[]
    {
        let glu: ShaderGlobalUniform;
        let list: ShaderGlobalUniform[] = [];
        
        if(this.lightData != null) {
            glu = this.lightData.getGlobalUinform();
            glu.uns = this.getUniqueShaderName();
            list.push(glu);
        }
        if(this.shadowReceiveEnabled && this.vsmData != null) {
            glu = this.vsmData.getGlobalUinform();
            glu.uns = this.getUniqueShaderName();
            list.push(glu);
        }
        if(this.fogEnabled && this.envData != null) {
            glu = this.envData.getGlobalUinform();
            glu.uns = this.getUniqueShaderName();
            list.push(glu);
        }
        return list.length > 0 ? list : null;
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

        if (this.pointLightsTotal > 0) ns += "LP" + this.pointLightsTotal;
        if (this.parallelLightsTotal > 0) ns += "LD" + this.parallelLightsTotal;

        ns += "_T" + this.texturesTotal;
        this.m_uniqueName = ns;
        
        return ns;
    }
    toString(): string {
        return "[PBRShaderBuffer()]";
    }
}

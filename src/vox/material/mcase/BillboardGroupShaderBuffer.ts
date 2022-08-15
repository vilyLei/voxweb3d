/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import BillboardFSBase from "../../../vox/material/mcase/BillboardFSBase";
import { MaterialPipeType } from "../pipeline/MaterialPipeType";
import IShaderCodeObject from "../IShaderCodeObject";
import { BillboardGroupShaderCode } from "../mcase/glsl/BillboardGroupShaderCode";

export default class BillboardGroupShaderBuffer extends ShaderCodeBuffer {

    private static s_billFS: BillboardFSBase = new BillboardFSBase();
    protected m_clipEnabled: boolean = false;
    protected m_hasOffsetColorTex: boolean = false;
    protected m_useRawUVEnabled: boolean = false
    protected m_brightnessEnabled: boolean = false;

    protected m_uniqueName: string = "";

    clipMixEnabled: boolean = false;
    brightnessEnabled: boolean = false;

    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "BillboardGroupShader";
        if (this.clipMixEnabled) this.m_uniqueName += "Mix";
        this.m_uniqueName += this.brightnessEnabled ? "Brn" : "Alp";

        this.adaptationShaderVersion = false;
    }
    setParam(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, hasOffsetColorTex: boolean): void {
        this.m_brightnessEnabled = brightnessEnabled;
        BillboardGroupShaderBuffer.s_billFS.setBrightnessAndAlpha(brightnessEnabled, alphaEnabled);
        this.m_clipEnabled = clipEnabled;
        this.m_hasOffsetColorTex = hasOffsetColorTex;
    }
    buildVertShd(): void {
    }
    getShaderCodeObject(): IShaderCodeObject {
        return BillboardGroupShaderCode;
    }
    buildShader(): void {

        this.m_coder.autoBuildHeadCodeEnabled = false;
        this.buildFragShd();
        this.buildVertShd();
    }

    buildFragShd(): void {

        if (this.brightnessEnabled) {
            let fogEnabled: boolean = this.fogEnabled;
            if (this.pipeline != null) {
                fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG_EXP2);
                fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG);
            }
            this.brightnessOverlayEnabeld = fogEnabled;
        }

        let coder = this.m_coder;
        this.m_uniform.addDiffuseMap();
        if (this.m_hasOffsetColorTex) {
            this.m_uniform.add2DMap("VOX_OFFSET_COLOR_MAP");
            if (this.m_useRawUVEnabled) {
                coder.addDefine("VOX_USE_RAW_UV");
                coder.addVarying("vec4", "v_uv");
            }
        }
        coder.addVarying("vec4", "v_colorMult");
        coder.addVarying("vec4", "v_colorOffset");
        coder.addVarying("vec4", "v_texUV");
        coder.addVarying("vec4", "v_factor");
        if (this.m_clipEnabled) {
            coder.addDefine("VOX_USE_CLIP");
            if (this.clipMixEnabled) {
                coder.addDefine("VOX_USE_CLIP_MIX");
            }
        }
        coder.addDefine("FADE_VAR", "v_factor");
        coder.addDefine("FADE_STATUS", "" + BillboardGroupShaderBuffer.s_billFS.getBrnAlphaStatus());

    }

    getUniqueShaderName(): string {
        let ns: string = this.m_uniqueName + "_" + BillboardGroupShaderBuffer.s_billFS.getBrnAlphaStatus();
        if (this.m_hasOffsetColorTex && this.m_clipEnabled) {
            ns += "ClipColorTex";
        }
        if (this.premultiplyAlpha) ns += "PreMAlpha";
        return ns;
    }
}
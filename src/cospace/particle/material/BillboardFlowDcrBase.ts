/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
import IShaderUniformData from "../../../vox/material/IShaderUniformData";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { IMaterialDecorator } from "../../../vox/material/IMaterialDecorator";
import { IShaderTextureBuilder } from "../../../vox/material/IShaderTextureBuilder";
import BillboardFragShaderBase from "../shader/BillboardFragShaderBase";
import { BillboardGroupShaderCode } from "../../../vox/material/mcase/glsl/BillboardGroupShaderCode";

class BillboardFlowDcrBase implements IMaterialDecorator {
	private m_uniqueName: string;
    private static s_billFS = new BillboardFragShaderBase();
    protected m_clipEnabled: boolean = false;
    protected m_hasOffsetColorTex: boolean = false;
    protected m_useRawUVEnabled: boolean = false
    protected m_brightnessEnabled: boolean = false;

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
	lightEnabled: boolean = false;
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


    clipMixEnabled: boolean = false;
    brightnessEnabled: boolean = false;

	constructor() {
		// this.m_uniqueName = "billboardFlow_";
	}

	initialize(texEnabled: boolean): void {
		this.m_uniqueName = "BillboardGroupShader";
		if (this.clipMixEnabled) this.m_uniqueName += "Mix";
		this.m_uniqueName += this.brightnessEnabled ? "Brn" : "Alp";
	}


    setParam(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, hasOffsetColorTex: boolean): void {
        this.m_brightnessEnabled = brightnessEnabled;
        BillboardFlowDcrBase.s_billFS.setBrightnessAndAlpha(brightnessEnabled, alphaEnabled);
        this.m_clipEnabled = clipEnabled;
        this.m_hasOffsetColorTex = hasOffsetColorTex;
    }
    buildVertShd(oder: IShaderCodeBuilder): void {
    }
    getShaderCodeObject(): IShaderCodeObject {
        return BillboardGroupShaderCode;
    }
    buildShader(coder: IShaderCodeBuilder): void {

        coder.autoBuildHeadCodeEnabled = false;
        this.buildFragShd(coder);
        this.buildVertShd(coder);
        // if (this.pipeline == null) {
        //     coder.addShaderObject(BillboardGroupShaderCode);
        // }
    }

    buildFragShd(coder: IShaderCodeBuilder): void {

        if (this.brightnessEnabled) {
            let f = this.fogEnabled;
            // if (this.pipeline != null) {
            //     f = f || this.pipeline.hasPipeByType(MaterialPipeType.FOG_EXP2);
            //     f = f || this.pipeline.hasPipeByType(MaterialPipeType.FOG);
            // }
            this.brightnessOverlayEnabeld = f;
        }

        // let coder = this.m_coder;
		let uniform = coder.uniform;
        uniform.addDiffuseMap();
        if (this.m_hasOffsetColorTex) {
            uniform.add2DMap("VOX_OFFSET_COLOR_MAP");
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
        coder.addDefine("FADE_STATUS", "" + BillboardFlowDcrBase.s_billFS.getBrnAlphaStatus());

    }

    getUniqueShaderName(): string {
        let ns: string = this.m_uniqueName + "_" + BillboardFlowDcrBase.s_billFS.getBrnAlphaStatus();
        if (this.m_hasOffsetColorTex && this.m_clipEnabled) {
            ns += "ClipColorTex";
        }
        if (this.premultiplyAlpha) ns += "PreMAlpha";
        return ns;
    }




	buildBufParams(): void {}
	buildTextureList(builder: IShaderTextureBuilder): void {}

	createUniformData(): IShaderUniformData {
		let oum: ShaderUniformData = new ShaderUniformData();
		// oum.uniformNameList = ["u_colorFill"];
		// oum.dataList = [this.m_colorData];
		return oum;
	}
	getShaderCodeObjectUUID(): ShaderCodeUUID {
		return ShaderCodeUUID.None;
	}

	getUniqueName(): string {
		return this.m_uniqueName;
	}
}
export { BillboardFlowDcrBase };

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
	protected m_clipEnabled = false;
	protected m_hasOffsetColorTex = false;
	protected m_useRawUVEnabled = false;
	protected m_brightnessEnabled = false;

	protected m_uniqueName = "";

	clipMixEnabled = false;
	brightnessEnabled = false;
	vtxColorEnabled = false;
	brnToAlpha = false;
	vtxClipUVRectEnabled = false;
	clipRectIndex = -1;
	constructor() {
		super();
	}
	initialize(texEnabled: boolean): void {
		super.initialize(texEnabled);
		this.m_uniqueName = "BillboardGroupShader";
		if (this.clipMixEnabled) this.m_uniqueName += "Mix";
		this.m_uniqueName += this.brightnessEnabled ? "Brn" : "Alp";
		if (this.vtxColorEnabled) this.m_uniqueName += "VtxColor";
		if (this.brnToAlpha) this.m_uniqueName += "BrnToA";
		if (this.vtxClipUVRectEnabled) this.m_uniqueName += "vCUVR";
		if (this.clipRectIndex >= 0) this.m_uniqueName += "CI"+this.clipRectIndex;

		this.adaptationShaderVersion = false;
	}
	setParam(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, hasOffsetColorTex: boolean): void {
		this.m_brightnessEnabled = brightnessEnabled;
		BillboardGroupShaderBuffer.s_billFS.setBrightnessAndAlpha(brightnessEnabled, alphaEnabled);
		this.m_clipEnabled = clipEnabled;
		this.m_hasOffsetColorTex = hasOffsetColorTex;
	}
	buildVertShd(): void {}
	getShaderCodeObject(): IShaderCodeObject {
		return BillboardGroupShaderCode;
	}
	buildShader(): void {
		this.m_coder.autoBuildHeadCodeEnabled = false;
		this.buildFragShd();
		this.buildVertShd();
	}

	buildFragShd(): void {
		let coder = this.m_coder;
		if (this.brightnessEnabled) {
			coder.addDefine("VOX_BRIGHTNESS");
			let fogEnabled = this.fogEnabled;
			if (this.pipeline != null) {
				fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG_EXP2);
				fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG);
			}
			this.brightnessOverlayEnabeld = fogEnabled;
		}

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

		if(this.brnToAlpha) {
			coder.addDefine("VOX_BRN_TO_ALPHA");
		}
		if(this.clipRectIndex >= 0) {
			coder.addDefine("VOX_CLIP_RECT_INDEX", this.clipRectIndex + "");
		}
		if (this.m_clipEnabled) {
			coder.addDefine("VOX_USE_CLIP");
			if (this.clipMixEnabled) {
				coder.addDefine("VOX_USE_CLIP_MIX");
			}
		}
		if(this.vtxColorEnabled) {
			coder.addDefine("VOX_VERTEX_COLOR");
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

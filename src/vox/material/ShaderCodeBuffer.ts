/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "./ShaderCodeUUID";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import ShaderCodeBuilder from "../../vox/material/code/ShaderCodeBuilder";
import ShaderCompileInfo from "../../vox/material/code/ShaderCompileInfo";
import IShaderCodeObject from "./IShaderCodeObject";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { MaterialPipeType } from "./pipeline/MaterialPipeType";
import { ShaderCodeUniform } from "../../vox/material/code/ShaderCodeUniform";
import { ShaderTextureBuilder } from "../../vox/material/ShaderTextureBuilder";
import IShaderCodeBuffer from "../../vox/material/IShaderCodeBuffer";

class ShaderCodeBuffer implements IShaderCodeBuffer {
	protected static s_coder: ShaderCodeBuilder;
	protected static s_uniform: ShaderCodeUniform;
	private static s_texBulder: ShaderTextureBuilder; // = new ShaderTextureBuilder();
	protected m_coder: ShaderCodeBuilder = null;
	protected m_uniform: ShaderCodeUniform;
	protected m_texture: ShaderCodeUniform;
	protected m_texBuilder: ShaderTextureBuilder;
	protected m_shaderCodeObj: IShaderCodeObject = null;

	protected m_texList: IRenderTexture[] = null;
	protected m_texEnabled: boolean = true;

	pipeline: IMaterialPipeline = null;

	gamma: boolean = false;
	vertColorEnabled: boolean = false;
	premultiplyAlpha: boolean = false;
	shadowReceiveEnabled: boolean = false;
	lightEnabled: boolean = false;
	fogEnabled: boolean = false;
	envAmbientLightEnabled: boolean = false;
	brightnessOverlayEnabeld: boolean = false;
	glossinessEnabeld: boolean = true;

	pipeTypes: MaterialPipeType[] = null;
	keysString: string = "";

	/**
	 * 是否自适应转换shader版本
	 */
	adaptationShaderVersion: boolean = true;
	constructor() {
		if (ShaderCodeBuffer.s_coder == null) {
			ShaderCodeBuffer.s_uniform = new ShaderCodeUniform();
			ShaderCodeBuffer.s_coder = new ShaderCodeBuilder(ShaderCodeBuffer.s_uniform);
			ShaderCodeBuffer.s_uniform.__$setCodeBuilder(ShaderCodeBuffer.s_coder);
			ShaderCodeBuffer.s_texBulder = new ShaderTextureBuilder(ShaderCodeBuffer.s_coder);
		}
	}
	reset(): void {
		this.m_coder = ShaderCodeBuffer.s_coder;
		this.m_uniform = ShaderCodeBuffer.s_uniform;
		this.m_texBuilder = ShaderCodeBuffer.s_texBulder;
		this.m_texture = this.m_uniform;

		this.m_coder.reset();

		this.m_texList = null;
		this.pipeTypes = null;

		this.gamma = false;
		this.vertColorEnabled = false;
		this.premultiplyAlpha = false;
		this.shadowReceiveEnabled = false;
		this.lightEnabled = false;
		this.fogEnabled = false;
		this.envAmbientLightEnabled = false;
		this.brightnessOverlayEnabeld = false;
		this.glossinessEnabeld = true;

		this.keysString = "";
	}
	clear(): void {
		this.m_coder = null;
	}

	getUniform(): ShaderCodeUniform { return this.m_uniform; }
	getTexture(): ShaderCodeUniform { return this.m_texture; }
	getTexBuilder(): ShaderTextureBuilder { return this.m_texBuilder; }

	setShaderCodeObject(obj: IShaderCodeObject): void {
		this.m_shaderCodeObj = obj;
	}
	getShaderCodeObject(): IShaderCodeObject {
		return this.m_shaderCodeObj;
	}
	getShaderCodeObjectUUID(): ShaderCodeUUID {
		return ShaderCodeUUID.None;
	}
	getShaderCodeBuilder(): ShaderCodeBuilder {
		return ShaderCodeBuffer.s_coder;
	}
	static GetPreCompileInfo(): ShaderCompileInfo {
		return ShaderCodeBuffer.s_coder.getPreCompileInfo();
	}

	initialize(texEnabled: boolean): void {
		// if (ShaderCodeBuffer.__$s_csBuf != null) {
		//     if (ShaderCodeBuffer.__$s_csBuf != this) {
		//         ShaderCodeBuffer.__$s_csBuf.initialize(texEnabled);
		//     }
		// }
		this.m_texEnabled = texEnabled;
		this.bufInitWithPipeline();
	}
	buildDefine(): void {
		if (this.premultiplyAlpha) {
			this.m_coder.addDefine("VOX_PREMULTIPLY_ALPHA");
			this.keysString += "A";
		}
		if (this.vertColorEnabled) {
			this.m_coder.addDefine("VOX_USE_VTX_COLOR");
			this.keysString += "UVC";
		}
		if (this.brightnessOverlayEnabeld) {
			this.m_coder.addDefine("VOX_USE_BRIGHTNESS_OVERLAY_COLOR");
			this.keysString += "UBOC";
		}
		if (this.glossinessEnabeld) {
			this.m_coder.addDefine("VOX_USE_GLOSSINESS");
			this.keysString += "UG";
		}
	}
	buildPipelineParams(): void {
		if (this.pipeline != null) {
			if (this.pipeTypes == null) this.pipeTypes = [];

			let MPT = MaterialPipeType;
			if (this.lightEnabled && !this.pipeTypes.includes(MPT.GLOBAL_LIGHT)) this.pipeTypes.push(MPT.GLOBAL_LIGHT);
			if (this.shadowReceiveEnabled && !this.pipeTypes.includes(MPT.VSM_SHADOW)) this.pipeTypes.push(MPT.VSM_SHADOW);
			if (this.fogEnabled && !this.pipeTypes.includes(MPT.FOG_EXP2)) this.pipeTypes.push(MPT.FOG_EXP2);
			if (this.envAmbientLightEnabled && !this.pipeTypes.includes(MPT.ENV_AMBIENT_LIGHT)) this.pipeTypes.push(MPT.ENV_AMBIENT_LIGHT);
		}
	}

	getTexturesFromPipeline(outList: IRenderTexture[]): void {
		if (this.pipeline != null) {
			this.pipeline.getTextures(this.m_coder, outList, this.pipeTypes);
		}
	}
	private bufInitWithPipeline(): void {
		if (this.pipeline != null) {
			this.buildPipelineParams();
			this.pipeline.buildSharedUniforms(this.pipeTypes);
			this.pipeline.createKeys(this.pipeTypes);
			this.keysString += this.pipeline.getKeysString();
		}
	}

	isTexEanbled(): boolean {
		return this.m_texEnabled;
	}
	setIRenderTextureList(texList: IRenderTexture[]): void {
		this.m_texList = texList;
	}
	getIRenderTextureList(): IRenderTexture[] {
		return this.m_texList;
	}
	buildShader(): void {}
	getFragShaderCode(): string {
		//if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getFragShaderCode();
		return this.m_coder.buildFragCode();
	}
	getVertShaderCode(): string {
		//if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getVertShaderCode();
		return this.m_coder.buildVertCode();
	}
	getUniqueShaderName(): string {
		//if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getUniqueShaderName();
		throw Error("Illgel operation !!!");
		return "";
	}
	toString(): string {
		return "[ShaderCodeBuffer()]";
	}
	// static UseShaderBuffer(buf: ShaderCodeBuffer): void {
	//     if (ShaderCodeBuffer.__$s_csBuf != null) {
	//         ShaderCodeBuffer.__$s_csBuf.clear();
	//     }
	//     ShaderCodeBuffer.__$s_csBuf = buf;
	// }
}
export default ShaderCodeBuffer;

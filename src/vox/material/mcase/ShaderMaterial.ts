/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IShaderCodeBuffer from "../../../vox/material/IShaderCodeBuffer";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import IShaderMaterial from "./IShaderMaterial";

class RawCodeShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private m_uniqueName: string = "";
	private m_fragCode: string = "";
	private m_vtxCode: string = "";
	private m_flag: boolean = true;

	shaderBuilder: (shdCodeBuf: IShaderCodeBuffer) => void = null;
	initialize(texEnabled: boolean): void {
		super.initialize(texEnabled);
		this.adaptationShaderVersion = false;
	}

	buildShader(): void {
		this.m_flag = this.shaderBuilder != null;
		if (this.m_flag) {
			this.shaderBuilder(this);
			this.shaderBuilder = null;
		}
	}
	setUniqueName(uniqueName: string): void {
		this.m_uniqueName = uniqueName;
	}
	setFragShaderCode(codeStr: string): void {
		this.m_fragCode = codeStr;
	}
	getFragShaderCode(): string {
		if (this.m_flag) return this.m_coder.buildFragCode();
		return this.m_fragCode;
	}
	setVtxShaderCode(codeStr: string): void {
		this.m_vtxCode = codeStr;
	}
	getVertShaderCode(): string {
		if (this.m_flag) return this.m_coder.buildVertCode();
		return this.m_vtxCode;
	}
	getUniqueShaderName(): string {
		//console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
		return this.m_uniqueName;
	}
	toString(): string {
		return "[RawCodeShaderBuffer()]";
	}
}

export default class ShaderMaterial extends MaterialBase implements IShaderMaterial {

	private m_buffer: RawCodeShaderBuffer = new RawCodeShaderBuffer();
	private m_uniformData: ShaderUniformData = null;
	private m_shaderBuilder: (shdCodeBuf: IShaderCodeBuffer) => void = null;

	vertColorEnabled: boolean = false;
	premultiplyAlpha: boolean = false;
	shadowReceiveEnabled: boolean = false;
	lightEnabled: boolean = false;
	fogEnabled: boolean = false;
	envAmbientLightEnabled: boolean = false;
	brightnessOverlayEnabeld: boolean = false;
	glossinessEnabeld: boolean = true;

	constructor(shd_uniqueName: string) {
		super();
		this.m_buffer.setUniqueName(shd_uniqueName);
	}
	protected buildBuf(): void {

		let buf = this.m_buffer;
		buf.shaderBuilder = this.m_shaderBuilder;

		buf.vertColorEnabled = this.vertColorEnabled;
		buf.premultiplyAlpha = this.premultiplyAlpha;
		buf.shadowReceiveEnabled = this.shadowReceiveEnabled;
		buf.lightEnabled = this.lightEnabled;
		buf.fogEnabled = this.fogEnabled;
		buf.envAmbientLightEnabled = this.envAmbientLightEnabled;
		buf.brightnessOverlayEnabeld = this.brightnessOverlayEnabeld;
		buf.glossinessEnabeld = this.glossinessEnabeld;
	}
	setShaderBuilder(shaderBuilder: (shdCodeBuf: IShaderCodeBuffer) => void): void {
		this.m_shaderBuilder = shaderBuilder;
	}
	setFragShaderCode(codeStr: string): void {
		this.m_buffer.shaderBuilder = null;
		this.m_buffer.setFragShaderCode(codeStr);
	}
	setVtxShaderCode(codeStr: string): void {
		this.m_buffer.shaderBuilder = null;
		this.m_buffer.setVtxShaderCode(codeStr);
	}
	/**
	 * @param           uniform_name        the name of a uniform in the shader.
	 * @param           data                Float32Array type data stream,for example: vec4(Float32Array(4)),mat4(Float32Array(16))
	 */
	addUniformDataAt(uniform_name: string, data: Float32Array): void {
		if (data != null) {
			if (this.m_uniformData == null) {
				this.m_uniformData = new ShaderUniformData();
				this.m_uniformData.uniformNameList = [];
				this.m_uniformData.dataList = [];
			}
			this.m_uniformData.uniformNameList.push(uniform_name);
			this.m_uniformData.dataList.push(data);
		}
	}
	getCodeBuf(): ShaderCodeBuffer {
		return this.m_buffer;
	}
	createSelfUniformData(): ShaderUniformData {
		return this.m_uniformData;
	}
	destroy(): void {
		this.m_shaderBuilder = null;
	}
}

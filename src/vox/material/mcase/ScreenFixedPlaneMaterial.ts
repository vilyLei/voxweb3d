/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import MaterialBase from "../../../vox/material/MaterialBase";
import IColorMaterial from "./IColorMaterial";
import IColor4 from "../IColor4";

class ScreenFixedPlaneShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: ScreenFixedPlaneShaderBuffer = null;
	private m_uniqueName: string = "";
	private m_hasTex: boolean = false;
	initialize(texEnabled: boolean): void {
		console.log("ScreenFixedPlaneShaderBuffer::initialize()... texEnabled: " + texEnabled);
		this.m_uniqueName = "ScreenFixedPlaneShd";
		this.m_hasTex = texEnabled;
		if (texEnabled) {
			this.m_uniqueName += "_tex";
		}
	}
	getFragShaderCode(): string {
		let fragCode: string = "\
precision mediump float;\n\
//ScreenFixedPlaneShd\n\
";
		if (this.m_hasTex) {
			fragCode += "\
uniform sampler2D u_sampler0;\n\
varying vec2 v_texUV;\n\
";
		}

		fragCode += "\
uniform vec4 u_color;\n\
void main()\n\
{\n\
";
		if (this.m_hasTex) {
			fragCode += "\
gl_FragColor = texture2D(u_sampler0, v_texUV) * u_color;\n\
";
		} else {
			fragCode += "\
gl_FragColor = u_color;\n\
";
		}
		fragCode += "\
}\n\
";
		return fragCode;
	}
	getVertShaderCode(): string {
		let vtxCode: string = "\
precision mediump float;\n\
attribute vec3 a_vs;\n\
";
		if (this.m_hasTex) {
			vtxCode += "\
uniform vec4 u_param;\n\
attribute vec2 a_uvs;\n\
varying vec2 v_texUV;\n\
";
		}
		vtxCode += "\
void main()\n\
{\n\
gl_Position = vec4(a_vs,1.0);\n\
";
		if (this.m_hasTex) {
			vtxCode += "\
v_texUV.xy = u_param.zw + (a_uvs.xy * u_param.xy);\n\
";
		}
		vtxCode += "\
}\n\
";
		return vtxCode;
	}
	getUniqueShaderName(): string {
		//console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
		return this.m_uniqueName;
	}
	toString(): string {
		return "[ScreenFixedPlaneShaderBuffer()]";
	}

	static GetInstance(): ScreenFixedPlaneShaderBuffer {
		if (ScreenFixedPlaneShaderBuffer.s_instance != null) {
			return ScreenFixedPlaneShaderBuffer.s_instance;
		}
		ScreenFixedPlaneShaderBuffer.s_instance = new ScreenFixedPlaneShaderBuffer();
		return ScreenFixedPlaneShaderBuffer.s_instance;
	}
}

export default class ScreenFixedPlaneMaterial extends MaterialBase implements IColorMaterial {
	premultiplyAlpha = false;
    normalEnabled = false;
    shadowReceiveEnabled = false;
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return ScreenFixedPlaneShaderBuffer.GetInstance();
	}
	private m_data: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
	private m_param: Float32Array = new Float32Array([1.0, 1.0, 0.0, 0.0]);
	setUVScale(scaleU: number, scaleV: number): void {
		this.m_param[0] = scaleU;
		this.m_param[1] = scaleU;
	}
	setUVTranslation(offsetU: number, offsetV: number): void {
		this.m_param[2] = offsetU;
		this.m_param[3] = offsetV;
	}
	setRGB3f(pr: number, pg: number, pb: number): void {
		this.m_data[0] = pr;
		this.m_data[1] = pg;
		this.m_data[2] = pb;
	}
	setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
		this.m_data[0] = pr;
		this.m_data[1] = pg;
		this.m_data[2] = pb;
		this.m_data[3] = pa;
	}
	setAlpha(a: number): void {
		this.m_data[3] = a;
	}
	getAlpha(): number {
		return this.m_data[3];
	}

    setColor(color: IColor4): void {
		color.toArray4( this.m_data );
	}
    getColor(color: IColor4): void {
		color.fromArray4( this.m_data );
	}
	createSelfUniformData(): ShaderUniformData {
		let oum: ShaderUniformData = new ShaderUniformData();
		oum.uniformNameList = ["u_color", "u_param"];
		oum.dataList = [this.m_data, this.m_param];
		return oum;
	}
}

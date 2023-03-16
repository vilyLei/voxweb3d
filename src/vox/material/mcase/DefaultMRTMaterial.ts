/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class DefaultMRTShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: DefaultMRTShaderBuffer = new DefaultMRTShaderBuffer();
	private m_uniqueName: string = "";
	initialize(texEnabled: boolean): void {
		//console.log("DefaultMRTShaderBuffer::initialize()...");
		this.m_uniqueName = "DefaultMRTShd";
		this.adaptationShaderVersion = false;
	}

	buildShader(): void {
        
		let coder = this.m_coder;
		coder.addVertLayout("vec3", "a_vs");
		coder.addVertLayout("vec2", "a_uvs");
		coder.addVarying("vec2", "v_texUV");

		this.m_uniform.add2DMap("MAP_0");

		coder.addFragUniform("vec4", "u_sphParam", 5);
		coder.addFragUniform("vec4", "u_frustumParam");
		coder.addFragUniform("vec4", "u_viewParam");

		coder.addFragOutput("vec4", "FragColor0");
		coder.addFragOutput("vec4", "FragColor1");

		coder.addVertMainCode(
			`
            gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs, 1.0);
            v_texUV = a_uvs;
        `
		);
		coder.addFragMainCode(
			`
            vec4 color = VOX_Texture2D(MAP_0, v_texUV);
            FragColor0 = vec4(color.rgb,1.0);
            FragColor1 = vec4(1.0 - color.rgb * color.rgb * color.rgb,1.0);
            `
		);
	}
	getUniqueShaderName(): string {
		return this.m_uniqueName;
	}
	toString(): string {
		return "[DefaultMRTShaderBuffer()]";
	}

	static GetInstance(): DefaultMRTShaderBuffer {
		return DefaultMRTShaderBuffer.s_instance;
	}
}

export default class DefaultMRTMaterial extends MaterialBase {
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return DefaultMRTShaderBuffer.GetInstance();
	}
	colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);

	createSelfUniformData(): ShaderUniformData {
		let oum: ShaderUniformData = new ShaderUniformData();
		oum.uniformNameList = ["u_color"];
		oum.dataList = [this.colorArray];
		return oum;
	}
}

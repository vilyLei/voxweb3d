/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";

class FogDepthUVShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: FogDepthUVShaderBuffer = new FogDepthUVShaderBuffer();
	private m_uniqueName: string = "";
	initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.adaptationShaderVersion = false;
		this.m_uniqueName = "FogDepthUV";
	}

	buildShader(): void {
		let coder = this.m_coder;
		// coder.addVertLayout("vec3", "a_vs");
		// coder.addVertLayout("vec2", "a_uvs");
		coder.addVarying("vec4", "v_color");
		// coder.addVarying("vec2", "v_uv");
		// coder.useVertSpaceMats(true, true, true);

		this.m_uniform.add2DMap("MAP_0");

		coder.addFragUniform("vec4", "u_param", 2);
		coder.addVertUniform("vec4", "u_frustumParam");
		coder.addFragOutput("vec4", "FragColor0");
		coder.addFragOutput("vec4", "FragColor1");

        coder.addVertHeadCode(`
        vec4 worldPos;
        vec4 viewPos;
        `);
		coder.addVertMainCode(
			`
            worldPos = u_objMat * vec4(a_vs, 1.0);
            viewPos = u_viewMat * worldPos;
            gl_Position = u_projMat * viewPos;
            v_color = vec4(viewPos.xyz, length(viewPos.xyz)/u_frustumParam.y);
            v_uv = a_uvs;
        `
		);
		coder.addFragMainCode(
			`
            vec4 color4 = VOX_Texture2D(MAP_0, v_uv * u_param[0].xy);
            color4.xyz *= u_param[1].xyz;
            FragColor0 = color4;
            FragColor1 = v_color;
        `
		);
	}
	/*
    getFragShaderCode(): string {
        let fragCode: string =
            `#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform vec4 u_param[2];
in vec4 v_color;
in vec2 v_uv;
layout(location = 0) out vec4 FragColor0;
layout(location = 1) out vec4 FragColor1;
void main()
{
    FragColor1 = vec4(v_color.xyz, v_color.w);
    vec4 color4 = texture(u_sampler0, v_uv * u_param[0].xy);
    color4.xyz *= u_param[1].xyz;
    FragColor0 = color4;
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_frustumParam;
out vec4 v_color;
out vec2 v_uv;
vec4 worldPos;
vec4 viewPos;
void main(){
    worldPos = u_objMat * vec4(a_vs, 1.0);
    viewPos = u_viewMat * worldPos;
    gl_Position = u_projMat * viewPos;
    v_color = vec4(viewPos.xyz, length(viewPos.xyz)/u_frustumParam.y);
    v_uv = a_uvs;
}
`;
        return vtxCode;
    }
    //*/
	getUniqueShaderName(): string {
		return this.m_uniqueName;
	}

	static GetInstance(): FogDepthUVShaderBuffer {
		return FogDepthUVShaderBuffer.s_instance;
	}
}

export class FogDepthUVMaterial extends MaterialBase {
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return FogDepthUVShaderBuffer.GetInstance();
	}
	private m_param: Float32Array = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0]);

	setRGBColor(pcolor: Color4): void {
		this.m_param[4] = pcolor.r;
		this.m_param[5] = pcolor.g;
		this.m_param[6] = pcolor.b;
	}
	setFRGB3f(pr: number, pg: number, pb: number): void {
		this.m_param[4] = pr;
		this.m_param[5] = pg;
		this.m_param[6] = pb;
	}
	setUVScale(scaleU: number, scaleV: number): void {
		this.m_param[0] = scaleU;
		this.m_param[1] = scaleV;
	}
	createSelfUniformData(): ShaderUniformData {
		let oum: ShaderUniformData = new ShaderUniformData();
		oum.uniformNameList = ["u_param"];
		oum.dataList = [this.m_param];
		return oum;
	}
}

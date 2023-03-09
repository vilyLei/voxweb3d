/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";

class DepthDistanceShowShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: DepthDistanceShowShaderBuffer = new DepthDistanceShowShaderBuffer();
	private m_uniqueName: string = "";
	initialize(texEnabled: boolean): void {
		//console.log("DepthDistanceShowShaderBuffer::initialize()...");
		this.m_uniqueName = "DepthDistanceShowShd";
	}
	getFragShaderCode(): string {
		let fragCode = `#version 300 es
precision mediump float;
layout(location = 0) out vec4 FragColor0;

uniform sampler2D u_sampler0;
in vec2 v_uv;

void main()
{
	vec4 color = texture(u_sampler0, v_uv);
    FragColor0 = vec4(color.xyz * color.w * 0.003, 1.0);
}
`;
		return fragCode;
	}
	getVertShaderCode(): string {
		let vtxCode = `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out vec2 v_uv;

vec4 worldPos;
vec4 viewPos;

void main(){
    worldPos = u_objMat * vec4(a_vs, 1.0);
    viewPos = u_viewMat * worldPos;
    gl_Position = u_projMat * viewPos;
	v_uv = a_uvs.xy;
}
`;
		return vtxCode;
	}
	getUniqueShaderName(): string {
		//console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
		return this.m_uniqueName;
	}
	toString(): string {
		return "[DepthDistanceShowShaderBuffer()]";
	}

	static GetInstance(): DepthDistanceShowShaderBuffer {
		return DepthDistanceShowShaderBuffer.s_instance;
	}
}

export class DepthDistanceShowMaterial extends MaterialBase {
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return DepthDistanceShowShaderBuffer.GetInstance();
	}
}

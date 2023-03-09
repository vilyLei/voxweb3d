/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";

class DepthDistanceShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: DepthDistanceShaderBuffer = new DepthDistanceShaderBuffer();
	private m_uniqueName: string = "";
	initialize(texEnabled: boolean): void {
		//console.log("DepthDistanceShaderBuffer::initialize()...");
		this.m_uniqueName = "DepthDistanceShd";
	}
	getFragShaderCode(): string {
		let fragCode = `#version 300 es
precision mediump float;
layout(location = 0) out vec4 FragColor0;

uniform sampler2D u_sampler0;
in float v_depthV;
in vec2 v_uv;

void main()
{
	vec4 color = texture(u_sampler0, v_uv);
    FragColor0 = vec4(color.xyz, v_depthV);
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

out float v_depthV;
out vec2 v_uv;

// these codes are very important, they can prevent depth z-fighting when the depth func contains equal.
vec4 worldPos;
vec4 viewPos;
void main(){
    worldPos = u_objMat * vec4(a_vs, 1.0);
    viewPos = u_viewMat * worldPos;
    gl_Position = u_projMat * viewPos;
    v_depthV = length(viewPos.xyz);
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
		return "[DepthDistanceShaderBuffer()]";
	}

	static GetInstance(): DepthDistanceShaderBuffer {
		return DepthDistanceShaderBuffer.s_instance;
	}
}

export class DepthDistanceMaterial extends MaterialBase {
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return DepthDistanceShaderBuffer.GetInstance();
	}
}

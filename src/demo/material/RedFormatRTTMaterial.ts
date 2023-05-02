/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";

class RedFormatRTTShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: RedFormatRTTShaderBuffer = new RedFormatRTTShaderBuffer();
	private m_uniqueName: string = "";
	initialize(texEnabled: boolean): void {
		//console.log("RedFormatRTTShaderBuffer::initialize()...");
		this.m_uniqueName = "RedFormatRTTShd";
	}
	getFragShaderCode(): string {
		let fragCode = `#version 300 es
precision mediump float;
layout(location = 0) out float FragColor0;

in float v_depthV;

void main()
{
    FragColor0 = v_depthV;
}
`;
		return fragCode;
	}
	getVertShaderCode(): string {
		let vtxCode = `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out float v_depthV;

// these codes are very important, they can prevent depth z-fighting when the depth func contains equal.
vec4 worldPos;
vec4 viewPos;
void main(){
    worldPos = u_objMat * vec4(a_vs, 1.0);
    viewPos = u_viewMat * worldPos;
    gl_Position = u_projMat * viewPos;
    v_depthV = length(viewPos.xyz);
}
`;
		return vtxCode;
	}
	getUniqueShaderName(): string {
		//console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
		return this.m_uniqueName;
	}
	toString(): string {
		return "[RedFormatRTTShaderBuffer()]";
	}

	static GetInstance(): RedFormatRTTShaderBuffer {
		return RedFormatRTTShaderBuffer.s_instance;
	}
}

export class RedFormatRTTMaterial extends MaterialBase {
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return RedFormatRTTShaderBuffer.GetInstance();
	}
}

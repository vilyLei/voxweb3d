/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";

class PSDepthShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: PSDepthShaderBuffer = new PSDepthShaderBuffer();
	private m_uniqueName: string = "";
	initialize(texEnabled: boolean): void {
		//console.log("PSDepthShaderBuffer::initialize()...");
		this.m_uniqueName = "PSDepthShd";
	}
	getFragShaderCode(): string {
		let fragCode: string = `#version 300 es
precision mediump float;
layout(location = 0) out vec4 FragColor0;
in vec4 v_depthV;
void main()
{
    FragColor0 = v_depthV;
}`;
		return fragCode;
	}
	getVertShaderCode(): string {
		let vtxCode: string = `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_frustumParam;
out vec4 v_depthV;
// these codes are very important, they can prevent depth z-fighting when the depth func contains equal.
vec4 worldPos;
vec4 viewPos;
void main(){
    worldPos = u_objMat * vec4(a_vs, 1.0);
    viewPos = u_viewMat * worldPos;
    gl_Position = u_projMat * viewPos;
    v_depthV = vec4(vec3(1.0),length(viewPos.xyz)/u_frustumParam.y);
}
`;
		return vtxCode;
	}
	getUniqueShaderName(): string {
		//console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
		return this.m_uniqueName;
	}
	toString(): string {
		return "[PSDepthShaderBuffer()]";
	}

	static GetInstance(): PSDepthShaderBuffer {
		return PSDepthShaderBuffer.s_instance;
	}
}

export class PSDepthMaterial extends MaterialBase {
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return PSDepthShaderBuffer.GetInstance();
	}
}

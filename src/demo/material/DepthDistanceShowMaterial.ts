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
	private static s_instance = new DepthDistanceShowShaderBuffer();
	private m_uniqueName = "";

	initialize(texEnabled: boolean): void {
		super.initialize(texEnabled);
		this.adaptationShaderVersion = false;
		this.m_uniqueName = "DepthDistanceShowShd";
	}

	buildShader(): void {
		let coder = this.m_coder;

		this.m_uniform.add2DMap("MAP_0");

		coder.addFragOutput("vec4", "FragColor0");

		coder.addVertMainCode(
			`
    		vec4 worldPos = u_objMat * vec4(a_vs, 1.0);
    		vec4 viewPos = u_viewMat * worldPos;
    		gl_Position = u_projMat * viewPos;
			v_uv = a_uvs.xy;
        `
		);
		coder.addFragMainCode(`
			vec4 color = VOX_Texture2D(MAP_0, v_uv);
    		FragColor0 = vec4(color.xyz * color.w * 0.003, 1.0);
		`);
	}
	getUniqueShaderName(): string {
		return this.m_uniqueName;
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

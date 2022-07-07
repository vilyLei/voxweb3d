/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

interface IShaderMaterial extends MaterialBase {

	initializeByCodeBuf(textureEnabled?: boolean): void;
	setFragShaderCode(codeStr: string): void;
	setVtxShaderCode(codeStr: string): void;
	/**
	 * @param           uniform_name        the name of a uniform in the shader.
	 * @param           data                Float32Array type data stream,for example: vec4(Float32Array(4)),mat4(Float32Array(16))
	 */
	addUniformDataAt(uniform_name: string, data: Float32Array): void;
}

export { IShaderMaterial };

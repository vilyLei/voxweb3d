/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";

export default interface IShaderMaterial extends IRenderMaterial {
	/**
	 * @param textureEnabled the default value is false
	 */
	initializeByCodeBuf(textureEnabled?: boolean): void;
	setShaderBuilder(shaderBuilder: (coder: IShaderCodeBuilder) => void): void;
	setFragShaderCode(codeStr: string): void;
	setVtxShaderCode(codeStr: string): void;
	/**
	 * @param           uniform_name        the name of a uniform in the shader.
	 * @param           data                Float32Array type data stream,for example: vec4(Float32Array(4)),mat4(Float32Array(16))
	 */
	addUniformDataAt(uniform_name: string, data: Float32Array): void;
}

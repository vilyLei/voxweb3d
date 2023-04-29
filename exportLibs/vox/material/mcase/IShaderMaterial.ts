/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuffer from "../../../vox/material/IShaderCodeBuffer";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";

export default interface IShaderMaterial extends IRenderMaterial {

	vertColorEnabled: boolean;
	premultiplyAlpha: boolean;
	shadowReceiveEnabled: boolean;
	lightEnabled: boolean;
	fogEnabled: boolean;
	envAmbientLightEnabled: boolean;
	brightnessOverlayEnabeld: boolean;
	glossinessEnabeld: boolean;

	/**
	 * @param textureEnabled the default value is false
	 */
	initializeByCodeBuf(textureEnabled?: boolean): void;
	setShaderBuilder(shaderBuilder: (cshdCodeBuf: IShaderCodeBuffer) => void): void;
	setFragShaderCode(codeStr: string): void;
	setVertShaderCode(codeStr: string): void;
	/**
	 * @param           uniform_name        the name of a uniform in the shader.
	 * @param           data                Float32Array type data stream,for example: vec4(Float32Array(4)),mat4(Float32Array(16))
	 */
	addUniformDataAt(uniform_name: string, data: Float32Array): void;
	/**
	 * @param uniform_name the name of a uniform in the shader.
	 * @returns a float32 type data
	 */
	getUniformDataAt(uniform_name: string): Float32Array;
	getUniformDataByIndex(index: number): {data: Float32Array, name: string};
}

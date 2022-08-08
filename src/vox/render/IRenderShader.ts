/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import IShaderUniform from "../../vox/material/IShaderUniform";
/**
 * renderer rendering runtime uniform data operations
 */
export default interface IRenderShader {
    /**
     * @returns return system gpu context
     */
    getRC(): any;
    /**
     * @returns return current gpu shader  program
     */
     getGPUProgram(): any;
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    getActiveAttachmentTotal(): number;
    useUniformMat4(ult: any, mat4f32Arr: Float32Array): void;
    useUniformV1(ult: any, type: number, f32Arr: Float32Array, dataSize: number): void;
    useUniformV2(ult: any, type: number, f32Arr: Float32Array, dataSize: number, offset: number): void;
	renderBegin():void;
	unlock(): void;
	lock(): void;
	textureUnlock(): void;
	textureLock(): void;
	resetUniform(): void;
	// updateUniform(uniform: IShaderUniform): void;
}

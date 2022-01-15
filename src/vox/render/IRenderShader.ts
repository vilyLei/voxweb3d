/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import {UniformDataSlot} from "../../vox/material/UniformDataSlot";
/**
 * renderer rendering runtime uniform data operations
 */
export default interface IRenderShader {
    // udSlot: UniformDataSlot;
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
}

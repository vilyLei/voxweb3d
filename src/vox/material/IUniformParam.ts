/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IUniformParam {
    /**
     * uniform type, for example: vec4,vec3,mat4, etc.
     */
    type: string;
    /**
     * unifrom cpu memory data
     */
    data: Float32Array | Int16Array | Int32Array;
    /**
     * uniform name string
     */
    name: string;
    /**
     * uniform array length
     */
    arrayLength: number;
}
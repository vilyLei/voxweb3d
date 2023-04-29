/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IShaderUniformProbe {

    rst: number;
    uniformsTotal: number;

    uniformNames: string[];
    // array -> [SHADER_MAT4, SHADER_VEC3]
    uniformTypes: number[];
    // array -> [1, 3], the "3" is uniform Array,length is 3
    dataSizeList: number[];
    /**
     * @return 获取当前probe在slot中的起始位置序号
     */
    getSlotBeginIndex(): number;

    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    
    getFS32At(i: number): Float32Array;
    setFS32At(fs32: Float32Array, i: number): void;
    setVec4DataAt(index: number, f0: number, f1: number, f2: number, f3: number): void;
    setVec4Data(f0: number, f1: number, f2: number, f3: number): void;
    setVec4DataAtWithArr4(index: number, arr4: number[]): void;
    setVec4DataWithArr4(arr4: number[]): void;
    addVec4Data(f32: Float32Array, vec4Total: number): void;

    addMat4Data(f32: Float32Array, mat4Total: number): void;
    isEnabled(): boolean;
    update(): void;
    reset(): void;
    destroy(): void;
}

export { IShaderUniformProbe };
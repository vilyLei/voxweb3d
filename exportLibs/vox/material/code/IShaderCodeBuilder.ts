
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IUniformParam from "../../../vox/material/IUniformParam";
import { IShaderCodeUniform } from "../../../vox/material/code/IShaderCodeUniform";
import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";

export default interface IShaderCodeBuilder {

	uns: string;
    normalEnabled: boolean;
    normalMapEnabled: boolean;
    mapLodEnabled: boolean;
    derivatives: boolean;
    vertMatrixInverseEnabled: boolean;
    fragMatrixInverseEnabled: boolean;
    uniform: IShaderCodeUniform;
    autoBuildHeadCodeEnabled: boolean;
    reset(): void;
    useHighPrecious(): void;
    useMediumPrecious(): void;
    useLowPrecious(): void;
    /**
     *
     * @param name macro name string
     * @param value the default value is "1"
     */
    addDefine(name: string, value?: string): void;
    addVertLayout(type: string, name: string): void;
    addFragOutput(type: string, name: string): void;
    addFragOutputHighp(type: string, name: string): void;
    addVarying(type: string, name: string): void;
    /**
     *
     * @param type vertex shader unifirm variable type, example: vec4
     * @param name vertex shader uniform variable name
     * @param arrayLength array length. the default value is 0, it is not a array. if the value is greater 0, it is a array.
     */
    addVertUniform(type: string, name: string, arrayLength?: number): void;
    addVertUniformParam(unifromParam: IUniformParam): void;
    addUniqueNSKeyString(key: string): void;
    /**
     *
     * @param type vertex shader unifirm variable type, example: vec4
     * @param name vertex shader uniform variable name
     * @param arrayLength array length. the default value is 0, it is not a array. if the value is greater 0, it is a array.
     */
    addFragUniform(type: string, name: string, arrayLength?: number): void;
    addFragUniformParam(unifromParam: IUniformParam): void;
    addFragFunction(codeBlock: string): void;
    addVertFunction(codeBlock: string): void;
    useTexturePreciseHighp(): void;
    /**
     * @param macroName macro name, the default value is ""
     * @param map2DEnabled the default value is true
     * @param fragEnabled the default value is true
     * @param vertEnabled the default value is false
     */
    addTextureSample2D(macroName?: string, map2DEnabled?: boolean, fragEnabled?: boolean, vertEnabled?: boolean): void;
    /**
     * @param macroName macro name, the default value is ""
     * @param fragEnabled the default value is true
     * @param vertEnabled the default value is false
     */
    addTextureSampleCube(macroName?: string, fragEnabled?: boolean, vertEnabled?: boolean): void;
    /**
     * @param macroName macro name, the default value is ""
     * @param fragEnabled the default value is true
     * @param vertEnabled the default value is false
     */
    addTextureSample3D(macroName?: string, fragEnabled?: boolean, vertEnabled?: boolean): void;
    isHaveTexture(): boolean;
    isHaveTexture2D(): boolean;
    /**
     * @param objMatEnabled the default value is true
     * @param viewMatEnabled the default value is true
     * @param projMatEnabled the default value is true
     */
    useVertSpaceMats(objMatEnabled?: boolean, viewMatEnabled?: boolean, projMatEnabled?: boolean): void;
    /**
     * @param objMatEnabled the default value is true
     * @param viewMatEnabled the default value is true
     * @param projMatEnabled the default value is true
     */
    useFragSpaceMats(objMatEnabled?: boolean, viewMatEnabled?: boolean, projMatEnabled?: boolean): void;

    addVertExtend(code: string): void;
    addFragExtend(code: string): void;

    addVertHeadCode(code: string): void;
    addVertMainCode(code: string): void;
    addFragHeadCode(code: string): void;
    addFragMainCode(code: string): void;
    addShaderObject(shaderObj: IShaderCodeObject): void;
    addShaderObjectHead(shaderObj: IShaderCodeObject): void;

    buildFragCode(): string;
    buildVertCode(): string
}

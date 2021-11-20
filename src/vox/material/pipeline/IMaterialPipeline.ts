
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {MaterialPipeType} from "./MaterialPipeType";
import IAbstractShader from "../../../vox/material/IAbstractShader";
import {IMaterialPipe} from "./IMaterialPipe";

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";

/**
 * 材质功能组装流水线行为规范
 */
interface IMaterialPipeline {
    /**
     * @param shaderCode IAbstractShader instance
     * @param force default value is false
     */
    addShaderCode(shaderCode: IAbstractShader, force: boolean): void;
    hasShaderCode(): boolean;
    addPipe(pipe: IMaterialPipe): void;
    getPipeByType(type: MaterialPipeType): IMaterialPipe;
    hasPipeByType(type: MaterialPipeType): boolean;
    createKeys(pipetypes: MaterialPipeType[]):void;    
    buildSharedUniforms(pipetypes: MaterialPipeType[]):void;
    build(shaderBuilder: IShaderCodeBuilder, pipetypes: MaterialPipeType[]):void;
    getSharedUniforms(): ShaderGlobalUniform[];
    getSelfUniformData(): ShaderUniformData;
    appendKeyString(key: string): void;
    getKeys(): string[];
    getKeysString(): string;
    reset(): void;
    clear(): void;
}
export {IMaterialPipeline}
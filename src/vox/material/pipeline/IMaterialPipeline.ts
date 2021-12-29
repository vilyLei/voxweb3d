
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { MaterialPipeType } from "./MaterialPipeType";
import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
import { IMaterialPipe } from "./IMaterialPipe";

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IRenderTexture from "../../../vox/render/IRenderTexture";

/**
 * 材质功能组装流水线行为规范
 */
interface IMaterialPipeline {
    /**
     * @param shaderCodeUUID IShaderCodeObject instance uuid
     * @param force default value is false
     */
    addShaderCodeWithUUID(shaderCodeUUID: ShaderCodeUUID, force: boolean): void;
    /**
     * @param shaderCode IShaderCodeObject instance
     * @param force default value is false
     */
    addShaderCode(shaderCode: IShaderCodeObject, force: boolean): void;
    hasShaderCode(): boolean;
    addPipe(pipe: IMaterialPipe): void;
    getPipeByType(type: MaterialPipeType): IMaterialPipe;
    hasPipeByType(type: MaterialPipeType): boolean;
    createKeys(pipetypes: MaterialPipeType[]): void;
    buildSharedUniforms(pipetypes: MaterialPipeType[]): void;
    build(shaderBuilder: IShaderCodeBuilder): void;
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipetypes: MaterialPipeType[]): void;
    getSharedUniforms(): ShaderGlobalUniform[];
    getSelfUniformData(): ShaderUniformData;
    appendKeyString(key: string): void;
    getKeys(): string[];
    getKeysString(): string;
    reset(): void;
    clear(): void;
}
export { IMaterialPipeline }

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { MaterialPipeType } from "./MaterialPipeType";
import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
import { IMaterialPipe } from "./IMaterialPipe";

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import IRenderShaderUniform from "../../../vox/render/uniform/IRenderShaderUniform";
import IShaderUniformData from "../../../vox/material/IShaderUniformData";
import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

/**
 * 材质功能组装流水线行为规范
 */
interface IMaterialPipeline {
    uuid:string;
    /**
     * @param shaderCodeUUID IShaderCodeObject instance uuid, the value from ShaderCodeUUID
     * @param force default value is false
     */
    addShaderCodeWithUUID(shaderCodeUUID: ShaderCodeUUID, force?: boolean): void;
    /**
     * @param shaderCode IShaderCodeObject instance
     * @param force default value is false
     */
    addShaderCode(shaderCode: IShaderCodeObject, force?: boolean): void;
    hasShaderCode(): boolean;
    addPipe(pipe: IMaterialPipe): void;
    getPipeByType(type: MaterialPipeType): IMaterialPipe;
    hasPipeByType(type: MaterialPipeType): boolean;
    createKeys(pipetypes: MaterialPipeType[]): void;
    buildSharedUniforms(pipetypes: MaterialPipeType[]): void;
    build(shaderBuilder: IShaderCodeBuilder): void;
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipetypes: MaterialPipeType[]): void;
    getSharedUniforms(): IRenderShaderUniform[];
    getSelfUniformData(): IShaderUniformData;
    appendKeyString(key: string): void;
    getKeys(): string[];
    getKeysString(): string;
    reset(): void;
    clear(): void;
}
export { IMaterialPipeline }
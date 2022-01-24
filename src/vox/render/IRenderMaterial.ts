/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderData from "../../vox/material/IShaderData";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import IShaderUniformData from "../../vox/material/IShaderUniformData";
import IShaderUniform from "../../vox/material/IShaderUniform";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { MaterialPipeType } from "../material/pipeline/MaterialPipeType";

interface IRenderMaterial {

    __$troMid: number;
    __$uniform: IShaderUniform;
    /**
     * pipes type list for material pipeline
     */
    pipeTypes: MaterialPipeType[];

    initializeByRenderer(texEnabled: boolean): void;
    initializeByCodeBuf(texEnabled: boolean): void;
    
    getPolygonOffset(): number[];
    createSharedUniforms(): IShaderUniform[];
    createSelfUniformData(): IShaderUniformData;
    createSharedUniformsData(): IShaderUniformData[];
    hasShaderData(): boolean;
    getShaderData(): IShaderData;
    getCodeBuf(): ShaderCodeBuffer;
    getShdUniqueName(): string;

    setDepthOffset(offset: number): void;

    getBufSortFormat(): number;
    getBufTypeList(): number[];
    getBufSizeList(): number[];
    /**
     * set TextuerProxy instances
     * @param texList [tex0,tex1,...]
     */
    setTextureList(texList: IRenderTexture[]): void;
    setTextureAt(index: number, tex: IRenderTexture): void;
    getTextureList(): IRenderTexture[];
    getTextureAt(index: number): IRenderTexture;
    getTextureTotal(): number;
    setMaterialPipeline(pipeline: IMaterialPipeline): void;
    getMaterialPipeline(): IMaterialPipeline;

    destroy(): void;
    __$attachThis(): void;
    __$detachThis(): void;
}
export default IRenderMaterial;
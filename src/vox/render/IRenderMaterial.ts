/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderData from "../../vox/material/IShaderData";
import IShaderCodeBuffer from "../../vox/material/IShaderCodeBuffer";
import IShaderUniformData from "../../vox/material/IShaderUniformData";
import IRenderShaderUniform from "../../vox/render/uniform/IRenderShaderUniform";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { MaterialPipeType } from "../material/pipeline/MaterialPipeType";

interface IRenderMaterial {

    __$troMid: number;
    __$uniform: IRenderShaderUniform;
    /**
     * pipes type list for material pipeline
     */
    pipeTypes: MaterialPipeType[];

    initializeByRenderer(texEnabled: boolean): void;
    initializeByCodeBuf(texEnabled: boolean): void;
    
    getPolygonOffset(): number[];
    createSharedUniforms(): IRenderShaderUniform[];
    createSelfUniformData(): IShaderUniformData;
    createSharedUniformsData(): IShaderUniformData[];
    hasShaderData(): boolean;
    getShaderData(): IShaderData;
    getCodeBuf(): IShaderCodeBuffer;
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
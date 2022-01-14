
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import IUniformParam from "../../../vox/material/IUniformParam";
import { MaterialPipeType } from "./MaterialPipeType";
import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import IShaderUniform from "../../../vox/material/IShaderUniform";
import IRenderTexture from "../../../vox/render/IRenderTexture";

/**
 * 材质功能组装流水线中的pipe行为规范
 */
interface IMaterialPipe {
    resetPipe(): void;
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipeType: MaterialPipeType): IRenderTexture[];
    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void;
    getPipeTypes(): MaterialPipeType[];
    getGlobalUinform(): IShaderUniform;
    getPipeKey(pipeType: MaterialPipeType): string;
}
export { IMaterialPipe }
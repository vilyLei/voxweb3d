
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
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import IRenderTexture from "../../../vox/render/IRenderTexture";

/**
 * 材质功能组装流水线中的pipe行为规范
 */
interface IMaterialPipe {
    resetPipe(): void;
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[]): IRenderTexture[];
    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void;
    getPipeTypes(): MaterialPipeType[];
    getGlobalUinform(): ShaderGlobalUniform;
    getPipeKey(pipeType: MaterialPipeType): string;
}
export { IMaterialPipe }

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { MaterialPipeType } from "./MaterialPipeType";
import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import IRenderShaderUniform from "../../../vox/render/uniform/IRenderShaderUniform";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

/**
 * 材质功能组装流水线中的pipe行为规范
 */
interface IMaterialPipe {
    resetPipe(): void;
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipeType: MaterialPipeType): IRenderTexture[];
    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void;
    getPipeTypes(): MaterialPipeType[];
    getGlobalUinform(): IRenderShaderUniform;
    getPipeKey(pipeType: MaterialPipeType): string;
}
export { IMaterialPipe }
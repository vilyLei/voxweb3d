/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";
import IRenderShaderUniform from "../../vox/render/uniform/IRenderShaderUniform";

interface IShaderUniformContext {
    
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    createShaderUniformProbe(): IShaderUniformProbe;
    createUniformVec4Probe(vec4Total:number): IShaderUniformProbe;
    createGlobalUinformFromProbe(uProbe: IShaderUniformProbe, uniformNames: string[]): IRenderShaderUniform;
    updateGlobalUinformDataFromProbe(suo: IRenderShaderUniform, uProbe: IShaderUniformProbe, uniformNames: string[]): void;
    createShaderGlobalUniformFromProbe(uProbe: IShaderUniformProbe,uns: string, uniformNames: string[]): IRenderShaderUniform;
    createShaderGlobalUniformFromProbeAt(uProbe: IShaderUniformProbe,uns: string, uniformNames: string[], index: number): IRenderShaderUniform;
    createShaderGlobalUniform(): IRenderShaderUniform;
    cloneShaderGlobalUniform(psuo: IRenderShaderUniform): IRenderShaderUniform;
}

export { IShaderUniformContext };
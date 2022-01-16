/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";
import IShaderUniform from "../../vox/material/IShaderUniform";

interface IShaderUniformContext {
    
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    createShaderUniformProbe(): IShaderUniformProbe;
    createUniformVec4Probe(vec4Total:number): IShaderUniformProbe;
    createGlobalUinformFromProbe(uProbe: IShaderUniformProbe, uniformNames: string[]): IShaderUniform;
    updateGlobalUinformDataFromProbe(suo: IShaderUniform, uProbe: IShaderUniformProbe, uniformNames: string[]): void;
    createShaderGlobalUniformFromProbe(uProbe: IShaderUniformProbe,uns: string, uniformNames: string[]): IShaderUniform;
    createShaderGlobalUniformFromProbeAt(uProbe: IShaderUniformProbe,uns: string, uniformNames: string[], index: number): IShaderUniform;
    createShaderGlobalUniform(): IShaderUniform;
    cloneShaderGlobalUniform(psuo: IShaderUniform): IShaderUniform;
}

export { IShaderUniformContext };
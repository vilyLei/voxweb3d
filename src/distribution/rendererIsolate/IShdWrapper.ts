/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
/**
 * 只能由渲染器对外提供
 */
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import ShaderUniform from "../../vox/material/ShaderUniform";

interface IShdWrapper {

    initialize(): void;
    buildThisCode(codeBuilder:IShaderCodeBuilder): void;
    getFragShaderCode(codeBuilder:IShaderCodeBuilder): string;
    getVtxShaderCode(codeBuilder:IShaderCodeBuilder): string;
    
    createSharedUniforms():ShaderUniform[];
    getUniqueShaderName(): string;
}
export {IShdWrapper};

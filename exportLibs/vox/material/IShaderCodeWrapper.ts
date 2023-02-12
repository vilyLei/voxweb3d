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
import IShaderUniform from "../../vox/material/IShaderUniform";

interface IShaderCodeWrapper {

    initialize(): void;
    buildThisCode(codeBuilder:IShaderCodeBuilder): void;
    getFragShaderCode(codeBuilder:IShaderCodeBuilder): string;
    getVertShaderCode(codeBuilder:IShaderCodeBuilder): string;
    
    createSharedUniforms():IShaderUniform[];
    getUniqueShaderName(): string;
}
export {IShaderCodeWrapper};

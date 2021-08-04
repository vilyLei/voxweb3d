
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IUniformParam from "../../../vox/material/IUniformParam";

export default interface IShaderCodeBuilder {

    addDefine(name: string, value: string): void;
    addVarying(type: string, name: string): void;
    
    addVertUniformParam(unifromParam: IUniformParam): void;
    addVertUniform(type: string, name: string, arrayLength: number): void;
    addFragUniformParam(unifromParam: IUniformParam): void;
    addFragUniform(type: string, name: string, arrayLength: number): void;

    addFragFunction(codeBlock: string): void;
    addVertFunction(codeBlock: string): void;
}
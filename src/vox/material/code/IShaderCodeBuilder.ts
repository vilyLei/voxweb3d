
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IUniformParam from "../../../vox/material/IUniformParam";

export default interface IShaderCodeBuilder {

    addVertUniformParam(unifromParam: IUniformParam): void;
    addVertUniform(type: string, name: string, arrayLength: number): void;
    addFragUniformParam(unifromParam: IUniformParam): void;
    addFragUniform(type: string, name: string, arrayLength: number): void;
}
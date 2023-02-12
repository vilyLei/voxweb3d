/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShdProgram from "../../../vox/material/IShdProgram";
import IRenderShaderUniform from "../../../vox/render/uniform/IRenderShaderUniform";
import IRenderProxy from "../../../vox/render/IRenderProxy";

export default interface IUniformBuilder {
    create(rc: IRenderProxy, shdp: IShdProgram): IRenderShaderUniform;
    getIDNS(): string;
}
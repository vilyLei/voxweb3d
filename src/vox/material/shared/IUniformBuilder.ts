/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShdProgram from "../../../vox/material/IShdProgram";
import IShaderUniform from "../../../vox/material/IShaderUniform";
import RenderProxy from "../../../vox/render/RenderProxy";

export default interface IUniformBuilder
{
    create( rc:RenderProxy,shdp:IShdProgram):IShaderUniform;
    getIDNS():string;
}
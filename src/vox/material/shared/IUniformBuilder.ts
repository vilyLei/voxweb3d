/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShdProgram from "../../../vox/material/ShdProgram";
import ShaderUniform from "../../../vox/material/ShaderUniform";
import RenderProxy from "../../../vox/render/RenderProxy";

export default interface IUniformBuilder
{
    create( rc:RenderProxy,shdp:ShdProgram):ShaderUniform;
    getIDNS():string;
}
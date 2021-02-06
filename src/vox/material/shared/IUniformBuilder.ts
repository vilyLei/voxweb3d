/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShdProgramT from "../../../vox/material/ShdProgram";
import * as ShaderUniformT from "../../../vox/material/ShaderUniform";
import * as RenderProxyT from "../../../vox/render/RenderProxy";

import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export namespace shared
        {
            export interface IUniformBuilder
            {
                create( rc:RenderProxy,shdp:ShdProgram):ShaderUniform;
                getIDNS():string;
            }
        }
    }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as ShaderUniformProbeT from "../../vox/material/ShaderUniformProbe";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export interface IShaderUniform
        {
            use(rc:RenderProxy):void;
            useByLocation(rc:RenderProxy,type:number,location:any,i:number):void;
            useByShd(rc:RenderProxy,shd:ShaderProgram):void
            updateData():void;
            destroy():void;
        }
    }
}
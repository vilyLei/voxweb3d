/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as ShaderUniformProbeT from "../../vox/material/ShaderUniformProbe";
import * as ShdProgramT from "../../vox/material/ShdProgram";
import * as IRenderShaderT from "../../vox/render/IRenderShader";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import IRenderShader = IRenderShaderT.vox.render.IRenderShader;

export namespace vox
{
    export namespace material
    {
        export interface IShaderUniform
        {
            next:IShaderUniform;
            use(rc:IRenderShader):void;
            useByLocation(rc:IRenderShader,type:number,location:any,i:number):void;
            useByShd(rc:IRenderShader,shd:ShdProgram):void
            updateData():void;
            destroy():void;
        }
    }
}
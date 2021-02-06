/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as UniformConstT from "../../../vox/material/UniformConst";
import * as ShdProgramT from "../../../vox/material/ShdProgram";
import * as ShaderUniformT from "../../../vox/material/ShaderUniform";
import * as ShaderGlobalUniformT from "../../../vox/material/ShaderGlobalUniform";
import * as IUniformBuilderT from "../../../vox/material/shared/IUniformBuilder";
import * as RenderProxyT from "../../../vox/render/RenderProxy";

import UniformConst = UniformConstT.vox.material.UniformConst;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import ShaderGlobalUniform = ShaderGlobalUniformT.vox.material.ShaderGlobalUniform;
import IUniformBuilder = IUniformBuilderT.vox.material.shared.IUniformBuilder;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export namespace shared
        {
            export class CameraParamUniformBuilder implements IUniformBuilder
            {
                create( rc:RenderProxy,shdp:ShdProgram):ShaderUniform
                {
                    let suo:ShaderGlobalUniform = null;
                    if(shdp.hasUniformByName(UniformConst.CameraParamUNS))
                    {
                        suo = new ShaderGlobalUniform();
                        suo.uniformNameList = [UniformConst.CameraParamUNS];
                        suo.copyDataFromProbe(rc.getCamera().ufrustumProbe);
                    }
                    return suo;                
                }
                getIDNS():string
                {
                    return "CameraParamUniformBuilder";
                }
            }
        }
    }
}
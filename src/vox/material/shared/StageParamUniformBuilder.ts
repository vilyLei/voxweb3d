/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as UniformConstT from "../../../vox/material/UniformConst";
import * as ShaderProgramT from "../../../vox/material/ShaderProgram";
import * as ShaderUniformT from "../../../vox/material/ShaderUniform";
import * as ShaderGlobalUniformT from "../../../vox/material/ShaderGlobalUniform";
import * as IUniformBuilderT from "../../../vox/material/shared/IUniformBuilder";
import * as RenderProxyT from "../../../vox/render/RenderProxy";

import UniformConst = UniformConstT.vox.material.UniformConst;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
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
            export class StageParamUniformBuilder implements IUniformBuilder
            {
                create( rc:RenderProxy,shdp:ShaderProgram):ShaderUniform
                {
                    let suo:ShaderGlobalUniform = null;
                    if(shdp.hasUniformByName(UniformConst.StageParamUNS))
                    {
                        suo = new ShaderGlobalUniform();
                        suo.uniformNameList = [UniformConst.StageParamUNS];
                        suo.copyDataFromProbe(rc.getStage3D().uProbe);                    
                    }
                    return suo;                
                }
                getIDNS():string
                {
                    return "StageParamUniformBuilder";
                }
            }
        }
    }
}
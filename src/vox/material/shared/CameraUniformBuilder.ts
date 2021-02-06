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
import * as CameraBaseT from "../../../vox/view/CameraBase";
import * as RenderProxyT from "../../../vox/render/RenderProxy";

import UniformConst = UniformConstT.vox.material.UniformConst;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import ShaderGlobalUniform = ShaderGlobalUniformT.vox.material.ShaderGlobalUniform;
import IUniformBuilder = IUniformBuilderT.vox.material.shared.IUniformBuilder;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export namespace shared
        {
            export class CameraUniformBuilder implements IUniformBuilder
            {
                create( rc:RenderProxy,shdp:ShdProgram):ShaderUniform
                {
                    let suo:ShaderGlobalUniform = null;
                    let cam:CameraBase = rc.getCamera();
                    
                    if(shdp.hasUniformByName(UniformConst.CameraViewMatUNS) && shdp.hasUniformByName(UniformConst.CameraProjectiveMatUNS))
                    {
                        suo = new ShaderGlobalUniform();
                        suo.uniformNameList = [UniformConst.CameraViewMatUNS,UniformConst.CameraProjectiveMatUNS];
                        suo.copyDataFromProbe(cam.matUProbe);
                    }
                    else if(shdp.hasUniformByName(UniformConst.CameraViewMatUNS))
                    {
                        suo = new ShaderGlobalUniform();
                        suo.uniformNameList = [UniformConst.CameraViewMatUNS];
                        suo.copyDataFromProbeAt(0,cam.matUProbe);
                    }
                    else if(shdp.hasUniformByName(UniformConst.CameraProjectiveMatUNS))
                    {
                        suo = new ShaderGlobalUniform();
                        suo.uniformNameList = [UniformConst.CameraProjectiveMatUNS];
                        suo.copyDataFromProbeAt(1,cam.matUProbe);
                    }
                    return suo;                
                }
                getIDNS():string
                {
                    return "CameraUniformBuilder";
                }
            }
        }
    }
}
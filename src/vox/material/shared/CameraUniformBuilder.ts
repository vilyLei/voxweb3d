/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../../vox/material/UniformConst";
import ShdProgram from "../../../vox/material/ShdProgram";
import ShaderUniform from "../../../vox/material/ShaderUniform";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import IUniformBuilder from "../../../vox/material/shared/IUniformBuilder";
import CameraBase from "../../../vox/view/CameraBase";
import RenderProxy from "../../../vox/render/RenderProxy";

export default class CameraUniformBuilder implements IUniformBuilder
{
    create( rc:RenderProxy,shdp:ShdProgram):ShaderUniform
    {
        let suo:ShaderGlobalUniform = null;
        let cam:CameraBase = rc.getCamera();
        
        if(shdp.hasUniformByName(UniformConst.CameraViewMatUNS) && shdp.hasUniformByName(UniformConst.CameraProjectiveMatUNS))
        {
            suo = new ShaderGlobalUniform();
            suo.uns = "u_viewAndProjMat";
            suo.uniformNameList = [UniformConst.CameraViewMatUNS,UniformConst.CameraProjectiveMatUNS];
            suo.copyDataFromProbe(cam.matUProbe);
        }
        else if(shdp.hasUniformByName(UniformConst.CameraViewMatUNS))
        {
            suo = new ShaderGlobalUniform();
            suo.uns = "u_viewMat";
            suo.uniformNameList = [UniformConst.CameraViewMatUNS];
            suo.copyDataFromProbeAt(0,cam.matUProbe);
        }
        else if(shdp.hasUniformByName(UniformConst.CameraProjectiveMatUNS))
        {
            suo = new ShaderGlobalUniform();
            suo.uns = "u_projMat";
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
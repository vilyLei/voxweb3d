/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../../vox/material/UniformConst";
import IShdProgram from "../../../vox/material/IShdProgram";
import IShaderUniform from "../../../vox/material/IShaderUniform";
import IUniformBuilder from "../../../vox/material/shared/IUniformBuilder";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import RenderProxy from "../../../vox/render/RenderProxy";

export default class CameraUniformBuilder implements IUniformBuilder {
    
    create(rc: RenderProxy, shdp: IShdProgram): IShaderUniform {

        let cam: IRenderCamera = rc.getCamera();
        if (shdp.hasUniformByName(UniformConst.CameraViewMatUNS) && shdp.hasUniformByName(UniformConst.CameraProjectiveMatUNS)) {
            return rc.uniformContext.createShaderGlobalUniformFromProbe(cam.matUProbe, "u_viewAndProjMat", [UniformConst.CameraViewMatUNS, UniformConst.CameraProjectiveMatUNS]);
        }
        else if (shdp.hasUniformByName(UniformConst.CameraViewMatUNS)) {
            return rc.uniformContext.createShaderGlobalUniformFromProbe(cam.matUProbe, "u_viewMat", [UniformConst.CameraViewMatUNS], 0);
        }
        else if (shdp.hasUniformByName(UniformConst.CameraProjectiveMatUNS)) {
            return rc.uniformContext.createShaderGlobalUniformFromProbe(cam.matUProbe, "u_projMat", [UniformConst.CameraProjectiveMatUNS], 1);
        }
        return null;
    }
    getIDNS(): string {
        return "CameraUniformBuilder";
    }
}
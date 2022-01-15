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
        let suo: IShaderUniform = null;
        let cam: IRenderCamera = rc.getCamera();

        if (shdp.hasUniformByName(UniformConst.CameraViewMatUNS) && shdp.hasUniformByName(UniformConst.CameraProjectiveMatUNS)) {
            //suo = new ShaderGlobalUniform();
            suo = rc.uniformContext.createShaderGlobalUniformFromProbe(cam.matUProbe, "u_viewAndProjMat", [UniformConst.CameraViewMatUNS, UniformConst.CameraProjectiveMatUNS]);
            // suo.uns = "u_viewAndProjMat";
            // suo.uniformNameList = [UniformConst.CameraViewMatUNS, UniformConst.CameraProjectiveMatUNS];
            // suo.copyDataFromProbe(cam.matUProbe);
        }
        else if (shdp.hasUniformByName(UniformConst.CameraViewMatUNS)) {
            //suo = new ShaderGlobalUniform();
            suo = rc.uniformContext.createShaderGlobalUniformFromProbe(cam.matUProbe, "u_viewMat", [UniformConst.CameraViewMatUNS], 0);
            // suo.uns = "u_viewMat";
            // suo.uniformNameList = [UniformConst.CameraViewMatUNS];
            // suo.copyDataFromProbeAt(0, cam.matUProbe);
        }
        else if (shdp.hasUniformByName(UniformConst.CameraProjectiveMatUNS)) {
            //suo = new ShaderGlobalUniform();
            suo = rc.uniformContext.createShaderGlobalUniformFromProbe(cam.matUProbe, "u_projMat", [UniformConst.CameraProjectiveMatUNS], 1);
            // suo.uns = "u_projMat";
            // suo.uniformNameList = [UniformConst.CameraProjectiveMatUNS];
            // suo.copyDataFromProbeAt(1, cam.matUProbe);
        }
        return suo;
    }
    getIDNS(): string {
        return "CameraUniformBuilder";
    }
}
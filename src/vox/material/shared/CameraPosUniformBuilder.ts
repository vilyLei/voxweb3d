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
import IUniformParam from "../../../vox/material/IUniformParam";
import IUniformBuilder from "../../../vox/material/shared/IUniformBuilder";
import RenderProxy from "../../../vox/render/RenderProxy";

export default class CameraPosUniformBuilder implements IUniformBuilder {
    create(rc: RenderProxy, shdp: ShdProgram): ShaderUniform {
        let suo: ShaderGlobalUniform = null;
        let param: IUniformParam = UniformConst.CameraPosParam;
        if (shdp.hasUniformByName(param.name)) {
            suo = new ShaderGlobalUniform();
            suo.uns = param.name;
            suo.uniformNameList = [param.name];
            suo.copyDataFromProbe(rc.getCamera().ucameraPosProbe);
        }
        return suo;
    }
    getIDNS(): string {
        return "CameraPosUniformBuilder";
    }
}
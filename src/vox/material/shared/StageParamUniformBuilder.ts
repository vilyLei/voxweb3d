/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../../vox/material/UniformConst";
import ShdProgram from "../../../vox/material/ShdProgram";
import IShaderUniform from "../../../vox/material/IShaderUniform";
import IUniformParam from "../../../vox/material/IUniformParam";
import IUniformBuilder from "../../../vox/material/shared/IUniformBuilder";
import RenderProxy from "../../../vox/render/RenderProxy";

export default class StageParamUniformBuilder implements IUniformBuilder {
    
    create(rc: RenderProxy, shdp: ShdProgram): IShaderUniform {

        let suo: IShaderUniform = null;
        let param: IUniformParam = UniformConst.StageParam;
        if (shdp.hasUniformByName(param.name)) {
            suo = rc.uniformContext.createShaderGlobalUniformFromProbe(rc.getStage3D().uProbe, param.name, [param.name]);
            // suo.uns = param.name;
            // suo.uniformNameList = [param.name];
            // suo.copyDataFromProbe(rc.getStage3D().uProbe);
        }
        return suo;
    }
    getIDNS(): string {
        return "StageParamUniformBuilder";
    }
}
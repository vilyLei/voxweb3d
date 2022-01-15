/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../../vox/material/UniformConst";
import IShdProgram from "../../../vox/material/IShdProgram";
import IShaderUniform from "../../../vox/material/IShaderUniform";
import IUniformParam from "../../../vox/material/IUniformParam";
import IUniformBuilder from "../../../vox/material/shared/IUniformBuilder";
import RenderProxy from "../../../vox/render/RenderProxy";

export default class StageParamUniformBuilder implements IUniformBuilder {
    
    create(rc: RenderProxy, shdp: IShdProgram): IShaderUniform {

        let param: IUniformParam = UniformConst.StageParam;
        if (shdp.hasUniformByName(param.name))
            return rc.uniformContext.createShaderGlobalUniformFromProbe(rc.getStage3D().uProbe, param.name, [param.name]);
        return null;
    }
    getIDNS(): string {
        return "StageParamUniformBuilder";
    }
}
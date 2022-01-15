/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../../vox/material/UniformConst";
import IShdProgram from "../../../vox/material/IShdProgram";
import IShaderUniform from "../../../vox/material/IShaderUniform";
// import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import IUniformParam from "../../../vox/material/IUniformParam";
import IUniformBuilder from "../../../vox/material/shared/IUniformBuilder";
import RenderProxy from "../../../vox/render/RenderProxy";

export default class CameraPosUniformBuilder implements IUniformBuilder {
    create(rc: RenderProxy, shdp: IShdProgram): IShaderUniform {
        
        let param: IUniformParam = UniformConst.CameraPosParam;
        if (shdp.hasUniformByName(param.name))
            return rc.uniformContext.createShaderGlobalUniformFromProbe(rc.getCamera().ucameraPosProbe, param.name, [param.name]);
        return null;
    }
    getIDNS(): string {
        return "CameraPosUniformBuilder";
    }
}
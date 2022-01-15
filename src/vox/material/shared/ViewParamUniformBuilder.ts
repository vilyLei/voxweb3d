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

export default class ViewParamUniformBuilder implements IUniformBuilder {
    create(rc: RenderProxy, shdp: IShdProgram): IShaderUniform {
        let suo: IShaderUniform = null;
        let param: IUniformParam = UniformConst.ViewportParam;
        if (shdp.hasUniformByName(param.name)) {
            suo = rc.uniformContext.createShaderGlobalUniformFromProbe((rc.getRenderAdapter() as any).uViewProbe, param.name, [param.name]);
            // suo.uns = param.name;
            // suo.uniformNameList = [param.name];
            // suo.copyDataFromProbe((rc.getRenderAdapter() as any).uViewProbe);
        }
        return suo;
    }
    getIDNS(): string {
        return "ViewParamUniformBuilder";
    }
}
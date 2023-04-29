/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../../vox/material/UniformConst";
import IShdProgram from "../../../vox/material/IShdProgram";
import IRenderShaderUniform from "../../../vox/render/uniform/IRenderShaderUniform";
import IUniformParam from "../../../vox/material/IUniformParam";
import IUniformBuilder from "../../../vox/material/shared/IUniformBuilder";
import RenderProxy from "../../../vox/render/RenderProxy";

export default class ViewParamUniformBuilder implements IUniformBuilder {
    
    create(rc: RenderProxy, shdp: IShdProgram): IRenderShaderUniform {
        
        let param: IUniformParam = UniformConst.ViewportParam;
        if (shdp.hasUniformByName(param.name))
            return rc.uniformContext.createShaderGlobalUniformFromProbe((rc.getRenderAdapter() as any).uViewProbe, param.name, [param.name]);
        return null;
    }
    getIDNS(): string {
        return "ViewParamUniformBuilder";
    }
}
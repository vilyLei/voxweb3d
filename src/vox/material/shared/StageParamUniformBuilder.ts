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
import RenderProxy from "../../../vox/render/RenderProxy";

export default class StageParamUniformBuilder implements IUniformBuilder
{
    create( rc:RenderProxy,shdp:ShdProgram):ShaderUniform
    {
        let suo:ShaderGlobalUniform = null;
        if(shdp.hasUniformByName(UniformConst.StageParamUNS))
        {
            suo = new ShaderGlobalUniform();
            suo.uniformNameList = [UniformConst.StageParamUNS];
            suo.copyDataFromProbe(rc.getStage3D().uProbe);                    
        }
        return suo;                
    }
    getIDNS():string
    {
        return "StageParamUniformBuilder";
    }
}
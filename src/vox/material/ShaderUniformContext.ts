/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderUniformProbe } from "../../vox/material/IShaderUniformProbe";
import IShaderUniform from "../../vox/material/IShaderUniform";

import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
import UniformVec4Probe from "../../vox/material/UniformVec4Probe";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import { IShaderUniformContext } from "./IShaderUniformContext";

class ShaderUniformContext implements IShaderUniformContext {

    private m_rcuid: number = 0;

    constructor(rcuid: number) {
        this.m_rcuid = rcuid;
    }
    createShaderUniformProbe(): IShaderUniformProbe {
        let probe = new ShaderUniformProbe();
        probe.bindSlotAt(this.m_rcuid);
        return probe;
    }
    createUniformVec4Probe(vec4Total: number): IShaderUniformProbe {
        let probe = new UniformVec4Probe(vec4Total);
        probe.bindSlotAt(this.m_rcuid);
        return probe;
    }
    createGlobalUinformFromProbe(uProbe: IShaderUniformProbe, uniformNames: string[] = null): IShaderUniform {

        let suo: ShaderGlobalUniform = this.createShaderGlobalUniform() as ShaderGlobalUniform;
        this.updateGlobalUinformDataFromProbe(suo, uProbe, uniformNames);
        return suo;
    }
    updateGlobalUinformDataFromProbe(psuo: IShaderUniform, uProbe: IShaderUniformProbe, uniformNames: string[] = null): void {
        let suo = psuo as ShaderGlobalUniform;
        suo.uniformNameList = uniformNames != null ? uniformNames : uProbe.uniformNames;
        suo.copyDataFromProbe(uProbe);
        uProbe.update();
    }
    createShaderGlobalUniform(): IShaderUniform {
        return new ShaderGlobalUniform();
    }
    cloneShaderGlobalUniform(psuo: IShaderUniform): IShaderUniform {
        let suo = psuo as ShaderGlobalUniform;
        return suo.clone();
    }
}

export { ShaderUniformContext };
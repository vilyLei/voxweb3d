/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";

import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
import UniformVec4Probe from "../../vox/material/UniformVec4Probe";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";

class ShaderUniformContext {

    private m_rcuid: number = 0;
    
    constructor(rcuid: number) {
        this.m_rcuid = rcuid;
    }
    createShaderUniformProbe(): ShaderUniformProbe {
        let probe = new ShaderUniformProbe();
        probe.bindSlotAt( this.m_rcuid );
        return probe;
    }
    createUniformVec4Probe(vec4Total:number): UniformVec4Probe {
        let probe = new UniformVec4Probe(vec4Total);
        probe.bindSlotAt( this.m_rcuid );
        return probe;
    }
    createGlobalUinformFromProbe(uProbe: ShaderUniformProbe, uniformNames: string[]): ShaderGlobalUniform {

        let suo: ShaderGlobalUniform = new ShaderGlobalUniform();
        suo.uniformNameList = uniformNames;
        suo.copyDataFromProbe(uProbe);
        uProbe.update();
        return suo;
    }
    createShaderGlobalUniform(): ShaderGlobalUniform {
        return new ShaderGlobalUniform();
    }
}

export { ShaderUniformContext };
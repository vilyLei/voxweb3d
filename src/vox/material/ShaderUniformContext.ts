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
    createGlobalUinformFromProbe(uProbe: ShaderUniformProbe, uniformNames: string[] = null): ShaderGlobalUniform {

        let suo: ShaderGlobalUniform = this.createShaderGlobalUniform();
        // suo.uniformNameList = uniformNames != null ? uniformNames : uProbe.uniformNames;
        // suo.copyDataFromProbe(uProbe);
        // uProbe.update();
        this.updateGlobalUinformDataFromProbe(suo, uProbe, uniformNames);
        return suo;
    }
    updateGlobalUinformDataFromProbe(suo: ShaderGlobalUniform, uProbe: ShaderUniformProbe, uniformNames: string[] = null): void {

        suo.uniformNameList = uniformNames != null ? uniformNames : uProbe.uniformNames;
        suo.copyDataFromProbe(uProbe);
        uProbe.update();
    }
    createShaderGlobalUniform(): ShaderGlobalUniform {
        return new ShaderGlobalUniform();
    }
}

export { ShaderUniformContext };
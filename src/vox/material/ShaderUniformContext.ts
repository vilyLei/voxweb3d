/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { UniformDataSlot } from "../../vox/material/UniformDataSlot";
import { IShaderUniformProbe } from "../../vox/material/IShaderUniformProbe";
import IShaderUniform from "../../vox/material/IShaderUniform";

import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
import UniformVec4Probe from "../../vox/material/UniformVec4Probe";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import { IShaderUniformContext } from "./IShaderUniformContext";

class ShaderUniformContext implements IShaderUniformContext {

    private m_rcuid: number = 0;
    private m_udSlot: UniformDataSlot = null;
    constructor(rcuid: number, dataTotal: number = 256) {
        this.m_rcuid = rcuid;
        this.m_udSlot = new UniformDataSlot(rcuid, dataTotal);
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    createShaderUniformProbe(): IShaderUniformProbe {
        let probe = new ShaderUniformProbe(this.m_udSlot);
        return probe;
    }
    createUniformVec4Probe(vec4Total: number): IShaderUniformProbe {
        let probe = new UniformVec4Probe(this.m_udSlot, vec4Total);
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
        let suo = new ShaderGlobalUniform(this.m_udSlot);
        return suo;
    }
    createShaderGlobalUniformFromProbe(uProbe: IShaderUniformProbe, puns: string, uniformNames: string[] = null): IShaderUniform {
        let suo = new ShaderGlobalUniform(this.m_udSlot);
        suo.uns = puns;
        suo.uniformNameList = uniformNames != null ? uniformNames : uProbe.uniformNames;
        suo.copyDataFromProbe(uProbe);
        uProbe.update();
        return suo;
    }
    createShaderGlobalUniformFromProbeAt(uProbe: IShaderUniformProbe, puns: string, uniformNames: string[] = null, index: number): IShaderUniform {
        let suo = new ShaderGlobalUniform(this.m_udSlot);
        suo.uns = puns;
        suo.uniformNameList = uniformNames != null ? uniformNames : uProbe.uniformNames;
        if (index < 0) {
            suo.copyDataFromProbe(uProbe);
        }
        else {
            suo.copyDataFromProbeAt(index, uProbe);
        }
        uProbe.update();
        return suo;
    }
    cloneShaderGlobalUniform(psuo: IShaderUniform): IShaderUniform {
        let suo = psuo as ShaderGlobalUniform;
        return suo.clone();
    }
}

export { ShaderUniformContext };
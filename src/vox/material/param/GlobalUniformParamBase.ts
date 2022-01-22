/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderUniform from "../../../vox/material/IShaderUniform";
import { IShaderUniformProbe } from "../../../vox/material/IShaderUniformProbe";
import { IShaderUniformContext } from "../../../vox/material/IShaderUniformContext";

class GlobalUniformParamBase {

    protected m_shdCtx: IShaderUniformContext = null;

    uProbe: IShaderUniformProbe = null;
    uniform: IShaderUniform = null;

    constructor(shdCtx: IShaderUniformContext, autoBuild: boolean = true) {
        this.m_shdCtx = shdCtx;
        if (autoBuild) {
            this.uProbe = shdCtx.createShaderUniformProbe();
            this.uniform = shdCtx.createShaderGlobalUniform();
        }
    }
    getNames(): string[] {
        return [];
    }
    cloneUniform(): IShaderUniform {
        return this.m_shdCtx.cloneShaderGlobalUniform(this.uniform);
    }
    buildData(): void {
        this.m_shdCtx.updateGlobalUinformDataFromProbe(this.uniform, this.uProbe, this.getNames());
        this.uProbe.update();
    }
    destroy(): void {

        this.uProbe = null;
        this.uniform = null;
        this.m_shdCtx = null;
    }
}

export { GlobalUniformParamBase }
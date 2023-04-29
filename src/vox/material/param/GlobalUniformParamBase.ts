/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderShaderUniform from "../../../vox/render/uniform/IRenderShaderUniform";
import { IShaderUniformProbe } from "../../../vox/material/IShaderUniformProbe";
import { IShaderUniformContext } from "../../../vox/material/IShaderUniformContext";

class GlobalUniformParamBase {

    protected m_shdCtx: IShaderUniformContext = null;

    uProbe: IShaderUniformProbe = null;
    uniform: IRenderShaderUniform = null;

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
    cloneUniform(): IRenderShaderUniform {
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
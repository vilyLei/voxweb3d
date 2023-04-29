/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderShaderUniform from "../../../vox/render/uniform/IRenderShaderUniform";
import { GlobalUniformParamBase } from "../../../vox/material/param/GlobalUniformParamBase";
import { IShaderUniformContext } from "../../../vox/material/IShaderUniformContext";

class MaterialPipeBase {

    private static s_uid: number = 0;
    private m_uid: number = -1;
    protected m_uniformParam: GlobalUniformParamBase = null;
    protected m_dirty: boolean = false;
    protected m_shdCtx: IShaderUniformContext = null;

    constructor(shdCtx: IShaderUniformContext) {
        this.m_shdCtx = shdCtx;
        this.m_uid = MaterialPipeBase.s_uid++;
    }

    getUid(): number {
        return this.m_uid;
    }
    update(): void {
        if (this.m_uniformParam != null && this.m_dirty) {
            this.m_dirty = false;
            this.m_uniformParam.uProbe.update();
        }
    }
    getGlobalUinform(): IRenderShaderUniform {
        return this.m_uniformParam != null ? this.m_uniformParam.cloneUniform() : null;
    }
    destroy(): void {
        
        if(this.m_uniformParam != null) this.m_uniformParam.destroy();
        this.m_uniformParam = null;
        this.m_shdCtx = null;
    }
}
export { MaterialPipeBase }
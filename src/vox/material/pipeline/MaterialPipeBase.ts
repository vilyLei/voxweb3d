/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import { GlobalUniformParamBase } from "../../../vox/material/GlobalUniformParam";
import RenderProxy from "../../../vox/render/RenderProxy";

class MaterialPipeBase {

    private static s_uid: number = 0;
    private m_uid: number = -1;
    protected m_uniformParam: GlobalUniformParamBase = null;
    protected m_dirty: boolean = false;
    protected m_renderProxy: RenderProxy = null;

    constructor(renderProxy: RenderProxy) {
        this.m_renderProxy = renderProxy;
        this.m_uid = MaterialPipeBase.s_uid++;
    }

    getUid(): number {
        return this.m_uid;
    }
    // initialize(): void {
    //     if (this.m_uniformParam == null) {
    //         this.m_uniformParam = new GlobalEnvLightUniformParam( this.m_renderProxy );
    //         this.m_uniformParam.uProbe.addVec4Data(UniformConst.EnvLightParams.data, UniformConst.EnvLightParams.arrayLength);
    //         this.m_uniformParam.buildData();
    //     }
    // }
    update(): void {
        if (this.m_uniformParam != null && this.m_dirty) {
            this.m_dirty = false;
            this.m_uniformParam.uProbe.update();
        }
    }
    getGlobalUinform(): ShaderGlobalUniform {
        return this.m_uniformParam != null ? this.m_uniformParam.uniform.clone() : null;
    }
    destroy(): void {

        if(this.m_uniformParam != null) this.m_uniformParam.destroy();
        this.m_uniformParam = null;
        this.m_renderProxy = null;
    }
}
export { MaterialPipeBase }
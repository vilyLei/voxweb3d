/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderProcess from "../../vox/render/IRenderProcess";
import IRendererInstance from "../../vox/scene/IRendererInstance";
import RendererStatus from "../../voxprofile/entity/RendererStatus";
export default class ProfileInstance {
    private m_rprocess: IRenderProcess = null;
    private m_renderer: IRendererInstance = null;
    private m_status: RendererStatus = null;

    constructor() {
    }
    initialize(renderer: IRendererInstance): void {
        if (this.m_renderer == null) {
            this.m_renderer = renderer;
            this.m_rprocess = this.m_renderer.createSeparatedProcess();
            this.m_status = new RendererStatus();
            this.m_status.initialize(this.m_renderer, this.m_rprocess);
        }
    }
    getFPS(): number {
        return this.m_status.getFPS();
    }
    run(syncStageSize: boolean = false): void {
        if (this.m_renderer != null) {
            this.m_status.run(syncStageSize);
            this.m_renderer.runProcess(this.m_rprocess);
        }
    }
    toString(): string {
        return "[ProfileInstance]";
    }
}
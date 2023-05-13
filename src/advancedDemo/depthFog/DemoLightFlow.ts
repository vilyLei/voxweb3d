/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";

import { SceneFogFlow } from "./scene/SceneFogFlow";

import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import DebugFlag from "../../vox/debug/DebugFlag";
import MouseEvent from "../../vox/event/MouseEvent";
import IMouseEvent from "../../vox/event/IMouseEvent";

export class DemoLightFlow {
    constructor() {
    }
    private m_rc: RendererScene = null;
    private m_esc = new SceneFogFlow();

    initialize(): void {
        console.log("depthLight::DemoLightFlow::initialize()......");

        if (!this.m_rc) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45.0, 1.0, 9000.0);
            rparam.setCamPosition(2500.0, 2500.0, 2500.0);
            rparam.setAttriAntialias(true);
            rparam.setDitherEanbled(false);
            rparam.syncBgColor = false;

            this.m_rc = new RendererScene();
            this.m_rc.initialize(rparam, 7);
            this.m_rc.setRendererProcessParam(1, true, true);
            this.m_rc.updateCamera();

            this.m_esc.initialize(this.m_rc);

			new MouseInteraction().initialize( this.m_rc, 0, true).setAutoRunning(true);
			new RenderStatusDisplay( this.m_rc, true);

			this.m_rc.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

        }
    }
	private m_rflag = true;
	private mouseDown(evt: IMouseEvent): void {
		this.m_rflag = true;
	}
    run(): void {

		if(this.m_rflag) {
			// logic run

			this.m_esc.runBegin();

			this.m_rc.setClearRGBAColor4f(1.0,1.0,1.0,1.0);
			this.m_rc.synFBOSizeWithViewport();
			this.m_rc.runBegin();
			this.m_rc.update();

			this.m_esc.run();

			this.m_rc.run(false);
			this.m_rc.runEnd();
			DebugFlag.Flag_0 = 0;
			this.m_rflag = true;
		}
    }
}

export default DemoLightFlow;

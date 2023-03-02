/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import RendererScene from "../../vox/scene/RendererScene";
import H5FontSystem from "../../vox/text/H5FontSys";

import CameraTrack from "../../vox/view/CameraTrack";

import { SceneFogFlow } from "../../advancedDemo/depthLight/scene/SceneFogFlow";

export class DemoLightFlow {
    constructor() {
    }
    private m_rc: RendererScene = null;
    private m_rct: IRendererInstanceContext = null;
    private m_camTrack: CameraTrack = null;

    private m_esc: SceneFogFlow = new SceneFogFlow();

    initialize(): void {
        console.log("depthLight::DemoLightFlow::initialize()......");
        if (this.m_rc == null) {
            H5FontSystem.GetInstance().initialize("fontTex", 18, 512, 512, false, false);
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0, 0.1, 5000.0);
            rparam.setCamPosition(2500.0, 2500.0, 2500.0);
            //rparam.setCamPosition(3000.0,0.0,3000.0);

            this.m_rc = new RendererScene();
            this.m_rc.initialize(rparam, 6);
            this.m_rc.setRendererProcessParam(1, true, true);
            this.m_rc.updateCamera();
            this.m_rct = this.m_rc.getRendererContext();
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rc.getCamera());
            this.m_esc.initialize(this.m_rc);

        }
    }

    run(): void {
        // logic run
        this.m_esc.runBegin();

        this.m_rc.runBegin();
        this.m_rc.update();
        this.m_rc.synFBOSizeWithViewport();

        this.m_esc.renderRun();

        this.m_rc.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_esc.runEnd();
    }
}

export default DemoLightFlow;
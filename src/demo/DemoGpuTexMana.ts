
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import TextureResSlot from "../vox/texture/TextureResSlot";
import CameraTrack from "../vox/view/CameraTrack";

import * as DemoSceneT from "./texMana/DemoScene";
import DemoScene = DemoSceneT.demo.texMama.DemoScene;
import CameraBase from "../vox/view/CameraBase";

export class DemoGpuTexMana {
    constructor() {
    }
    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_scene: DemoScene = new DemoScene();
    initialize(): void {
        console.log("DemoGpuTexMana::initialize()......");
        if (this.m_rcontext == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setMatrix4AllocateSize(4096);
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_renderer = new RendererInstance();
            let stage3D: Stage3D = new Stage3D(this.m_renderer.getRCUid(), document);
            this.m_renderer.__$setStage3D(stage3D);
            this.m_renderer.initialize(rparam, new CameraBase());
            this.m_rcontext = this.m_renderer.getRendererContext();

            stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            this.m_statusDisp.initialize();
            this.m_scene.initialize(this.m_renderer);

        }
    }
    mouseDownListener(evt: any): void {
        this.m_scene.mouseDown();
    }
    run(): void {
        this.m_scene.run();
        this.m_statusDisp.statusInfo = "/" + this.m_rcontext.getTextureAttachTotal() + "/" + TextureResSlot.GetInstance().getTextureTotal();
        this.m_statusDisp.update();

        this.m_rcontext.setClearRGBColor3f(0.1, 0.1, 0.2);
        this.m_rcontext.renderBegin();

        this.m_renderer.update();
        this.m_renderer.run();

        this.m_rcontext.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
        this.m_rcontext.updateCamera();

    }
}
export default DemoGpuTexMana;
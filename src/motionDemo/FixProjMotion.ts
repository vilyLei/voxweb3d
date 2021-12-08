import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import {MotionScene} from "./fixProjMotion/MotionScene";

export class FixProjMotion {
    constructor() {
    }
    
    private m_rscene: RendererScene = null;

    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_motionScene: MotionScene = new MotionScene();
    initialize(): void {
        console.log("FixProjMotion::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            this.m_statusDisp.initialize();
            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseUpListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_motionScene.initialize(this.m_rscene.getRenderer(), this.m_texLoader);

        }
    }
    mouseUpListener(evt: any): void {
    }
    run(): void {
        
        this.m_motionScene.run();

        this.m_statusDisp.update();
        
        this.m_rscene.run();
    }
}
export default FixProjMotion;
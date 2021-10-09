import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import { QuadBrokenLine3DEntity } from "../vox/entity/QuadLine3DEntity";

export class DemoQuadLine {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    initialize(): void {
        console.log("DemoQuadLine::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            //this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());


            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_statusDisp.initialize();
            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            let brokenLine:QuadBrokenLine3DEntity = new QuadBrokenLine3DEntity();
            //brokenLine.initialize([0.0,0.0,0.0, 200.0,0.0,0.0], 6.0);
            //brokenLine.initialize([0.0,0.0,0.0, 0.0,0.0,200.0, 100.0,0.0,100.0, 200.0,0.0,200.0],5.0);
            brokenLine.initialize([0.0,0.0,0.0, 0.0,0.0,200.0, 100.0,0.0,200.0, 100.0,0.0,400.0, 100.0,-150.0,500.0],40.0);
            this.m_rscene.addEntity(brokenLine);
        }
    }
    run(): void {

        this.m_statusDisp.update();

        this.m_rscene.run();

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        //  //console.log("#---  end");
    }
}
export default DemoQuadLine;
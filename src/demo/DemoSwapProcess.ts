
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import Color4 from "../vox/material/Color4";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import RendererState from "../vox/render/RendererState";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

/**
 * This example: move rendering runtime displayEntity to different renderer process
 */
export class DemoSwapProcess {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_targets: DisplayEntity[] = [];
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoSwapProcess::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let tex0 = this.getImageTexByUrl("static/assets/wood_01.jpg");
            let tex1 = this.getImageTexByUrl("static/assets/yanj.jpg");
            let tex2 = this.getImageTexByUrl("static/assets/tile_002.jpg");
            let tex3 = this.m_rscene.textureBlock.createRGBATex2D(16, 16, new Color4(1.0, 0.0, 1.0));

            let plane: Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-300.0, -300.0, 400.0, 400.0, [tex2]);
            plane.setXYZ(0, -60, 0);
            this.m_rscene.addEntity(plane, 1);

            plane = new Plane3DEntity();
            plane.initializeXOZ(-200.0, -200.0, 400.0, 400.0, [tex1]);
            plane.setXYZ(80, -1, 80);
            plane.uuid = "plane 0";
            this.m_rscene.addEntity(plane, 0);
            plane.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
            this.m_targets.push(plane);
        }
    }
    private m_isChanged: boolean = true;
    private mouseDown(evt: any): void {
        if (this.m_targets != null && this.m_targets.length > 0) {
            // move rendering runtime displayEntity to different renderer process
            if (this.m_isChanged) {
                this.m_rscene.moveEntityTo(this.m_targets[0], 2);
            }
            else {
                this.m_rscene.moveEntityTo(this.m_targets[0], 0);
            }
            this.m_isChanged = !this.m_isChanged;
        }
    }
    run(): void {
        this.m_statusDisp.update();

        this.m_rscene.run();

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoSwapProcess;

import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import TextureConst from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import ImageTextureAtlas from "../../vox/texture/ImageTextureAtlas";
import Color4 from "../../vox/material/Color4";

export class DemoCanvasTexAtlas {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoCanvasTexAtlas::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            rparam.setAttriAntialias(true);
            rparam.setAttriAlpha(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new RenderStatusDisplay(this.m_rscene, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(500.0);
            this.m_rscene.addEntity(axis);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);

            this.initScene();
        }
    }
    private initScene(): void {
        let canvasTex = new ImageTextureAtlas(this.m_rscene, 256, 256, new Color4());

    }
    private mouseBgDown(evt: any): void {
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...",evt);
    }

    run(): void {
        this.m_rscene.run();
    }

}
export default DemoCanvasTexAtlas;
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";

import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

export class DemoOnlyColorRTT {
    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        if (!this.m_rscene) {
            console.log("DemoOnlyColorRTT::initialize()......");
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
			new MouseInteraction().initialize( this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay( this.m_rscene, true);

            let tex0 = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1 = this.getImageTexByUrl("static/assets/broken_iron.jpg");

            // add common 3d display entity
            let plane = new Plane3DEntity();
            plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
            this.m_rscene.addEntity(plane);

            let axis = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let box = new Box3DEntity();
            box.initializeCube(200.0, [tex1]);
            this.m_rscene.addEntity(box);
            // add rtt texture 3d display entity
            let boxRtt = new Box3DEntity();
            boxRtt.initializeCube(200.0, [this.m_rscene.textureBlock.getRTTTextureAt(0)]);
            this.m_rscene.addEntity(boxRtt, 1);

        }
    }
    run(): void {

        let ctx = this.m_rscene.getRendererContext();

        this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
        // render begin
        this.m_rscene.runBegin();
        // run logic program
        this.m_rscene.update();

        // --------------------------------------------- rtt begin
        ctx.setClearRGBColor3f(0.1, 0.0, 0.1);
        ctx.synFBOSizeWithViewport();
        ctx.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(0), false, false, 0);
        ctx.useFBO(true, false, false);
        // to be rendering in framebuffer
        this.m_rscene.runAt(0);
        // --------------------------------------------- rtt end
        ctx.setRenderToBackBuffer();
        // to be rendering in backbuffer
        this.m_rscene.runAt(1);

        // render end
        this.m_rscene.runEnd();
    }
}
export default DemoOnlyColorRTT;

import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import TextureBlock from "../../vox/texture/TextureBlock";
import CameraTrack from "../../vox/view/CameraTrack";
import { EntityManager } from "./EntityManager";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import { DepthBlur } from "../../renderingtoy/mcase/DepthBlur";

class DepthBlurScene {
    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_camTrack: CameraTrack = null;
    private m_entityMana: EntityManager = new EntityManager();

    private m_textureLoader: ImageTextureLoader;
    private m_texBlock: TextureBlock;

    private m_depthBlur: DepthBlur = new DepthBlur();
    constructor() { }
    initialize(renderer: RendererInstance): void {
        this.m_renderer = renderer;
        this.m_rcontext = this.m_renderer.getRendererContext();
        this.m_texBlock = new TextureBlock();
        this.m_texBlock.setRenderer(this.m_renderer);
        this.m_textureLoader = new ImageTextureLoader(this.m_texBlock);

        this.m_renderer.appendProcess();

        this.m_depthBlur.initialize(
            renderer,
            this.m_texBlock,
            this.m_renderer.getProcessAt(0),
            this.m_renderer.getProcessAt(1)
        );

        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
        RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

        this.m_entityMana.setTextureLoader(this.m_textureLoader);
        this.m_entityMana.initialize(renderer);
    }

    private runThis(): void {
        this.m_textureLoader.run();
        this.m_entityMana.run();
    }
    run(): void {
        this.runThis();
        this.renderBegin();

        this.m_depthBlur.run();

        this.renderEnd();
    }
    private renderBegin(): void {
        this.m_rcontext.updateCamera();
        this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_rcontext.unlockRenderState();
        this.m_rcontext.unlockMaterial();
        this.m_rcontext.renderBegin();
        this.m_rcontext.synFBOSizeWithViewport();
        this.m_renderer.update();
    }
    private renderEnd(): void {
        this.m_rcontext.runEnd();
    }
}
export { DepthBlurScene }
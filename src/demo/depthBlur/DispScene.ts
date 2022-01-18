
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../../vox/texture/TextureConst";
import TextureBlock from "../../vox/texture/TextureBlock";
import { ScrDepBaseMaterial } from "../material/ScrDepBaseMaterial";
import { ScrDepBlurMaterial } from "../material/ScrDepBlurMaterial";
import ScreenPlaneMaterial from "../../vox/material/mcase/ScreenPlaneMaterial";
import PingpongBlur from "../../renderingtoy/mcase/PingpongBlur";
import CameraTrack from "../../vox/view/CameraTrack";
import { EntityManager } from "./EntityManager";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

class DispScene {
    
    private m_blurModule: PingpongBlur = null;
    private m_scrDepMaterial: ScrDepBaseMaterial = new ScrDepBaseMaterial();
    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_renderAdapter: IRenderAdapter = null;
    private m_camTrack: CameraTrack = null;
    private m_entityMana: EntityManager = new EntityManager();

    private m_texLoader: ImageTextureLoader;
    private m_texBlock: TextureBlock;
    constructor() {
    }
    initialize(renderer: RendererInstance): void {
        this.m_renderer = renderer;

        //TextureStore.SetRenderer( this.m_renderer );
        this.m_renderer.appendProcess();
        this.m_renderer.appendProcess();
        this.m_renderer.appendProcess();
        this.m_renderer.appendProcess();


        this.m_texBlock = new TextureBlock();
        this.m_texBlock.setRenderer(this.m_renderer);
        this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
        this.m_entityMana.setTextureLoader(this.m_texLoader);
        this.m_rcontext = this.m_renderer.getRendererContext();
        this.m_renderAdapter = this.m_rcontext.getRenderAdapter();
        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
        RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

        this.m_blurModule = new PingpongBlur(renderer);
        this.m_blurModule.bindSrcProcessId(2);
        this.m_blurModule.setBackbufferVisible(false);

        this.initScene();
    }
    private initScene(): void {
        let renderer: RendererInstance = this.m_renderer;
        this.m_scrDepMaterial.__$attachThis();
        let scrColorPlane: Plane3DEntity = new Plane3DEntity();
        scrColorPlane.name = "scrColorPlane";
        //scrColorPlane.flipVerticalUV = true;
        scrColorPlane.setMaterial(new ScreenPlaneMaterial());
        scrColorPlane.initializeXOY(-1.0, -1.0, 2.0, 2.0, [this.getTextureAt(1)]);
        renderer.addEntity(scrColorPlane, 2);

        let scrPlane: Plane3DEntity = new Plane3DEntity();
        scrPlane.name = "scrPlane";
        scrPlane.setMaterial(new ScrDepBlurMaterial());
        scrPlane.initializeXOY(-1.0, -1.0, 2.0, 2.0, [this.m_blurModule.getDstTexture(), this.getTextureAt(0), this.getTextureAt(1)]);
        renderer.addEntity(scrPlane, 4);

        this.m_entityMana.initialize(renderer);
    }
    run(): void {
        this.runThis();
        this.renderThis();
    }

    private runThis(): void {
        this.m_texLoader.run();
        this.m_entityMana.run();
    }
    private renderThis(): void {
        this.renderBegin();
        this.drawDepthScene();
        this.drawColorScene();
        this.blurColorScene();
        this.showScene();
        this.renderEnd();
    }
    private renderBegin(): void {
        this.m_rcontext.updateCamera();
        this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_rcontext.unlockRenderState();
        this.m_rcontext.unlockMaterial();
        this.m_rcontext.renderBegin();
        this.m_renderer.update();
        this.m_renderAdapter.synFBOSizeWithViewport();
    }
    private renderEnd(): void {
        this.m_rcontext.runEnd();
    }
    private drawDepthScene(): void {
        this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_renderAdapter.setRenderToTexture(this.getTextureAt(0), true, false, 0);
        this.m_renderAdapter.useFBO(true, true, false);
        // use global material
        this.m_rcontext.useGlobalMaterial(this.m_scrDepMaterial);
        this.m_rcontext.useGlobalRenderState(RendererState.NORMAL_STATE);
        // draw call for depth rendering
        this.m_renderer.runAt(0);
    }
    private drawColorScene(): void {
        this.m_renderAdapter.setRenderToTexture(this.getTextureAt(1), true, false, 0);
        this.m_renderAdapter.useFBO(true, true, false);
        this.m_rcontext.unlockMaterial();
        this.m_rcontext.unlockRenderState();
        this.m_renderer.runAt(0);
        this.m_renderer.runAt(1);
    }
    private blurColorScene(): void {
        this.m_blurModule.run();
    }
    private showScene(): void {
        //this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_rcontext.setRenderToBackBuffer();
        this.m_rcontext.unlockMaterial();
        this.m_rcontext.unlockRenderState();
        this.m_renderer.runAt(4);
    }
    private m_texs: RTTTextureProxy[] = [null, null];
    private getTextureAt(index: number): RTTTextureProxy {
        if (this.m_texs[index] != null) {
            return this.m_texs[index];
        }
        switch (index) {
            case 0:
                this.m_texs[index] = this.m_texBlock.getRTTTextureAt(0) as any
                this.m_texs[index].internalFormat = TextureFormat.RGBA16F;
                this.m_texs[index].srcFormat = TextureFormat.RGBA;
                this.m_texs[index].dataType = TextureDataType.FLOAT;
                return this.m_texs[index];
                break;

            case 1:
                this.m_texs[index] = this.m_texBlock.getRTTTextureAt(1) as any
                this.m_texs[index].internalFormat = TextureFormat.RGBA;
                this.m_texs[index].srcFormat = TextureFormat.RGBA;
                return this.m_texs[index];
                break;
            default:
                break;
        }
        return null;
    }

}
export { DispScene }
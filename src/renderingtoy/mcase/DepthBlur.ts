import RendererState from "../../vox/render/RendererState";
import IRenderProcess from "../../vox/render/IRenderProcess";
import RendererInstance from "../../vox/scene/RendererInstance";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import { TextureBlock } from "../../vox/texture/TextureBlock";
import {ScrDepBaseMaterial} from "./material/ScrDepBaseMaterial";
import {ScrDepBlurMaterial} from "./material/ScrDepBlurMaterial";
import ScreenPlaneMaterial from "../../vox/material/mcase/ScreenPlaneMaterial";
import FBOInstance from "../../vox/scene/FBOInstance";
import PingpongBlur from "../../renderingtoy/mcase/PingpongBlur";
import IRendererScene from "../../vox/scene/IRendererScene";

class DepthBlur {
    
    private m_textureBlock: TextureBlock;

    private m_renderer: RendererInstance = null;
    private m_blurModule: PingpongBlur = null;
    private m_depthFbo: FBOInstance = null;
    private m_colorFbo: FBOInstance = null;

    private m_opacityProcess: IRenderProcess = null;
    private m_blendProcess: IRenderProcess = null;
    private m_blurSrcProcess: IRenderProcess = null;
    private m_resultProcess: IRenderProcess = null;

    private m_scrDepMaterial: ScrDepBaseMaterial = new ScrDepBaseMaterial();
    constructor() {
    }
    initialize(rscene: IRendererScene, textureBlock: TextureBlock, opacityProcess: IRenderProcess, blendProcess: IRenderProcess): void {
        if (this.m_renderer == null) {
            this.m_renderer = (rscene as any).getRenderer();

            this.m_blurSrcProcess = this.m_renderer.appendProcess();
            this.m_resultProcess = this.m_renderer.appendProcess();

            this.m_opacityProcess = opacityProcess;
            this.m_blendProcess = blendProcess;

            this.m_textureBlock = textureBlock;

            this.m_blurModule = new PingpongBlur(rscene);
            this.m_blurModule.bindSrcProcess(this.m_blurSrcProcess);
            this.m_blurModule.setBackbufferVisible(false);

            this.m_depthFbo = new FBOInstance(this.m_renderer);
            this.m_depthFbo.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);                     // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
            this.m_depthFbo.createAutoSizeFBOAt(0, true, false);
            this.m_depthFbo.setRenderToHalfFloatTexture(null, 0);                     // framebuffer color attachment 0
            this.m_depthFbo.setRProcessList([this.m_opacityProcess]);
            this.m_depthFbo.useGlobalMaterial(this.m_scrDepMaterial);

            this.m_colorFbo = new FBOInstance(this.m_renderer);
            this.m_colorFbo.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);                     // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
            this.m_colorFbo.createAutoSizeFBOAt(0, true, false);
            this.m_colorFbo.setRenderToRGBATexture(null, 0);                          // framebuffer color attachment 0
            if (this.m_blendProcess == null) {
                this.m_colorFbo.setRProcessList([this.m_opacityProcess]);
            }
            else {
                this.m_colorFbo.setRProcessList([this.m_opacityProcess, this.m_blendProcess]);
            }

            this.initState();
        }
    }
    private initState(): void {
        let renderer: RendererInstance = this.m_renderer;
        this.m_scrDepMaterial.__$attachThis();

        let scrColorPlane: Plane3DEntity = new Plane3DEntity();
        scrColorPlane.uuid = "scrColorPlane";
        scrColorPlane.flipVerticalUV = true;
        scrColorPlane.setMaterial(new ScreenPlaneMaterial());
        scrColorPlane.initializeFixScreen([this.m_colorFbo.getRTTAt(0)]);
        renderer.addEntity(scrColorPlane, this.m_blurSrcProcess.getRPIndex());

        let resultPlane: Plane3DEntity = new Plane3DEntity();
        resultPlane.uuid = "resultPlane";
        resultPlane.setMaterial(new ScrDepBlurMaterial());
        resultPlane.initializeFixScreen(
            [
                this.m_blurModule.getDstTexture(),
                this.m_depthFbo.getRTTAt(0),
                this.m_colorFbo.getRTTAt(0)
            ]
        );
        renderer.addEntity(resultPlane, this.m_resultProcess.getRPIndex());

    }
    run(): void {
        this.drawDepthScene();
        this.drawColorScene();

        this.m_blurModule.run();

        this.displayScene();
    }
    private displayScene(): void {
        /*
        this.m_rcontext.setRenderToBackBuffer();
        this.m_rcontext.unlockMaterial();
        this.m_rcontext.unlockRenderState();
        //*/

        this.m_colorFbo.setRenderToBackBuffer();
        this.m_colorFbo.unlockMaterial();
        this.m_colorFbo.unlockRenderState();

        this.m_resultProcess.run();
    }
    private drawDepthScene(): void {
        /*
        this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_rcontext.setRenderToTexture(this.getTextureAt(0), true, false, 0);
        this.m_rcontext.useFBO(true, true, false);

        // use global material
        this.m_rcontext.useGlobalMaterial(this.m_scrDepMaterial);
        this.m_rcontext.useGlobalRenderState(RendererState.NORMAL_STATE);
        // draw call for depth rendering
        this.m_opacityProcess.run();
        //*/
        this.m_depthFbo.useGlobalRenderState(RendererState.NORMAL_STATE);
        this.m_depthFbo.run();
    }
    private drawColorScene(): void {
        /*
        this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_rcontext.setRenderToTexture(this.getTextureAt(1), true, false, 0);
        this.m_rcontext.useFBO(true, true, false);

        this.m_rcontext.unlockMaterial();
        this.m_rcontext.unlockRenderState();

        this.m_opacityProcess.run();
        if(this.m_blendProcess != null)this.m_blendProcess.run();
        //*/
        this.m_colorFbo.unlockRenderState();
        this.m_colorFbo.run();
    }
    destroy(): void {
        if (this.m_renderer != null) {
            this.m_renderer = null;
        }
    }

}
export { DepthBlur }
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as DepthBlurSceneT from "./depthBlur/DepthBlurScene";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import DepthBlurScene = DepthBlurSceneT.demo.depthBlur.DepthBlurScene;

export namespace demo
{
    export class DemoDepthBlur2
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        
        private m_scene:DepthBlurScene = new DepthBlurScene();
        initialize():void
        {
            console.log("DemoDepthBlur2::initialize()...");
            if(this.m_renderer == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                
                this.m_renderer = new RendererInstance();
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(60.0,0.1,5000.0);
                rparam.setCamPosition(1700,1700,1700);
                this.m_renderer.initialize(rparam);
                this.m_scene.initialize(this.m_renderer);
                this.m_statusDisp.initialize("rstatus",this.m_renderer.getViewWidth() - 128);                
            }
        }
        run():void
        {
            this.m_statusDisp.update();
            this.m_scene.run();
        }
    }
}
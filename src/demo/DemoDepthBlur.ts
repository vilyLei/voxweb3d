import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import * as DispSceneT from "./depthBlur/DispScene";
import DispScene = DispSceneT.demo.depthBlur.DispScene;
import CameraBase from "../vox/view/CameraBase";

export class DemoDepthBlur
{
    constructor()
    {
    }
    private m_renderer:RendererInstance = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    
    private m_scene:DispScene = new DispScene();
    initialize():void
    {
        console.log("DemoDepthBlur::initialize()...");
        if(this.m_renderer == null)
        {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            
            this.m_renderer = new RendererInstance();
            let rparam:RendererParam = new RendererParam();
            rparam.setCamProject(60.0,0.1,5000.0);
            rparam.setCamPosition(1700,1700,1700);
            this.m_renderer.initialize(rparam, new CameraBase());
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
export default DemoDepthBlur;
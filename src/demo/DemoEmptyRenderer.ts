
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";

import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;

export namespace demo
{
    /**
     * Empty Renderer instance example
     */
    export class DemoEmptyRenderer
    {
        constructor(){}
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        initialize():void
        {
            console.log("DemoEmptyRenderer::initialize()......");
            if(this.m_rcontext == null)
            {
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(new RendererParam());
                this.m_rcontext = this.m_renderer.getRendererContext();                
            }
        }
        run():void
        {
            this.m_rcontext.runBegin();

            this.m_renderer.run();

            this.m_rcontext.runEnd();            
        }
    }
}
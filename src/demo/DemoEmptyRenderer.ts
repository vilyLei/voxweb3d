import {Camera} from "../vox/view/Camera";
import { IRendererInstanceContext } from "../vox/scene/IRendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RendererParam from "../vox/scene/RendererParam";

/**
 * A empty Renderer instance example
 */
export class DemoEmptyRenderer {
    constructor() { }

    private m_renderer: RendererInstance = null;
    private m_rcontext: IRendererInstanceContext = null;

    initialize(): void {
        this.m_renderer = new RendererInstance();
        
        this.m_renderer.initialize(new RendererParam(), new Camera(this.m_renderer.getRCUid()));
        this.m_rcontext = this.m_renderer.getRendererContext();
    }
    private m_time: number = 0.0;

    run(): void {

        if(this.m_rcontext != null) {
            let t: number = Math.abs( Math.cos( this.m_time += 0.01 ) );
            this.m_rcontext.setClearRGBColor3f(0.0, t, 1.0 - t);
    
            this.m_rcontext.renderBegin();
            this.m_renderer.run();
            this.m_rcontext.runEnd();
        }
    }
}
export default DemoEmptyRenderer;
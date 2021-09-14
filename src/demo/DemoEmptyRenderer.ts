//import {Camera} from "../vox/view/Camera";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";

/**
 * A empty Renderer instance example
 */
export class DemoEmptyRenderer {
    constructor() { }

    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;

    initialize(): void {
        this.m_renderer = new RendererInstance();
        //this.m_renderer.initialize(null, new Camera(this.m_renderer.getRCUid()));
        this.m_renderer.initialize();
        this.m_rcontext = this.m_renderer.getRendererContext();
    }
    run(): void {
        //  this.m_rcontext.renderBegin();
        //  this.m_renderer.run();
        //  this.m_rcontext.runEnd();
    }
}

export default DemoEmptyRenderer;
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

export class DemoMouseInteraction {
    private m_init = true;
    constructor() { }
    initialize(): void {
        console.log("DemoMouseInteraction::initialize()......");

        if (this.m_init) {
            this.m_init = false;

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam = new RendererParam();
            rparam.setCamProject(45.0, 10.1, 9000.0);
            rparam.setCamPosition(2500.0, 2500.0, 2500.0);

            let rscene = new RendererScene().initialize(rparam).setAutoRunning(true);

            new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
            new RenderStatusDisplay(rscene, true);

            let axis = new Axis3DEntity();
            axis.initialize(600.0);
            rscene.addEntity(axis);

        }
    }
}
export default DemoMouseInteraction;
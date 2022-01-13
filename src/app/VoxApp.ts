import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import Vector3D from "../vox/math/Vector3D";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import RendererScene from "../vox/scene/RendererScene";
import EngineBase from "../vox/engine/EngineBase";
import Axis3DEntity from "../vox/entity/Axis3DEntity";

class VoxApp {

    private m_rscene: RendererScene = null;
    private m_engine: EngineBase = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_axis: Axis3DEntity = new Axis3DEntity();
    
    constructor() { }

    initialize(): void {
        console.log("VoxApp::initialize()......");
        if (this.m_engine == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setPolygonOffsetEanbled(false);
            rparam.setAttriAlpha(false);
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamProject(45.0, 30.0, 9000.0);
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);

            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam, 7);
            this.m_rscene = this.m_engine.rscene;
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            
            this.update();
        }
    }
    private mouseDown(evt: any): void {
        this.m_engine.interaction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_engine.interaction.viewRay.position;
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
    }
    run(): void {
        this.m_statusDisp.update();
        this.m_engine.run();
    }
}
export default VoxApp;
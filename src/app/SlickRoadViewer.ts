import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import EngineBase from "../vox/engine/EngineBase";
import {SceneViewer} from "./slickRoad/view/SceneViewer";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
export class SlickRoadViewer {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_profileInstance: ProfileInstance = null;
    private m_sceneViewer: SceneViewer = new SceneViewer();

    initialize(): void {
        
        if (this.m_engine == null) {

            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            
            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam);
            
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_engine.rscene.getRenderer());
            //this.m_engine.showInfo();
            this.m_sceneViewer.initialize( this.m_engine );
        }
    }
    run(): void {
        
        this.m_sceneViewer.run();
        this.m_engine.run();
        
        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
    }
}

export default SlickRoadViewer;

import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import EngineBase from "../vox/engine/EngineBase";
import {SceneViewer} from "./slickRoad/view/SceneViewer";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
export class SlickRoadViewer {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_profileInstance: ProfileInstance = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_sceneViewer: SceneViewer = new SceneViewer();
    initialize(): void {
        
        console.log("SlickRoadViewer::initialize()......");
        
        if (this.m_engine == null) {

            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            
            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam, 6);

            this.m_statusDisp.initialize();
            
            this.m_engine.appendRendererScene(null, 3, false);
            this.m_engine.swapSceneAt(1, 2);
            this.m_engine.getRendererSceneAt(1).getRScene().enableMouseEvent(false);
            
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_engine.rscene.getRenderer());
            //this.m_engine.showInfo();
            this.m_sceneViewer.initialize( this.m_engine );
            this.update();
        }
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 25);// 20 fps
        this.m_statusDisp.render();
    }

    run(): void {
        
        this.m_statusDisp.update(false);
        this.m_sceneViewer.run();
        this.m_engine.run();
        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
    }
}

export default SlickRoadViewer;

import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import {Scene} from "./slickRoad/scene/Scene";
import {EditorSceneAccessor} from "./slickRoad/render/EditorSceneAccessor";
import {UIScene} from "./slickRoad/ui/UIScene";
import EngineBase from "../vox/engine/EngineBase";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

export class SlickRoad {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_scene: Scene = new Scene();
    private m_uiscene: UIScene = new UIScene();
    private m_profileInstance: ProfileInstance = null;

    initialize(): void {
        
        console.log("SlickRoad::initialize()......");
        
        if (this.m_engine == null) {

            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.SetWebBodyColor("white");
            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            rparam.syncBgColor = true;
            
            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam, 6);

            // this.m_profileInstance = new ProfileInstance();
            // this.m_profileInstance.initialize(this.m_engine.rscene.getRenderer());

            this.m_engine.appendRendererScene(null, 3, false);
            this.m_engine.swapSceneAt(1,2);
            this.m_engine.getRendererSceneAt(1).enableMouseEvent(false);
            //this.m_engine.showInfo();
            
            this.m_scene.initialize( this.m_engine );
            this.m_uiscene.scene = this.m_scene;
            this.m_uiscene.initialize( this.m_engine );
            
            this.m_engine.setAccessorAt(1, new EditorSceneAccessor());
            // let plane: Plane3DEntity = new Plane3DEntity();
            // plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [this.m_engine.texLoader.getTexByUrl("static/assets/default.jpg")]);
            // plane.setXYZ(0,-100,0);
            // plane.setScaleXYZ(3.0,3.0,3.0);
            // this.m_engine.rscene.addEntity(plane, 0, true);

        }
    }

    run(): void {
        
        this.m_uiscene.run();
        this.m_scene.run();
        this.m_engine.run();        
        // if (this.m_profileInstance != null) {
        //     this.m_profileInstance.run();
        // }
    }
}

export default SlickRoad;
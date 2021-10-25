
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import {Scene} from "./easyroad/Scene";
import {UIScene} from "./easyroad/UIScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import EngineBase from "../vox/engine/EngineBase";
import Plane3DEntity from "../vox/entity/Plane3DEntity";

export class EasyRoad {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_scene: Scene = new Scene();
    private m_uiscene: UIScene = new UIScene();

    initialize(): void {
        
        console.log("EasyRoad::initialize()......");
        
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
            this.m_engine.swapSceneAt(1,2);
            this.m_engine.getRendererSceneAt(1).getRScene().enableMouseEvent(false);
            //this.m_engine.showInfo();
            
            this.m_scene.initialize( this.m_engine );
            this.m_uiscene.scene = this.m_scene;
            this.m_uiscene.initialize( this.m_engine );
            
            // // add common 3d display entity
            // var plane: Plane3DEntity = new Plane3DEntity();
            // plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [this.m_engine.texLoader.getTexByUrl("static/assets/default.jpg")]);
            // this.m_engine.getRendererSceneAt(1).getRScene().addEntity(plane, 0, true);

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
        this.m_uiscene.run();
        this.m_scene.run();
        this.m_engine.run();        
    }
}

export default EasyRoad;
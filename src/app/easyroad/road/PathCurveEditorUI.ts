import MouseEvent from "../../../vox/event/MouseEvent";
import EngineBase from "../../../vox/engine/EngineBase";
import {MoveController} from "../ui/MoveController";
class PathCurveEditorUI {

    private m_engine: EngineBase = null;
    private m_moveCtrl: MoveController = null;
    constructor() { }

    initialize(engine: EngineBase): void {

        console.log("PathCurveEditorUI::initialize()......");
        if (this.m_engine == null) {
            this.m_engine = engine;
            
            this.initUI();
        }
    }

    private m_editEnabled: boolean = false;
    private m_closeEnabled: boolean = false;
    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    setCloseEnabled(enabled: boolean): void {
        this.m_closeEnabled = enabled;
    }
    getCloseEnabled(): boolean {
        return this.m_closeEnabled;
    }
    
    private initUI(): void {
        
        this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
        this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);

        this.m_moveCtrl = new MoveController();
        this.m_moveCtrl.initialize( this.m_engine.getRendererSceneAt(1).getRScene() );       
    }
    run(): void {
        this.m_moveCtrl.run();
    }
    clear(): void {
        
    }
    private mouseBgDownListener(evt: any): void {
    }
    private mouseUpListener(evt: any): void {
        this.m_moveCtrl.deselect();
    }
}

export {PathCurveEditorUI};
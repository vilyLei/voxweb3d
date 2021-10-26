import MouseEvent from "../../../vox/event/MouseEvent";
import EngineBase from "../../../vox/engine/EngineBase";
import {DragMoveController} from "../../../voxeditor/entity/DragMoveController";
import Vector3D from "../../../vox/math/Vector3D";
class PathCurveEditorUI {

    private m_engine: EngineBase = null;
    readonly dragMoveController: DragMoveController = new DragMoveController();

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
        
        //this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, true);
        this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
        this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);
        this.dragMoveController.initialize( this.m_engine.getRendererSceneAt(1).getRScene() );
    }
    run(): void {
        this.dragMoveController.run();
    }
    clear(): void {
        this.dragMoveController.setTarget( null );
    }
    private m_rpv: Vector3D = new Vector3D();
    private m_rtv: Vector3D = new Vector3D();
    
    private mouseDownListener(evt: any): void {
        
        this.m_engine.rscene.getMouseXYWorldRay(this.m_rpv, this.m_rtv);
    }
    private mouseBgDownListener(evt: any): void {
    }
    private mouseUpListener(evt: any): void {
        this.dragMoveController.deselect();
    }
}

export {PathCurveEditorUI};
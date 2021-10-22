import MouseEvent from "../../../vox/event/MouseEvent";
import EngineBase from "../../../vox/engine/EngineBase";
import {MoveController} from "../ui/MoveController";
/*
class MoveController {
    private m_engine: EngineBase = null;
    private m_moveAxis: DragAxisQuad3D = null;
    private m_moveAxisBg: AxisQuad3DEntity = null;
    private m_bgFlag: boolean = true;
    private m_rpv: Vector3D = new Vector3D();
    private m_rtv: Vector3D = new Vector3D();
    constructor(){}
    initialize(engine: EngineBase): void {
        if (this.m_engine == null) {
            this.m_engine = engine;
            this.init();
        }
    }
    private init(): void {
        let saxis: DragAxisQuad3D = new DragAxisQuad3D();
        saxis.pickTestRadius = 15;
        saxis.initialize(500.0, 5.0);
        this.m_engine.rscene.addEntity(saxis);
        this.m_moveAxis = saxis;
        saxis.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
        saxis.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);

        this.m_moveAxisBg = new AxisQuad3DEntity();
        this.m_moveAxisBg.wireframe = true;
        this.m_moveAxisBg.colorX.setRGB3f(0.8,0.0,0.8);
        this.m_moveAxisBg.colorY.setRGB3f(0.8,0.8,0.0);
        this.m_moveAxisBg.colorZ.setRGB3f(0.0,0.8,0.8);
        this.m_moveAxisBg.initialize(500.0, 8.0);
        this.m_engine.rscene.addEntity(this.m_moveAxisBg);
        this.m_moveAxisBg.setVisible(false);
    }
    run(): void {
        if (this.m_moveAxis.isSelected()) {
            this.m_engine.rscene.getMouseXYWorldRay(this.m_rpv, this.m_rtv);
            this.m_moveAxis.moveByRay(this.m_rpv, this.m_rtv);
        }
    }
    isSelected(): boolean {
        return this.m_moveAxis.isSelected();
    }
    deselect(): void {
        this.m_moveAxis.deselect();
        this.m_moveAxisBg.setVisible(false);
        this.m_bgFlag = true;
    }
    
    private mouseOverListener(evt: any): void {
        this.m_moveAxisBg.setVisible(true);
        if(this.m_bgFlag) {
            this.m_bgFlag = false;
            this.m_moveAxisBg.copyPositionFrom(this.m_moveAxis);
            this.m_moveAxisBg.update();
        }
    }
    private mouseOutListener(evt: any): void {
        if(!this.isSelected()) {
            this.m_moveAxisBg.setVisible(false);
        }
    }
}
//*/
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
        
        this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, false, true);
        this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);

        this.m_moveCtrl = new MoveController();
        this.m_moveCtrl.initialize( this.m_engine );       
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
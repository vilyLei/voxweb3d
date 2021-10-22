import MouseEvent from "../../../vox/event/MouseEvent";
import EngineBase from "../../../vox/engine/EngineBase";
import Vector3D from "../../../vox/math/Vector3D";
import AxisQuad3DEntity from "../../../vox/entity/AxisQuad3DEntity";
import DragAxisQuad3D from "../../../voxeditor/entity/DragAxisQuad3D";

class MoveController {
    private m_engine: EngineBase = null;
    private m_moveAxis: DragAxisQuad3D = null;
    private m_moveAxisBg: AxisQuad3DEntity = null;
    private m_bgFlag: boolean = true;
    private m_rpv: Vector3D = new Vector3D();
    private m_rtv: Vector3D = new Vector3D();
    layerIndex: number = 4;
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
        this.m_engine.rscene.addEntity(saxis, this.layerIndex);
        this.m_moveAxis = saxis;
        saxis.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
        saxis.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);

        this.m_moveAxisBg = new AxisQuad3DEntity();
        this.m_moveAxisBg.wireframe = true;
        this.m_moveAxisBg.colorX.setRGB3f(0.9,0.0,0.5);
        this.m_moveAxisBg.colorY.setRGB3f(0.5,0.9,0.0);
        this.m_moveAxisBg.colorZ.setRGB3f(0.0,0.5,0.9);
        this.m_moveAxisBg.initialize(500.0, 8.0);
        this.m_engine.rscene.addEntity(this.m_moveAxisBg, this.layerIndex);
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

export {MoveController};
import MouseEvent from "../../../vox/event/MouseEvent";
import Vector3D from "../../../vox/math/Vector3D";
import AxisQuad3DEntity from "../../../vox/entity/AxisQuad3DEntity";
import DragAxisQuad3D from "../../../voxeditor/entity/DragAxisQuad3D";
import DragPlaneEntity3D from "../../../voxeditor/entity/DragPlaneEntity3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

class DragMoveTarget implements IEntityTransform {

    dragAxis: IEntityTransform = null;
    dragPlaneXOZ: IEntityTransform = null;
    dragPlaneXOY: IEntityTransform = null;
    dragPlaneYOZ: IEntityTransform = null;
    constructor() {

    }
    setXYZ(px:number,py:number,pz:number):void {

    }
    setPosition(pv:Vector3D):void {
        this.dragAxis.setPosition( pv );
        this.dragPlaneXOZ.setPosition( pv );
        this.dragPlaneXOY.setPosition( pv );
        this.dragPlaneYOZ.setPosition( pv );
    }
    getPosition(pv:Vector3D):void {
        
    }
    setRotationXYZ(rx:number,ry:number,rz:number):void {
        
    }
    setScaleXYZ(sx:number,sy:number,sz:number):void {
        
    }
    getRotationXYZ(pv:Vector3D):void {
        
    }
    getScaleXYZ(pv:Vector3D):void {
        
    }
    update():void {
        this.dragAxis.update();
        this.dragPlaneXOZ.update();
        this.dragPlaneXOY.update();
        this.dragPlaneYOZ.update();
    }
}
class MoveController {

    private m_moveAxis: DragAxisQuad3D = null;
    private m_moveAxisBg: AxisQuad3DEntity = null;
    
    private m_movePlaneXOZ: DragPlaneEntity3D = null;
    private m_movePlaneXOY: DragPlaneEntity3D = null;
    private m_movePlaneYOZ: DragPlaneEntity3D = null;

    private m_bgFlag: boolean = true;
    private m_rpv: Vector3D = new Vector3D();
    private m_rtv: Vector3D = new Vector3D();
    
    private m_editScene: IRendererScene = null;
    private m_dragMoveTarget: DragMoveTarget = new DragMoveTarget();
    
    layerIndex: number = 0;
    constructor(){}
    initialize(editScene: IRendererScene): void {
        if (this.m_editScene == null) {
            this.m_editScene = editScene;
            this.init();
        }
    }
    private init(): void {
        
        let saxis: DragAxisQuad3D = new DragAxisQuad3D();
        saxis.moveSelfenabled = true;
        saxis.pickTestRadius = 15;
        saxis.initialize(500.0, 5.0);
        this.m_editScene.addEntity(saxis, this.layerIndex, true);
        this.m_moveAxis = saxis;
        saxis.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
        saxis.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);

        this.m_moveAxisBg = new AxisQuad3DEntity();
        this.m_moveAxisBg.wireframe = true;
        this.m_moveAxisBg.colorX.setRGB3f(0.9,0.0,0.5);
        this.m_moveAxisBg.colorY.setRGB3f(0.5,0.9,0.0);
        this.m_moveAxisBg.colorZ.setRGB3f(0.0,0.5,0.9);
        this.m_moveAxisBg.initialize(500.0, 8.0);
        this.m_editScene.addEntity(this.m_moveAxisBg, this.layerIndex, true);
        this.m_moveAxisBg.setVisible(false);

        let plane: Plane3DEntity = new Plane3DEntity();
        plane.initializeXOZ(8,8,200,200);
        (plane.getMaterial() as any).setRGB3f(0.8,0.3,0.3);
        this.m_movePlaneXOZ = new DragPlaneEntity3D();
        this.m_movePlaneXOZ.setPlaneNormal(Vector3D.Y_AXIS);
        this.m_movePlaneXOZ.moveSelfenabled = true;
        this.m_movePlaneXOZ.copyMeshFrom( plane );
        this.m_movePlaneXOZ.copyMaterialFrom( plane );
        this.m_movePlaneXOZ.initializeEvent();
        this.m_editScene.addEntity(this.m_movePlaneXOZ, this.layerIndex, true);

        plane = new Plane3DEntity();
        plane.initializeXOY(8,8,200,200);
        (plane.getMaterial() as any).setRGB3f(0.3,0.8,0.3);
        this.m_movePlaneXOY = new DragPlaneEntity3D();
        this.m_movePlaneXOY.setPlaneNormal(Vector3D.Z_AXIS);
        this.m_movePlaneXOY.moveSelfenabled = true;
        this.m_movePlaneXOY.copyMeshFrom( plane );
        this.m_movePlaneXOY.copyMaterialFrom( plane );
        this.m_movePlaneXOY.initializeEvent();
        this.m_editScene.addEntity(this.m_movePlaneXOY, this.layerIndex, true);

        plane = new Plane3DEntity();
        plane.initializeYOZ(8,8,200,200);
        (plane.getMaterial() as any).setRGB3f(0.3,0.3,0.8);
        this.m_movePlaneYOZ = new DragPlaneEntity3D();
        this.m_movePlaneYOZ.setPlaneNormal(Vector3D.X_AXIS);
        this.m_movePlaneYOZ.moveSelfenabled = true;
        this.m_movePlaneYOZ.copyMeshFrom( plane );
        this.m_movePlaneYOZ.copyMaterialFrom( plane );
        this.m_movePlaneYOZ.initializeEvent();
        this.m_editScene.addEntity(this.m_movePlaneYOZ, this.layerIndex, true);
        

        this.m_dragMoveTarget.dragAxis = this.m_moveAxis;
        this.m_dragMoveTarget.dragPlaneXOZ = this.m_movePlaneXOZ;
        this.m_dragMoveTarget.dragPlaneXOY = this.m_movePlaneXOY;
        this.m_dragMoveTarget.dragPlaneYOZ = this.m_movePlaneYOZ;

        this.m_moveAxis.setTarget( this.m_dragMoveTarget );
        this.m_movePlaneXOZ.setTarget( this.m_dragMoveTarget );
        this.m_movePlaneXOY.setTarget( this.m_dragMoveTarget );
        this.m_movePlaneYOZ.setTarget( this.m_dragMoveTarget );

    }
    run(): void {
        this.m_editScene.getMouseXYWorldRay(this.m_rpv, this.m_rtv);

        if (this.m_movePlaneXOZ.isSelected()) {
            this.m_movePlaneXOZ.moveByRay(this.m_rpv, this.m_rtv);
        }
        if (this.m_movePlaneXOY.isSelected()) {
            this.m_movePlaneXOY.moveByRay(this.m_rpv, this.m_rtv);
        }
        if (this.m_movePlaneYOZ.isSelected()) {
            this.m_movePlaneYOZ.moveByRay(this.m_rpv, this.m_rtv);
        }
        if (this.m_moveAxis.isSelected()) {
            this.m_moveAxis.moveByRay(this.m_rpv, this.m_rtv);
        }
    }
    isSelected(): boolean {
        return this.m_moveAxis.isSelected() || this.m_movePlaneXOZ.isSelected() || this.m_movePlaneXOY.isSelected() || this.m_movePlaneYOZ.isSelected();
    }
    deselect(): void {

        this.m_movePlaneXOY.deselect();
        this.m_movePlaneXOZ.deselect();
        this.m_movePlaneYOZ.deselect();

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
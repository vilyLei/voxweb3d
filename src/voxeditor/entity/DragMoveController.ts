import Vector3D from "../../vox/math/Vector3D";
import MouseEvent from "../../vox/event/MouseEvent";
import DragAxisQuad3D from "../../voxeditor/entity/DragAxisQuad3D";
import DragPlaneEntity3D from "../../voxeditor/entity/DragPlaneEntity3D";
import IRendererScene from "../../vox/scene/IRendererScene";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import IEntityTransform from "../../vox/entity/IEntityTransform";
import RendererState from "../../vox/render/RendererState";
import { IRayControl } from "../../voxeditor/base/IRayControl";
import CameraBase from "../../vox/view/CameraBase";
import MathConst from "../../vox/math/MathConst";
import DisplayEntity from "../../vox/entity/DisplayEntity";

import { EditableEntity } from "../../voxeditor/entity/EditableEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";

class DragMoveTarget implements IEntityTransform {

    private m_engitys: IEntityTransform[] = [null];
    private m_changFlags: boolean[] = [true];
    private m_targetPosOffset: Vector3D = new Vector3D();
    position: Vector3D = new Vector3D();

    constructor() {
    }
    setTargetPosOffset(offset: Vector3D): void {
        this.m_targetPosOffset.copyFrom(offset);
    }
    addEntity(engity: IEntityTransform): void {
        if (engity != null) {
            this.m_engitys.push(engity);
            this.m_changFlags.push(true);
        }
    }
    setTarget(target: IEntityTransform): void {
        this.m_engitys[0] = target;
        this.m_changFlags[0] = true;
    }
    getTarget(): IEntityTransform {
        return this.m_engitys[0];
    }

    setXYZ(px: number, py: number, pz: number): void {
    }
    setPosition(pv: Vector3D): void {
        let i: number = 0;
        if (this.m_engitys[i] != null) {
            this.position.addVecsTo(pv, this.m_targetPosOffset);
            this.m_engitys[i].setPosition(this.position);
            this.m_changFlags[i] = true;
        }
        for (i = 1; i < this.m_engitys.length; ++i) {
            this.m_engitys[i].setPosition(pv);
            this.m_changFlags[i] = true;
        }
        this.position.copyFrom(pv);
    }
    getPosition(pv: Vector3D): void {
        pv.copyFrom(this.position);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        // for (let i: number = 1; i < this.m_engitys.length; ++i) {
        //     this.m_engitys[i].setScaleXYZ(sx, sy, sz);
        // }
    }
    setCtrlScaleXYZ(sx: number, sy: number, sz: number): void {
        for (let i: number = 1; i < this.m_engitys.length; ++i) {
            this.m_changFlags
            this.m_engitys[i].setScaleXYZ(sx, sy, sz);
            this.m_changFlags[i] = true;
        }
    }
    getRotationXYZ(pv: Vector3D): void {
    }
    getScaleXYZ(pv: Vector3D): void {
    }
    
    localToGlobal(pv: Vector3D): void {
    }
    globalToLocal(pv: Vector3D): void {
    }
    update(): void {
        let i: number = 0;
        if (this.m_engitys[i] != null && this.m_changFlags[i]) {
            this.m_changFlags[i] = false;
            this.m_engitys[i].update();
        }
        for (i = 1; i < this.m_engitys.length; ++i) {
            if (this.m_changFlags[i]) {
                this.m_changFlags[i] = false;
                this.m_engitys[i].update();
            }
        }
    }
    destroy(): void {
        this.m_engitys = [null];
    }
}
class DragMoveController implements IRayControl {

    private m_controllers: IRayControl[] = [];
    private m_crossPlaneDrag: DragPlaneEntity3D = null;
    private m_rpv: Vector3D = new Vector3D();
    private m_rtv: Vector3D = new Vector3D();
    private m_tempPos: Vector3D = new Vector3D();
    private m_visible: boolean = true;
    private m_enabled: boolean = true;

    private m_editRendererScene: IRendererScene = null;
    private m_editRendererSceneProcessid: number = 0;
    private m_dragMoveTarget: DragMoveTarget = new DragMoveTarget();
    private m_camera: CameraBase = null;

    uuid: string = "DragMoveController";
    constructor() { }
    /**
     * initialize the DragMoveController instance.
     * @param editRendererScene a IRendererScene instance.
     * @param processid this destination renderer process id in the editRendererScene.
     */
    initialize(editRendererScene: IRendererScene, processid: number = 0): void {
        if (this.m_editRendererScene == null) {
            this.m_editRendererScene = editRendererScene;
            this.m_editRendererSceneProcessid = processid;
            this.init();
        }
    }

    initializeEvent(): void {

    }
    selectByParam(raypv: Vector3D, raytv: Vector3D, wpos: Vector3D): void {
        if (this.m_crossPlaneDrag != null) {
            this.m_crossPlaneDrag.selectByParam(raypv, raytv, wpos);
        }
    }
    setTargetPosOffset(offset: Vector3D): void {
        this.m_dragMoveTarget.setTargetPosOffset( offset );
    }
    setTarget(target: IEntityTransform): void {

        this.m_dragMoveTarget.setTarget(target);
        this.setVisible(target != null);
    }
    getTarget(): IEntityTransform {
        return this.m_dragMoveTarget.getTarget();
    }
    private activeRayController(controller: IRayControl): void {

    }
    private createPlaneDrag(type: number, alpha: number, srcEntity: DisplayEntity = null): DragPlaneEntity3D {

        let dis: number = 50;
        let axisPlaneSize: number = 130;
        let movePlane = new DragPlaneEntity3D();
        movePlane.setRenderState(RendererState.NONE_TRANSPARENT_STATE);

        let plane: Plane3DEntity;
        if (srcEntity == null) {
            plane = new Plane3DEntity();
            plane.setPolyhedral(false);
            srcEntity = plane;
        }

        switch (type) {
            // xoz
            case 0:
                plane.initializeXOZ(dis, dis, axisPlaneSize, axisPlaneSize);
                movePlane.setPlaneNormal(Vector3D.Y_AXIS);
                movePlane.outColor.setRGBA4f(1.0, 0.3, 0.3, alpha);
                movePlane.overColor.setRGBA4f(1.0, 0.1, 0.1, alpha * 1.1);
                break;
            // xoy
            case 1:
                plane.initializeXOY(dis, dis, axisPlaneSize, axisPlaneSize);
                movePlane.setPlaneNormal(Vector3D.Z_AXIS);
                movePlane.outColor.setRGBA4f(0.3, 0.3, 1.0, alpha);
                movePlane.overColor.setRGBA4f(0.1, 0.1, 1.0, alpha * 1.1);
                break;
            // yoz
            case 2:
                plane.initializeYOZ(dis, dis, axisPlaneSize, axisPlaneSize);
                movePlane.setPlaneNormal(Vector3D.X_AXIS);
                movePlane.outColor.setRGBA4f(0.3, 1.0, 0.3, alpha);
                movePlane.overColor.setRGBA4f(0.1, 1.0, 0.1, alpha * 1.1);
                break;
            // ray cross plane
            case 3:
                movePlane.planeCrossRayEnabled = true;
                movePlane.outColor.setRGBA4f(1.0, 0.3, 1.0, alpha);
                movePlane.overColor.setRGBA4f(1.0, 0.1, 1.0, alpha * 1.1);
                break;
            default:
                throw Error("Error type !!!");
                break;
        }

        movePlane.moveSelfEnabled = false;
        movePlane.copyMeshFrom(srcEntity);
        movePlane.copyMaterialFrom(srcEntity);
        movePlane.showOutColor();

        movePlane.initializeEvent();
        movePlane.setTarget(this.m_dragMoveTarget);
        movePlane.addEventListener(MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_dragMoveTarget.addEntity(movePlane);
        this.m_controllers.push(movePlane);
        this.m_editRendererScene.addEntity(movePlane, this.m_editRendererSceneProcessid, true);
        return movePlane;
    }
    private init(): void {

        let sphRadius: number = 50;
        let alpha: number = 0.6;

        let moveAxis = new DragAxisQuad3D();
        moveAxis.moveSelfEnabled = true;
        moveAxis.pickTestRadius = 15;
        moveAxis.initialize(500.0, 5.0);
        moveAxis.outColor.setRGBA4f(0.9, 0.8, 0.9, 1.0);
        moveAxis.overColor.setRGBA4f(1.0, 1.0, 1.0, 1.0);
        moveAxis.showOutColor();

        moveAxis.initializeEvent();
        moveAxis.setTarget(this.m_dragMoveTarget);
        moveAxis.addEventListener(MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_dragMoveTarget.addEntity(moveAxis);
        this.m_controllers.push(moveAxis);
        this.m_editRendererScene.addEntity(moveAxis, this.m_editRendererSceneProcessid, true);

        let planeCtrFlag: boolean = true;
        if (planeCtrFlag) {
            // xoz
            this.createPlaneDrag(0, alpha);
            // xoy
            this.createPlaneDrag(1, alpha);
            // yoz
            this.createPlaneDrag(2, alpha);
        }
        let sph: Sphere3DEntity = new Sphere3DEntity();
        sph.initialize(sphRadius, 10, 10);
        // ray cross plane
        this.m_crossPlaneDrag = this.createPlaneDrag(3, alpha, sph);
    }
    private dragMouseDownListener(evt: any): void {
        this.m_editRendererScene.addEventListener(MouseEvent.MOUSE_UP, this, this.dragMouseUpListener, true, true);
        this.setVisible(false);
    }
    private dragMouseUpListener(evt: any): void {
        this.m_editRendererScene.removeEventListener(MouseEvent.MOUSE_UP, this, this.dragMouseUpListener);
        this.setVisible(true);
    }
    private m_pos0: Vector3D = new Vector3D();
    private m_pos1: Vector3D = new Vector3D(100.0, 0.0, 0.0);
    private m_posX: number = -1;
    private m_mousePrePos: Vector3D = new Vector3D(-100000, -100000, 0);
    private m_mousePos: Vector3D = new Vector3D();
    run(): void {

        if (this.m_enabled) {

            this.m_tempPos.copyFrom(this.m_dragMoveTarget.position);

            this.m_camera = this.m_editRendererScene.getCamera() as CameraBase;
            this.m_camera.getViewMatrix().transformVector3Self(this.m_tempPos);

            this.m_pos0.setXYZ(0.0, 0.0, this.m_tempPos.z);
            this.m_pos1.setXYZ(100.0, 0.0, this.m_tempPos.z);
            this.m_camera.getProjectMatrix().transformVectorSelf(this.m_pos0);
            this.m_camera.getProjectMatrix().transformVectorSelf(this.m_pos1);
            this.m_pos1.x = this.m_pos1.x / this.m_pos1.w - this.m_pos0.x / this.m_pos0.w;

            if (Math.abs(this.m_posX - this.m_pos1.x) > 0.0001) {
                this.m_posX = this.m_pos1.x;
                let scale: number = 0.03 / this.m_pos1.x;
                this.m_dragMoveTarget.setCtrlScaleXYZ(scale, scale, scale);
                this.m_dragMoveTarget.update();
            }
            this.m_mousePos.setXYZ(this.m_editRendererScene.getStage3D().mouseX, this.m_editRendererScene.getStage3D().mouseY, 0);
            if (Vector3D.DistanceSquared(this.m_mousePrePos, this.m_mousePos) > 0.001) {
                this.m_mousePrePos.copyFrom(this.m_mousePos);
                this.m_editRendererScene.getMouseXYWorldRay(this.m_rpv, this.m_rtv);

                for (let i: number = 0; i < this.m_controllers.length; ++i) {
                    if (this.m_controllers[i].isSelected()) {
                        this.m_controllers[i].moveByRay(this.m_rpv, this.m_rtv);
                    }
                }
            }
        }
    }
    isSelected(): boolean {
        let flag: boolean = false;
        for (let i: number = 0; i < this.m_controllers.length; ++i) {
            flag = flag || this.m_controllers[i].isSelected();
        }
        return flag;
    }
    select(): void {
    }
    deselect(): void {

        for (let i: number = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].deselect();
        }
    }
    setVisible(visible: boolean): void {

        this.m_visible = visible;
        for (let i: number = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].setVisible(visible);
        }
    }
    moveByRay(rpv: Vector3D, rtv: Vector3D): void {

    }
    getVisible(): boolean {
        return this.m_visible;
    }

    setXYZ(px: number, py: number, pz: number): void {
    }

    setPosition(pv: Vector3D): void {
        this.m_dragMoveTarget.setPosition(pv);
        this.m_dragMoveTarget.update();
    }
    getPosition(pv: Vector3D): void {
        this.m_dragMoveTarget.getPosition(pv);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_dragMoveTarget.setScaleXYZ(sx, sy, sz);
    }
    getRotationXYZ(pv: Vector3D): void {
    }
    getScaleXYZ(pv: Vector3D): void {
    }
    
    localToGlobal(pv: Vector3D): void {
    }
    globalToLocal(pv: Vector3D): void {
    }
    update(): void {
    }
    destroy(): void {
        this.m_controllers = [];
    }

}

export { DragMoveController };
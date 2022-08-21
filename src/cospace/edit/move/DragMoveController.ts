import IVector3D from "../../../vox/math/IVector3D";
import DragPlane from "./DragPlane";
import DragAxis from "./DragAxis";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { IRayControl } from "../base/IRayControl";

import {IRenderCamera} from "../../../vox/render/IRenderCamera";
import ITransformEntity from "../../../vox/entity/ITransformEntity";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
// import { ICoAGeom } from "../../ageom/ICoAGeom";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
// declare var CoAGeom: ICoAGeom;

class DragMoveTarget implements IEntityTransform {

    private m_entitys: IEntityTransform[] = [null];
    private m_changFlags: boolean[] = [true];
    private m_targetPosOffset = CoMath.createVec3();
    position = CoMath.createVec3();

    constructor() {
    }
    setTargetPosOffset(offset: IVector3D): void {
        this.m_targetPosOffset.copyFrom(offset);
    }
    addEntity(engity: IEntityTransform): void {
        if (engity != null) {
            this.m_entitys.push(engity);
            this.m_changFlags.push(true);
        }
    }
    setTarget(target: IEntityTransform): void {
        this.m_entitys[0] = target;
        this.m_changFlags[0] = true;
    }
    getTarget(): IEntityTransform {
        return this.m_entitys[0];
    }

    setXYZ(px: number, py: number, pz: number): void {
    }
    setPosition(pv: IVector3D): void {
        let i: number = 0;
        if (this.m_entitys[i] != null) {
            this.position.addVecsTo(pv, this.m_targetPosOffset);
            this.m_entitys[i].setPosition(this.position);
            this.m_changFlags[i] = true;
        }
        for (i = 1; i < this.m_entitys.length; ++i) {
            this.m_entitys[i].setPosition(pv);
            this.m_changFlags[i] = true;
        }
        this.position.copyFrom(pv);
    }
    getPosition(pv: IVector3D): void {
        pv.copyFrom(this.position);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        // for (let i: number = 1; i < this.m_entitys.length; ++i) {
        //     this.m_entitys[i].setScaleXYZ(sx, sy, sz);
        // }
    }
    setCtrlScaleXYZ(sx: number, sy: number, sz: number): void {
        for (let i: number = 1; i < this.m_entitys.length; ++i) {
            this.m_changFlags
            this.m_entitys[i].setScaleXYZ(sx, sy, sz);
            this.m_changFlags[i] = true;
        }
    }
    getRotationXYZ(pv: IVector3D): void {
    }
    getScaleXYZ(pv: IVector3D): void {
    }
    
    localToGlobal(pv: IVector3D): void {
    }
    globalToLocal(pv: IVector3D): void {
    }
    update(): void {
        let i: number = 0;
        if (this.m_entitys[i] != null && this.m_changFlags[i]) {
            this.m_changFlags[i] = false;
            this.m_entitys[i].update();
        }
        for (i = 1; i < this.m_entitys.length; ++i) {
            if (this.m_changFlags[i]) {
                this.m_changFlags[i] = false;
                this.m_entitys[i].update();
            }
        }
    }
    destroy(): void {
        this.m_entitys = [null];
    }
}
class DragMoveController implements IRayControl {

    private m_controllers: IRayControl[] = [];
    private m_crossPlaneDrag: DragPlane = null;
    private m_rpv = CoMath.createVec3();
    private m_rtv = CoMath.createVec3();
    private m_tempPos = CoMath.createVec3();
    private m_visible = true;
    private m_enabled = true;

    private m_editRendererScene: IRendererScene = null;
    private m_editRendererSceneProcessid: number = 0;
    private m_dragMoveTarget: DragMoveTarget = new DragMoveTarget();
    private m_camera: IRenderCamera = null;

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
    selectByParam(raypv: IVector3D, raytv: IVector3D, wpos: IVector3D): void {
        if (this.m_crossPlaneDrag != null) {
            this.m_crossPlaneDrag.selectByParam(raypv, raytv, wpos);
        }
    }
    setTargetPosOffset(offset: IVector3D): void {
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
    private createPlaneDrag(type: number, alpha: number, srcEntity: ITransformEntity = null): DragPlane {

        let size: number = 50;
        
        let movePlane = new DragPlane();

        movePlane.moveSelfEnabled = false;
        movePlane.initialize(type, size, alpha);
        
        movePlane.setTarget(this.m_dragMoveTarget);
        movePlane.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_dragMoveTarget.addEntity(movePlane);
        this.m_controllers.push(movePlane);
        this.m_editRendererScene.addEntity(movePlane.getEntity(), this.m_editRendererSceneProcessid, true);
        return movePlane;
    }
    private init(): void {

        // let sphRadius: number = 50;
        let alpha: number = 0.6;

        let moveAxis = new DragAxis();
        moveAxis.moveSelfEnabled = true;
        moveAxis.pickTestRadius = 15;
        moveAxis.initialize(500.0);
        moveAxis.outColor.setRGBA4f(0.9, 0.8, 0.9, 1.0);
        moveAxis.overColor.setRGBA4f(1.0, 1.0, 1.0, 1.0);
        moveAxis.showOutColor();

        // moveAxis.initializeEvent();
        moveAxis.setTarget(this.m_dragMoveTarget);
        moveAxis.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_dragMoveTarget.addEntity(moveAxis.getEntity());
        this.m_controllers.push(moveAxis);
        this.m_editRendererScene.addEntity(moveAxis.getEntity(), this.m_editRendererSceneProcessid, true);

        let planeCtrFlag: boolean = true;
        if (planeCtrFlag) {
            // xoz
            this.createPlaneDrag(0, alpha);
            // xoy
            this.createPlaneDrag(1, alpha);
            // yoz
            this.createPlaneDrag(2, alpha);
        }

        // let sph: Sphere3DEntity = new Sphere3DEntity();
        // sph.initialize(sphRadius, 10, 10);
        // // ray cross plane
        // this.m_crossPlaneDrag = this.createPlaneDrag(3, alpha, sph);
    }
    private dragMouseDownListener(evt: any): void {
        this.m_editRendererScene.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.dragMouseUpListener, true, true);
        this.setVisible(false);
    }
    private dragMouseUpListener(evt: any): void {
        this.m_editRendererScene.removeEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.dragMouseUpListener);
        this.setVisible(true);
    }
    private m_pos0 = CoMath.createVec3();
    private m_pos1 = CoMath.createVec3(100.0, 0.0, 0.0);
    private m_posX = -1;
    private m_mousePrePos = CoMath.createVec3(-100000, -100000, 0);
    private m_mousePos = CoMath.createVec3();
    run(): void {

        if (this.m_enabled) {

            this.m_tempPos.copyFrom(this.m_dragMoveTarget.position);

            this.m_camera = this.m_editRendererScene.getCamera();
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
            if (CoMath.Vector3D.DistanceSquared(this.m_mousePrePos, this.m_mousePos) > 0.001) {
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
    moveByRay(rpv: IVector3D, rtv: IVector3D): void {

    }
    getVisible(): boolean {
        return this.m_visible;
    }

    setXYZ(px: number, py: number, pz: number): void {
    }

    setPosition(pv: IVector3D): void {
        this.m_dragMoveTarget.setPosition(pv);
        this.m_dragMoveTarget.update();
    }
    getPosition(pv: IVector3D): void {
        this.m_dragMoveTarget.getPosition(pv);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_dragMoveTarget.setScaleXYZ(sx, sy, sz);
    }
    getRotationXYZ(pv: IVector3D): void {
    }
    getScaleXYZ(pv: IVector3D): void {
    }
    
    localToGlobal(pv: IVector3D): void {
    }
    globalToLocal(pv: IVector3D): void {
    }
    update(): void {
    }
    destroy(): void {
        this.m_controllers = [];
    }

}

export { DragMoveController };
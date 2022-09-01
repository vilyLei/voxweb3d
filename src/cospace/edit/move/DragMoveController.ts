import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import DragPlane from "./DragPlane";
import DragRayCrossPlane from "./DragRayCrossPlane";
import DragAxis from "./DragAxis";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { IRayControl } from "../base/IRayControl";

import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { DragMoveTarget } from "./DragMoveTarget";

import { IDragMoveController } from "./IDragMoveController";
import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
// import { ICoAGeom } from "../../ageom/ICoAGeom";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
// declare var CoAGeom: ICoAGeom;

/**
 * 在三个坐标轴上拖拽移动
 */
class DragMoveController implements IDragMoveController {

    private m_controllers: IRayControl[] = [];
    private m_rpv = CoMath.createVec3();
    private m_rtv = CoMath.createVec3();
    private m_tempPos = CoMath.createVec3();
    private m_visible = true;
    private m_enabled = true;

    private m_editRS: IRendererScene = null;
    private m_editRSP: number = 0;
    private m_target = new DragMoveTarget();
    private m_camera: IRenderCamera = null;

    private m_posX = -1;
    private m_pos0 = CoMath.createVec3();
    private m_pos1 = CoMath.createVec3(100.0, 0.0, 0.0);
    private m_mousePrePos = CoMath.createVec3(-100000, -100000, 0);
    private m_mousePos = CoMath.createVec3();
    /**
     * example: the value is 0.05
     */
    fixSize = 0.0;

    circleSize = 60.0;
    axisSize = 100.0;
    planeSize = 50.0;
    planeAlpha = 0.6;
    pickTestAxisRadius = 20;
    runningVisible = true;
    uuid = "DragMoveController";
    
    constructor() { }
    /**
     * initialize the DragMoveController instance.
     * @param editRendererScene a IRendererScene instance.
     * @param processid this destination renderer process id in the editRendererScene.
     */
    initialize(rc: IRendererScene, processid: number = 0): void {
        if (this.m_editRS == null) {
            this.m_editRS = rc;
            this.m_editRSP = processid;
            this.init();
        }
    }

    selectByParam(raypv: IVector3D, raytv: IVector3D, wpos: IVector3D): void {
        // if (this.m_crossPlaneDrag != null) {
        //     this.m_crossPlaneDrag.selectByParam(raypv, raytv, wpos);
        // }
    }
    setTargetPosOffset(offset: IVector3D): void {
        this.m_target.setTargetPosOffset(offset);
    }
    setTarget(target: IEntityTransform): void {

        this.m_target.setTarget(target);
        this.setVisible(target != null);
    }
    getTarget(): IEntityTransform {
        return this.m_target.getTarget();
    }
    private createPlaneDrag(type: number, alpha: number): DragPlane {

        let movePlane = new DragPlane();
        movePlane.moveSelfEnabled = false;
        movePlane.initialize(type, this.planeSize, alpha);

        movePlane.setTarget(this.m_target);
        movePlane.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_target.addEntity(movePlane);
        this.m_controllers.push(movePlane);
        this.m_editRS.addEntity(movePlane.getEntity(), this.m_editRSP, true);
        return movePlane;
    }
    private init(): void {

        let alpha = this.planeAlpha;

        let moveAxis = new DragAxis();
        moveAxis.moveSelfEnabled = true;
        moveAxis.pickTestRadius = this.pickTestAxisRadius;
        moveAxis.initialize(this.axisSize);
        moveAxis.outColor.setRGBA4f(0.9, 0.8, 0.9, 1.0);
        moveAxis.overColor.setRGBA4f(1.0, 1.0, 1.0, 1.0);
        moveAxis.showOutColor();

        moveAxis.setTarget(this.m_target);
        moveAxis.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_target.addEntity(moveAxis.getEntity());
        this.m_controllers.push(moveAxis);
        this.m_editRS.addEntity(moveAxis.getEntity(), this.m_editRSP, true);

        let planeCtrFlag = true;
        if (planeCtrFlag) {
            // xoz
            this.createPlaneDrag(0, alpha);
            // xoy
            this.createPlaneDrag(1, alpha);
            // yoz
            this.createPlaneDrag(2, alpha);
        }

        let crossPlane = new DragRayCrossPlane();
        console.log("XXXXXXXX crossPlane: ", crossPlane);
        crossPlane.moveSelfEnabled = false;
        crossPlane.initialize(this.m_editRS, 0, this.circleSize)
        crossPlane.setTarget(this.m_target);
        crossPlane.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_target.addEntity(crossPlane);
        this.m_controllers.push(crossPlane);
    }
    private dragMouseDownListener(evt: any): void {
        this.m_editRS.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.dragMouseUpListener, true, true);
        this.setVisible(this.runningVisible);
    }
    private dragMouseUpListener(evt: any): void {
        this.m_editRS.removeEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.dragMouseUpListener);
        this.setVisible(true);
    }
    run(): void {

        if (this.m_enabled) {

            this.m_tempPos.copyFrom(this.m_target.position);
            this.m_camera = this.m_editRS.getCamera();
            let stage = this.m_editRS.getStage3D();

            if (this.fixSize > 0.01) {
                let vmat = this.m_camera.getViewMatrix();
                let pmat = this.m_camera.getProjectMatrix();
                vmat.transformVector3Self(this.m_tempPos);

                this.m_pos0.setXYZ(0.0, 0.0, this.m_tempPos.z);
                this.m_pos1.setXYZ(100.0, 0.0, this.m_tempPos.z);
                pmat.transformVectorSelf(this.m_pos0);
                pmat.transformVectorSelf(this.m_pos1);
                this.m_pos1.x = this.m_pos1.x / this.m_pos1.w - this.m_pos0.x / this.m_pos0.w;

                if (Math.abs(this.m_posX - this.m_pos1.x) > 0.0001) {
                    this.m_posX = this.m_pos1.x;
                    let scale = this.fixSize / this.m_pos1.x;
                    this.m_target.setCtrlScaleXYZ(scale, scale, scale);
                    this.m_target.update();
                }
            }
            this.m_mousePos.setXYZ(stage.mouseX, stage.mouseY, 0);
            if (CoMath.Vector3D.DistanceSquared(this.m_mousePrePos, this.m_mousePos) > 0.001) {
                this.m_mousePrePos.copyFrom(this.m_mousePos);
                this.m_editRS.getMouseXYWorldRay(this.m_rpv, this.m_rtv);

                for (let i = 0; i < this.m_controllers.length; ++i) {
                    if (this.m_controllers[i].isSelected()) {
                        this.m_controllers[i].moveByRay(this.m_rpv, this.m_rtv);
                    }
                }
            }
        }
    }
    isSelected(): boolean {
        let flag = false;
        for (let i = 0; i < this.m_controllers.length; ++i) {
            flag = flag || this.m_controllers[i].isSelected();
        }
        return flag;
    }
    select(): void {
    }
    deselect(): void {

        console.log("DragMoveController::deselect() ..., this.m_controllers.length: ", this.m_controllers.length);
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].deselect();
        }
    }
    setVisible(visible: boolean): void {

        this.m_visible = visible;
        for (let i = 0; i < this.m_controllers.length; ++i) {
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
        this.m_target.setPosition(pv);
        this.m_target.update();
    }
    getPosition(pv: IVector3D): void {
        this.m_target.getPosition(pv);
    }
    setRotation3(r: IVector3D): void {
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_target.setScaleXYZ(sx, sy, sz);
    }
    getRotationXYZ(pv: IVector3D): void {
    }
    getScaleXYZ(pv: IVector3D): void {
    }

    getGlobalBounds(): IAABB {
        return null;
    }
    getLocalBounds(): IAABB {
        return null;
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
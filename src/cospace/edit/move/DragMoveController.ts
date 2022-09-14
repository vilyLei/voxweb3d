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
import { MovedTarget } from "./MovedTarget";
import { DragLine } from "./DragLine";

import { IDragMoveController } from "./IDragMoveController";
import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import IColor4 from "../../../vox/material/IColor4";
import IMatrix4 from "../../../vox/math/IMatrix4";
// import { ICoAGeom } from "../../ageom/ICoAGeom";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
declare var CoMaterial: ICoMaterial;
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
    // private m_target = new DragMoveTarget();
    private m_target = new MovedTarget();
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
    planeSize = 30.0;
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

    private createDragPlane(type: number, alpha: number, outColor: IColor4): DragPlane {

        let movePlane = new DragPlane();
        movePlane.moveSelfEnabled = false;
        movePlane.initialize(type, this.planeSize);
        outColor.a = alpha;
        movePlane.outColor.copyFrom(outColor);
        outColor.scaleBy(1.5);
        outColor.a = alpha * 1.3;
        movePlane.overColor.copyFrom(outColor);
        movePlane.showOutColor();

        movePlane.setTarget(this.m_target);
        movePlane.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_target.addCtrlEntity(movePlane);
        this.m_controllers.push(movePlane);
        this.m_editRS.addEntity(movePlane.getEntity(), this.m_editRSP, true);
        return movePlane;
    }
    private createDragLine(tv: IVector3D, outColor: IColor4, mat4: IMatrix4): void {

        let trans = tv.clone().scaleBy(this.axisSize);
        mat4.setTranslation(trans);

        let line = new DragLine();
        line.coneScale = 0.8;
        line.coneTransMat4 = mat4;
        line.tv.copyFrom(tv);
        line.innerSphereRadius = this.circleSize * 0.5;
        line.moveSelfEnabled = true;
        line.pickTestRadius = this.pickTestAxisRadius;
        line.initialize(this.axisSize, line.innerSphereRadius);
        line.outColor.copyFrom(outColor);
        outColor.scaleBy(1.5);
        line.overColor.copyFrom(outColor);
        line.showOutColor();

        line.setTarget(this.m_target);
        line.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_editRS.addEntity(line.getEntity(), this.m_editRSP, true);
        this.m_editRS.addEntity(line.getCone(), this.m_editRSP, true);
        this.m_target.addCtrlEntity(line.getEntity());
        this.m_target.addCtrlEntity(line.getCone());
        this.m_controllers.push(line);
    }
    private init(): void {

        let alpha = this.planeAlpha;

        let color4 = CoMaterial.createColor4;

        let outColor = color4();

        /*

        const V3 = CoMath.Vector3D;
        let mat4 = CoMath.createMat4();

        outColor.setRGBUint8(240, 55, 80);
        mat4.identity();
        this.createDragLine(V3.X_AXIS, outColor, mat4);
        outColor.setRGBUint8(135, 205, 55);
        mat4.identity();
        this.createDragLine(V3.Y_AXIS, outColor, mat4);
        outColor.setRGBUint8(80, 145, 240);
        mat4.identity();
        this.createDragLine(V3.Z_AXIS, outColor, mat4);
        */

        const V3 = CoMath.Vector3D;
        let mat4 = CoMath.createMat4();
        mat4.identity();
        mat4.rotationZ(-0.5 * Math.PI);
        outColor.setRGBUint8(240, 55, 80);
        this.createDragLine(V3.X_AXIS, outColor, mat4);
        mat4.identity();
        mat4.rotationX(0.5 * Math.PI);
        mat4.rotationY(0.5 * Math.PI);
        outColor.setRGBUint8(135, 205, 55);
        this.createDragLine(V3.Y_AXIS, outColor, mat4);
        mat4.identity();
        mat4.rotationY(0.5 * Math.PI);
        mat4.rotationX(0.5 * Math.PI);
        outColor.setRGBUint8(80, 145, 240);
        this.createDragLine(V3.Z_AXIS, outColor, mat4);

        // xoz
        outColor.setRGBUint8(240, 55, 80);
        this.createDragPlane(0, alpha, outColor);
        // xoy
        outColor.setRGBUint8(135, 205, 55);
        this.createDragPlane(1, alpha, outColor);
        // yoz
        outColor.setRGBUint8(80, 145, 240);
        this.createDragPlane(2, alpha, outColor);

        let crossPlane = new DragRayCrossPlane();
        crossPlane.moveSelfEnabled = false;
        crossPlane.initialize(this.m_editRS, 0, this.circleSize);
        crossPlane.setTarget(this.m_target);
        crossPlane.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_target.addCtrlEntity(crossPlane);
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
    select(targets: IEntityTransform[]): void {

        this.m_target.setTargets(targets);
        this.m_target.select(null);
        this.setVisible(targets != null);
    }
    deselect(): void {

        console.log("DragMoveController::deselect() ..., this.m_controllers.length: ", this.m_controllers.length);
        this.m_target.deselect();
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].deselect();
        }
    }
    decontrol(): void {
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
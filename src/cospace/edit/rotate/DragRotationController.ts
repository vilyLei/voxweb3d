/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";

import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IRendererScene from "../../../vox/scene/IRendererScene";

import { DragMoveTarget } from "../move/DragMoveTarget";
import { RotationCircle } from "./RotationCircle";
import { IDragRotationController } from "./IDragRotationController";

import IColor4 from "../../../vox/material/IColor4";
import { IRayControl } from "../base/IRayControl";
import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;

/**
 * 在三个坐标轴上拖动旋转
 */
class DragRotationController implements IDragRotationController {

    private m_controllers: IRayControl[] = [];
    private m_pos0 = CoMath.createVec3();
    private m_pos1 = CoMath.createVec3();
    private m_posX = 0;
    private m_rpv = CoMath.createVec3();
    private m_rtv = CoMath.createVec3();
    private m_tempPos = CoMath.createVec3();
    private m_visible = true;
    private m_enabled = true;

    private m_editRS: IRendererScene = null;
    private m_editRSP: number = 0;
    private m_target = new DragMoveTarget();
    private m_camera: IRenderCamera = null;

    private m_mousePrePos = CoMath.createVec3(-100000, -100000, 0);
    private m_mousePos = CoMath.createVec3();
    /**
     * example: the value is 0.05
     */
    fixSize = 0.0;
    radius = 100.0;
    pickTestAxisRadius = 20;
    runningVisible = true;
    uuid = "DragRotationController";
    constructor() { }
    /**
     * initialize the DragRotationController instance.
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
    private createCircle(type: number, color: IColor4, radius: number = 100.0, segsTotal: number = 20): RotationCircle {
        let circle = new RotationCircle();
        circle.initialize(radius, segsTotal, type, color);

        circle.setTarget(this.m_target);
        circle.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);

        this.m_target.addEntity(circle);
        this.m_controllers.push(circle);
        this.m_editRS.addEntity(circle.getEntity(), this.m_editRSP, true);
        return circle;
    }
    private init(): void {

        let planeCtrFlag = true;
        if (planeCtrFlag) {
            let n = Math.floor(this.radius / 2.0);
            // xoz
            this.createCircle(0, CoMaterial.createColor4(1.0, 0.0, 0.0), this.radius, n);
            // xoy
            this.createCircle(1, CoMaterial.createColor4(0.0, 1.0, 0.0), this.radius, n);
            // yoz
            this.createCircle(2, CoMaterial.createColor4(0.0, 0.0, 1.0), this.radius, n);
        }
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

        console.log("DragRotationController::deselect() ..., this.m_controllers.length: ", this.m_controllers.length);
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].deselect();
        }
    }
    decontrol(): void {
        
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
        this.m_target.setRotation3(r);
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
        this.m_editRS = null;
    }
}
export { DragRotationController }
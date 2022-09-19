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
import { RotationCamZCircle } from "./RotationCamZCircle";
import { IDragRotationController } from "./IDragRotationController";
import { RotatedTarget } from "./RotatedTarget";

import IColor4 from "../../../vox/material/IColor4";
import { IRotationCtr } from "./IRotationCtr";
import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { RotationCamXYCircle } from "./RotationCamXYCircle";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;

/**
 * 在三个坐标轴上拖动旋转
 */
class DragRotationController implements IDragRotationController {

    private m_controllers: IRotationCtr[] = [];
    private m_pos0 = CoMath.createVec3();
    private m_pos1 = CoMath.createVec3();

    private m_rpv = CoMath.createVec3();
    private m_rtv = CoMath.createVec3();

    private m_tempPos = CoMath.createVec3();

    private m_visible = true;
    private m_enabled = true;
    private m_posX = 0;

    private m_editRS: IRendererScene = null;
    private m_editRSPI: number = 0;
    private m_target = new RotatedTarget();

    private m_mousePrePos = CoMath.createVec3(-100000, -100000, 0);
    private m_mousePos = CoMath.createVec3();
    /**
     * example: the value is 0.05
     */
    fixSize = 0.0;
    radius = 100.0;
    pickTestAxisRadius = 20;
    camZCircleRadius = 120;
    camYXCircleRadius = 80;
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
            this.m_editRSPI = processid;
            this.init();
        }
    }

    private createCircle(type: number, color: IColor4, radius: number = 100.0, segsTotal: number = 20): RotationCircle {

        let circle = new RotationCircle();
        circle.pickTestRadius = this.pickTestAxisRadius;
        circle.outColor.copyFrom(color);
        circle.overColor.copyFrom(color);
        circle.overColor.scaleBy(1.5);
        circle.initialize(this.m_editRS, this.m_editRSPI + 1, radius, segsTotal, type);
        circle.showOutColor();

        circle.setTarget(this.m_target);
        circle.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);

        this.m_target.addCtrlEntity(circle);
        this.m_controllers.push(circle);
        
        return circle;
    }

    private init(): void {

        // 粉色 240,55,80, 绿色 135 205 55,  蓝色:  80, 145, 240
        let n = Math.floor(this.radius / 2.0);
        if(n < 30) {
            n = 30;
        }
        // xoz
        let color = CoMaterial.createColor4();
        
        ///*
        this.createCircle(0, color.setRGBUint8(240,55,80), this.radius, n);
        // xoy
        this.createCircle(1, color.setRGBUint8(135,205,55), this.radius, n);
        // yoz
        this.createCircle(2, color.setRGBUint8(80,145,240), this.radius, n);
        //*/

        n = Math.floor(this.camZCircleRadius / 2.0);
        let camZCtrl = new RotationCamZCircle();
        camZCtrl.pickTestRadius = this.pickTestAxisRadius;
        camZCtrl.initialize(this.m_editRS, this.m_editRSPI, this.camZCircleRadius, n);
        camZCtrl.setTarget(this.m_target);
        camZCtrl.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_target.addCtrlEntity(camZCtrl);
        this.m_controllers.push(camZCtrl);

        let camYXCtrl = new RotationCamXYCircle();
        camYXCtrl.pickTestRadius = this.pickTestAxisRadius;
        camYXCtrl.initialize(this.m_editRS, this.m_editRSPI, this.camYXCircleRadius);
        camYXCtrl.showOutColor();
        camYXCtrl.setTarget(this.m_target);
        camYXCtrl.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        this.m_target.addCtrlEntity(camYXCtrl);
        this.m_controllers.push(camYXCtrl);

    }
    private dragMouseDownListener(evt: any): void {
        this.m_editRS.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.dragMouseUpListener, true, true);
    }
    private dragMouseUpListener(evt: any): void {
        this.m_editRS.removeEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.dragMouseUpListener);
    }
    enable(): void {
        this.m_enabled = true;
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].enable();
        }
    }
    disable(): void {
        this.m_enabled = false;
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].disable();
        }
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }
    run(): void {

        if (this.m_enabled) {

            let ls = this.m_controllers;

            this.m_tempPos.copyFrom(this.m_target.position);
            let cam = this.m_editRS.getCamera();
            let stage = this.m_editRS.getStage3D();

            if (this.fixSize > 0.01) {
                let vmat = cam.getViewMatrix();
                let pmat = cam.getProjectMatrix();
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

                for (let i = 0; i < ls.length; ++i) {
                    if (ls[i].isSelected()) {
                        ls[i].moveByRay(this.m_rpv, this.m_rtv);
                    }
                }
            }

            for (let i = 0; i < ls.length; ++i) {
                if (ls[i].getVisible()) {
                    ls[i].run(cam, this.m_rtv);
                }
            }
        }
    }
    isSelected(): boolean {
        let flag = false;
        let ls = this.m_controllers;
        for (let i = 0; i < ls.length; ++i) {
            flag = flag || ls[i].isSelected();
        }
        return flag;
    }
    select(targets: IEntityTransform[]): void {        
        this.m_target.setTargets(targets);
        this.m_target.select(null);
        this.setVisible(targets != null);
    }
    deselect(): void {

        console.log("DragRotationController::deselect() ..., this.m_controllers.length: ", this.m_controllers.length);
        this.m_target.deselect();
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].deselect();
        }
    }
    decontrol(): void {
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].deselect();
        }
        this.setVisible(true);
    }
    
    getTargets(): IEntityTransform[] {
        return this.m_target.getTargets();
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
        this.m_controllers[0].getPosition(pv);
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
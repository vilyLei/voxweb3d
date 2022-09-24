/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";

import IEntityTransform from "../../../vox/entity/IEntityTransform";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { ICtrTarget } from "../base/ICtrTarget";

import { IRayControl } from "../base/IRayControl";
import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;

/**
 * transform 编辑控制器基类
 */
class DragTransController{

    protected m_controllers: IRayControl[] = [];

    private m_pos0 = CoMath.createVec3();
    private m_pos1 = CoMath.createVec3();

    private m_rpv = CoMath.createVec3();
    private m_rtv = CoMath.createVec3();
    private m_tempPos = CoMath.createVec3();
    private m_mv0 = CoMath.createVec3(-100000, -100000, 0);
    private m_mv1 = CoMath.createVec3();
    private m_px = 0;

    protected m_visible = true;
    protected m_enabled = true;

    protected m_editRS: IRendererScene = null;
    protected m_editRSPI: number = 0;
    protected m_target: ICtrTarget = null;

    /**
     * example: the value is 0.05
     */
    fixSize = 0.0;
    runningVisible = true;
    uuid = "DragTransController";
    constructor() { }
    /**
     * initialize the DragTransController instance.
     * Don't overide this function
     * @param editRendererScene a IRendererScene instance.
     * @param processid this destination renderer process id in the editRendererScene.
     */
    initialize(rc: IRendererScene, processid: number = 0): void {
        if (this.m_editRS == null) {
            this.m_editRS = rc;
            this.m_editRSPI = processid;

            this.init();
            this.applyEvt();
        }
    }
    /**
     * 需要被子类覆盖，以便实现具体的功能
     */
    protected init(): void {

    }
    private applyEvt(): void {
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
        }
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
                if (Math.abs(this.m_px - this.m_pos1.x) > 0.0001) {
                    this.m_px = this.m_pos1.x;
                    let scale = this.fixSize / this.m_pos1.x;
                    this.m_target.setCtrlScaleXYZ(scale, scale, scale);
                    this.m_target.update();
                }
            }

            for (let i = 0; i < ls.length; ++i) {
                if (ls[i].getVisible()) {
                    ls[i].run(cam, this.m_rtv);
                }
            }
            this.m_mv1.setXYZ(stage.mouseX, stage.mouseY, 0);
            if (CoMath.Vector3D.DistanceSquared(this.m_mv0, this.m_mv1) > 0.001) {
                this.m_mv0.copyFrom(this.m_mv1);
                this.m_editRS.getMouseXYWorldRay(this.m_rpv, this.m_rtv);

                for (let i = 0; i < ls.length; ++i) {
                    if (ls[i].isSelected()) {
                        ls[i].moveByRay(this.m_rpv, this.m_rtv);
                    }
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

        console.log("DragTransController::deselect() ..., this.m_controllers.length: ", this.m_controllers.length);
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
        if(this.m_controllers.length > 0) {
            for (let i = 0; i < this.m_controllers.length; ++i) {
                this.m_controllers[i].destroy();
            }
            this.m_controllers = [];
        }
        this.m_editRS = null;
    }
}
export { DragTransController }
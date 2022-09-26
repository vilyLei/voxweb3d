/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

import { IUserEditController } from "../base/IUserEditController";

import { IDragMoveController } from "../../edit/move/IDragMoveController";
import { DragMoveController } from "../../edit/move/DragMoveController";
import { IDragScaleController } from "../scale/IDragScaleController";
import { DragScaleController } from "../scale/DragScaleController";
import { IDragRotationController } from "../rotate/IDragRotationController";
import { DragRotationController } from "../rotate/DragRotationController";
import IVector3D from "../../../vox/math/IVector3D";
import { ITransformController } from "./ITransformController";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

/**
 * renderable entity transform 编辑控制器
 */
class TransformController implements ITransformController {

    private m_rsc: IRendererScene = null;
    private m_enabled: boolean = false;
    private m_controllers: IUserEditController[] = [null, null, null];
    private m_wpos: IVector3D = CoMath.createVec3();
    private m_targets: IEntityTransform[] = null;

    private m_movedCtr: IDragMoveController = null;
    private m_scaleCtr: IDragScaleController = null;
    private m_rotatedCtr: IDragRotationController = null;
    private m_type = -1;

    /**
     * the type vaule is 0
     */
    readonly TRANSLATION: number = 0;
    /**
     * the type vaule is 1
     */
    readonly SCALE: number = 1;
    /**
     * the type vaule is 2
     */
    readonly ROTATION: number = 2;
    constructor() {
    }
    initialize(rsc: IRendererScene, processid: number = 0): void {

        if (this.m_rsc == null) {

            this.m_rsc = rsc;

            let ls = this.m_controllers;

            let ctr0 = this.m_movedCtr = new DragMoveController();
            ctr0.axisSize = 100;
            ctr0.planeSize = 30;
            ctr0.pickTestAxisRadius = 10;
            ctr0.runningVisible = true;
            ctr0.initialize(rsc, 0);
            ctr0.disable();
            ctr0.setVisible(false);
            ls[0] = ctr0;

            let ctr1 = this.m_scaleCtr = new DragScaleController();
            ctr1.axisSize = 100;
            ctr1.planeSize = 30;
            ctr1.pickTestAxisRadius = 10;
            ctr1.initialize(rsc, 0);
            ctr1.disable();
            ctr1.setVisible(false);
            ls[1] = ctr1;

            let ctr2 = this.m_rotatedCtr = new DragRotationController();
            ctr2.pickTestAxisRadius = 10;
            ctr2.runningVisible = true;
            ctr2.initialize(rsc, 0);
            ctr2.disable();
            ctr2.setVisible(false);
            ls[2] = ctr2;
        }
    }

    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        let ls = this.m_controllers;
        for (let i = 0; i < ls.length; ++i) {
            ls[i].addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
        }
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        let ls = this.m_controllers;
        for (let i = 0; i < ls.length; ++i) {
            ls[i].removeEventListener(type, listener, func);
        }
    }
    /**
     * to translation controller
     */
    toTranslation(): void {
        this.enable(this.TRANSLATION);
    }
    /**
     * to scale controller
     */
    toScale(): void {
        this.enable(this.SCALE);
    }
    /**
     * to rotation controller
     */
    toRotation(): void {
        this.enable(this.ROTATION);
    }
    /**
     * get the current controller type
     * @returns the legal value is 0, 1, or 2, -1 or other value is illegal.
     */
    getCurrType(): number {
        return this.m_type;
    }
    /**
     * @param type the correct value is 0, 1, or 2, the default value is -1.
     */
    enable(type: number = -1): void {

        let ls = this.m_controllers;
        let t = this.m_type;
        this.m_enabled = true;
        if (type >= 0 && type <= 2) {
            if (t != type) {
                let targets = this.m_targets;
                if (t >= 0) {
                    if (targets == null) {
                        targets = ls[t].getTargets();
                    }
                    ls[t].getPosition(this.m_wpos);
                    ls[t].decontrol();
                    ls[t].disable();
                    ls[t].setVisible(false);
                }

                this.m_type = type;
                ls[type].enable();
                if (targets != null) {
                    this.select(targets, this.m_wpos, false);
                }
                // else {
                //     ls[type].enable();
                // }
            }
        } else {
            if (t >= 0) {
                ls[t].enable();
            }
        }
    }
    disable(force: boolean = false): void {
        this.m_enabled = false;
        this.m_targets = null;
        let ls = this.m_controllers;
        let t = this.m_type;
        if (t >= 0) {
            ls[t].decontrol();
            ls[t].disable();
            ls[t].setVisible(false);
        }
        if (force) {
            this.m_type = -1;
        }
    }
    decontrol(): void {
        if (this.m_enabled && this.m_type >= 0) {
            this.m_controllers[this.m_type].decontrol();
        }
    }
    select(targets: IEntityTransform[], wpos: IVector3D = null, autoEnabled: boolean = true): void {
        if (targets != null) {
            
            if (this.m_type >= 0) {
                if (wpos == null) {
                    let pos = this.m_wpos;
                    let pv = CoMath.createVec3();
                    pos.setXYZ(0, 0, 0);
                    for (let i = 0; i < targets.length; ++i) {
                        pos.addBy(targets[i].getPosition(pv));
                    }
                    pos.scaleBy(1.0 / targets.length);
                } else {
                    this.m_wpos.copyFrom(wpos);
                }
                let ctr = this.m_controllers[this.m_type];
                if (autoEnabled && !ctr.isEnabled()) {
                    this.m_enabled = true;
                    ctr.enable();
                }
                ctr.deselect();
                ctr.setPosition(this.m_wpos);
                ctr.update();
                ctr.select(targets);
                ctr.setVisible(true);
            } else {
                this.m_targets = targets;
                this.m_wpos.copyFrom(wpos);
            }
        } else {
            console.error("targets == null");
        }
    }
    run(): void {
        if (this.m_enabled && this.m_type >= 0) {
            this.m_controllers[this.m_type].run();
        }
    }
}

export { TransformController }
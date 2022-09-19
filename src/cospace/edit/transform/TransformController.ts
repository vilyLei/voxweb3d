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

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoMath } from "../../math/ICoMath";
declare var CoMaterial: ICoMaterial;
declare var CoMath: ICoMath;


/**
 * 旋转编辑控制
 */
class TransformController {
    private m_rsc: IRendererScene = null;
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

        if(this.m_rsc == null) {

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
    /**
     * get the current controller type
     * @returns the legal value is 0, 1, or 2, -1 or other value is illegal.
     */
    getCurrType(): number {
        return this.m_type;
    }
    /**
     * @param type the value is 0, 1, or 2.
     */
    enable(type: number): void {
        if(type >= 0 && type <= 2 && this.m_type != type) {

            let ls = this.m_controllers;

            let targets: IEntityTransform[] = this.m_targets;

            if(this.m_type >= 0 && targets == null) {
                targets = ls[ this.m_type ].getTargets();
                ls[ this.m_type ].getPosition(this.m_wpos);
                ls[ this.m_type ].decontrol();
                ls[ this.m_type ].disable();
                ls[ this.m_type ].setVisible(false);
            }
            
            this.m_type = type;

            ls[ type ].enable();
            if(targets != null) {
                this.select(targets, this.m_wpos);
            }
        }
    }
    disable(): void {
        this.m_targets = null;
        let ls = this.m_controllers;
        if(this.m_type >= 0) {
            ls[ this.m_type ].decontrol();
            ls[ this.m_type ].disable();
            ls[ this.m_type ].setVisible(false);
        }
        this.m_type = -1;
    }
    decontrol(): void {
        if(this.m_type >= 0) {
            this.m_controllers[ this.m_type ].decontrol();
        }
    }
    select(targets: IEntityTransform[], wpos: IVector3D): void {
        if(this.m_type >= 0) {
            this.m_wpos.copyFrom( wpos );
            let ctr = this.m_controllers[ this.m_type ];
            ctr.deselect();
			ctr.setPosition(this.m_wpos);
			ctr.update();
            ctr.select(targets);            
            ctr.setVisible(true);
        }else {
            this.m_targets = targets;
            this.m_wpos.copyFrom( wpos );
        }
    }
    run(): void {
        if(this.m_type >= 0) {
            this.m_controllers[ this.m_type ].run();
        }
    }
}

export { TransformController }
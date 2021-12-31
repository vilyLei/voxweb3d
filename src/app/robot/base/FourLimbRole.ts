/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";
import IPartStore from "../../../app/robot/IPartStore";
import TwoLegRbtModule from "../../../app/robot/base/TwoLegRbtModule";
import TwoArmRbtModule from "../../../app/robot/base/TwoArmRbtModule";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import FireCtrlRadar from "../../../app/robot/attack/FireCtrlRadar";
import RbtRole from "../../../app/robot/base/RbtRole";
import { ShadowEntity } from "./ShadowEntity";

export default class FourLimbRole extends RbtRole implements IAttackDst {

    private m_legModule: TwoLegRbtModule = null;
    private m_armModule: TwoArmRbtModule = null;

    constructor() {
        super();
    }

    initialize(sc: RendererScene, renderProcessIndex: number, partStore0: IPartStore, partStore1: IPartStore, dis: number = 100.0): void {
        if (sc != null && partStore0 != null && partStore1 != null) {
            this.m_legModule = new TwoLegRbtModule();
            this.m_armModule = new TwoArmRbtModule();

            let offsetPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
            this.m_legModule.initialize(sc, renderProcessIndex, partStore0, offsetPos);
            this.m_legModule.toPositive();
            //this.m_legModule.setVisible(false);

            //
            offsetPos.y = dis;
            this.m_armModule.campType = this.campType;
            this.m_armModule.initialize(sc, renderProcessIndex, partStore1, offsetPos);
            this.m_armModule.toNegative();
            this.m_armModule.setAngleDirec(1.0, -1.0);

            this.m_moveModule.setSpeed(this.m_speed);
            this.m_moveModule.syncTargetUpdate = false;
            this.m_moveModule.syncDirecUpdate = false;
            this.m_moveModule.setTarget(this.m_legModule.getContainer());
            this.m_moveModule.setVelocityFactor(0.02, 0.03);

            let findRadar: FireCtrlRadar = new FireCtrlRadar();
            findRadar.dstCamp = this.roleCamp;
            findRadar.srcRole = this;
            findRadar.campType = this.campType;

            this.m_findRadar = findRadar;
            this.m_motionModule = this.m_legModule;
            this.m_attackModule = this.m_armModule;

            // for building shadow entity
            this.m_motionModule.direcByDegree(0, false);
            let container = this.m_legModule.getContainer();
            container.update();
            let bounds = container.getGlobalBounds();
            
            this.shadowEntity = new ShadowEntity();
            let shadowEntity = this.shadowEntity;
            shadowEntity.sizeScaleX = 0.35;
            shadowEntity.sizeScaleZ = 0.5;
            shadowEntity.srcEntity = container;
            shadowEntity.bounds.copyFrom( bounds );
            shadowEntity.initialize();
            sc.addEntity(shadowEntity.entity, 3);
        }
    }
    wake(): void {
        if (!this.m_isMoving) {
            this.m_legModule.toPositive();
            this.m_armModule.toNegative();
        }
        super.wake();
    }
    // 获得被击中位置
    getHitPos(outPos: Vector3D): void {
        outPos.copyFrom(this.position);
        outPos.y += 100.0;
    }
    // 获得被击毁位置
    getDestroyedPos(outPos: Vector3D): void {
        outPos.copyFrom(this.position);
        outPos.y += 60.0;
    }
    consume(power: number): void {
        this.lifeTime -= power;
        if (this.lifeTime < 1) {
            this.sleep();
        }
    }
    attackTest(): boolean {
        return true;
    }
}
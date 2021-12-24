/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";
import DirectXZModule from "../../../voxmotion/primitive/DirectXZModule";
import { CampType } from "../../../app/robot/camp/Camp";
import IRoleCamp from "../../../app/robot/IRoleCamp";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import IRunnable from "../../../vox/base/IRunnable";
import RoleActMode from "../../../app/robot/base/RoleActMode";
import IRbtModule from "../../../app/robot/base/IRbtModule";
import RunnableModule from "../../../app/robot/scene/RunnableModule";
import IDstFinder from "../../../app/robot/attack/IDstFinder";
import { TerrainData } from "../../../terrain/tile/TerrainData";

export default class RbtRole implements IRunnable {
    private m_synMaxDegree: number = 50.0;
    protected m_rscene: RendererScene = null;
    protected m_isMoving: boolean = true;
    protected m_movingFlag: boolean = true;
    protected m_moveModule: DirectXZModule = new DirectXZModule();
    protected m_speed: number = 4.5;
    protected m_runMode: RoleActMode = RoleActMode.FREE_RUN;

    protected m_findRadar: IDstFinder = null;
    protected m_attackModule: IRbtModule = null;
    protected m_motionModule: IRbtModule = null;

    position: Vector3D = new Vector3D();
    attackDis: number = 50;
    radius: number = 100;
    lifeTime: number = 3000;
    campType: CampType = CampType.Blue;

    terrainData: TerrainData = null;
    roleCamp: IRoleCamp = null;
    constructor() {
    }
    getRendererScene(): RendererScene {
        return this.m_rscene;
    }

    getAttackModule(): IRbtModule {
        return this.m_attackModule;
    }
    getMotionModule(): IRbtModule {
        return this.m_motionModule;
    }
    isAwake(): boolean {
        return this.m_isMoving;
    }
    wake(): void {
        RunnableModule.RunnerQueue.addRunner(this);
        this.m_isMoving = true;
        this.m_movingFlag = true;

    }
    sleep(): void {
        RunnableModule.RunnerQueue.removeRunner(this);
        this.m_isMoving = false;
    }

    private m_flag: number = 0;
    setRunFlag(flag: number): void {
        this.m_flag = flag;
    }
    getRunFlag(): number {
        return this.m_flag;
    }
    isRunning(): boolean {
        return true;
    }
    isStopped(): boolean {
        return false;
    }
    run(): void {
        switch (this.m_runMode) {
            case RoleActMode.ATTACK_RUN:
                this.attackRun();
                break;
            case RoleActMode.FREE_RUN:
                this.freeRun();
                break;
            default:
                break;
        }
    }

    setVisible(visible: boolean): void {
        this.m_motionModule.setVisible(visible);
        this.m_attackModule.setVisible(visible);
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_motionModule.setXYZ(px, py, pz);
        this.m_attackModule.setXYZ(px, py, pz);
        this.m_moveModule.setCurrentXYZ(px, py, pz);
        this.m_fixPos.setXYZ(px, py, pz);
        //this.m_moveModule.toXZ(px,pz);
    }
    setPosition(position: Vector3D): void {
        this.m_motionModule.setPosition(position);
        this.m_attackModule.setPosition(position);
        this.m_moveModule.setCurrentPosition(position);
        this.m_fixPos.copyFrom(position);
        //this.m_moveModule.toXZ(position.x,position.z);
    }
    getPosition(position: Vector3D): void {
        this.m_motionModule.getPosition(position);
    }
    resetPose(): void {
        this.m_motionModule.resetPose();
        this.m_attackModule.resetPose();
    }

    protected attackMove(readyAttack: boolean, optionalDegree: number): boolean {
        let state: boolean = true;
        // 如果接近目标则暂停
        if (readyAttack && this.roleCamp.distance > 0.4 * (this.attackDis + this.radius)) {
            state = false;
        }
        else if (this.m_moveModule.isMoving()) {
            this.m_movingFlag = true;
        }

        let moveFlag: boolean = false;
        if (this.m_movingFlag) {
            optionalDegree = readyAttack ? optionalDegree : this.m_moveModule.getDirecDegree();
            state = this.m_isMoving && state;
            if (state) {
                moveFlag = true;
                // 执行移动控制过程
                this.m_moveModule.run();
                this.m_isMoving = this.m_moveModule.isMoving();
                this.m_motionModule.getPosition(this.position);
            }
            //  执行leg动动作
            this.m_motionModule.direcByDegree(optionalDegree, !state);
            this.m_movingFlag = moveFlag ? true : this.m_motionModule.isPoseRunning();
        }
        else {
            // attack 进行时保持上部和下部朝向一致
            if (readyAttack && Math.abs(this.m_motionModule.getRotationY() - optionalDegree) > this.m_synMaxDegree) {
                this.m_movingFlag = true;
            }
        }
        return moveFlag;
    }
    // 需要移动的时候才会执行
    protected armMove(pos: Vector3D, direcDegree: number): void {
        // 同步上半身和下半身的坐标
        this.m_attackModule.setPosition(pos);
        // 目标朝向和leg一致
        this.m_attackModule.setDstDirecDegree(direcDegree);
    }
    protected attackRun(): void {
        let direcDegree: number = this.m_attackModule.getRotationY();
        let attDst: IAttackDst = this.m_findRadar != null ? this.m_findRadar.findAttDst(direcDegree) : null;

        this.m_attackModule.setAttackDst(attDst);

        let moveEnabled: boolean = this.attackMove(attDst != null, direcDegree);
        if (moveEnabled) {
            this.armMove(this.position, this.m_motionModule.getRotationY());
        }
        this.m_attackModule.run(moveEnabled);

        if (moveEnabled || attDst != null) {
            this.m_staticCount = 30;
            this.m_fixPos.copyFrom(this.position);
        }
        else {
            if (this.m_staticCount < 1) {
                this.m_runMode = RoleActMode.FREE_RUN;
            }
            this.m_staticCount--;
        }
    }

    private m_staticCount: number = Math.round(Math.random() * 20 + 20);
    private m_fixPos: Vector3D = new Vector3D();
    private freeRunTest(): void {
        if (this.m_staticCount < 1) {
            this.m_staticCount = Math.round(Math.random() * 30 + 30);
            //let pos: Vector3D = this.terrainData.getRandomFreeGridPosition(this.m_fixPos);
            let pos: Vector3D = this.terrainData.getRandomFreeGridPosition();
            this.moveToXZ(pos.x, pos.z);
        }
        else {
            this.m_staticCount--;
        }
    }
    protected freeRun(): void {
        let direcDegree: number = this.m_attackModule.getRotationY();
        let attDst: IAttackDst = this.m_findRadar != null ? this.m_findRadar.testAttDst(direcDegree) : null;
        let moveEnabled: boolean = this.attackMove(false, direcDegree);
        if (moveEnabled) {
            this.armMove(this.position, this.m_motionModule.getRotationY());
        }
        this.m_attackModule.run(moveEnabled);
        if (!moveEnabled) this.freeRunTest();
        if (attDst != null) {
            this.m_runMode = RoleActMode.ATTACK_RUN;
        }
    }
    moveToXZ(px: number, pz: number, force: boolean = false): void {
        this.m_moveModule.toXZ(px, pz);
        if (force) {
            this.m_runMode = RoleActMode.ATTACK_RUN;
        }
        this.wake();
    }
}
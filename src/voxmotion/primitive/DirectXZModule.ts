/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import VelocityXZModule from "../../voxmotion/primitive/VelocityXZModule";
import IEntityTransform from "../../vox/entity/IEntityTransform";

export default class DirectXZModule {
    private m_currPos: Vector3D = new Vector3D();
    private m_dstPos: Vector3D = new Vector3D(0.1, 0.0, 0.0);
    private m_pos: Vector3D = new Vector3D();
    private m_velModule: VelocityXZModule = new VelocityXZModule();
    private m_target: IEntityTransform = null;
    private m_moving: boolean = true;
    private m_direcDegree: number = 0.0;
    private m_squaredDis: number = 0.0;
    syncTargetUpdate: boolean = true;
    syncDirecUpdate: boolean = true;
    // readonly targetPosOffset: Vector3D = new Vector3D();
    constructor() { }

    setSpeed(spd: number): void {
        this.m_velModule.setSpeed(spd);
    }
    getSpeed(): number {
        return this.m_velModule.getSpeed();
    }
    setVelocityFactor(oldVelocityFactor: number, newVelocityFactor: number): void {
        this.m_velModule.setFactor(oldVelocityFactor, newVelocityFactor);
    }
    setTarget(target: IEntityTransform): void {
        this.m_target = target;
    }
    setCurrentXYZ(px: number, py: number, pz: number): void {
        this.m_currPos.setXYZ(px, py, pz);
        this.calcSquaredDis();
    }
    setCurrentPosition(pv: Vector3D): void {
        this.m_currPos.copyFrom(pv);
        this.calcSquaredDis();
    }
    toXZ(px: number, pz: number): void {

        this.m_dstPos.x = px;
        this.m_dstPos.z = pz;
        this.m_velModule.setDirecXZ(px - this.m_currPos.x, pz - this.m_currPos.z);
        this.m_moving = true;
        
        this.calcSquaredDis();
    }
    setDstPosition(pv: Vector3D): void {

        this.m_dstPos.copyFrom(pv);
        this.m_velModule.setDirecXZ(pv.x - this.m_currPos.x, pv.z - this.m_currPos.z);
        this.m_moving = true;
        
        this.calcSquaredDis();
    }
    stop(): void {
        this.m_moving = false;
    }
    isMoving(): boolean {
        return this.m_moving;
    }
    private m_velocityFlag: boolean = true;
    getVelocity(): Vector3D {
        return this.m_velModule.spdv;
    }
    /**
     * 只有在 isMoving() 返回为 true 的时候才能单独调用
     */
    calcVelocity(): void {
        this.m_velModule.updateDirecXZ(this.m_dstPos.x - this.m_currPos.x, this.m_dstPos.z - this.m_currPos.z);
        this.m_velModule.run();
        this.m_velocityFlag = false;
    }
    run(): void {
        if (this.m_moving && this.m_target != null) {
            this.updatePos();
        }
    }
    getDirecDegree(): number {
        return this.m_direcDegree;
    }
    getSquredDis(): number {
        return this.m_squaredDis;
    }
    private calcSquaredDis(): void {        
        this.m_pos.subVecsTo(this.m_currPos, this.m_dstPos);
        this.m_pos.y = 0;
        this.m_squaredDis = this.m_pos.getLengthSquared();
        //console.log("this.m_squaredDis: ",this.m_squaredDis);
    }
    private updatePos(): void {
        if (this.m_velocityFlag) {
            this.calcVelocity();
        }
        this.m_velocityFlag = true;
        let spdv: Vector3D = this.m_velModule.spdv;

        let preDegree: number = this.m_direcDegree;
        let degree = MathConst.GetDegreeByXY(-spdv.x, spdv.z);
        this.m_direcDegree = degree + 180;
        // console.log("spdv.getLengthSquared(): ",spdv.getLengthSquared());
        // console.log("direcDegree: ",this.m_direcDegree,degree,", preDegree: ",preDegree);
        if (spdv.getLengthSquared() < this.m_squaredDis) {
            this.m_pos.addVecsTo(this.m_currPos, spdv);
            this.m_pos.subtractBy(this.m_dstPos);
            this.m_currPos.addVecsTo(this.m_currPos, spdv);
            
            this.calcSquaredDis();
        }
        else {
            this.m_squaredDis = 0;
            this.m_currPos.copyFrom(this.m_dstPos);
            this.m_moving = false;
            this.m_velModule.stop();
        }
        this.m_target.setPosition(this.m_currPos);
        if (this.syncDirecUpdate) {
            this.m_target.setRotationXYZ(0.0, this.m_direcDegree, 0.0);
        }
        if (this.syncTargetUpdate) {
            this.m_target.update();
        }
    }
}
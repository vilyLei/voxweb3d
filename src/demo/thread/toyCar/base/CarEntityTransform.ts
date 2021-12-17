/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../../vox/math/Vector3D";
import IEntityTransform from "../../../../vox/entity/IEntityTransform";
import { EntityStatus } from "./EntityStatus";

class CarEntityTransform implements IEntityTransform {

    private m_entityIndex: number = -1;
    private m_fs32Length: number = 15;
    private m_fs32Data: Float32Array = null;
    
    private m_position: Vector3D = new Vector3D();
    private m_outPos: Vector3D = new Vector3D();
    status: EntityStatus = EntityStatus.Init;
    constructor() {
    }

    setFS32Data(srcFS32: Float32Array, index: number): void {
        this.m_entityIndex = index;
        this.m_fs32Data = srcFS32.subarray(index * this.m_fs32Length, (index + 1) * this.m_fs32Length);
    }
    
    initParam(): void {
        
        this.setXYZ(200, 50, 200);
        this.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
        // whole body scale, param 1, param 2
        this.setBodyParam(0.2, 0.5, 0.5);
        // 轮子的位置偏移值
        this.setWheelOffsetXYZ(80.0, -30.0, 100.0);
        // wheel init rotation, wheel rotation spd, wheel body scale;
        this.setWheelRotParam(30.0, -2.0, 0.3);
    }
    getPosition(): Vector3D {
        this.m_outPos.copyFrom(this.m_position);
        return this.m_outPos;
    }
    setPosition(pos: Vector3D): void {
        this.m_position.copyFrom(pos);
        //console.log("setPosition(), pos: ",pos);
        //console.log("this.m_entityIndex >= 0: ",this.m_entityIndex >= 0, pos);
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[0] = pos.x;
            this.m_fs32Data[1] = pos.y;
            this.m_fs32Data[2] = pos.z;
        }
        this.status = EntityStatus.Init;
    }
    setXYZ(px: number, py: number, pz: number): void {
        //console.log("setXYZ(), px,py,pz: ",px,py,pz);
        this.m_position.setXYZ(px, py, pz);
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[0] = px;
            this.m_fs32Data[1] = py;
            this.m_fs32Data[2] = pz;
        }
        this.status = EntityStatus.Init;
    }
    setRotationXYZ(prx: number, pry: number, prz: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[3] = prx;
            this.m_fs32Data[4] = pry;
            this.m_fs32Data[5] = prz;
        }
    }
    setScale(bodyScale: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[6] = bodyScale;
        }
    }
    /**
     * 
     * @param bodyScale whole body scale
     * @param param1 
     * @param param2 
     */
    setBodyParam(bodyScale: number, param1: number, param2: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[6] = bodyScale;
            this.m_fs32Data[7] = param1;
            this.m_fs32Data[8] = param2;
        }
    }
    setWheelOffsetXYZ(px: number, py: number, pz: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[9] = px;
            this.m_fs32Data[10] = py;
            this.m_fs32Data[11] = pz;
        }
    }
    // wheel init rotation, spd, wheel body scale;
    setWheelRotParam(pr: number, wheelRotSpd: number, bodyScale: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[12] = pr;
            this.m_fs32Data[13] = wheelRotSpd;
            this.m_fs32Data[14] = bodyScale;
        }
    }
    setWheelRotSpeed(wheelRotSpd: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[13] = wheelRotSpd;
        }
    }

    setScaleXYZ(sx: number, sy: number, sz: number): void {

    }
    getRotationXYZ(pv: Vector3D): void {

    }
    getScaleXYZ(pv: Vector3D): void {

    }
    localToGlobal(pv: Vector3D): void {

    }
    globalToLocal(pv: Vector3D): void {

    }
    update(): void {

    }
    
    updateTrans(): void {
        
        switch (this.status) {
            case EntityStatus.Init:
                if (this.status == EntityStatus.Init) {
                    this.status = EntityStatus.Stop;
                }
                break;
            default:
                break;
        }
    }
}
export { CarEntityTransform };
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../../vox/math/Vector3D";
import IAABB from "../../../../vox/geom/IAABB";
import IEntityTransform from "../../../../vox/entity/IEntityTransform";
import { NavigationStatus } from "../../../../voxnav/tileTerrain/NavigationStatus";
import { StatusDetector } from "./StatusDetector";

class CarEntityTransform implements IEntityTransform {

    private m_entityIndex: number = -1;
    private m_fs32Length: number = 15;
    private m_fs32Data: Float32Array = null;    
    private m_position: Vector3D = new Vector3D();

    detector: StatusDetector = null;
    status: NavigationStatus = NavigationStatus.Init;
    constructor() {
    }

    setFS32Data(srcFS32: Float32Array, index: number): void {
        this.m_entityIndex = index;
        this.m_fs32Data = srcFS32.subarray(index * this.m_fs32Length, (index + 1) * this.m_fs32Length);
    }
    
    initParam(wheelY: number = -30.0, wheelBodyScale: number = 0.3): void {
        
        this.setXYZ(200, 50, 200);
        this.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
        // whole body scale, param 1, param 2
        this.setBodyParam(0.2, 0.5, 0.5);
        // 轮子的位置偏移值
        this.setWheelOffsetXYZ(80.0, wheelY, 100.0);
        // wheel init rotation, wheel rotation spd, wheel body scale;
        this.setWheelRotParam(30.0, -2.0, 0.3);
    }
    isChanged(): boolean {
        return this.status != NavigationStatus.Stop;
    }
    getPosition(outV: Vector3D): Vector3D {
        outV.copyFrom(this.m_position);
        return outV;
    }
    setPosition(pos: Vector3D): CarEntityTransform {
        this.m_position.copyFrom(pos);
        //console.log("setPosition(), pos: ",pos);
        //console.log("this.m_entityIndex >= 0: ",this.m_entityIndex >= 0, pos);
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[0] = pos.x;
            this.m_fs32Data[1] = pos.y;
            this.m_fs32Data[2] = pos.z;
            this.status = NavigationStatus.Init;
            this.detector.version++;
        }
        return this;
    }
    setXYZ(px: number, py: number, pz: number): CarEntityTransform {
        //console.log("setXYZ(), px,py,pz: ",px,py,pz);
        this.m_position.setXYZ(px, py, pz);
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[0] = px;
            this.m_fs32Data[1] = py;
            this.m_fs32Data[2] = pz;
            this.status = NavigationStatus.Init;
            this.detector.version++;
        }
        return this;
    }
    
    setRotation3(r: Vector3D): CarEntityTransform {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[3] = r.x;
            this.m_fs32Data[4] = r.y;
            this.m_fs32Data[5] = r.z;
            this.status = NavigationStatus.Init;
            this.detector.version++;
        }
        return this;
    }
    setRotationXYZ(prx: number, pry: number, prz: number): CarEntityTransform {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[3] = prx;
            this.m_fs32Data[4] = pry;
            this.m_fs32Data[5] = prz;
            this.status = NavigationStatus.Init;
            this.detector.version++;
        }
        return this;
    }
    setScale(bodyScale: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[6] = bodyScale;
            this.status = NavigationStatus.Init;
            this.detector.version++;
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
            this.status = NavigationStatus.Init;
            this.detector.version++;
        }
    }
    setWheelOffsetXYZ(px: number, py: number, pz: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[9] = px;
            this.m_fs32Data[10] = py;
            this.m_fs32Data[11] = pz;
            this.status = NavigationStatus.Init;
            this.detector.version++;
        }
    }
    // wheel init rotation, spd, wheel body scale;
    setWheelRotParam(pr: number, wheelRotSpd: number, WheelBodyScale: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[12] = pr;
            this.m_fs32Data[13] = wheelRotSpd;
            this.m_fs32Data[14] = WheelBodyScale;
            this.status = NavigationStatus.Init;
            this.detector.version++;
        }
    }
    setWheelRotSpeed(wheelRotSpd: number): void {
        if (this.m_entityIndex >= 0) {
            this.m_fs32Data[13] = wheelRotSpd;
            this.status = NavigationStatus.Init;
            this.detector.version++;
        }
    }

    getScale(): number {
        if (this.m_entityIndex >= 0) {
            return this.m_fs32Data[6];
        }
        return 1.0;
    }
    setScaleXYZ(sx: number, sy: number, sz: number): CarEntityTransform {
        return this;
    }
    getRotationXYZ(pv: Vector3D): Vector3D {
        return pv;
    }
    getScaleXYZ(pv: Vector3D): Vector3D {
        return pv;
    }
    
    getGlobalBounds(): IAABB {
        return null;
    }
    getLocalBounds(): IAABB {
        return null;
    }
    localToGlobal(pv: Vector3D): void {

    }
    globalToLocal(pv: Vector3D): void {

    }
    update(): void {

    }
    
    updateTrans(): void {
        
        switch (this.status) {
            case NavigationStatus.Init:
                if (this.status == NavigationStatus.Init) {
                    this.status = NavigationStatus.Stop;
                }
                break;
            default:
                break;
        }
    }

    destroy(): void {

        this.m_entityIndex = -1;
        this.m_fs32Data = null;
        this.detector = null;
    }
}
export { CarEntityTransform };
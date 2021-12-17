/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import DirectXZModule from "../../voxmotion/primitive/DirectXZModule";
import IEntityTransform from "../../vox/entity/IEntityTransform";

class CurveMotionXZModule {
    private m_posList: Vector3D[] = null;
    private m_posListLen: number = 0;
    private m_posIndex: number = -1;
    private m_moving: boolean = false;
    readonly motion: DirectXZModule = new DirectXZModule();
    constructor() {
    }
    setPathPosList(posList: Vector3D[]): void {
        this.m_posList = posList != null ? posList.slice(0) : null;
        this.m_posListLen = this.m_posList != null ? this.m_posList.length : 0;
        this.m_posIndex = 0;
        this.m_moving = this.m_posListLen > 0;
        if(this.m_moving) {
            this.motion.setDstPosition(this.m_posList[this.m_posIndex]);
        }
    }
    isMoving(): boolean {
        return this.m_moving;
    }
    isStopped(): boolean {
        return !this.m_moving;
    }
    run(): void {
        if(this.m_moving) {
            let movingFlag: boolean = (this.m_posIndex + 1) < this.m_posListLen;
            let flag: boolean = this.motion.isMoving();
            if(flag && movingFlag) {
                // flag = this.motion.getSquredDis() > 100.0;
                // if(!flag) {
                //     console.log(">>>");
                // }
                //console.log("this.motion.getSquredDis(): ",this.motion.getSquredDis());
                if(movingFlag && this.motion.getSquredDis() < 1600.0) {
                    this.m_posIndex ++;
                    this.motion.setDstPosition(this.m_posList[this.m_posIndex]);
                }
            }
            if(flag) {
                this.motion.run();
            }
            else {
                this.m_posIndex ++;
                if(movingFlag) {
                    this.motion.setDstPosition(this.m_posList[this.m_posIndex]);
                }
                else {
                    this.m_moving = false;
                }
            }
        }
    }
}
export {CurveMotionXZModule}
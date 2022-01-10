/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import { CampRoleStatus, CampType } from "../../../app/robot/camp/Camp";
import Color4 from "../../../vox/material/Color4";


export default interface IAttackDst {
    
    color: Color4;
    campType: CampType;
    lifeTime: number;
    radius: number;
    splashRadius: number;
    position: Vector3D;
    /**
     * 自身的范围半径
     */
    status: CampRoleStatus;
    /**
     * 自身能攻击到的距离
     */
    attackDis: number;
    /**
     * 重新启动激活
     */
    wake(): void;

    getPosition(pos: Vector3D): void;
    setVisible(visible: boolean): void;
    /**
     * 获得被击中位置
     */
    getHitPos(outPos: Vector3D): void;
    /**
     * 获得被击毁位置
    */
    getDestroyedPos(outPos: Vector3D): void;
    consume(power: number): void;
    attackTest(): boolean;
    /**
     * 复活
     */
    // revive(): void;
}
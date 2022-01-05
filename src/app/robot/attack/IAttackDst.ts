/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import {CampRoleStatus, CampType} from "../../../app/robot/camp/Camp";


export default interface IAttackDst
{
    campType:CampType;
    lifeTime:number;
    radius:number;
    position:Vector3D;
    status: CampRoleStatus;

    attackDis:number;
    getPosition(pos:Vector3D):void;
    setVisible(visible:boolean):void;
    /**
     * 获得被击中位置
     */
    getHitPos(outPos:Vector3D):void;
    /**
     * 获得被击毁位置
    */
    getDestroyedPos(outPos:Vector3D):void;
    consume(power:number):void;
    attackTest():boolean;
}
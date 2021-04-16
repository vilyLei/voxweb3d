/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../../vox/math/MathConst";
import * as Vector3T from "../../../vox/math/Vector3D";
import * as CampTypeT from "../../../app/robot/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import CampType = CampTypeT.app.robot.CampType;
export namespace app
{
    export namespace robot
    {
        export namespace attack
        {
            export interface IAttackDst
            {
                campType:CampType;
                lifeTime:number;
                radius:number;
                position:Vector3D;
            
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
        }
    }
}
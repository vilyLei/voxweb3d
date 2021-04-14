/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as CampTypeT from "../../app/robot/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import CampType = CampTypeT.app.robot.CampType;
export namespace app
{
    export namespace robot
    {
        export interface IAttackDst
        {
            campType:CampType;
            lifeTime:number;
            radius:number;
            position:Vector3D;

            attackDis:number;
            setVisible(visible:boolean):void;
            getAttackPos(outPos:Vector3D):void;
            getDestroyPos(outPos:Vector3D):void;
            consume(power:number):void;
            attackTest():boolean;
        }
    }
}
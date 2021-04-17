/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IAttackDstT from "../../../app/robot/attack/IAttackDst";

import IAttackDst = IAttackDstT.app.robot.attack.IAttackDst;

export namespace app
{
    export namespace robot
    {
        export namespace attack
        {
            export interface IDstFinder
            {
                resetState():void;
                setDelayTime(delayTime:number):void;
                testAttDst(direcDegree:number):IAttackDst;
                findAttDst(direcDegree:number):IAttackDst;
                findNextDst():IAttackDst;
            }
        }
    }
}
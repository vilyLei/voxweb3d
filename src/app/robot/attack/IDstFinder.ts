/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IAttackDst from "../../../app/robot/attack/IAttackDst";

export default interface IDstFinder
{
    resetState():void;
    setDelayTime(delayTime:number):void;
    testAttDst(direcDegree:number):IAttackDst;
    findAttDst(direcDegree:number):IAttackDst;
    findNextDst():IAttackDst;
}
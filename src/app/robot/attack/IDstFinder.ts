/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
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
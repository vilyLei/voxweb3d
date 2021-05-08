/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RunnableQueue from "../../../vox/base/RunnableQueue";

export default class RunnableModule
{
    static readonly RunnerQueue:RunnableQueue = new RunnableQueue();
    constructor(){}
    
    static Run():void
    {
        RunnableModule.RunnerQueue.run();
    }
}
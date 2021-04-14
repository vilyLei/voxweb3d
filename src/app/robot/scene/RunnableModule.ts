/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import * as RunnableQueueT from "../../../vox/base/RunnableQueue";

import RunnableQueue = RunnableQueueT.vox.base.RunnableQueue;

export namespace app
{
    export namespace robot
    {
        export namespace scene
        {
            export class RunnableModule
            {
                static readonly RunnerQueue:RunnableQueue = new RunnableQueue();
                constructor(){}
                
                static Run():void
                {
                    RunnableModule.RunnerQueue.run();
                }
            }
        }
    }
}
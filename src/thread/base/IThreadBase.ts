/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IThreadSendDataT from "../../thread/base/IThreadSendData";

import IThreadSendData = IThreadSendDataT.thread.base.IThreadSendData;

export namespace thread
{
    export namespace base
    {
        export interface IThreadBase
        {
            sendDataTo(sendData:IThreadSendData):void;
            isFree():boolean;
        }
    }
}
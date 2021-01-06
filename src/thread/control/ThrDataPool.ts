/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IThreadSendDataT from "../../thread/base/IThreadSendData";
import * as IThreadBaseT from "../../thread/base/IThreadBase";

import IThreadSendData = IThreadSendDataT.thread.base.IThreadSendData;
import IThreadBase = IThreadBaseT.thread.base.IThreadBase;

export namespace thread
{
    export namespace control
    {
        export class ThrDataPool
        {
            private static s_dataList:IThreadSendData[] = [];
            // wait calc data queue
            private static s_waitList:IThreadSendData[] = [];
            
            private static s_dataTotal:number = 0;
            private static s_startupFlag:number = 0;

            static SendDataTo(thread:IThreadBase):boolean
            {
                if(ThrDataPool.s_dataTotal > 0)
                {
                    let data:IThreadSendData = null;
                    // 等待队列有数据，就优先发送这个队列里面的数据
                    let len:number = ThrDataPool.s_waitList.length;
                    if(len > 0)
                    {
                        data = ThrDataPool.s_waitList[0];
                        thread.sendDataTo(data);
                        if(data.sendStatus == 1)
                        {
                            ThrDataPool.s_dataTotal--;
                            len --;
                            ThrDataPool.s_waitList.shift();
                            return true;
                        }
                    }
                    len = ThrDataPool.s_dataTotal - len;
                    if(len > 0)
                    {
                        data = ThrDataPool.s_dataList.shift();
                        thread.sendDataTo(data);
                        if(data.sendStatus == 1)
                        {
                            ThrDataPool.s_dataTotal--;
                            return true;
                        }
                        else
                        {
                            // 因为相关计算模块还没准备好,需先加入等待队列
                            ThrDataPool.s_waitList.push(data);
                        }
                    }
                }
                return false;
            }
            static AddData(thrData:IThreadSendData):void
            {
                if(thrData.sendStatus < 0)
                {
                    thrData.sendStatus = 0;
                    ThrDataPool.s_dataTotal++;
                    ThrDataPool.s_startupFlag = 1;
                    ThrDataPool.s_dataList.push(thrData);
                }
                else
                {
                    console.error("thrData.sendStatus value is "+thrData.sendStatus);
                }
            }
            static getDataTotal():number
            {
                return ThrDataPool.s_dataTotal;
            }
            static IsEnabled():boolean
            {
                return ThrDataPool.s_dataTotal > 0 * ThrDataPool.s_startupFlag;
            }
            static IsStartup():boolean
            {
                return ThrDataPool.s_startupFlag > 0;
            }
        }
    }
}
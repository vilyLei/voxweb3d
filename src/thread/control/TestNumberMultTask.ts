/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example

import * as IThreadSendDataT from "../../thread/base/IThreadSendData";
import * as ThreadTaskT from "../../thread/control/ThreadTask";

import IThreadSendData = IThreadSendDataT.thread.base.IThreadSendData;
import ThreadTask = ThreadTaskT.thread.control.ThreadTask;

export namespace thread
{
    export namespace control
    {
        export class NumberMultSendData implements IThreadSendData
        {
            constructor()
            {
            }

            numberData:Float32Array = null;

            // 多线程任务分类id
            taskclass:number = -1;
            // 多线程任务实例id
            srcuid:number = -1;
            // IThreadSendData数据对象在自身队列中的序号
            dataIndex:number = -1;
            // 发送给thread处理的数据对象
            sendData:any = null;
            // thread task 任务命令名
            taskCmd:string;
            //
            transfers:any[] = null;
            // sendStatus 值为 -1 表示没有加入数据池等待处理
            //            值为 0 表示已经加入数据池正等待处理
            //            值为 1 表示已经发送给worker
            sendStatus:number = -1;
            // 按照实际需求构建自己的数据(sendData和transfers等)
            buildThis(transferEnabled:boolean):void
            {
                if(this.sendData != null)
                {
                    this.sendData.taskclass = this.taskclass;
                    this.sendData.srcuid = this.srcuid;
                    this.sendData.dataIndex = this.dataIndex;
                    this.sendData.numberData = this.numberData;
                }
                else
                {
                    this.sendData = {
                        taskCmd:this.taskCmd
                        ,taskclass:this.taskclass
                        ,srcuid:this.srcuid
                        ,dataIndex:this.dataIndex
                        ,numberData:this.numberData
                    }
                }
                //console.log("transferEnabled: "+transferEnabled);
                if(transferEnabled)
                {
                    if(this.numberData != null)
                    {
                        //console.log("NumberMultSendData::buildSendData(), this.numberData.byteLength: "+this.numberData.byteLength);
                        this.transfers = [this.numberData.buffer];
                    }
                }
            }
            
            reset():void
            {
                this.transfers = null;
                if(this.sendData != null)
                {
                    this.sendData.numberData = null
                }
                this.sendStatus = -1;
            }
            
            private static __S_FLAG_BUSY:number = 1;
            private static __S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitIndexPptFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:NumberMultSendData[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(NumberMultSendData.m_freeIdList.length > 0)
                {
                    return NumberMultSendData.m_freeIdList.pop();
                }
                return -1;
            }
            static Create():NumberMultSendData
            {
                let sd:NumberMultSendData = null;
                let index:number = NumberMultSendData.GetFreeId();
                //console.log("NumberMultSendData::Create(), NumberMultSendData.m_unitList.length: "+NumberMultSendData.m_unitList.length);
                if(index >= 0)
                {
                    sd = NumberMultSendData.m_unitList[index];
                    sd.dataIndex = index;
                    NumberMultSendData.m_unitFlagList[index] = NumberMultSendData.__S_FLAG_BUSY;
                }
                else
                {
                    sd = new NumberMultSendData();
                    NumberMultSendData.m_unitList.push( sd );
                    NumberMultSendData.m_unitIndexPptFlagList.push(NumberMultSendData.__S_FLAG_FREE);
                    NumberMultSendData.m_unitFlagList.push(NumberMultSendData.__S_FLAG_BUSY);
                    sd.dataIndex = NumberMultSendData.m_unitListLen;
                    NumberMultSendData.m_unitListLen++;
                }
                return sd;
            }
            
            static Restore(psd:NumberMultSendData):void
            {
                if(psd != null && NumberMultSendData.m_unitFlagList[psd.dataIndex] == NumberMultSendData.__S_FLAG_BUSY)
                {
                    let uid:number = psd.dataIndex;
                    NumberMultSendData.m_freeIdList.push(uid);
                    NumberMultSendData.m_unitFlagList[uid] = NumberMultSendData.__S_FLAG_FREE;
                    psd.reset();
                }
            }
        }
        export class TestNumberMultTask extends ThreadTask
        {
            constructor()
            {
                super();
            }
            clacNumberList(typeData:Float32Array):void
            {
                if(typeData != null)
                {
                    let sd:NumberMultSendData = NumberMultSendData.Create();
                    sd.taskCmd = "MULT_NUMBER";
                    sd.numberData = typeData;
                    this.addData(sd);
                }
            }
            
            // return true, task finish; return false, task continue...
            parseDone(data:any,flag:number):boolean
            {
                console.log("TestNumberAddTask::parseDone(), data: ",data);
                NumberMultSendData.Restore(data.dataIndex);
                return true;
            }
            getWorkerSendDataAt(i:number):IThreadSendData
            {
                return null;
            }
            destroy():void
            {
                if(this.getUid() > 0)
                {
                    super.destroy();
                }
            }
            
            getTaskClass():number
            {
                return 1;
            }
        }
    }
}
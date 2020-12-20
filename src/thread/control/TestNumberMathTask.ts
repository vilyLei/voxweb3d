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
        export class NumberMathSendData implements IThreadSendData
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
                        //console.log("NumberMathSendData::buildSendData(), this.numberData.byteLength: "+this.numberData.byteLength);
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
            private static m_unitList:NumberMathSendData[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(NumberMathSendData.m_freeIdList.length > 0)
                {
                    return NumberMathSendData.m_freeIdList.pop();
                }
                return -1;
            }
            static Create():NumberMathSendData
            {
                let sd:NumberMathSendData = null;
                let index:number = NumberMathSendData.GetFreeId();
                //console.log("NumberMathSendData::Create(), NumberMathSendData.m_unitList.length: "+NumberMathSendData.m_unitList.length);
                if(index >= 0)
                {
                    sd = NumberMathSendData.m_unitList[index];
                    sd.dataIndex = index;
                    NumberMathSendData.m_unitFlagList[index] = NumberMathSendData.__S_FLAG_BUSY;
                }
                else
                {
                    sd = new NumberMathSendData();
                    NumberMathSendData.m_unitList.push( sd );
                    NumberMathSendData.m_unitIndexPptFlagList.push(NumberMathSendData.__S_FLAG_FREE);
                    NumberMathSendData.m_unitFlagList.push(NumberMathSendData.__S_FLAG_BUSY);
                    sd.dataIndex = NumberMathSendData.m_unitListLen;
                    NumberMathSendData.m_unitListLen++;
                }
                return sd;
            }
            
            static Restore(psd:NumberMathSendData):void
            {
                if(psd != null && NumberMathSendData.m_unitFlagList[psd.dataIndex] == NumberMathSendData.__S_FLAG_BUSY)
                {
                    let uid:number = psd.dataIndex;
                    NumberMathSendData.m_freeIdList.push(uid);
                    NumberMathSendData.m_unitFlagList[uid] = NumberMathSendData.__S_FLAG_FREE;
                    psd.reset();
                }
            }
        }
        export class TestNumberMathTask extends ThreadTask
        {
            constructor()
            {
                super();
            }
            addNumberList(typeData:Float32Array):void
            {
                if(typeData != null)
                {
                    let sd:NumberMathSendData = NumberMathSendData.Create();
                    sd.taskCmd = "MATH_ADD";
                    sd.numberData = typeData;
                    this.addData(sd);
                }
            }
            subNumberList(typeData:Float32Array):void
            {
                if(typeData != null)
                {
                    let sd:NumberMathSendData = NumberMathSendData.Create();
                    sd.taskCmd = "MATH_SUB";
                    sd.numberData = typeData;
                    this.addData(sd);
                }
            }
            divNumberList(typeData:Float32Array):void
            {
                if(typeData != null)
                {
                    let sd:NumberMathSendData = NumberMathSendData.Create();
                    sd.taskCmd = "MATH_DIV";
                    sd.numberData = typeData;
                    this.addData(sd);
                }
            }
            mulNumberList(typeData:Float32Array):void
            {
                if(typeData != null)
                {
                    let sd:NumberMathSendData = NumberMathSendData.Create();
                    sd.taskCmd = "MATH_MUL";
                    sd.numberData = typeData;
                    this.addData(sd);
                }
            }
            
            // return true, task finish; return false, task continue...
            parseDone(data:any,flag:number):boolean
            {
                this.m_parseIndex++;// >= this.m_parseTotal
                console.log("TestNumberAddTask::parseDone(), data.vdata: ",data.vdata+",this.m_parseIndex: "+this.m_parseIndex+","+this.m_parseTotal);
                if(this.m_parseIndex == this.m_parseTotal)
                {
                    console.log("TestNumberAddTask::parseDone() finish.");
                }
                NumberMathSendData.Restore(data.dataIndex);
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
                return 2;
            }
        }
    }
}
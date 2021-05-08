/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example

import IThreadSendData from "../../thread/base/IThreadSendData";
import ThreadTask from "../../thread/control/ThreadTask";

class NumberAddSendData implements IThreadSendData
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
                //console.log("NumberAddSendData::buildSendData(), this.numberData.byteLength: "+this.numberData.byteLength);
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
        this.numberData = null;
        this.sendStatus = -1;
    }
    //
    private static S_FLAG_BUSY:number = 1;
    private static S_FLAG_FREE:number = 0;
    private static m_unitFlagList:number[] = [];
    private static m_unitListLen:number = 0;
    private static m_unitList:NumberAddSendData[] = [];
    private static m_freeIdList:number[] = [];
    private static GetFreeId():number
    {
        if(NumberAddSendData.m_freeIdList.length > 0)
        {
            return NumberAddSendData.m_freeIdList.pop();
        }
        return -1;
    }
    static Create():NumberAddSendData
    {
        let sd:NumberAddSendData = null;
        let index:number = NumberAddSendData.GetFreeId();
        //console.log("NumberAddSendData::Create(), NumberAddSendData.m_unitList.length: "+NumberAddSendData.m_unitList.length);
        if(index >= 0)
        {
            sd = NumberAddSendData.m_unitList[index];
            sd.dataIndex = index;
            NumberAddSendData.m_unitFlagList[index] = NumberAddSendData.S_FLAG_BUSY;
        }
        else
        {
            sd = new NumberAddSendData();
            NumberAddSendData.m_unitList.push( sd );
            NumberAddSendData.m_unitFlagList.push(NumberAddSendData.S_FLAG_BUSY);
            sd.dataIndex = NumberAddSendData.m_unitListLen;
            NumberAddSendData.m_unitListLen++;
        }
        return sd;
    }
    
    static Restore(psd:NumberAddSendData):void
    {
        if(psd != null && NumberAddSendData.m_unitFlagList[psd.dataIndex] == NumberAddSendData.S_FLAG_BUSY)
        {
            let uid:number = psd.dataIndex;
            NumberAddSendData.m_freeIdList.push(uid);
            NumberAddSendData.m_unitFlagList[uid] = NumberAddSendData.S_FLAG_FREE;
            psd.reset();
        }
    }
    static RestoreByUid(uid:number):void
    {
        if(uid >= 0 && NumberAddSendData.m_unitFlagList[uid] == NumberAddSendData.S_FLAG_BUSY)
        {
            NumberAddSendData.m_freeIdList.push(uid);
            NumberAddSendData.m_unitFlagList[uid] = NumberAddSendData.S_FLAG_FREE;
            NumberAddSendData.m_unitList[uid].reset();
        }
    }
}
class TestNumberAddTask extends ThreadTask
{
    constructor()
    {
        super();
    }
    clacNumberList(typeData:Float32Array):NumberAddSendData
    {
        if(typeData != null)
        {
            let sd:NumberAddSendData = NumberAddSendData.Create();
            sd.taskCmd = "ADD_NUMBER";
            sd.numberData = typeData;
            this.addData(sd);
            return sd;
        }
        return null;
    }
    // return true, task finish; return false, task continue...
    parseDone(data:any,flag:number):boolean
    {
        console.log("TestNumberAddTask::parseDone(), data: ",data);
        //dataIndex
        NumberAddSendData.RestoreByUid(data.dataIndex);
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
        return 0;
    }
}

export default TestNumberAddTask;
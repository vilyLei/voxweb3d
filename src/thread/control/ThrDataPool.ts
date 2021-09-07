/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IThreadSendData from "../../thread/base/IThreadSendData";
import IThreadBase from "../../thread/base/IThreadBase";

//import IThreadBase = IThreadBaseT.thread.base.IThreadBase;

class ThrDataPool
{
    private m_dataList:IThreadSendData[] = [];
    // wait calc data queue
    private m_waitList:IThreadSendData[] = [];
    
    private m_dataTotal:number = 0;
    private m_dataHaveTotal:number = 0;
    private m_startupFlag:number = 0;
    constructor(){}
    sendDataTo(thread:IThreadBase):boolean
    {
        if(this.m_dataTotal > 0)
        {
            let data:IThreadSendData = null;
            // 等待队列有数据，就优先发送这个队列里面的数据
            let len:number = this.m_waitList.length;
            if(len > 0)
            {
                data = this.m_waitList[0];
                thread.sendDataTo(data);
                
                if(data.sendStatus == 1)
                {
                    this.m_dataTotal--;
                    len --;
                    this.m_waitList.shift();
                    return true;
                }
            }
            len = this.m_dataTotal - len;
            if(len > 0)
            {
                data = this.m_dataList.shift();
                thread.sendDataTo(data);
                if(data.sendStatus == 1)
                {
                    this.m_dataTotal--;
                    return true;
                }
                else
                {
                    // 因为相关计算模块还没准备好,需先加入等待队列
                    this.m_waitList.push(data);
                }
            }
        }
        return false;
    }
    addData(thrData:IThreadSendData):void
    {
        if(thrData.sendStatus < 0)
        {
            thrData.sendStatus = 0;
            this.m_dataTotal++;
            this.m_dataHaveTotal++;
            this.m_startupFlag = 1;
            this.m_dataList.push(thrData);
        }
        else
        {
            console.error("thrData.sendStatus value is "+thrData.sendStatus);
        }
    }
    getDataTotal():number
    {
        return this.m_dataTotal;
    }
    isEnabled():boolean
    {
        //console.log(this.m_dataHaveTotal,this.m_dataTotal,this.m_startupFlag);
        return (this.m_dataTotal * this.m_startupFlag) > 0;
    }
    isStartup():boolean
    {
        return this.m_startupFlag > 0;
    }
}

export default ThrDataPool;
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {StreamType, IThreadSendData} from "../../../../thread/base/IThreadSendData";

class ToyCarSendData implements IThreadSendData {
    constructor() {
        console.log("ToyCarSendData::constructor().");
    }

    param: any = null;//{flag: 0, calcType: 1, allTotal: 16, matsTotal: 0};

    // 多线程任务分类id
    taskclass: number = -1;
    // 多线程任务实例id
    srcuid: number = -1;
    // IThreadSendData数据对象在自身队列中的序号
    dataIndex: number = -1;
    // 发送给thread处理的数据对象
    sendData: any = null;
    // thread task 任务命令名
    taskCmd: string;
    /**
     * 直接传递内存句柄所有权的数据流对象数组
     */
    streams: StreamType[] = null;
    /**
     * sendStatus   值为 -1 表示没有加入数据池等待处理
     *              值为 0 表示已经加入数据池正等待处理
     *              值为 1 表示已经发送给worker
     */
    sendStatus: number = -1;
    // 按照实际需求构建自己的数据(sendData和transfers等)
    buildThis(transferEnabled: boolean): void {
        if (this.sendData != null) {
            this.sendData.param = this.param;
        }
        else {
            this.sendData = {
                param: this.param
            }
        }
    }

    reset(): void {
        this.streams = null;
        this.sendStatus = -1;
    }

    private static S_FLAG_BUSY: number = 1;
    private static S_FLAG_FREE: number = 0;
    private static m_unitFlagList: number[] = [];
    private static m_unitListLen: number = 0;
    private static m_unitList: ToyCarSendData[] = [];
    private static m_freeIdList: number[] = [];
    private static GetFreeId(): number {
        if (ToyCarSendData.m_freeIdList.length > 0) {
            return ToyCarSendData.m_freeIdList.pop();
        }
        return -1;
    }
    static Create(): ToyCarSendData {
        let sd: ToyCarSendData = null;
        let index: number = ToyCarSendData.GetFreeId();
        //console.log("index: "+index);
        //console.log("ToyCarSendData::Create(), ToyCarSendData.m_unitList.length: "+ToyCarSendData.m_unitList.length);
        if (index >= 0) {
            sd = ToyCarSendData.m_unitList[index];
            sd.dataIndex = index;
            ToyCarSendData.m_unitFlagList[index] = ToyCarSendData.S_FLAG_BUSY;
        }
        else {
            sd = new ToyCarSendData();
            ToyCarSendData.m_unitList.push(sd);
            ToyCarSendData.m_unitFlagList.push(ToyCarSendData.S_FLAG_BUSY);
            sd.dataIndex = ToyCarSendData.m_unitListLen;
            ToyCarSendData.m_unitListLen++;
        }
        return sd;
    }

    static Restore(psd: ToyCarSendData): void {
        if (psd != null && ToyCarSendData.m_unitFlagList[psd.dataIndex] == ToyCarSendData.S_FLAG_BUSY) {
            let uid: number = psd.dataIndex;
            ToyCarSendData.m_freeIdList.push(uid);
            ToyCarSendData.m_unitFlagList[uid] = ToyCarSendData.S_FLAG_FREE;
            psd.reset();
        }
    }
    static RestoreByUid(uid: number): void {
        if (uid >= 0 && ToyCarSendData.m_unitFlagList[uid] == ToyCarSendData.S_FLAG_BUSY) {
            ToyCarSendData.m_freeIdList.push(uid);
            ToyCarSendData.m_unitFlagList[uid] = ToyCarSendData.S_FLAG_FREE;
            ToyCarSendData.m_unitList[uid].reset();
        }
    }
}

export { ToyCarSendData };
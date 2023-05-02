/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {StreamType, IThreadSendData} from "./IThreadSendData";

class ThreadSendData implements IThreadSendData {
    constructor() {
    }
    
    /**
     * 会发送到子线程的用于当前数据处理的数据描述对象, for example: {flag : 0, type: 12, name: "First"}
     */
    descriptor: any;

    // 多线程任务分类id
    taskclass: number = -1;
    // 多线程任务实例id
    srcuid: number = -1;
    // IThreadSendData 数据对象的唯一标识, 不能随便更改
    dataIndex: number = -1;
    
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
    /**
     * build vaule from ThreadWFST.ts
     * 任务数据在执行过程中的状态(work flow status): 将32位分为4个8位, 分别表示任务执行过程中的四种类别的状态(未知 | 未知 | 未知 | 流转状态)，默认是0x0
     */
    wfst: number = 0;
    // 按照实际需求构建自己的数据(sendData和transfers等)
    buildThis(transferEnabled: boolean): void {
    }

    reset(): void {
    }

    private static s_FLAG_BUSY: number = 1;
    private static s_FLAG_FREE: number = 0;
    private static m_unitFlagList: number[] = [];
    private static m_unitListLen: number = 0;
    private static m_unitList: ThreadSendData[] = [];
    private static m_freeIdList: number[] = [];
    private static GetFreeId(): number {
        if (ThreadSendData.m_freeIdList.length > 0) {
            return ThreadSendData.m_freeIdList.pop();
        }
        return -1;
    }
    static Create(): ThreadSendData {
        let sd: ThreadSendData = null;
        let index: number = ThreadSendData.GetFreeId();
        //console.log("index: "+index);
        //console.log("ThreadSendData::Create(), ThreadSendData.m_unitList.length: "+ThreadSendData.m_unitList.length);
        if (index >= 0) {
            sd = ThreadSendData.m_unitList[index];
            sd.dataIndex = index;
            ThreadSendData.m_unitFlagList[index] = ThreadSendData.s_FLAG_BUSY;
        }
        else {
            sd = new ThreadSendData();
            ThreadSendData.m_unitList.push(sd);
            ThreadSendData.m_unitFlagList.push(ThreadSendData.s_FLAG_BUSY);
            sd.dataIndex = ThreadSendData.m_unitListLen;
            ThreadSendData.m_unitListLen++;
        }
        return sd;
    }
    static Contains(psd: IThreadSendData): boolean {

        if(psd != null) {
            let uid: number = psd.dataIndex;
            if(uid >=0 && uid < ThreadSendData.m_unitListLen) {
                return ThreadSendData.m_unitList[uid] == psd;
            }
        }
        return false;
    }
    static Restore(psd: ThreadSendData): void {

        if(ThreadSendData.Contains(psd)) {
            let uid: number = psd.dataIndex;
            if (ThreadSendData.m_unitFlagList[uid] == ThreadSendData.s_FLAG_BUSY) {
                ThreadSendData.m_freeIdList.push(uid);
                ThreadSendData.m_unitFlagList[uid] = ThreadSendData.s_FLAG_FREE;
                psd.sendStatus = -1;
                psd.reset();
            }
        }
    }
    static RestoreByUid(uid: number): void {
        if (uid >= 0 && ThreadSendData.m_unitFlagList[uid] == ThreadSendData.s_FLAG_BUSY) {
            ThreadSendData.m_freeIdList.push(uid);
            ThreadSendData.m_unitFlagList[uid] = ThreadSendData.s_FLAG_FREE;
            ThreadSendData.m_unitList[uid].reset();
        }
    }
}

export { ThreadSendData };
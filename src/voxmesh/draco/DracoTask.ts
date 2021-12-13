/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example

import {StreamType, IThreadSendData} from "../../thread/base/IThreadSendData";
import ThreadTask from "../../thread/control/ThreadTask";
import ThreadSystem from "../../thread/ThreadSystem";

class DracoSendData implements IThreadSendData {
    constructor() {
    }


    //data: ArrayBuffer = null;
    // beginI: number = 0;
    // endI: number = 0;

    /**
     * 数据描述对象, for example: {flag : 0, type: 12, name: "First"}
     */
    descriptor: any;
    // 多线程任务分类id
    taskclass: number = -1;
    // 多线程任务实例id
    srcuid: number = -1;
    // IThreadSendData数据对象在自身队列中的序号
    dataIndex: number = -1;
    // // 发送给thread处理的数据对象
    // sendData: any = null;
    // thread task 任务命令名
    taskCmd: string;
    /**
     * 直接传递内存句柄所有权的数据流对象数组
     */
    streams: StreamType[];
    /**
     * sendStatus   值为 -1 表示没有加入数据池等待处理
     *              值为 0 表示已经加入数据池正等待处理
     *              值为 1 表示已经发送给worker
     */
    sendStatus: number = -1;
    // 按照实际需求构建自己的数据(sendData和transfers等)
    buildThis(transferEnabled: boolean): void {
        /*
        if (this.sendData != null) {
            this.sendData.taskCmd = this.taskCmd;
            this.sendData.taskclass = this.taskclass;
            this.sendData.srcuid = this.srcuid;
            this.sendData.dataIndex = this.dataIndex;
            this.sendData.data = this.data;

            this.sendData.beginI = this.beginI;
            this.sendData.endI = this.endI;
        }
        else {
            this.sendData = {
                taskCmd: this.taskCmd
                , taskclass: this.taskclass
                , srcuid: this.srcuid
                , dataIndex: this.dataIndex
                , data: this.data
                , beginI: this.beginI
                , endI: this.endI
            }
        }
        //console.log("transferEnabled: "+transferEnabled);
        if (transferEnabled) {
            if (this.data != null) {
                this.streams = [this.data];
            }
            //console.log("DracoSendData::buildSendData(), this.sendData: ", this.sendData);
        }
        //*/
    }
    reset(): void {
        // this.streams = null;
        // if (this.sendData != null) {
        //     this.sendData.data = null;
        // }
        // this.data = null;
        // this.sendStatus = -1;
    }
    //
    private static S_FLAG_BUSY: number = 1;
    private static S_FLAG_FREE: number = 0;
    private static m_unitFlagList: number[] = [];
    private static m_unitListLen: number = 0;
    private static m_unitList: DracoSendData[] = [];
    private static m_freeIdList: number[] = [];
    private static GetFreeId(): number {
        if (DracoSendData.m_freeIdList.length > 0) {
            return DracoSendData.m_freeIdList.pop();
        }
        return -1;
    }
    static Create(): DracoSendData {
        let sd: DracoSendData = null;
        let index: number = DracoSendData.GetFreeId();
        //console.log("DracoSendData::Create(), DracoSendData.m_unitList.length: "+DracoSendData.m_unitList.length);
        if (index >= 0) {
            sd = DracoSendData.m_unitList[index];
            sd.dataIndex = index;
            DracoSendData.m_unitFlagList[index] = DracoSendData.S_FLAG_BUSY;
        }
        else {
            sd = new DracoSendData();
            DracoSendData.m_unitList.push(sd);
            DracoSendData.m_unitFlagList.push(DracoSendData.S_FLAG_BUSY);
            sd.dataIndex = DracoSendData.m_unitListLen;
            DracoSendData.m_unitListLen++;
        }
        return sd;
    }

    static Restore(psd: DracoSendData): void {
        if (psd != null && DracoSendData.m_unitFlagList[psd.dataIndex] == DracoSendData.S_FLAG_BUSY) {
            let uid: number = psd.dataIndex;
            DracoSendData.m_freeIdList.push(uid);
            DracoSendData.m_unitFlagList[uid] = DracoSendData.S_FLAG_FREE;
            psd.reset();
        }
    }
    static RestoreByUid(uid: number): void {
        if (uid >= 0 && DracoSendData.m_unitFlagList[uid] == DracoSendData.S_FLAG_BUSY) {
            DracoSendData.m_freeIdList.push(uid);
            DracoSendData.m_unitFlagList[uid] = DracoSendData.S_FLAG_FREE;
            DracoSendData.m_unitList[uid].reset();
        }
    }
}

export interface DracoTaskListener {
    dracoParse(module: any, index: number, total: number): void;
    dracoParseFinish(modules: any[], total: number): void;
}
class DracoTask extends ThreadTask {
    private m_enabled: boolean = true;
    private static s_inited: boolean = false;
    private static s_taskTotal: number = 1;
    private static s_initedTaskTotal: number = 1;
    private m_listener: DracoTaskListener = null;
    private m_modules: any[] = [];
    constructor(taskTotal: number) {
        super();
        DracoTask.s_taskTotal = taskTotal;
    }
    reset(): void {
        super.reset();
        this.m_modules = [];
        this.m_segIndex = 0;
    }
    setListener(l: DracoTaskListener): void {
        this.m_listener = l;
    }

    private initCurrTask(wasmBin: ArrayBuffer, index: number = 0): void {

        let sd: DracoSendData = DracoSendData.Create();
        sd.taskCmd = "DRACO_INIT";
        //sd.data = wasmBin;
        sd.streams = [new Uint8Array(wasmBin)];
        sd.descriptor = null;
        console.log("XXXX initCurrTask sd.streams: ",sd.streams);
        this.nomalizeData(sd);
        this.m_enabled = false;
        ThreadSystem.SendDataToWorkerAt(index, sd);
    }

    initTask(wasmBin: ArrayBuffer): void {
        if (wasmBin != null && !DracoTask.s_inited && this.m_enabled) {
            this.initCurrTask(wasmBin);
        }
    }
    private parseData(bufData: ArrayBuffer, beginI: number, endI: number): void {
        if (bufData != null && DracoTask.s_inited) {
            let sd: DracoSendData = DracoSendData.Create();
            sd.taskCmd = "DRACO_PARSE";
            //sd.data = bufData;
            sd.streams = [new Uint8Array(bufData)];
            // sd.beginI = beginI;
            // sd.endI = endI;
            sd.descriptor = {beginI: beginI, endI: endI, status: 0};
            console.log("XXXX parseData sd.streams: ",sd.streams);
            this.addData(sd);

            ThreadSystem.AddData(sd);
        }
    }
    
    private m_srcBuf: ArrayBuffer = null;
    private m_segs: number[] = null;
    private m_segIndex: number = 0;

    parseNextSeg(): void {
        if (DracoTask.s_inited && this.m_enabled && this.m_segs != null && this.m_segIndex < this.m_segs.length) {
            for (let i: number = 0; i < DracoTask.s_taskTotal; i++) {
                if (this.m_segIndex < this.m_segs.length) {
                    let buf: ArrayBuffer = this.m_srcBuf.slice(this.m_segs[this.m_segIndex], this.m_segs[this.m_segIndex + 1]);
                    this.parseData(buf, 0, buf.byteLength);
                    this.m_segIndex += 2;
                }
                else {
                    break;
                }
            }
        }
    }
    parseSrcData(bufData: ArrayBuffer, segs: number[]): void {
        if (bufData != null && segs != null) {
            this.m_segIndex = 0;
            this.m_srcBuf = bufData;
            this.m_segs = segs;
            this.setParseTotal(segs.length / 2);
            this.parseNextSeg();
        }
    }
    private m_wasmBin: ArrayBuffer;
    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {

        // console.log("DracoTask::parseDone(), data.taskCmd: ", data.taskCmd);

        DracoSendData.RestoreByUid(data.dataIndex);
        switch (data.taskCmd) {
            case "DRACO_INIT":
                this.m_enabled = true;
                DracoTask.s_inited = true;
                this.m_wasmBin = data.streams[0].buffer;
                DracoTask.s_initedTaskTotal++;
                if (DracoTask.s_initedTaskTotal >= DracoTask.s_taskTotal) {
                    if (this.m_segIndex == 0 && this.m_segs != null && this.m_segs.length > 0) {
                        this.parseNextSeg();
                    }
                }
                else {
                    this.initCurrTask(data.data, DracoTask.s_initedTaskTotal);
                }
                break;
            case "DRACO_PARSE":
                this.m_enabled = true;
                this.m_parseIndex++;
                this.m_modules.push(data.data.module);
                if (this.m_listener != null) {
                    //console.log("this.isFinished(): ", this.isFinished());
                    if (this.isFinished()) {
                        this.m_listener.dracoParseFinish(this.m_modules, this.getParseTotal());
                    }
                    else {
                        this.parseNextSeg();
                        this.m_listener.dracoParse(data.data.module, this.getParsedIndex(), this.getParseTotal());
                    }
                }
                break;
            default:
                break;
        }
        return true;
    }
    getWorkerSendDataAt(i: number): IThreadSendData {
        return null;
    }
    destroy(): void {
        if (this.getUid() > 0) {
            super.destroy();
        }
    }

    getTaskClass(): number {
        return 0;
    }
}

export default DracoTask;
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ThreadCMD from "../../thread/base/ThreadCMD";
import {IThreadSendData} from "../../thread/base/IThreadSendData";
import {ThreadSendData} from "../../thread/base/ThreadSendData";
import IThreadBase from "../../thread/base/IThreadBase";
import ThrDataPool from "../../thread/control/ThrDataPool";
import ThreadTask from "../../thread/control/ThreadTask";

class ThreadBase implements IThreadBase {
    private static s_uid: number = 0;
    private m_uid: number = -1;
    private m_worker: Worker = null;
    private m_initTasks: any[] = [];
    private m_taskfs: any[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    private m_free: boolean = false;
    private m_enabled: boolean = false;
    private m_initBoo: boolean = true;
    private m_thrData: IThreadSendData = null;
    private m_time: number = 0;
    
    autoSendData: boolean = false;
    localDataPool: ThrDataPool = new ThrDataPool();
    globalDataPool: ThrDataPool = null;
    unlock: boolean = true;

    constructor() {
        this.m_uid = ThreadBase.s_uid++;
    }
    getUid(): number {
        return this.m_uid;
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }
    isFree(): boolean {
        return this.m_free && this.unlock;
    }
    sendPoolDataToThread(): void {
        if(this.m_free) {
            let boo = this.localDataPool.isEnabled();
            if(boo) {
                boo = this.localDataPool.sendDataTo(this);
            }
            if(!boo) {
                this.globalDataPool.sendDataTo(this);
            }
        }
    }
    // send parse data to thread
    sendDataTo(thrData: IThreadSendData): void {
        if (this.m_free && this.m_taskfs[thrData.taskclass] > 0) {
            // console.log("sendDataTo...,this.m_free: "+this.m_free,thrData+",uid: "+this.getUid());
            thrData.buildThis(true);

            let sendData: any = {streams: null};
            
            sendData.descriptor = thrData.descriptor;
            sendData.taskCmd = thrData.taskCmd;
            sendData.taskclass = thrData.taskclass;
            sendData.srcuid = thrData.srcuid;
            sendData.dataIndex = thrData.dataIndex;
            sendData.streams = thrData.streams;
            sendData.cmd = ThreadCMD.DATA_PARSE;

            // this.m_time = Date.now();
            if (sendData.streams != null) {
                let transfers = new Array(sendData.streams.length);
                for(let i: number = 0; i < sendData.streams.length; ++i) {
                    transfers[i] = sendData.streams[i].buffer;
                }
                this.m_worker.postMessage(sendData, transfers);
            }
            else {
                this.m_worker.postMessage( sendData );
            }

            thrData.sendStatus = 1;
            thrData.streams = null;

            sendData.descriptor = null;
            sendData.streams = null;
            this.m_thrData = thrData;
            this.m_free = false;
        }
        else if(this.m_taskfs[thrData.taskclass] < 1) {
            console.error("task class("+thrData.taskclass+") module is undeifned");
        }
    }

    initTaskByURL(ns: string, taskclass: number, moduleName: string): void {
        //console.log("initTask, this.m_initTasks.length: "+this.m_initTasks.length);
        if (taskclass >= 0 && taskclass < this.m_taskfs.length) {
            if (this.m_taskfs[taskclass] < 0) {
                this.m_taskfs[taskclass] = 0;
                let task: any = { taskName: ns, taskclass: taskclass, inited: false, type: 0, moduleName: moduleName };
                this.m_initTasks.push(task);
            }
        }
    }
    initTaskByCodeStr(codeStr: string, taskclass: number, moduleName: string): void {
        //console.log("initTask, this.m_initTasks.length: "+this.m_initTasks.length);
        if (taskclass >= 0 && taskclass < this.m_taskfs.length) {
            if (this.m_taskfs[taskclass] < 0) {
                this.m_taskfs[taskclass] = 0;
                let task: any = { srccode: codeStr, taskclass: taskclass, inited: false, type: 2, moduleName: moduleName };
                this.m_initTasks.push(task);
            }
        }
    }
    private updateInitTask(): void {
        //console.log("###>>>> this.m_initTasks.length: "+this.m_initTasks.length);
        if (this.m_initTasks.length > 0) {
            this.m_free = false;
            let task: any = this.m_initTasks.pop();
            // type 为0 表示task js 文件是外部加载的, 如果为 1 则表示是由运行时字符串构建的任务可执行代码
            this.m_worker.postMessage({ cmd: ThreadCMD.INIT_TASK, threadIndex: this.getUid(), param: task });
        }
    }
    private receiveData(data: any): void {
        
        // this.m_time = Date.now() - this.m_time;
        // console.log("lost time: ",this.m_time,data.taskCmd);
        this.m_free = true;
        let task: ThreadTask = ThreadTask.GetTaskByUid(data.srcuid);
        // console.log("task != null: "+(task != null)+", data.srcuid: "+data.srcuid,", thread uid: "+this.m_uid);
        let finished: boolean = true;
        if (task != null) {
            finished = task.parseDone(data, -1);
        }
        
        this.updateInitTask();
        // 下面这个逻辑要慎用，用了可能会对时间同步(例如帧同步)造成影响
        if (this.autoSendData) {
            this.sendPoolDataToThread();
        }
    }
    initialize(blob: Blob): void {
        if (this.m_initBoo && blob != null && this.m_worker == null) {
            this.m_initBoo = false;
            let worker: Worker = new Worker(URL.createObjectURL(blob));
            this.m_worker = worker;

            this.m_worker.onmessage = (evt: any): void => {
                
                if(this.m_thrData != null) {
                    ThreadSendData.Restore( this.m_thrData );
                    this.m_thrData.sendStatus = -1;
                    this.m_thrData = null;
                }
                //console.log("Main worker recieve data, event.data: ",evt.data,",uid: "+this.m_uid);
                let data: any = evt.data;
                //console.log("Main Worker received worker cmd: "+data.cmd);
                switch (data.cmd) {
                    case ThreadCMD.DATA_PARSE:
                        this.receiveData(data);
                        break;
                    case ThreadCMD.THREAD_INIT:
                        worker.postMessage({ cmd: ThreadCMD.INIT_PARAM, threadIndex: this.getUid() });
                        break;
                    case ThreadCMD.INIT_TASK:
                        this.m_taskfs[data.taskclass] = 1;
                        this.m_free = true;
                        //console.log("Main Worker INIT_TASK selfT.m_taskfs: ",selfT.m_taskfs);
                        this.updateInitTask();
                        break;
                    case ThreadCMD.INIT_PARAM:
                        this.m_free = true;
                        this.m_enabled = true;
                        //console.log("Main worker INIT_PARAM.");
                        this.updateInitTask();
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

export default ThreadBase;
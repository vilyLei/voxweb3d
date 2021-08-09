/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ThreadCMD from "../../thread/base/ThreadCMD";
import IThreadSendData from "../../thread/base/IThreadSendData";
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
    
    autoSendData: boolean = false;
    pool: ThrDataPool = null;
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
    private thisSendDataTo(): void {
        this.pool.sendDataTo(this);
    }
    // send parse data to thread
    sendDataTo(thrData: IThreadSendData): void {
        if (this.m_free && this.m_taskfs[thrData.taskclass] > 0) {
            //console.log("sendDataTo...,this.m_free: "+this.m_free,thrData+",uid: "+this.getUid());
            thrData.buildThis(true);
            thrData.sendData.cmd = ThreadCMD.DATA_PARSE;
            if (thrData.transfers != null) {
                this.m_worker.postMessage(thrData.sendData, thrData.transfers);
            }
            else {
                this.m_worker.postMessage(thrData.sendData);
            }
            thrData.sendStatus = 1;
            this.m_free = false;
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
        //let receiveBoo:boolean = true;
        this.m_free = true;
        let task: ThreadTask = ThreadTask.GetTaskByUid(data.srcuid);
        //console.log("task != null: "+(task != null)+", data.srcuid: "+data.srcuid,", thread uid: "+this.m_uid);
        let finished: boolean = true;
        if (task != null) {
            finished = task.parseDone(data, -1);
        }
        //  if(finished)
        //  {
        //  }
        this.updateInitTask();
        // 下面这个逻辑要慎用，用了可能会对时间同步(例如帧同步)造成影响
        if (this.autoSendData) {
            this.thisSendDataTo();
        }
    }
    initialize(blob: Blob): void {
        if (this.m_initBoo && blob != null && this.m_worker == null) {
            this.m_initBoo = false;
            let worker: Worker = new Worker(URL.createObjectURL(blob));
            this.m_worker = worker;
            let selfT: ThreadBase = this;
            this.m_worker.onmessage = function (evt: any) {
                //console.log("Main worker recieve data, event.data: ",evt.data);
                let data: any = evt.data;
                //console.log("Main Worker received worker cmd: "+data.cmd);
                switch (data.cmd) {
                    case ThreadCMD.DATA_PARSE:
                        selfT.receiveData(data);
                        break;
                    case ThreadCMD.THREAD_INIT:
                        worker.postMessage({ cmd: ThreadCMD.INIT_PARAM, threadIndex: selfT.getUid() });
                        break;
                    case ThreadCMD.INIT_TASK:
                        selfT.m_taskfs[data.taskclass] = 1;
                        selfT.m_free = true;
                        //console.log("Main Worker INIT_TASK selfT.m_taskfs: ",selfT.m_taskfs);
                        selfT.updateInitTask();
                        break;
                    case ThreadCMD.INIT_PARAM:
                        selfT.m_free = true;
                        selfT.m_enabled = true;
                        //console.log("Main worker recieve INIT_PARAM.");
                        selfT.updateInitTask();
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

export default ThreadBase;
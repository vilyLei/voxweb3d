/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ThreadCore from "../thread/control/Thrcode";
import ThrDataPool from "../thread/control/ThrDataPool";
import { StreamType, IThreadSendData } from "../thread/base/IThreadSendData";
import { ThreadSendData } from "../thread/base/ThreadSendData";
import ThreadBase from "../thread/base/ThreadBase";
class ThreadSchedule {
    // allow ThreadSchedule initialize yes or no
    private m_initBoo: boolean = true;
    private m_maxThreadsTotal: number = 0;
    private m_thrSupportFlag: number = -1;
    private m_codeBlob: Blob = null;
    private m_tasks: any[] = [null, null, null, null, null, null, null, null, null, null, null, null];
    private m_threads: ThreadBase[] = [];
    private m_threadsTotal: number = 0;
    private m_threadEnabled: boolean = true;
    private m_pool: ThrDataPool = new ThrDataPool();

    getThrDataPool(): ThrDataPool {
        return this.m_pool;
    }
    run(): void {
        if (this.getThreadEnabled()) {
            if (this.m_pool.isEnabled()) {
                let tot: number = 0;
                for (let i: number = 0; i < this.m_threadsTotal; ++i) {
                    if (this.m_pool.isEnabled()) {
                        if (this.m_threads[i].isFree()) {
                            this.m_pool.sendDataTo(this.m_threads[i]);
                        }
                        if (this.m_threads[i].isFree()) {
                            ++tot;
                        }
                    }
                }
                if (tot < 1 && this.m_pool.isEnabled()) {
                    this.createThread();
                }
            }
        }
    }

    /**
     * 通过参数, 添加发送给子线程的数据
     * @param taskCmd 处理当前数据的任务命令名字符串
     * @param streams 用于内存所有权转换的数据流数组, 例如 Float32Array 数组, 默认值是null
     * @param descriptor 会发送到子线程的用于当前数据处理的数据描述对象, for example: {flag : 0, type: 12, name: "First"}, 默认值是 null
     */
    addDataWithParam(taskCmd: string, streams: StreamType[] = null, descriptor: any = null): void {
        let sd = ThreadSendData.Create();
        sd.taskCmd = taskCmd;
        sd.streams = streams;
        sd.descriptor = descriptor;
        this.addData(sd);
    }
    addData(thrData: IThreadSendData): void {
        if (thrData != null && thrData.srcuid >= 0) {
            this.m_pool.addData(thrData);
        }
    }
    private getAFreeThread(): ThreadBase {
        for (let i: number = 0; i < this.m_threadsTotal; ++i) {
            if (this.m_threads[i].isFree()) {
                return this.m_threads[i];
            }
        }
        return null;
    }
    getMaxThreadsTotal(): number {
        return this.m_maxThreadsTotal;
    }
    // 当前系统是否开启 worker multi threads
    setThreadEnabled(boo: boolean): void {
        if (this.m_thrSupportFlag > 0) this.m_thrSupportFlag = boo ? 2 : 1;
        this.m_threadEnabled = boo;
    }
    getThreadEnabled(): boolean {
        return this.m_threadEnabled;
    }
    // runtime support worker multi thrads yes or no
    isSupported(): boolean {
        if (this.m_thrSupportFlag > 0) {
            return this.m_thrSupportFlag == 2;
        }
        let boo: boolean = (typeof (Worker) !== "undefined") && (typeof (Blob) !== "undefined");
        this.m_thrSupportFlag = boo ? 2 : 1;
        this.m_threadEnabled = boo;
        return boo;
    }
    private createThread(): void {
        if (this.m_threadsTotal < this.m_maxThreadsTotal) {
            let thread: ThreadBase = new ThreadBase();
            thread.initialize(this.m_codeBlob);
            this.m_threads.push(thread);
            this.m_threadsTotal++;

            let task: any;
            for (let i: number = 0, len: number = this.m_tasks.length; i < len; ++i) {
                task = this.m_tasks[i];
                if (task != null) {
                    switch (task.type) {
                        case 0:
                            thread.initTaskByURL(task.taskName, task.taskclass, task.moduleName);
                            break;
                        case 2:
                            thread.initTaskByCodeStr(task.srccode, task.taskclass, task.moduleName);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    initTaskByURL(ns: string, taskclass: number, moduleName: string = ""): void {
        if (ns != "" && taskclass >= 0 && taskclass < this.m_tasks.length) {
            let task: any = this.m_tasks[taskclass];
            if (task == null) {
                task = { taskName: ns, taskclass: taskclass, type: 0, threads: [], moduleName: moduleName };
                this.m_tasks[taskclass] = task;
                //m_threadsTotal
                for (let i: number = 0; i < this.m_threadsTotal; ++i) {
                    this.m_threads[i].initTaskByURL(ns, taskclass, moduleName);
                }

            }
        }
    }
    initTaskByCodeStr(codestr: string, taskclass: number, moduleName: string = ""): void {
        if (codestr != "" && taskclass >= 0 && taskclass < this.m_tasks.length) {
            let task: any = this.m_tasks[taskclass];
            if (task == null) {
                task = { srccode: codestr, type: 2, taskclass: taskclass, threads: [], moduleName: moduleName };
                this.m_tasks[taskclass] = task;
                //m_threadsTotal
                for (let i: number = 0; i < this.m_threadsTotal; ++i) {
                    this.m_threads[i].initTaskByCodeStr(codestr, taskclass, moduleName);
                }

            }
        }
    }
    /**
     * @param maxThreadsTotal 最大子线程数量
     */
    initsialize(maxThreadsTotal: number): void {
        if (this.m_initBoo) {
            if (this.getThreadEnabled() && this.isSupported()) {
                //console.log("ThreadCore.CodeStr: \n",ThreadCore.CodeStr);

                let bolb: Blob = new Blob([ThreadCore.CodeStr]);

                if (maxThreadsTotal < 1) maxThreadsTotal = 1;
                this.m_codeBlob = bolb;
                this.m_maxThreadsTotal = maxThreadsTotal;
                this.createThread();
            }
            this.m_initBoo = false;
        }
    }
}

export default ThreadSchedule;
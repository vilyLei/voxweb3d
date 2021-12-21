/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {StreamType, IThreadSendData} from "../thread/base/IThreadSendData";
import {ThreadSendData} from "../thread/base/ThreadSendData";
import RendererDevice from "../vox/render/RendererDevice";
import ThreadCore from "../thread/control/Thrcode";
import ThrDataPool from "../thread/control/ThrDataPool";
import ThreadBase from "../thread/base/ThreadBase";
import ThreadTask from "./control/ThreadTask";

class ThreadSystem {
    // allow ThreadSystem initialize yes or no
    private static s_initBoo: boolean = true;
    private static s_maxThreadsTotal: number = 0;
    private static s_thrSupportFlag: number = -1;
    private static s_codeBlob: Blob = null;
    private static s_tasks: any[] = [null, null, null, null, null, null, null, null];
    private static s_threads: ThreadBase[] = [null, null, null, null, null, null, null, null];
    private static s_threadsTotal: number = 0;
    private static s_pool: ThrDataPool = new ThrDataPool();
    private static s_specList: IThreadSendData[] = [];
    private static s_specIndices: number[] = [];
    
    static GetThrDataPool(): ThrDataPool {
        return ThreadSystem.s_pool;
    }
    static BindTask(task: ThreadTask, threadIndex: number = -1): void {
        if(task != null) {
            let localPool: ThrDataPool = null;
            if(threadIndex >= 0 && threadIndex < ThreadSystem.s_maxThreadsTotal) {
                for(;;) {
                    if(threadIndex >= ThreadSystem.s_threadsTotal) {
                        ThreadSystem.CreateThread();
                    }
                    else {
                        break;
                    }
                }
                localPool = ThreadSystem.s_threads[threadIndex].localDataPool;
            }
            task.setDataPool(ThreadSystem.s_pool, localPool);
        }
    }
    static SendDataToWorkerAt(i: number, sendData: IThreadSendData): void {
        if(i >= 0 && i < ThreadSystem.s_maxThreadsTotal) {
            for(;;) {
                if(i >= ThreadSystem.s_threadsTotal) {
                    ThreadSystem.CreateThread();
                }
                else {
                    break;
                }
            }
            if (sendData != null && sendData.sendStatus < 0) {
                sendData.sendStatus = 0;
                if (ThreadSystem.s_threads[i].isFree()) {
                    ThreadSystem.s_threads[i].sendDataTo( sendData );
                }
                else {
                    ThreadSystem.s_specList.push(sendData);
                    ThreadSystem.s_specIndices.push(i);
                }
            }
        }
    }
    /**
     * @returns 返回是否在队列中还有待处理的数据
     */
    static HasData(): boolean {
        return ThreadSystem.s_pool.isEnabled();
    }
    static Run(): void {
        
        if (ThreadSystem.GetThreadEnabled()) {
            let specList: IThreadSendData[] = ThreadSystem.s_specList;
            let tot: number = specList.length;
            let thrTot: number = ThreadSystem.s_threadsTotal;
            let i: number = 0;
            for (; i < tot; ++i) {
                let j: number = ThreadSystem.s_specIndices[i];
                if (ThreadSystem.s_threads[j].isFree()) {
                    ThreadSystem.s_threads[j].sendDataTo( specList[i] );
                    specList.splice(i, 1);
                    ThreadSystem.s_specIndices.splice(i, 1);
                    i --;
                    tot --;
                    thrTot --;
                }
                if(thrTot < 1) {
                    break;
                }                    
            }

            if (ThreadSystem.s_pool.isEnabled()) {
                tot = 0;
                for (i = 0; i < ThreadSystem.s_threadsTotal; ++i) {
                    if (ThreadSystem.s_pool.isEnabled()) {
                        if (ThreadSystem.s_threads[i].isFree()) {
                            ThreadSystem.s_pool.sendDataTo(ThreadSystem.s_threads[i]);
                        }
                        if (ThreadSystem.s_threads[i].isFree()) {
                            ++tot;
                        }
                    }
                }
                if (tot < 1 && ThreadSystem.s_pool.isEnabled()) {
                    ThreadSystem.CreateThread();
                }
            }
            else {
                for (i = 0; i < ThreadSystem.s_threadsTotal; ++i) {
                    if (ThreadSystem.s_threads[i].isFree()) {
                        ThreadSystem.s_threads[i].sendPoolDataToThread();
                    }
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
    static AddDataWithParam(taskCmd: string, streams: StreamType[] = null, descriptor: any = null): void {
        let sd = ThreadSendData.Create();
        sd.taskCmd = taskCmd;
        sd.streams = streams;
        sd.descriptor = descriptor;
        ThreadSystem.AddData(sd);
    }
    static AddData(thrData: IThreadSendData): void {
        if (thrData != null && thrData.srcuid >= 0) {
            ThreadSystem.s_pool.addData(thrData);
        }
    }
    static LockThreadAt(i: number): void {
        ThreadSystem.s_threads[i].unlock = false;
    }
    static UnlockThreadAt(i: number): void {
        ThreadSystem.s_threads[i].unlock = true;
    }
    private static GetAFreeThread(): ThreadBase {
        for (let i: number = 0; i < ThreadSystem.s_threadsTotal; ++i) {
            if (ThreadSystem.s_threads[i].isFree()) {
                return ThreadSystem.s_threads[i];
            }
        }
        return null;
    }
    static GetMaxThreadsTotal(): number {
        return ThreadSystem.s_maxThreadsTotal;
    }
    // 当前系统是否开启 worker multi threads
    static SetThreadEnabled(boo: boolean): void {
        if (ThreadSystem.s_thrSupportFlag > 0) ThreadSystem.s_thrSupportFlag = boo ? 2 : 1;
        RendererDevice.SetThreadEnabled(boo);
    }
    static GetThreadEnabled(): boolean {
        return RendererDevice.GetThreadEnabled();
    }
    // runtime support worker multi thrads yes or no
    static IsSupported(): boolean {
        if (ThreadSystem.s_thrSupportFlag > 0) {
            return ThreadSystem.s_thrSupportFlag == 2;
        }
        let boo: boolean = (typeof (Worker) !== "undefined") && (typeof (Blob) !== "undefined");
        ThreadSystem.s_thrSupportFlag = boo ? 2 : 1;
        RendererDevice.SetThreadEnabled(boo);
        return boo;
    }
    private static CreateThread(): void {
        if (ThreadSystem.s_threadsTotal < ThreadSystem.s_maxThreadsTotal) {
            let thread: ThreadBase = new ThreadBase();
            thread.globalDataPool = ThreadSystem.s_pool;
            thread.initialize(ThreadSystem.s_codeBlob);
            ThreadSystem.s_threads[ThreadSystem.s_threadsTotal] = thread;

            console.log("Create Thread("+ThreadSystem.s_threadsTotal+")");
            
            ThreadSystem.s_threadsTotal++;
            let task: any;
            for (let i: number = 0, len: number = ThreadSystem.s_tasks.length; i < len; ++i) {
                task = ThreadSystem.s_tasks[i];
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

    static InitTaskByURL(ns: string, taskclass: number, moduleName: string = ""): void {
        if (ns != "" && taskclass >= 0 && taskclass < ThreadSystem.s_tasks.length) {
            let task: any = ThreadSystem.s_tasks[taskclass];
            if (task == null) {
                task = { taskName: ns, taskclass: taskclass, type: 0, threads: [], moduleName: moduleName };
                ThreadSystem.s_tasks[taskclass] = task;

                for (let i: number = 0; i < ThreadSystem.s_threadsTotal; ++i) {
                    ThreadSystem.s_threads[i].initTaskByURL(ns, taskclass, moduleName);
                }

            }
        }
    }
    static InitTaskByCodeStr(codestr: string, taskclass: number, moduleName: string = ""): void {
        if (codestr != "" && taskclass >= 0 && taskclass < ThreadSystem.s_tasks.length) {
            let task: any = ThreadSystem.s_tasks[taskclass];
            if (task == null) {
                task = { srccode: codestr, type: 2, taskclass: taskclass, threads: [], moduleName: moduleName };
                ThreadSystem.s_tasks[taskclass] = task;
                //s_threadsTotal
                for (let i: number = 0; i < ThreadSystem.s_threadsTotal; ++i) {
                    ThreadSystem.s_threads[i].initTaskByCodeStr(codestr, taskclass, moduleName);
                }

            }
        }
    }
    /**
     * @param maxThreadsTotal 最大子线程数量
     */
    static Initialize(maxThreadsTotal: number, codeStr: string = ""): void {
        if (ThreadSystem.s_initBoo) {
            if (ThreadSystem.GetThreadEnabled() && ThreadSystem.IsSupported()) {
                //console.log("ThreadCore.CodeStr: \n",ThreadCore.CodeStr);

                let bolb: Blob = new Blob([codeStr + ThreadCore.CodeStr]);

                if (maxThreadsTotal < 1) maxThreadsTotal = 1;
                ThreadSystem.s_codeBlob = bolb;
                ThreadSystem.s_maxThreadsTotal = maxThreadsTotal;
                ThreadSystem.CreateThread();
            }
            ThreadSystem.s_initBoo = false;
        }
    }
}
export default ThreadSystem;
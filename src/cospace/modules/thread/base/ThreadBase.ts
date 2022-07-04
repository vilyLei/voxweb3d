/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ThreadCMD } from "../../thread/base/ThreadCMD";
import { IThreadSendData } from "../../thread/base/IThreadSendData";
import { ThreadSendData } from "../../thread/base/ThreadSendData";
import { IThreadBase } from "../../thread/base/IThreadBase";
import { ThrDataPool } from "../../thread/control/ThrDataPool";
import { ThreadCodeSrcType } from "../control/ThreadCodeSrcType";
import { TDRManager } from "./TDRManager";
import { ThreadConfigure } from "./ThreadConfigure";
import { TDRParam } from "./TDRParam";
import { TaskDataRouter } from "./TaskDataRouter";
import { TaskDescriptor } from "./TaskDescriptor";
import { ThreadTaskPool } from "../control/ThreadTaskPool";
// import { TaskRegister } from "./TaskRegister";
type ArrayTypeT = Float32Array | Int32Array | Uint16Array | Uint8Array | Int16Array | Int8Array;
class ThreadBase implements IThreadBase {
    private static s_uid: number = 0;
    private m_uid: number = -1;
    private m_worker: Worker = null;
    private m_taskItems: TaskDescriptor[] = [];
    private m_taskfs: number[];
    private m_free: boolean = false;
    private m_enabled: boolean = false;
    private m_initBoo: boolean = true;
    private m_thrData: IThreadSendData = null;
    private m_commonModuleMap: Map<string,number> = new Map();
    private m_tdrManager: TDRManager;    
    private m_taskPool: ThreadTaskPool;
    // private m_taskReg: TaskRegister;
    /**
     * 线程中子模块间依赖关系的json描述
     */
    private m_graphJsonStr: string;
    
    autoSendData: boolean = false;
    localDataPool: ThrDataPool = new ThrDataPool();
    globalDataPool: ThrDataPool = null;
    unlock: boolean = true;

    constructor(tdrManager: TDRManager, taskPool: ThreadTaskPool, graphJsonStr: string = "") {
        
        this.m_tdrManager = tdrManager;
        this.m_taskPool = taskPool;
        // this.m_taskReg = taskReg;
        this.m_graphJsonStr = graphJsonStr;

        this.m_uid = ThreadBase.s_uid++;
        this.m_taskfs = new Array( ThreadConfigure.MAX_TASKS_TOTAL );
        this.m_taskfs.fill( -1 );
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
    hasDataToThread(): boolean {
        return this.localDataPool.isEnabled() || this.globalDataPool.isEnabled();
    }
    sendPoolDataToThread(): boolean {

        if(this.m_free) {
            let boo = this.localDataPool.isEnabled();
            if(boo) {
                boo = this.localDataPool.sendDataTo(this);
            }
            if(!boo) {
                boo = this.globalDataPool.sendDataTo(this);
            }
            return boo;
        }
        return false;
    }
    // send parse data to thread
    sendDataTo(thrData: IThreadSendData): void {
        if (this.m_free && this.m_taskfs[thrData.taskclass] > 0) {
            // console.log("ThreadBase::sendDataTo(),this.m_free: "+this.m_free,thrData+",uid: "+this.getUid());
            thrData.buildThis(true);

            let sendData: any = {streams: null};
            
            sendData.descriptor = thrData.descriptor;
            sendData.taskCmd = thrData.taskCmd;
            sendData.taskclass = thrData.taskclass;
            sendData.srcuid = thrData.srcuid;
            sendData.dataIndex = thrData.dataIndex;
            sendData.wfst = thrData.wfst;
            sendData.streams = thrData.streams;
            sendData.cmd = ThreadCMD.DATA_PARSE;
            sendData.threadIndex = this.m_uid;

            // this.m_time = Date.now();
            if (thrData.streams != null) {
                let ls = thrData.streams;
                let transfers = new Array(ls.length);
                for(let i: number = 0; i < ls.length; ++i) {
                    if(ls[i] instanceof ArrayBuffer ) {
                        transfers[i] = ls[i];
                    }else {
                        transfers[i] = (ls[i] as ArrayTypeT).buffer;
                    }
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
    initModuleByTaskDescriptor(task: TaskDescriptor): void {
        if(task != null) {
            let taskclass = task.taskclass;
            // console.log("ThreadBase::initModuleByTaskDescriptor(), taskclass: ", taskclass);
            if (taskclass >= 0 && taskclass < this.m_taskfs.length) {
                if (this.m_taskfs[taskclass] < 0) {
                    this.m_taskfs[taskclass] = 0;
                    this.m_taskItems.push(task);
                }
            }
        }
    }
    initModules(moduleUrls: string[]): void {
        let urls: string[] = [];
        for(let i = 0; i < moduleUrls.length; ++i) {
            if(!this.m_commonModuleMap.has(moduleUrls[i])) {
                this.m_commonModuleMap.set(moduleUrls[i], 1);
                urls.push(moduleUrls[i]);              
            }
        }
        // console.log("XXXX thread initModules urls.length: ",urls.length);
        if(urls.length > 0) {
            this.m_worker.postMessage({ cmd: ThreadCMD.INIT_COMMON_MODULE, threadIndex: this.getUid(), modules: urls, type: ThreadCodeSrcType.JS_FILE_CODE });
        }
    }
    
    initModuleByCodeString(codeStr: string): void {
        this.m_worker.postMessage({ cmd: ThreadCMD.INIT_COMMON_MODULE, threadIndex: this.getUid(), src: codeStr, type: ThreadCodeSrcType.STRING_CODE });
    }
    private updateInitTask(): void {
        if (this.m_taskItems.length > 0) {
            this.m_free = false;
            this.m_enabled = false;
            let task = this.m_taskItems.pop();
            // type 为0 表示task js 文件是外部加载的, 如果为 1 则表示是由运行时字符串构建的任务可执行代码
            console.log("Main worker("+this.getUid()+") updateInitTask(), task: ",task);
            // let info: {taskClass:number, keyuns: string} = this.m_taskReg.getTaskInfo(task);
            // console.log("task info: ", info);
            this.m_worker.postMessage({ cmd: ThreadCMD.INIT_TASK, threadIndex: this.getUid(), param: task, info: task.info });
        }
    }
    private receiveData(data: any): void {
        
        // console.log("lost time: ",this.m_time,data.taskCmd);
        this.m_free = true;
        
        // 下面这个逻辑要慎用，用了可能会对时间同步(例如帧同步)造成影响
        if (this.autoSendData) {
            this.sendPoolDataToThread();
        }
        
        // let task: ThreadTask = ThreadTask.GetTaskByUid(data.srcuid);
        let task = this.m_taskPool.getTaskByUid(data.srcuid);
        // console.log("task != null: ",(task != null),", data.srcuid: ",data.srcuid,", thread uid: ",this.m_uid);
        // console.log("data: ",data);
        let finished: boolean = true;
        if (task != null) {
            finished = task.parseDone(data, 0);
        }
        
        this.updateInitTask();
    }
    sendRouterDataTo(router: TaskDataRouter): void {
        let param: TDRParam = router.param;
        // console.log("#### A thread("+this.m_uid+"), sendRouterDataTo(), param: ", param);
        if(router != null && router.isTransmission() && param.threadIndex == this.m_uid) {
            router.param = null;
            // console.log("#### B thread("+this.m_uid+"), sendRouterDataTo(), param: ", param);
            this.m_worker.postMessage({ cmd: param.cmd, taskCmd: param.taskCmd,threadIndex: this.getUid(), taskclass: param.taskclass, data: router.getData() }, router.getTransfers());
        }
    }
    terminate(): void {
        if(this.m_worker != null) {            
            this.m_worker.terminate();
            this.m_worker = null;
            this.m_free = false;
            this.m_enabled = false;
        }
    }
    destroy(): void {

        if(this.m_worker != null) {
            this.terminate();
            this.m_taskPool = null;
            this.m_tdrManager = null;
            this.m_graphJsonStr = "";
            this.localDataPool = null;
            this.globalDataPool = null;
        }
    }
    isDestroyed(): boolean {
        return this.m_taskPool == null;
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
                // console.log("Main worker("+this.getUid()+") recieve data, event.data: ",evt.data,",uid: "+this.m_uid);
                let data: any = evt.data;
                // console.log("Main Worker received worker cmd: ",data.cmd);
                switch (data.cmd) {
                    case ThreadCMD.DATA_PARSE:
                        this.receiveData(data);
                        break;
                    case ThreadCMD.THREAD_INIT:
                        worker.postMessage({ cmd: ThreadCMD.INIT_PARAM, threadIndex: this.getUid(), graphJsonStr: this.m_graphJsonStr, total: ThreadConfigure.MAX_TASKS_TOTAL });
                        break;
                    case ThreadCMD.INIT_TASK:
                        if(this.m_taskfs[data.taskclass] < 0) {
                            throw Error("sub worker taskclass and main worker logic taskClass are not equal !!!");
                        }
                        this.m_taskfs[data.taskclass] = 1;
                        this.m_free = true;
                        this.m_enabled = true;
                        // console.log("Main Worker("+this.getUid()+") INIT_TASK data.taskclass: ", data.taskclass);
                        this.updateInitTask();
                        break;
                    case ThreadCMD.INIT_PARAM:
                        this.m_free = true;
                        this.m_enabled = true;
                        //console.log("Main worker INIT_PARAM.");
                        this.updateInitTask();
                        break;
                    case ThreadCMD.THREAD_ACQUIRE_DATA:
                        // console.log("ThreadCMD.THREAD_ACQUIRE_DATA, data.taskclass: ", data.taskclass);
                        let tdrParam = new TDRParam(data.taskclass, data.cmd, data.taskCmd,this.getUid());
                        let router1 = this.m_tdrManager.getRouterByTaskClass(data.taskclass);
                        if(router1 != null) {
                            router1.acquireTrigger();
                            // console.log("#####$$$ Main worker("+this.getUid()+") ThreadCMD.THREAD_ACQUIRE_DATA, router: ", router1.isDataEnabled() && !router1.isTransmission(), router1);
                            if(router1.isDataEnabled() && !router1.isTransmission()) {
                                router1.param = tdrParam;
                                this.sendRouterDataTo( router1 );
                            }else {
                                router1 = null;
                            }
                        }
                        if(router1 == null) {
                            this.m_tdrManager.waitRouterByParam(tdrParam);
                        }
                        break;
                    case ThreadCMD.THREAD_TRANSMIT_DATA:
                        let router2 = this.m_tdrManager.getRouterByTaskClass(data.taskclass);
                        // console.log("#### ThreadCMD.THREAD_TRANSMIT_DATA, router2: ", router2.isDataEnabled() && !router2.isTransmission(), router2);
                        if(router2 != null) {
                            if(router2.isDataEnabled()) {
                                console.error("router have old data, can not reset new data.");
                            }
                            router2.setData(data.data);
                        }
                        break;
                    case ThreadCMD.INIT_COMMON_MODULE:
                        
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

export { ThreadBase };
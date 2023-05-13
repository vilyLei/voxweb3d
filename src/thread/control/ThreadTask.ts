/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
/*
作为 多线程 计算 的数据和业务逻辑的任务管理基础
一个task可以只有一个数据处理发送给worker,也可以是多个任务处理发送给worker
本类作为任何thread task 的基类
*/
import { StreamType, IThreadSendData } from "../base/IThreadSendData";
import { ThreadSendData } from "../base/ThreadSendData";
import { IThrDataPool } from "../control/IThrDataPool";
import { ThreadCodeSrcType } from "../control/ThreadCodeSrcType";

class ThreadTask {
    // 同时处在运行时状态的最大任务数量: 512个
    private static s_maxTasksTotal: number = 512;
    private static s_taskList: ThreadTask[] = null;
    private static s_freeList: number[] = null;

    private m_uid: number = -1;
    private m_globalDataPool: IThrDataPool = null;
    private m_localDataPool: IThrDataPool = null;

    protected m_parseIndex: number = 0;
    protected m_parseTotal: number = 0;
    /**
     * the task code source type in the thread runtime
     */
    threadCodeSrcType: ThreadCodeSrcType = ThreadCodeSrcType.JS_FILE_CODE;
    /**
     * the task code source url in the thread runtime
     */
    threadCodeURL: string = "";
    constructor() {
        if (ThreadTask.s_freeList == null) {
            ThreadTask.s_taskList = new Array(ThreadTask.s_maxTasksTotal);
            ThreadTask.s_freeList = new Array(ThreadTask.s_maxTasksTotal);
            for (let i: number = 0, len: number = ThreadTask.s_freeList.length; i < len; ++i) {
                ThreadTask.s_freeList[i] = i;
            }
        }
        if (ThreadTask.s_freeList.length > 0) {
            this.m_uid = ThreadTask.s_freeList.pop();
            ThreadTask.s_taskList[this.m_uid] = this;
        }
        else {
            throw Error("Create ThreadTask too much !!!");
        }
    }
    static GetTaskByUid(uid: number): ThreadTask {
        if (uid < ThreadTask.s_maxTasksTotal && uid >= 0) {
            return ThreadTask.s_taskList[uid];
        }
        return null;
    }
    // 重新关联一个 DetachTask 操作之后的 task
    static AttachTask(task: ThreadTask): boolean {
        if (task.m_uid < 0) {
            if (ThreadTask.s_freeList.length > 0) {
                task.m_uid = ThreadTask.s_freeList.pop();
                ThreadTask.s_taskList[task.m_uid] = task;
                return true;
            }
        }
        return false;
    }
    // detach a task, 使之不会再被多任务系统调用
    static DetachTask(task: ThreadTask): void {
        if (task.m_uid >= 0) {
            ThreadTask.s_taskList[task.m_uid] = null;
            ThreadTask.s_freeList.push(task.m_uid);
            task.m_uid = -1;
        }
    }
    setDataPool(globalDataPool: IThrDataPool, localDataPool: IThrDataPool = null): void {
        this.m_globalDataPool = globalDataPool;
        this.m_localDataPool = localDataPool;
    }
    // 被子类覆盖后便能实现更细节的相关功能
    reset(): void {
        this.m_parseIndex = 0;
    }
    setParseTotal(total: number): void {
        this.m_parseTotal = total;
    }
    isFinished(): boolean {
        return this.m_parseIndex >= this.m_parseTotal;
    }
    getParsedTotal(): number {
        return this.m_parseIndex >= this.m_parseTotal ? this.m_parseTotal : (this.m_parseIndex + 1);
    }
    getParseTotal(): number {
        return this.m_parseTotal;
    }
    getParsedIndex(): number {
        return this.m_parseIndex;
    }
    getUid(): number {
        return this.m_uid;
    }
    // 必须被覆盖, return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {
        throw Error("function parseDone(), Need Override !");
        return true;
    }
    /**
     * 创建发所给子线程的数据对象
     * @returns 默认返回 ThreadSendData 实例, 这个实例由系统自行管理
     */
    protected createSendData(): ThreadSendData {
        let sd = ThreadSendData.Create();
        sd.srcuid = this.getUid();
        sd.taskclass = this.getTaskClass();
        return sd;
    }
    /**
     * 通过参数, 創建发送给子线程的数据
     * @param taskCmd 处理当前数据的任务命令名字符串
     * @param streams 用于内存所有权转换的数据流数组, 例如 Float32Array 数组, 默认值是null
     * @param descriptor 会发送到子线程的用于当前数据处理的数据描述对象, for example: {flag : 0, type: 12, name: "First"}, 默认值是 null
     */
    protected createSendDataWithParam(taskCmd: string, streams: StreamType[] = null, descriptor: any = null): ThreadSendData {
        
        let sd = ThreadSendData.Create();
        sd.srcuid = this.getUid();
        sd.taskclass = this.getTaskClass();
        sd.taskCmd = taskCmd;
        sd.streams = streams;
        sd.descriptor = null;
        return sd;
    }
    /**
     * 通过参数, 添加发送给子线程的数据
     * @param taskCmd 处理当前数据的任务命令名字符串
     * @param streams 用于内存所有权转换的数据流数组, 例如 Float32Array 数组, 默认值是null
     * @param descriptor 会发送到子线程的用于当前数据处理的数据描述对象, for example: {flag : 0, type: 12, name: "First"}, 默认值是 null
     * @param threadBindingData 是否是线程直接绑定的数据，默认是false
     */
    protected addDataWithParam(taskCmd: string, streams: StreamType[] = null, descriptor: any = null, threadBindingData: boolean = false): void {
        let sd = this.createSendData();
        sd.taskCmd = taskCmd;
        sd.streams = streams;
        sd.descriptor = descriptor;
        this.addData(sd, threadBindingData);
    }
    /**
     * 通过参数, 添加发送给子线程的数据
     * @param data 符合IThreadSendData行为规范的数据对象
     * @param threadBindingData 是否是线程直接绑定的数据，默认是false
     */
    protected addData(data: IThreadSendData, threadBindingData: boolean = false): void {
        if (this.m_uid >= 0) {
            data.srcuid = this.m_uid;
            data.taskclass = this.getTaskClass();
            if(threadBindingData) {
                if (this.m_localDataPool != null) {
                    this.m_localDataPool.addData(data);
                }
            }
            else {
                if (this.m_globalDataPool != null) {
                    this.m_globalDataPool.addData(data);
                }
            }
        }
        else {
            throw Error("Need attach this task !");
        }
    }
    getWorkerSendDataAt(i: number): IThreadSendData {
        throw Error("function getWorkerSendDataAt(), Need Override !");
        return null;
    }
    // 必须被覆盖
    getTaskClass(): number {
        throw Error("function getTaskClass(), Need Override !");
        return -1;
    }
    destroy(): void {
        this.m_globalDataPool = null;
        this.m_localDataPool = null;
        ThreadTask.DetachTask(this);
    }
}

export default ThreadTask;
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
/*
作为 多线程 计算 的数据和业务逻辑的任务管理基础
一个task可以只有一个数据处理发送给worker,也可以是多个任务处理发送给worker
本类作为任何thread task 的基类
*/
import {IThreadSendData} from "../base/IThreadSendData";
import {ThreadSendData} from "../base/ThreadSendData";
import {IThrDataPool} from "../control/IThrDataPool";

class ThreadTask {
    // 同时处在运行时状态的最大任务数量: 512个
    private static s_maxTasksTotal: number = 512;
    private static s_taskList: ThreadTask[] = null;
    private static s_freeList: number[] = null;
    private m_uid: number = -1;
    private m_thrDataPool: IThrDataPool = null;
    protected m_parseIndex: number = 0;
    protected m_parseTotal: number = 0;
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
    setThrDataPool(thrDataPool: IThrDataPool): void {
        this.m_thrDataPool = thrDataPool;
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
    nomalizeData(data: IThreadSendData): void {
        if (this.m_uid >= 0) {
            data.srcuid = this.m_uid;
            data.taskclass = this.getTaskClass();
        }
        else {
            throw Error("Need attach this task !");
        }
    }
    protected createSendData(): ThreadSendData{
        return ThreadSendData.Create();
    }
    protected addData(data: IThreadSendData): void {
        if (this.m_uid >= 0) {
            data.srcuid = this.m_uid;
            data.taskclass = this.getTaskClass();
            if(this.m_thrDataPool != null) {
                this.m_thrDataPool.addData(data);
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
        this.m_thrDataPool = null;
        ThreadTask.DetachTask(this);
    }
}

export default ThreadTask;
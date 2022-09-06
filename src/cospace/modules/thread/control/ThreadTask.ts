/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { StreamType, IThreadSendData } from "../base/IThreadSendData";
import { ThreadSendData } from "../base/ThreadSendData";
import { IThrDataPool } from "../control/IThrDataPool";
import { TaskDependency } from "./TaskDependency";
import { IThreadTask } from "./IThreadTask";
import { ThreadTaskPool } from "./ThreadTaskPool";

class ThreadTask implements IThreadTask {
    private m_uid: number = -1;
    private m_globalDataPool: IThrDataPool = null;
    private m_localDataPool: IThrDataPool = null;
    private m_taskPool: ThreadTaskPool = null;
    private m_info: { taskClass: number, keyuns: string } = null;

    protected m_parseIndex: number = 0;
    protected m_parseTotal: number = 0;
    /**
     * 当前任务对于线程中相关代码模块的依赖关系
     */
    dependency: TaskDependency = null;
    constructor() {
        console.log("XXXX ThreadTask::constructor() ...");
    }
    attach(taskPool: ThreadTaskPool): boolean {
        if (this.m_uid < 0 && this.m_taskPool == null && taskPool != null) {
            this.m_taskPool = taskPool;
            let uid = taskPool.attachTask(this);
            if (uid > 0) {
                this.m_uid = uid;
                return true;
            } else {
                throw Error("illegal operation!!!");
            }
        }
        return false;
    }
    detach(): void {
        if (this.m_uid > 0 && this.m_taskPool != null) {
            this.m_taskPool.detachTask(this);
            this.m_uid = -1;
        }
    }
    setTaskInfo(info: { taskClass: number, keyuns: string }): void {
        console.log("XXXX ThreadTask::setTaskInfo() info: ", info);
        this.m_info = info;
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
    /**
     * 必须被覆盖, return true, task finish; return false, task continue...
     * @param data 存放处理结果的数据对象
     * @param flag 表示多线程任务的处理状态, 这里的flag是一个uint型。用4个8位来表示4种标识分类, 最低8位用来表示任务的处理阶段相关的状态
     * @returns 返回这个函数的处理状态，默认返回false
     */
    parseDone(data: unknown, flag: number): boolean {
        throw Error("ThreadTask::parseDone(), Need Override it!");
        return true;
    }
    /**
     * 创建发所给子线程的数据对象
     * @returns 默认返回 ThreadSendData 实例, 这个实例由系统自行管理
     */
    protected createSendData(): ThreadSendData {
        let sd = ThreadSendData.Create();
        sd.srcuid = this.getUid();
        sd.taskclass = this.m_info.taskClass;
        sd.wfst = 0;
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
        sd.taskclass = this.m_info.taskClass;
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
            data.taskclass = this.m_info.taskClass;
            // console.log("task addData, ",threadBindingData, this.m_localDataPool != null, this.m_globalDataPool != null);
            if (threadBindingData) {
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
        throw Error("ThreadTask::getWorkerSendDataAt(), Need Override !");
        return null;
    }
    /**
     * 获得自身动态分配到的 task class 值，不可被子类覆盖
     * @returns task class value
     */
    getTaskClass(): number {
        return this.m_info.taskClass;
    }
    destroy(): void {
        this.detach();
        this.m_info = null;
        this.m_globalDataPool = null;
        this.m_localDataPool = null;
        this.dependency = null;
        // ThreadTask.DetachTask(this);
    }
}

export { ThreadTask };

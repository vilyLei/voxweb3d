/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import { IThreadTask } from "./IThreadTask";
/**
 * 记录绑定在当前线程控制模块的任务对象
 */
class ThreadTaskPool {
    
    private m_taskList: IThreadTask[];
    private m_freeList: number[];
    private m_total: number = 0;

    constructor(total: number) {
        
        this.m_total = total;
        this.m_taskList = new Array( total );
        this.m_taskList[0] = null;
        this.m_freeList = new Array( total );
        for (let i: number = 1, len: number = total; i < len; ++i) {
            this.m_freeList[i] = i;
        }
    }
    
    getTaskByUid(uid: number): IThreadTask {
        if (uid < this.m_total && uid > 0) {
            return this.m_taskList[uid];
        }
        return null;
    }
    // 重新关联一个 DetachTask 操作之后的 task
    attachTask(task: IThreadTask): number {
        // console.log("ThreadTaskPool::AttachTask()...");
        if (task.getUid() < 1) {
            if (this.m_freeList.length > 0) {
                let uid = this.m_freeList.pop();
                this.m_taskList[uid] = task;
                return uid;
            }
        }
        return -1;
    }
    // detach a task, 使之不会再被多任务系统调用
    detachTask(task: IThreadTask): void {
        // console.log("ThreadTaskPool::detachTask()...");
        if (task.getUid() > 0 && this.m_taskList[task.getUid()] != null) {
            this.m_taskList[task.getUid()] = null;
            this.m_freeList.push(task.getUid());
        }
    }
}

export { ThreadTaskPool };
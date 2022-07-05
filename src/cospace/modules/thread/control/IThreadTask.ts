/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IThreadTask {

    // 被子类覆盖后便能实现更细节的相关功能
    reset(): void;
    isFinished(): boolean;
    getUid(): number;
    detach(): void;
    /**
     * 必须被覆盖, return true, task finish; return false, task continue...
     * @param data 存放处理结果的数据对象
     * @param flag 表示多线程任务的处理状态, 这里的flag是一个uint型。用4个8位来表示4种标识分类, 最低8位用来表示任务的处理阶段相关的状态
     * @returns 返回这个函数的处理状态，默认返回false
     */
    parseDone(data: unknown, flag: number): boolean;
    // getTaskClass(): number;
    destroy(): void;
}

export { IThreadTask };

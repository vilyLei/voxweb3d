/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { TDRParam } from "./TDRParam";
/**
 * 处理子线程和主线程之、子线程和子线程 这些线程间的数据传输路由
 */
class TaskDataRouter {

    private m_taskclass: number;

    // 这个变量的值将由实现者视具体情况而定，因为这个值为true则表示数据已经准备好了处于可用状态
    protected m_dataEnabled: boolean = false;

    param: TDRParam = null;

    constructor(taskclass: number) {
        this.m_taskclass = taskclass;
    }
    getTaskClass(): number {
        return this.m_taskclass;
    }
    isDataEnabled(): boolean {
        return this.m_dataEnabled;
    }
    /**
     * @returns 返回是否处在传输状态中，如果是，则返回true
     */
    isTransmission(): boolean {
        return this.m_dataEnabled && this.param != null;
    }
    disable(): void {
        this.m_dataEnabled = false;
    }
    setData(data: any): void {
        // 这里不一定是直接赋值，可能要经过处理和转化
    }
    /**
     * 由线程对象调用，以便启动数据处理的相应， 子类覆盖此函数以便实现具体的功能
     */
    acquireTrigger(): void {

    }
    /**
     * 这个过程默认支持异步机制，如果有数据则使用，如果没数据，则进入到等待队列, 需要被子类覆盖之后再使用
     * 这个数据的获取过程分为两类:
     * 纯值访问的方式: 内存操作无影响的可复制数据，则可以保持源数据直接使用。
     * 内存转移的方式: 这个情况下数据要以内存转移的形式传递出去，传递出去之后而没有传回来之前是不能再使用了
     * 具体实现则由子类的具体逻辑来决定
     * @returns 由线程相关过程获取数据对象
     */
    getData(): any {
        // 如果有，就直接返回，如果没有，则将自己加入到等等队列
        throw Error("illegal operation !!!");
        return null;
    }
    /**
     * 具体实现逻辑由子类覆盖
     * @returns 由线程相关过程获取数据对象的transfer对象数组
     */
    getTransfers(): ArrayBuffer[] {
        return null;
    }
}

export { TaskDataRouter };
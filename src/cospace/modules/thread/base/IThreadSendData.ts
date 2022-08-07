type StreamType = ArrayBuffer | Float32Array | Int32Array | Uint16Array | Uint8Array | Int16Array | Int8Array;
interface IThreadSendData {
    /**
     * 多线程任务分类id  和task的 getTaskClass() 函数返回值保持一致
     */
     taskclass: number;
     /**
      * 多线程任务实例id
      */
     srcuid: number;

    /**
     * 会发送到子线程的数据描述对象, for example: {flag : 0, type: 12, name: "First"}
     */
    descriptor: any;

    /**
     * IThreadSendData数据对象在自身队列中的序号
     */
    dataIndex: number;
    
    /**
     * 当前任务命令名
     */
    taskCmd: string;
    /**
     * 直接传递内存句柄所有权的数据流对象数组
     */
    streams: StreamType[];
    /**
     * sendStatus   值为 -1 表示没有加入数据池等待处理
     *              值为 0 表示已经加入数据池正等待处理
     *              值为 1 表示已经发送给worker
     */
    sendStatus: number;

    /**
     * build vaule from ThreadWFST.ts
     * 任务数据在执行过程中的状态(work flow status): 将32位分为4个8位, 分别表示任务执行过程中的四种类别的状态(未知 | 未知 | 未知 | 流转状态)，默认是0x0
     */
    wfst: number;
    /**
     * 按照实际需求构建自己的数据(sendData和transfers等)
     * @param transferEnabled 是否需要内存句柄所有权转移
     */
    buildThis(transferEnabled: boolean): void;
    reset(): void;
}

export {StreamType, IThreadSendData};
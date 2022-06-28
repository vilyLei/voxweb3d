type StreamType = ArrayBuffer | Float32Array | Int32Array | Uint16Array | Uint8Array | Int16Array | Int8Array;
interface IThreadReceiveData<T1 extends any = unknown, T2 extends any = unknown> {
    /**
     * 多线程任务分类id  和task的 getTaskClass() 函数返回值保持一致, 使用者不可更改只能获取
     */
     readonly taskclass: number;
    /**
     * 多线程任务实例id, 使用者不可更改只能获取
     */
     readonly srcuid: number;

    /**
     * 会发送到子线程的数据描述对象, for example: {flag : 0, type: 12, name: "First"}, 使用者不可更改只能获取
     */
     readonly descriptor: T2;

    /**
     * IThreadSendData数据对象在自身队列中的序号, 使用者不可更改只能获取
     */
    readonly dataIndex: number;
    
    /**
     * 当前任务命令名, 使用者不可更改只能获取
     */
     readonly taskCmd: string;
    /**
     * 由系统使用的命令码, 使用者不可更改只能获取
     */
     readonly cmd: number;
    /**
     * 当前子线程的 id 序号, 使用者不可更改只能获取
     */
     readonly threadIndex: number;

    /**
     * 直接传递内存句柄所有权的数据流对象数组, 使用者可更改
     */
    streams: StreamType[];
    /**
     * 存放处理结果的数据, 使用者可更改
     */
    data: T1;
    /**
     * 任务数据在执行过程中的状态(work flow status): 将32位分为4个8位, 分别表示任务执行过程中的四种类别的状态(未知 | 未知 | 未知 | 流转状态)，默认是0x0
     */
     wfst: number;
}

export {IThreadReceiveData};
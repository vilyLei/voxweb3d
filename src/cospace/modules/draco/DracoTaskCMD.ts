class DracoTaskCMD {
    /**
     * 处理数据
     */
    static readonly PARSE: string = "DRACO_PARSE";
    /**
     * 从其他线程获取数据
     */
    static readonly THREAD_ACQUIRE_DATA: string = "DRACO_THREAD_ACQUIRE_DATA";
    /**
     * 向其他线程发送数据
     */
    static readonly THREAD_TRANSMIT_DATA: string = "DRACO_THREAD_TRANSMIT_DATA";
}

export { DracoTaskCMD };
/**
 * 这些定义都是内部使用的，实现任务功能的使用者不必关心，当然也不能修改
 */
class ThreadCMD {
    /**
     * 单个数据处理任务
     */
    static readonly DATA_PARSE: number = 3501;
    /**
     * (3502)多个数据处理任务组成的队列
     */
    static readonly DATA_QUEUE_PARSE: number = 3502;
    /**
     * (3601)
     */
    static readonly THREAD_INIT: number = 3601;
    /**
     * (3621)
     */
    static readonly INIT_COMMON_MODULE: number = 3621;
    /**
     * (3631)线程中的任务程序初始化的时候主动从任务对象获取需要的数据
     */
    static readonly THREAD_ACQUIRE_DATA: number = 3631;
    /**
     * (3632)
     */
    static readonly THREAD_TRANSMIT_DATA: number = 3632;
    /**
     * (3701)
     */
    static readonly INIT_TASK: number = 3701;
    /**
     * (3801)
     */
    static readonly INIT_PARAM: number = 3801;
}

export { ThreadCMD };
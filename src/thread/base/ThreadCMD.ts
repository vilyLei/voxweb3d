/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class ThreadCMD {
    /**
     * 单个数据处理任务
     */
    static readonly DATA_PARSE: number = 3501;
    /**
     * 多个数据处理任务组成的队列
     */
    static readonly DATA_QUEUE_PARSE: number = 3502;
    static readonly THREAD_INIT: number = 3601;
    static readonly INIT_TASK: number = 3701;
    static readonly INIT_PARAM: number = 3801;
    static readonly ECHO_ERROR: number = 3901;
}

export default ThreadCMD;
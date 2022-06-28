/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/**
 * 任务数据的流转状态
 */
class TransStatus {
    /**
     * 子线程中任务执行结束
     */
    static readonly FINISH: number = 11;
    /**
     * 线程间传输
     */
    static readonly TRANSMIT: number = 12;
}

export { TransStatus };
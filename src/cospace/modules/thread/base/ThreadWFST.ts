/**
 * 任务数据在执行过程中的状态(work flow status): 将32位分为4个8位, 分别表示任务执行过程中的四种类别的状态(未知 | 未知 | 未知 | 流转状态)，默认是0x0
 */

/**
 * 流转状态
 */
enum TransST {
    /**
     * 默认值，标识所有操作结束
     */
    None = 0,
    /**
     * 任务正在运行
     */
    Running = 20,
    /**
     * 任务结束
     */
    Finish = 21
}
class ThreadWFST {

    static Build(s0: number, s1: number, s2: number, transStatus: TransST): number {
        return (s0 << 24) + (s1 << 16) + (s2 << 8) + transStatus;
    }
    static ModifyTransStatus(srcWSFT: number, transStatus: TransST): number {
        srcWSFT &= 0xffffff00;
        return srcWSFT + transStatus;
    }
    static GetTransStatus(srcWSFT: number): number {
        srcWSFT &= 0xFF;
        return srcWSFT;
    }
}
export { TransST, ThreadWFST };
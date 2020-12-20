random multi tasks multi thread system contains:
任意多任务多线程子系统包括:

1.auto free async multi threads system
支持完全不受限并行异步多线程

2.condition limited async multi threads system, for example: frame time slice synchronization limited multi threads system
有条件限制的异步多线程, 例如帧时间片内同步的并行多线程执行任务

3.mix compute in main thread and sub thread
主线程和子线程混合运算支持

4.controlled multi steps compute strategy, for stable renderer FPS
受控多步计算策略(例如一个完整的计算，因为计算复杂，整个计算分十帧来逐帧完成， 以便让帧率顺畅)

5.每一类任务，都能独立完成初始化到正常运行的过程，可即插即用
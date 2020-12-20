/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace thread
{
    export namespace base
    {
        export interface IThreadSendData
        {
            // 多线程任务分类id
            taskclass:number;
            // 多线程任务实例id
            srcuid:number;
            // IThreadSendData数据对象在自身队列中的序号
            dataIndex:number;
            // 发送给thread处理的数据对象
            sendData:any;
            // thread task 任务命令名
            taskCmd:string;
            // 记录所有权的引用
            transfers:any[];
            // sendStatus 值为 -1 表示没有加入数据池等待处理
            //            值为 0 表示已经加入数据池正等待处理
            //            值为 1 表示已经发送给worker
            sendStatus:number;
            // 按照实际需求构建自己的数据(sendData和transfers等)
            buildThis(transferEnabled:boolean):void;
            reset():void;
        }
    }
}
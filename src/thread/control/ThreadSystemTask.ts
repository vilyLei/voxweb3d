/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example

import {IThreadSendData} from "../../thread/base/IThreadSendData";
import ThreadTask from "../../thread/control/ThreadTask";

interface IThreadSystemTaskListener {
    parseDone(data:any,flag:number):boolean;
}

class ThreadSystemTask extends ThreadTask
{
    private m_listener: IThreadSystemTaskListener = null;
    private m_classId: number = 0;
    constructor(classId: number)
    {
        super();
        this.m_classId = classId;
    }
    setListener(listener: IThreadSystemTaskListener): void {
        this.m_listener = listener;
    }
    addTaskData(data: IThreadSendData): void {
        this.addData( data );
    }
    increaseParseIndex(): void {
        this.m_parseIndex ++;
    }
    // return true, task finish; return false, task continue...
    parseDone(data:any,flag:number):boolean
    {
        console.log("TestNumberAddTask::parseDone(), data: ",data);
        if(this.m_listener != null) {
            return this.m_listener.parseDone(data, flag);
        }
        return true;
    }
    getWorkerSendDataAt(i:number):IThreadSendData
    {
        return null;
    }
    destroy():void
    {
        this.m_listener = null;
        if(this.getUid() > 0)
        {
            super.destroy();
        }
    }
    
    getTaskClass():number
    {
        return this.m_classId;
    }
}

export {ThreadSystemTask};
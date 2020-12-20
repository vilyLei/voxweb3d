/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IThreadSendDataT from "../../thread/base/IThreadSendData";
import * as IThreadBaseT from "../../thread/base/IThreadBase";
import * as ThrDataPoolT from "../../thread/control/ThrDataPool";
import * as ThreadTaskT from "../../thread/control/ThreadTask";

import IThreadSendData = IThreadSendDataT.thread.base.IThreadSendData;
import IThreadBase = IThreadBaseT.thread.base.IThreadBase;
import ThrDataPool = ThrDataPoolT.thread.control.ThrDataPool;
import ThreadTask = ThreadTaskT.thread.control.ThreadTask;

export namespace thread
{
    export namespace base
    {
        export class ThreadBase implements IThreadBase
        {
            private static s_uid:number = 0;
            private m_uid:number = -1;
            private m_worker:Worker = null;
            private m_initTasks:any[] = [];
            private m_taskfs:any[] = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
            private m_free:boolean = false;
            private m_initBoo:boolean = true;
            constructor()
            {
                this.m_uid = ThreadBase.s_uid++;
            }
            getUid():number
            {
                return this.m_uid;
            }
            isFree():boolean
            {
                return this.m_free;
            }
            private thisSendDataTo():void
            {
                ThrDataPool.SendDataTo(this);
            }
            // send parse data to thread
            sendDataTo(thrData:IThreadSendData):void
            {
                //console.log("sendDataTo...,this.m_free: "+this.m_free,thrData);
                if(this.m_free && this.m_taskfs[thrData.taskclass] > 0)
                {
                    thrData.buildThis(true);
                    thrData.sendData.cmd = "DATA_PARSE";
                    if(thrData.transfers != null)
                    {
                        this.m_worker.postMessage(thrData.sendData,thrData.transfers);
                    }
                    else
                    {
                        this.m_worker.postMessage(thrData.sendData);
                    }
                    thrData.sendStatus = 1;
                }
            }
            //
            initTaskByURL(ns:string,taskclass:number):void
            {
                //console.log("initTask, this.m_initTasks.length: "+this.m_initTasks.length);
                if(taskclass >= 0 && taskclass < this.m_taskfs.length)
                {
                    if(this.m_taskfs[taskclass] < 0)
                    {
                        this.m_taskfs[taskclass] = 0;
                        let task:any = {taskName:ns, taskclass:taskclass, inited:false,type:0};
                        this.m_initTasks.push(task);
                    }
                }
            }
            initTaskByCodeStr(codeStr:string,taskclass:number):void
            {
                //console.log("initTask, this.m_initTasks.length: "+this.m_initTasks.length);
                if(taskclass >= 0 && taskclass < this.m_taskfs.length)
                {
                    if(this.m_taskfs[taskclass] < 0)
                    {
                        this.m_taskfs[taskclass] = 0;
                        let task:any = {srccode:codeStr, taskclass:taskclass, inited:false,type:2};
                        this.m_initTasks.push(task);
                    }
                }
            }
            private updateInitTask():void
            {
                //console.log("this.m_initTasks.length: "+this.m_initTasks.length);
                if(this.m_initTasks.length > 0)
                {
                    this.m_free = false;
                    let task:any = this.m_initTasks.pop();
                    // type 为0 表示task js 文件是外部加载的, 如果为 1 则表示是由运行时字符串构建的任务可执行代码
                    this.m_worker.postMessage({cmd:"INIT_TASK",threadIndex:this.getUid(),param:task});
                }
            }
            private receiveData(data:any):void
            {
                let receiveBoo:boolean = true;
                let task:ThreadTask = ThreadTask.GetTaskByUid(data.srcuid);
                this.m_free = true;
                //console.log("task != null: "+(task != null)+", data.srcuid: "+data.srcuid);
                let finished:boolean = true;
                if(task != null)
                {
                    finished = task.parseDone(data,-1);
                }
                if(finished)
                {
                    
                }
                this.updateInitTask();
                if(this.m_free)
                {
                    this.thisSendDataTo();
                }
            }
            initialize(blob:Blob):void
            {
                if(this.m_initBoo && blob != null && this.m_worker == null)
                {
                    this.m_initBoo = false;
                    let worker:Worker = new Worker(URL.createObjectURL(blob));
                    this.m_worker = worker;
                    let selfT:ThreadBase = this;
                    this.m_worker.onmessage = function(evt:any)
                    {
                        //console.log("Main worker recieve data, event.data: ",evt.data);
                        let data:any = evt.data;
                        //console.log("Main Worker received worker cmd: "+data.cmd);
                        switch(data.cmd)
                        {
                            case "DATA_PARSE":
                                selfT.receiveData(data);
                            break;
                            case "THREAD_INIT":
                                worker.postMessage({cmd:"INIT_PARAM",threadIndex:selfT.getUid()});
                            break;
                            case "INIT_TASK":
                                selfT.m_taskfs[data.taskclass] = 1;
                                selfT.m_free = true;
                                console.log("Main Worker INIT_TASK selfT.m_taskfs: ",selfT.m_taskfs);
                                selfT.updateInitTask();
                                break;
                            case "INIT_PARAM":
                                selfT.m_free = true;
                                console.log("Main worker recieve INIT_PARAM.");
                                //worker.postMessage({cmd:"INIT_TASK",threadIndex:selfT.getUid(),param:{taskName:"static/thread/ThreadAddNum",taskclass:0}});
                                selfT.updateInitTask();
                            break;
                            default:
                            break;
                        }
                    }
                }
            }
        }
    }
}
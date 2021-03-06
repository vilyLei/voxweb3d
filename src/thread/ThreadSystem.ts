/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IThreadSendData from "../thread/base/IThreadSendData";
import RendererDeviece from "../vox/render/RendererDeviece";
import ThreadCore from "../thread/control/Thrcode";
import ThrDataPool from "../thread/control/ThrDataPool";
import ThreadBase from "../thread/base/ThreadBase";

//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;

class ThreadSystem
{
    // allow ThreadSystem initialize yes or no
    private static s_initBoo:boolean = true;
    private static s_maxThreadsTotal:number = 0;
    private static s_thrSupportFlag:number = -1;
    private static s_codeBlob:Blob = null;
    private static s_tasks:any[] = [null,null,null,null,null,null,null,null,null,null,null,null];
    private static s_threads:ThreadBase[] = [];
    private static s_threadsTotal:number = 0;
    private static s_pool:ThrDataPool = new ThrDataPool();
    static Run():void
    {
        if(ThreadSystem.GetThreadEnabled())
        {
            if(ThreadSystem.s_pool.isEnabled())
            {
                let tot:number = 0;
                for(let i:number = 0; i < ThreadSystem.s_threadsTotal; ++i)
                {
                    if(ThreadSystem.s_pool.isEnabled())
                    {
                        if(ThreadSystem.s_threads[i].isFree())
                        {
                            ThreadSystem.s_pool.sendDataTo(ThreadSystem.s_threads[i]);
                        }
                        if(ThreadSystem.s_threads[i].isFree())
                        {
                            ++tot;
                        }
                    }
                }
                if(tot < 1 && ThreadSystem.s_pool.isEnabled())
                {
                    ThreadSystem.CreateThread();
                }
            }
        }
    }
    static AddData(thrData:IThreadSendData):void
    {
        if(thrData != null && thrData.srcuid >= 0)
        {
            ThreadSystem.s_pool.addData(thrData);
        }
    }
    private static GetAFreeThread():ThreadBase
    {
        for(let i:number = 0; i < ThreadSystem.s_threadsTotal; ++i)
        {
            if(ThreadSystem.s_threads[i].isFree())
            {
                return ThreadSystem.s_threads[i];
            }
        }
        return null;
    }
    static GetMaxThreadsTotal():number
    {
        return ThreadSystem.s_maxThreadsTotal;
    }
    // 当前系统是否开启 worker multi threads
    static SetThreadEnabled(boo:boolean):void
    {
        if(ThreadSystem.s_thrSupportFlag > 0)ThreadSystem.s_thrSupportFlag = boo?2:1;
        RendererDeviece.SetThreadEnabled(boo);
    }
    static GetThreadEnabled():boolean
    {
      return RendererDeviece.GetThreadEnabled();
    }
    // runtime support worker multi thrads yes or no
    static IsSupported():boolean
    {
        if(ThreadSystem.s_thrSupportFlag > 0)
        {
            return ThreadSystem.s_thrSupportFlag == 2;
        }
        let boo:boolean = (typeof(Worker)!=="undefined") && (typeof(Blob)!=="undefined");
        ThreadSystem.s_thrSupportFlag = boo?2:1;
        RendererDeviece.SetThreadEnabled(boo);
        return boo;
    }
    private static CreateThread():void
    {
        if(ThreadSystem.s_threadsTotal < ThreadSystem.s_maxThreadsTotal)
        {
            let thread:ThreadBase = new ThreadBase();
            thread.pool = ThreadSystem.s_pool;
            thread.initialize(ThreadSystem.s_codeBlob);
            ThreadSystem.s_threads.push(thread);
            ThreadSystem.s_threadsTotal++;
            
            let task:any;
            for(let i:number = 0,len:number=ThreadSystem.s_tasks.length; i<len;++i)
            {
                task = ThreadSystem.s_tasks[i];
                if(task != null)
                {
                    switch(task.type)
                    {
                        case 0:
                            thread.initTaskByURL(task.taskName,task.taskclass);
                        break;
                        case 2:
                            thread.initTaskByCodeStr(task.srccode,task.taskclass);
                        break;
                        default:
                        break;
                    }
                }
            }
        }
    }
    
    static InitTaskByURL(ns:string,taskclass:number):void
    {
        if(ns != "" && taskclass >= 0 && taskclass < ThreadSystem.s_tasks.length)
        {
            let task:any = ThreadSystem.s_tasks[taskclass];
            if(task == null)
            {
                task = {taskName:ns, taskclass:taskclass,type:0,threads:[]};
                ThreadSystem.s_tasks[taskclass] = task;
                
                for(let i:number = 0; i<ThreadSystem.s_threadsTotal;++i)
                {
                    ThreadSystem.s_threads[i].initTaskByURL(ns,taskclass);
                }
                
            }
        }
    }
    static InitTaskByCodeStr(codestr:string,taskclass:number):void
    {
        if(codestr != "" && taskclass >= 0 && taskclass < ThreadSystem.s_tasks.length)
        {
            let task:any = ThreadSystem.s_tasks[taskclass];
            if(task == null)
            {
                task = {srccode:codestr,type:2, taskclass:taskclass,threads:[]};
                ThreadSystem.s_tasks[taskclass] = task;
                //s_threadsTotal
                for(let i:number = 0; i<ThreadSystem.s_threadsTotal;++i)
                {
                    ThreadSystem.s_threads[i].initTaskByCodeStr(codestr,taskclass);
                }
                
            }
        }
    }
    /**
     * @param maxThreadsTotal 最大子线程数量
     */
    static Initsialize(maxThreadsTotal:number):void
    {
        if(ThreadSystem.s_initBoo)
        {
            if(ThreadSystem.GetThreadEnabled() && ThreadSystem.IsSupported())
            {
                //console.log("ThreadCore.CodeStr: \n",ThreadCore.CodeStr);
                
                let bolb:Blob = new Blob([ThreadCore.CodeStr]);
                
                if(maxThreadsTotal < 1)maxThreadsTotal = 1;
                ThreadSystem.s_codeBlob = bolb;
                ThreadSystem.s_maxThreadsTotal = maxThreadsTotal;
                ThreadSystem.CreateThread();
            }
            ThreadSystem.s_initBoo = false;
        }
    }
}
export default ThreadSystem;
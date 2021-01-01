/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace thread
{
    export namespace control
    {
        export class ThreadCore
        {
            // worker task manage code
            static CodeStr:string =
`
let scriptDir = "";
let ENV_IS_WORKER = typeof importScripts === 'function';
if (ENV_IS_WORKER)
{
    // in worker
    scriptDir = self.location.href;
}
var baseUrl = scriptDir.slice(0,scriptDir.lastIndexOf("/")+1);
var k = baseUrl.indexOf("http://");
if(k < 0)
{
    k = baseUrl.indexOf("https://");
}
if(k < 0) k = 0;
baseUrl = baseUrl.slice(k);
self.TaskSlot = [null,null,null,null,null,null,null,null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null, null,null,null,null,null,null,null,null];
self.TaskSTList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let taskSlot = self.TaskSlot;
let taskSTList = self.TaskSTList;
function ThreadCore()
{
  let m_initBoo = true;
  let m_threadIndex = 0;
  this.isWorker = typeof(postMessage) !== "undefined";
  
  let selfT = this;
  
  let DATA_PARSE = 3501;
  let THREAD_INIT = 3601;
  let INIT_TASK = 3701;
  let INIT_PARAM = 3801;
  this.receiveData = function(evt)
  {
    /////////////////////////////////////////////////// receive data from Main Worker ///////////////////////////////////
    //console.log("receive main data in worker,data: ",evt.data);
    let data = evt.data;
    switch(data.cmd)
    {
        case DATA_PARSE:
            // taskclass
            data.threadIndex = m_threadIndex;
            let ins = taskSlot[data.taskclass];
            if(ins)
            {
                ins.receiveData(data);
            }
        break;
        case INIT_TASK:
            let param =  data.param;
            console.log("worker INIT_TASK param.type: ",param.type);
            switch(param.type)
            {
                case 0:
                    if(taskSTList[param.taskclass] < 1)
                    {
                        taskSTList[param.taskclass] = 1;
                        let js_url = baseUrl + param.taskName + ".js";
                        console.log("worker js_url: "+js_url);
                        importScripts(js_url);
                    }
                break;
                case 1:
                    if(taskSTList[param.taskclass] < 1)
                    {
                        taskSTList[param.taskclass] = 1;
                        // 代码直接在worker构造的blob中了,直接需要构建相关算法实例
                    }
                break;
                case 2:
                    if(taskSTList[param.taskclass] < 1)
                    {
                        taskSTList[param.taskclass] = 1;
                        // 代码直接在字符串中, 并且是后续
                        eval(param.srccode);
                    }
                break;
                default:
                break;
            }
            if(data.type < 1)
            {
                if(taskSTList[param.taskclass] < 1)
                {
                    taskSTList[param.taskclass] = 1;
                    let js_url = baseUrl + param.taskName + ".js";
                    console.log("worker js_url: "+js_url);
                    importScripts(js_url);
                }
            }
            else
            {
                if(taskSTList[param.taskclass] < 1)
                {
                    taskSTList[param.taskclass] = 1;
                    // 代码直接在字符串中了
                    //let js_url = baseUrl + param.taskName + ".js";
                    //console.log("worker js_url: "+js_url);
                    //importScripts(js_url);
                }
            }
            break;
        case INIT_PARAM:
            if(m_initBoo)
            {
                m_threadIndex = data.threadIndex;
                
                console.log("thread init data.threadIndex: "+m_threadIndex);
                m_initBoo = false;
                postMessage({cmd:INIT_PARAM,threadIndex:m_threadIndex});
            }
        break;
        default:
        break;
    }
  }
  this.initialize = function()
  {
    console.log("###worker ThreadCore::initialize()...");
    //console.log("self.TaskSlot: ",self.TaskSlot);
    if(typeof(postMessage) !== "undefined")
    {
        self.addEventListener(
            "message", 
            selfT.receiveData,
            false
        );
        let THREAD_INIT = 3601;
        postMessage({cmd:THREAD_INIT});
    }
  }
}
console.log("worker run begin ...");
console.log("scriptDir: "+scriptDir);
console.log("baseUrl: "+baseUrl);
let thrCore = new ThreadCore();
thrCore.initialize();
`;
        }
    }
}
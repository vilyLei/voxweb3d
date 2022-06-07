/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class ThreadCore
{
    // worker task manage code
    static readonly CodeStr:string =
`
let scriptDir = "";
let ENV_IS_WORKER = typeof importScripts === 'function';
if (ENV_IS_WORKER) {
    scriptDir = self.location.href;
}
var baseUrl = scriptDir.slice(0, scriptDir.lastIndexOf("/") + 1);
var k = baseUrl.indexOf("http://");
if (k < 0) {
    k = baseUrl.indexOf("https://");
}
if (k < 0) k = 0;
baseUrl = baseUrl.slice(k);
self.__$TaskSlot = new Array(512);
self.__$TaskSlot.fill(null);
self.TaskSTList = new Array(512);
self.TaskSTList.fill(0);
let taskSlot = self.__$TaskSlot;
let taskSTList = self.TaskSTList;

function initializeExternModule(ext_module) {
    if(ext_module != null && ext_module.getTaskClass != undefined) {
        self.__$TaskSlot[ext_module.getTaskClass()] = ext_module;
        const INIT_TASK = 3701;
        postMessage({cmd:INIT_TASK,taskclass:ext_module.getTaskClass()});
    }
}
const ERROR_Task_Already_exists = 1001;
function echoError(errorCode) {
    const ECHO_ERROR = 3901;
    postMessage({cmd:ECHO_ERROR,errorCode:errorCode});
}

function ThreadCore() {
    let m_initBoo = true;
    let m_threadIndex = 0;
    this.isWorker = typeof (postMessage) !== "undefined";

    let selfT = this;

    const DATA_PARSE = 3501;
    const THREAD_INIT = 3601;
    const INIT_TASK = 3701;
    const INIT_PARAM = 3801;
    this.receiveData = function (evt) {
        /////////////////////////////////////////////////// receive data from Main Worker ///////////////////////////////////
        //console.log("receive main data in worker,data: ",evt.data);
        let data = evt.data;
        switch (data.cmd) {
            case DATA_PARSE:
                // taskclass
                data.threadIndex = m_threadIndex;
                let ins = taskSlot[data.taskclass];
                if (ins) {
                    ins.receiveData(data);
                }
                break;
            case INIT_TASK:
                let param = data.param;
                //console.log("worker INIT_TASK param.type: ", param.type);
                switch (param.type) {
                    case 0:
                        if (taskSTList[param.taskclass] < 1) {
                            taskSTList[param.taskclass] = 1;
                            let js_url = param.taskName;
                            let urlEnabled = param.moduleName != undefined && param.moduleName != "";
                            if(!urlEnabled) {
                                let si = param.taskName.lastIndexOf(".");
                                if(si > 0) {
                                    param.taskName = param.taskName.slice(0,si);
                                }
                                js_url = baseUrl + param.taskName + ".js";
                            }
                            else
                            {
                                if(js_url.indexOf(".js") < 1) {
                                    js_url = baseUrl + js_url + ".js";
                                }
                                else
                                {
                                    js_url = baseUrl + js_url;
                                }
                            }
                            //console.log("importScripts worker js_url: " + js_url);
                            importScripts(js_url);
                        }
                        break;
                    case 1:
                        if (taskSTList[param.taskclass] < 1) {
                            taskSTList[param.taskclass] = 1;
                            // build code from block
                        }
                        break;
                    case 2:
                        if (taskSTList[param.taskclass] < 1) {
                            taskSTList[param.taskclass] = 1;
                            // build code from string
                            eval(param.srccode);
                            if (param.moduleName != undefined && param.moduleName != "") {
                                //console.log("build worker task ins,param.moduleName: ",param.moduleName);
                                var mins = "workerIns_" + param.moduleName;
                                var tmcodeStr = "var " + mins + " = new " + param.moduleName + "();";
                                tmcodeStr += "\\ninitializeExternModule(" + mins + ");";
                                eval(tmcodeStr);
                                //  let blob = new Blob([tmcodeStr]);
                                //  importScripts(URL.createObjectURL(blob));
                            }
                        }else if(taskSTList[param.taskclass] == 1) {
                            echoError( ERROR_Task_Already_exists );
                        }
                        break;
                    default:
                        break;
                }
                if (data.type < 1) {
                    if (taskSTList[param.taskclass] < 1) {
                        taskSTList[param.taskclass] = 1;
                        let js_url = baseUrl + param.taskName + ".js";
                        console.log("worker js_url: " + js_url);
                        importScripts(js_url);
                    }
                }
                else {
                    if (taskSTList[param.taskclass] < 1) {
                        taskSTList[param.taskclass] = 1;
                    }
                }
                break;
            case INIT_PARAM:
                if (m_initBoo) {
                    m_threadIndex = data.threadIndex;

                    //  console.log("thread init data.threadIndex: " + m_threadIndex);
                    m_initBoo = false;
                    postMessage({ cmd: INIT_PARAM, threadIndex: m_threadIndex });
                }
                break;
            default:
                break;
        }
    }
    this.initialize = function () {
        //console.log("self.__$TaskSlot: ",self.__$TaskSlot);
        if (typeof (postMessage) !== "undefined") {
            self.addEventListener(
                "message",
                selfT.receiveData,
                false
            );
            const THREAD_INIT = 3601;
            postMessage({ cmd: THREAD_INIT });
        }
    }
}
//  console.log("worker run begin ...");
//  console.log("scriptDir: " + scriptDir);
//  console.log("baseUrl: " + baseUrl);
let thrCore = new ThreadCore();
thrCore.initialize();
`;
}
export default ThreadCore;
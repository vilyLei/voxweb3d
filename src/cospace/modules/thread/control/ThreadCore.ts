/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ThreadCMD } from "../base/ThreadCMD";
import { ThreadCodeSrcType } from "./ThreadCodeSrcType";
import { importJSModuleCode, DependenceGraph } from "./DependenceGraph";
import { SubThreadModule } from "./SubThreadModule";

let TCMD = ThreadCMD;
let TCST = ThreadCodeSrcType;

declare var postMessage: (obj: unknown, transfers?: ArrayBuffer[]) => void;

let taskSlot: SubThreadModule[] = [];
let stList: number[] = [];
class TaskHost {
    static slot: SubThreadModule[];
    static stList: number[];
    static Init(tot: number): void {
        TaskHost.slot = new Array(tot);
        TaskHost.stList = new Array(tot);
        TaskHost.slot.fill(null);
        TaskHost.stList.fill(0);
        taskSlot = TaskHost.slot;
        stList = TaskHost.stList;
    }
}




let dpGraph: DependenceGraph = new DependenceGraph();
function getCurrTaskClass(): number {
    return dpGraph.currTaskClass;
}
function setCurrTaskClass(taskClass: number): void {
    dpGraph.currTaskClass = taskClass;
}
function resetCurrTaskClass(): void {
    dpGraph.currTaskClass = -1;
}
function postMessageToThread(obj: unknown, transfers?: ArrayBuffer[]): void {
    postMessage(obj, transfers);
}

function registerDependency(dependencyNSList: string[]): void {

    console.log("ThreadCore::registerDependency(), dependencyNSList: ", dependencyNSList);

    dpGraph.registerDependency(dependencyNSList);
}
function useDependency(tm: SubThreadModule): void {

    console.log("ThreadCore::useDependency(), tm: ", tm);
    dpGraph.useDependency(tm);
}

function bindExternModule(tm: SubThreadModule): void {
    if (tm != null) {
		const id = dpGraph.currTaskClass;
        if(id >= 0) {
        	TaskHost.slot[id] = tm;
		}else {
            throw Error("bind extern module error task class value!!!!");
		}
    }
}
function initializeExternModule(tm: SubThreadModule): void {
    if (tm != null) {
        console.log("initializeExternModule apply dpGraph.currTaskClass: ", dpGraph.currTaskClass);
		const id = dpGraph.currTaskClass;
        if(id >= 0) {
            // TaskHost.slot[tm.getTaskClass()] = tm;
            // postMessage({ cmd: TCMD.INIT_TASK, taskclass: tm.getTaskClass() });
            TaskHost.slot[id] = tm;
            postMessage({ cmd: TCMD.INIT_TASK, taskclass: id });
        }else {
            throw Error("initialize extern module error task class value!!!!");
        }
        dpGraph.currTaskClass = -1;
    }
}
function acquireData(moduleInstance: SubThreadModule, pdata: unknown, ptaskCmd: string) {

    bindExternModule(moduleInstance);
	console.log("acquireData dpGraph.currTaskClass: ", dpGraph.currTaskClass);
    let sendData: unknown = {
        cmd: TCMD.THREAD_ACQUIRE_DATA,
        taskCmd: ptaskCmd,
        taskclass: dpGraph.currTaskClass,
        data: pdata,
    };
    postMessage(sendData);
}

function transmitData(moduleInstance: SubThreadModule, pdata: unknown, ptaskCmd: string, transfers: ArrayBuffer[]): void {
    let sendData = {
        cmd: TCMD.THREAD_TRANSMIT_DATA,
        taskCmd: ptaskCmd,
        taskclass: moduleInstance.getTaskClass(),
        data: pdata,
    };
    if (transfers != undefined && transfers != null) {
        postMessage(sendData, transfers);
    } else {
        postMessage(sendData);
    }
}

/**
 * 作为多线程主程序核心代码
 */
class ThreadCore {

    private m_inited = true;
    private m_threadIndex = 0;

    constructor() {
    }

    receiveData(evt: any): void {
        let ins: any = null;
        /////////////////////////////////////////////////// receive data from Main Worker ///////////////////////////////////
        let data = evt.data;
        // console.log("Sub Worker(" + data.threadIndex + ") receive main data in worker, cmd: " + data.cmd + ", data: ", evt.data);
        switch (data.cmd) {
            case TCMD.DATA_PARSE:
                data.threadIndex = this.m_threadIndex;
                ins = taskSlot[data.taskclass];
                // console.log("Sub Thread(), data.taskclass: ",data.taskclass, ins);
                if (ins != null) {
                    ins.receiveData(data);
                }
                break;
            case TCMD.THREAD_ACQUIRE_DATA:
                ins = taskSlot[data.taskclass];
                //console.log("Sub Worker("+data.threadIndex+") receive main data in worker,THREAD_ACQUIRE_DATA, data.taskclass: ", data.taskclass, ins);
                if (ins != null) {
                    ins.receiveData(data);
                }
                break;
            case TCMD.INIT_TASK:
                let param = data.param;
				let taskClass: number = data.info.taskClass;
                // console.log("Sub Worker(" + data.threadIndex + ") INIT_TASK param.type: ", param.type,"taskClass: ",taskClass);
                // console.log("Sub Worker(" + data.threadIndex + ") INIT_TASK data: ", data);
                switch (param.type) {
                    case TCST.JS_FILE_CODE:
                        if (stList[taskClass] < 1) {
                            stList[taskClass] = 1;
                            dpGraph.loadProgramByModuleUrl(param.src, data.info);
                        }
                        break;

                    case TCST.DEPENDENCY:
                        if (stList[taskClass] < 1) {
                            stList[taskClass] = 1;
                            dpGraph.loadProgramByDependency(param.src, data.info);
                        }
                        break;
                    case TCST.BLOB_CODE:
                        if (stList[taskClass] < 1) {
                            stList[taskClass] = 1;
                            // build code from block
                        }
                        break;
                    case TCST.STRING_CODE:
                        if (stList[taskClass] < 1) {
                            stList[taskClass] = 1;
                            // build code from string
                            // console.log("param.srccode: ",param.srccode);
                            // console.log("param.src: ",param.src);
                            dpGraph.currTaskClass = data.info.taskClass;
                            if (param.moduleName != undefined && param.moduleName != "") {
                                var mins = "workerIns_" + param.moduleName;
                                var tmcodeStr = "var " + mins + " = new " + param.moduleName + "();";
                                tmcodeStr += "\ninitializeExternModule(" + mins + ");";
                                // console.log("tmcodeStr: ",tmcodeStr);
                                param.src += "\n" + tmcodeStr;
                                eval(param.src);
                            }
                            else {
                                eval(param.src);
                            }
                        }
                        break;
                    default:
                        break;
                }

                if (data.type < 1) {
                    if (stList[taskClass] < 1) {
                        stList[taskClass] = 1;
                        dpGraph.loadProgramByModuleUrl(param.taskName);
                    }
                } else {
                    if (stList[taskClass] < 1) {
                        stList[taskClass] = 1;
                    }
                }
                break;
            case TCMD.INIT_PARAM:
                if (this.m_inited) {
                    this.m_threadIndex = data.threadIndex;
                    this.m_inited = false;
                    console.log("TCMD.INIT_PARAM, data.total: ", data.total);
                    TaskHost.Init(data.total);
                    dpGraph.graphData.initFromJsonString(data.graphJsonStr);
                    postMessage({ cmd: TCMD.INIT_PARAM, threadIndex: this.m_threadIndex });
                }
                break;
            case TCMD.INIT_COMMON_MODULE:
                //   console.log("#### data.type: ",data.type);
                switch (data.type) {
                    case TCST.JS_FILE_CODE:
                        let modules = data.modules;
                        for (let i = 0; i < modules.length; ++i) {
                            dpGraph.loadProgramByModuleUrl(modules[i]);
                        }
                        break;
                    case TCST.STRING_CODE:
                        let blob = new Blob([data.src]);
                        dpGraph.currTaskClass = data.info.taskClass;
                        importJSModuleCode(URL.createObjectURL(blob), data.info.keyuns);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    };
    initialize(): void {
        if (typeof postMessage !== "undefined") {
            console.log("Sub Worker Main::initialize()...");
            self.addEventListener("message", this.receiveData.bind(this), false);
            postMessage({ cmd: TCMD.THREAD_INIT, threadIndex: -1 });
        }
    };
}
let ins = new ThreadCore();
ins.initialize();
export { getCurrTaskClass, setCurrTaskClass, resetCurrTaskClass, postMessageToThread, registerDependency, useDependency, initializeExternModule, acquireData, transmitData, ThreadCore };

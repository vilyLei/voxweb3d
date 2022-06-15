import { ThreadCMD } from "../base/ThreadCMD";
import { ThreadCodeSrcType } from "./ThreadCodeSrcType";
import { DependenceGraph } from "./DependenceGraph";
import { SubThreadModule } from "./SubThreadModule";

let TCMD = ThreadCMD;
let TCST = ThreadCodeSrcType;

declare var __$tstl: number;
declare var importScripts: (js_file_url: string) => void;
declare var postMessage: (obj: unknown, transfers?: ArrayBuffer[]) => void;

class TaskHost {
  static readonly slot: SubThreadModule[] = new Array(__$tstl);
  static readonly stList: number[] = new Array(__$tstl);
}

let taskSlot = TaskHost.slot;
let stList = TaskHost.stList;

taskSlot.fill(null);
stList.fill(0);


let dpGraph: DependenceGraph = new DependenceGraph();

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
  if (tm != null && tm.getTaskClass != undefined) {
    TaskHost.slot[tm.getTaskClass()] = tm;
  }
}
function initializeExternModule(tm: SubThreadModule): void {
  if (tm != null && tm.getTaskClass != undefined) {
    TaskHost.slot[tm.getTaskClass()] = tm;
    postMessage({ cmd: TCMD.INIT_TASK, taskclass: tm.getTaskClass() });
  }
}
function acquireData(moduleInstance: SubThreadModule, pdata: unknown, ptaskCmd: string) {

  bindExternModule(moduleInstance);

  let sendData: unknown = {
    cmd: TCMD.THREAD_ACQUIRE_DATA,
    taskCmd: ptaskCmd,
    taskclass: moduleInstance.getTaskClass(),
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
class Main {

  private m_inited = true;
  private m_threadIndex = 0;

  constructor() {
  }

  receiveData(evt: any): void {
    let ins: any = null;
    /////////////////////////////////////////////////// receive data from Main Worker ///////////////////////////////////
    let data = evt.data;
    console.log("Sub Worker(" + data.threadIndex + ") receive main data in worker, cmd: " + data.cmd + ", data: ", evt.data);
    switch (data.cmd) {
      case TCMD.DATA_PARSE:
        data.threadIndex = this.m_threadIndex;
        ins = taskSlot[data.taskclass];
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
        console.log("Sub Worker(" + data.threadIndex + ") INIT_TASK param.type: ", param.type);
        switch (param.type) {
          case TCST.JS_FILE_CODE:
            if (stList[param.taskclass] < 1) {
              stList[param.taskclass] = 1;
              dpGraph.loadProgramByModuleUrl(param.src);
            }
            break;

          case TCST.DEPENDENCY:
            if (stList[param.taskclass] < 1) {
              stList[param.taskclass] = 1;
              dpGraph.loadProgramByDependency(param.src);
            }
            break;
          case TCST.BLOB_CODE:
            if (stList[param.taskclass] < 1) {
              stList[param.taskclass] = 1;
              // build code from block
            }
            break;
          case TCST.STRING_CODE:
            if (stList[param.taskclass] < 1) {
              stList[param.taskclass] = 1;
              // build code from string
              // console.log("param.srccode: ",param.srccode);
              eval(param.src);
              if (param.moduleName != undefined && param.moduleName != "") {
                var mins = "workerIns_" + param.moduleName;
                var tmcodeStr = "var " + mins + " = new " + param.moduleName + "();";
                tmcodeStr += "\ninitializeExternModule(" + mins + ");";
                eval(tmcodeStr);
              }
            }
            break;
          default:
            break;
        }

        if (data.type < 1) {
          if (stList[param.taskclass] < 1) {
            stList[param.taskclass] = 1;
            dpGraph.loadProgramByModuleUrl(param.taskName);
          }
        } else {
          if (stList[param.taskclass] < 1) {
            stList[param.taskclass] = 1;
          }
        }
        break;
      case TCMD.INIT_PARAM:
        if (this.m_inited) {
          this.m_threadIndex = data.threadIndex;
          this.m_inited = false;
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
            importScripts(URL.createObjectURL(blob));
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
let ins = new Main();
ins.initialize();
export { postMessageToThread, registerDependency, useDependency, initializeExternModule, acquireData, transmitData, Main };

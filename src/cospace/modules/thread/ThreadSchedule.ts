/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ThreadConfigure } from "./base/ThreadConfigure";
import { ThrDataPool } from "../thread/control/ThrDataPool";
import { StreamType, IThreadSendData } from "../thread/base/IThreadSendData";
import { ThreadSendData } from "../thread/base/ThreadSendData";
import { ThreadBase } from "../thread/base/ThreadBase";
import { TaskDescriptor } from "../thread/base/TaskDescriptor";
import { ThreadCodeSrcType } from "./control/ThreadCodeSrcType";
import { ThreadTask } from "./control/ThreadTask";
import { TaskDataRouter } from "./base/TaskDataRouter";
import { TDRManager } from "./base/TDRManager";
/**
 * 多线程任务调度器
 */
class ThreadSchedule {
  // allow ThreadSchedule initialize yes or no
  private m_initBoo: boolean = true;
  private m_maxThreadsTotal: number = 0;
  private m_thrSupportFlag: number = -1;
  private m_codeBlob: Blob = null;
  private m_commonModuleUrls: string[] = [];
  private m_tasks: TaskDescriptor[];
  private m_threads: ThreadBase[] = [];
  private m_threadsTotal: number = 0;
  private m_threadEnabled: boolean = true;
  // TODO(lyl): 下面两行暂时这么写
  private m_thrIdexSDList: IThreadSendData[] = [];
  private m_thrIndexList: number[] = [];
  private m_codeStrList: string[] = [];
  private m_pool: ThrDataPool = new ThrDataPool();
  private m_tdrManager: TDRManager;
  /**
   * 线程中子模块间依赖关系的json描述
   */
  private m_graphJsonStr: string = "";
  private m_autoSendData: boolean = false;

  constructor() {
    this.m_tasks = new Array(ThreadConfigure.MAX_TASKS_TOTAL);
    this.m_tasks.fill(null);
    this.m_tdrManager = new TDRManager(ThreadConfigure.MAX_TASKS_TOTAL);
  }
  setParams(autoSendData: boolean): void {
    this.m_autoSendData = autoSendData;
  }
  hasRouterByTaskClass(taskclass: number): boolean {
    return this.m_tdrManager.hasRouterByTaskClass(taskclass);
  }
  setTaskDataRouter(taskDataRouter: TaskDataRouter): void {
    this.m_tdrManager.setRouter( taskDataRouter );
  }
  /**
   * 任务实例和当前线程系统建立关联
   * @param task 任务实例
   * @param taskDataRouter 用户为线程中数据路由
   * @param threadIndex 指定线程序号, 默认值为1表示未指定
   */
  bindTask(task: ThreadTask, threadIndex: number = -1): void {
    if (task != null) {
      let localPool: ThrDataPool = null;
      if (threadIndex >= 0 && threadIndex < this.m_maxThreadsTotal) {
        for (;;) {
          if (threadIndex >= this.m_threadsTotal) {
            this.createThread();
          } else {
            break;
          }
        }
        localPool = this.m_threads[threadIndex].localDataPool;
      }
      task.setDataPool(this.m_pool, localPool);
      let d = task.dependency;
      if (d != null) {
        if(d.isJSFile()) {
          this.initTaskByURL(d.threadCodeFileURL, task.getTaskClass());
        }else if(d.isDependency()) {
          this.initTaskByDependency(d.dependencyUniqueName, task.getTaskClass(), d.moduleName);
        }else if(d.isCodeString()) {
          this.initTaskByCodeStr(d.threadCodeString, task.getTaskClass(), d.moduleName);
        }
      }
    }
  }

  sendDataToThreadAt(i: number, sendData: IThreadSendData): void {
    if (i >= 0 && i < this.m_maxThreadsTotal) {
      if (i >= this.m_threadsTotal) {
        for (;;) {
          if (i >= this.m_threadsTotal) {
            this.createThread();
          } else {
            break;
          }
        }
      }
      if (sendData != null && sendData.sendStatus < 0) {
        if (this.m_threads[i].isFree()) {
          sendData.sendStatus = 0;
          this.m_threads[i].sendDataTo(sendData);
        } else {
          this.m_threads[i].localDataPool.addData(sendData);
        }
      }
    }else {
      this.m_thrIdexSDList.push(sendData);
      this.m_thrIndexList.push(i);
    }

  }
  /**
   * @returns 返回是否在队列中还有待处理的数据
   */
  hasTaskData(): boolean {
    return this.m_pool.isEnabled();
  }
  getThrDataPool(): ThrDataPool {
    return this.m_pool;
  }
  /**
   * 间隔一定的时间，循环执行
   */
  run(): void {
    if (this.getThreadEnabled()) {

      this.m_tdrManager.run();

      //console.log("this.m_pool.isEnabled(): ",this.m_pool.isEnabled());
      if (this.m_pool.isEnabled()) {
        let tot = 0;
        for (let i: number = 0; i < this.m_threadsTotal; ++i) {
          if (this.m_pool.isEnabled()) {
            if (this.m_threads[i].isFree()) {
              this.m_pool.sendDataTo(this.m_threads[i]);
            }
            if (this.m_threads[i].isFree()) {
              ++tot;
            }
          }
        }
        if (tot < 1 && this.m_pool.isEnabled()) {
          this.createThread();
        }
      } else {
        for (let i: number = 0; i < this.m_threadsTotal; ++i) {
          this.m_threads[i].sendPoolDataToThread();
        }
      }
    }
  }

  /**
   * 通过参数, 添加发送给子线程的数据
   * @param taskCmd 处理当前数据的任务命令名字符串
   * @param streams 用于内存所有权转换的数据流数组, 例如 Float32Array 数组, 默认值是null
   * @param descriptor 会发送到子线程的用于当前数据处理的数据描述对象, for example: {flag : 0, type: 12, name: "First"}, 默认值是 null
   */
  addDataWithParam(
    taskCmd: string,
    streams: StreamType[] = null,
    descriptor: any = null
  ): void {
    let sd = ThreadSendData.Create();
    sd.taskCmd = taskCmd;
    sd.streams = streams;
    sd.descriptor = descriptor;
    this.addData(sd);
  }
  /**
   * 将任务实例重点额数据对象添加到线程系统任务池子中
   * @param thrData
   */
  addData(thrData: IThreadSendData): void {
    if (thrData != null && thrData.srcuid >= 0) {
      this.m_pool.addData(thrData);
    }
  }
  private getAFreeThread(): ThreadBase {
    for (let i: number = 0; i < this.m_threadsTotal; ++i) {
      if (this.m_threads[i].isFree()) {
        return this.m_threads[i];
      }
    }
    return null;
  }
  getThreadsTotal(): number {
    return this.m_threadsTotal;
  }
  getMaxThreadsTotal(): number {
    return this.m_maxThreadsTotal;
  }
  // 当前系统是否开启 worker multi threads
  setThreadEnabled(boo: boolean): void {
    if (this.m_thrSupportFlag > 0) this.m_thrSupportFlag = boo ? 2 : 1;
    this.m_threadEnabled = boo;
  }
  getThreadEnabled(): boolean {
    return this.m_threadEnabled;
  }
  // runtime support worker multi thrads yes or no
  isSupported(): boolean {
    if (this.m_thrSupportFlag > 0) {
      return this.m_thrSupportFlag == 2;
    }
    let boo: boolean =
      typeof Worker !== "undefined" && typeof Blob !== "undefined";
    this.m_thrSupportFlag = boo ? 2 : 1;
    this.m_threadEnabled = boo;
    return boo;
  }
  private createThread(): void {
    if (this.m_threadsTotal < this.m_maxThreadsTotal) {

      let thread: ThreadBase = new ThreadBase( this.m_tdrManager, this.m_graphJsonStr );
      thread.autoSendData = this.m_autoSendData;
      thread.globalDataPool = this.m_pool;
      thread.initialize(this.m_codeBlob);
      this.m_threads.push(thread);
      console.log("create Thread("+ this.m_threadsTotal +")");

      this.m_threadsTotal++;
      this.m_tdrManager.setThreads( this.m_threads );

      //let task: TaskDescriptor;
      for (let i: number = 0, len: number = this.m_tasks.length; i < len; ++i) {
        //task = this.m_tasks[i];
        thread.initModuleByTaskDescriptor(this.m_tasks[i]);
      }
      thread.initModules(this.m_commonModuleUrls);
      for (let i: number = 0; i < this.m_codeStrList.length; ++i) {
        thread.initModuleByCodeString(this.m_codeStrList[i]);
      }
      if(this.m_threadsTotal >= this.m_maxThreadsTotal) {
        this.m_commonModuleUrls = [];
        this.m_codeStrList = [];
      }

      let sdList = this.m_thrIdexSDList.slice(0);
      let indexList = this.m_thrIndexList.slice(0);
      this.m_thrIdexSDList = [];
      this.m_thrIndexList = [];
      for (let i: number = 0; i < sdList.length; ++i) {
        this.sendDataToThreadAt(indexList[i], sdList[i]);
      }
    }
  }

  /**
   * 通过外部js文件源码初始化在线程中处理指定任务的程序代码
   * @param jsFileUrl 子线程中执行的源码的js文件的相对url
   * @param taskclass 任务类型整型表示，例如: 0, 这和子线程中执行的源码中的 getTaskClass()成员函数 返回值一致
   * @param taskclass 子线程中执行的源码中的对象类名
   */
  initTaskByURL(jsFileUrl: string, taskclass: number, moduleName: string = ""): void {
    if (jsFileUrl != "" && taskclass >= 0 && taskclass < this.m_tasks.length) {
      let task: TaskDescriptor = this.m_tasks[taskclass];

      if (task == null) {
        task = new TaskDescriptor(taskclass, ThreadCodeSrcType.JS_FILE_CODE, jsFileUrl, moduleName);
        this.m_tasks[taskclass] = task;
        this.initModuleByTaskDescriptor(task);
      }
    }
  }
  /**
   * 通过唯一依赖名初始化在线程中处理指定任务的程序代码
   * @param jsFileUrl 子线程中执行的源码的js文件的相对url
   * @param taskclass 任务类型整型表示，例如: 0, 这和子线程中执行的源码中的 getTaskClass()成员函数 返回值一致
   * @param taskclass 子线程中执行的源码中的对象类名
   */
  initTaskByDependency(dependencyUniqueName: string, taskclass: number, moduleName: string = ""): void {
    if (dependencyUniqueName != "" && taskclass >= 0 && taskclass < this.m_tasks.length) {
      let task: TaskDescriptor = this.m_tasks[taskclass];

      if (task == null) {
        task = new TaskDescriptor(taskclass, ThreadCodeSrcType.DEPENDENCY, dependencyUniqueName, moduleName);
        this.m_tasks[taskclass] = task;
        this.initModuleByTaskDescriptor(task);
      }
    }
  }
  /**
   * 通过字符串源码初始化在线程中处理指定任务的程序代码
   * @param codestr 子线程中执行的源码字符串
   * @param taskclass 任务类型整型表示，例如: 0, 这和子线程中执行的源码中的 getTaskClass()成员函数 返回值一致
   * @param moduleName 子线程中执行的源码中的对象类名
   */
  initTaskByCodeStr(codestr: string, taskclass: number, moduleName: string): void {
    if (codestr != "" && taskclass >= 0 && taskclass < this.m_tasks.length) {
      let task: TaskDescriptor = this.m_tasks[taskclass];

      if (task == null) {
        task = new TaskDescriptor(taskclass, ThreadCodeSrcType.STRING_CODE, codestr, moduleName);
        this.m_tasks[taskclass] = task;        
        this.initModuleByTaskDescriptor(task);
      }
    }
  }
  private initModuleByTaskDescriptor(task: TaskDescriptor): void {

    for (let i: number = 0; i < this.m_threadsTotal; ++i) {
      this.m_threads[i].initModuleByTaskDescriptor( task );
    }
  }
  /**
   * 通过js文件url数组来初始化子线程中的若干共有基础功能模块
   * @param moduleUrls 模块的js代码url数组
   */
  initModules(moduleUrls: string[]): void {
    if (moduleUrls != null && moduleUrls.length > 0) {
      for (let i = 0; i < moduleUrls.length; ++i) {
        if (moduleUrls[i] == "") throw Error("moduleUrls[" + i + '] == ""');
        this.m_commonModuleUrls.push(moduleUrls[i]);
      }
      for (let i: number = 0; i < this.m_threadsTotal; ++i) {
        this.m_threads[i].initModules(moduleUrls);
      }
    }
  }
  /**
   * 通过代码字符串形式来初始化子线程中的共有基础功能模块
   * @param codeStr js代码的字符串形式
   */
  initModuleByCodeString(codeStr: string): void {
    if(codeStr.length > 8) {
      if(this.m_threadsTotal < this.m_maxThreadsTotal) {
        this.m_codeStrList.push(codeStr);
      }
      for (let i: number = 0; i < this.m_threadsTotal; ++i) {
        this.m_threads[i].initModuleByCodeString( codeStr );
      }
    }
  }
  destroy(): void {
    if(this.m_tdrManager != null) {
      for (let i: number = 0; i < this.m_threadsTotal; ++i) {
        this.m_threads[i].destroy();
      }
      this.m_threads = [];
      this.m_tdrManager.destroy();
      this.m_tdrManager = null;
      this.m_threadsTotal = 0;
    }

  }

  /**
   * 设置线程中子模块间依赖关系的json描述字符串
   * @param graphJsonStr json描述字符串
   */
  setDependencyGraphJsonString(graphJsonStr: string): void {
    this.m_graphJsonStr = graphJsonStr;
  }

  /**
   * 初始化线程系统的子线程
   * @param maxThreadsTotal 最大子线程数量
   * @param coreCodeUrl 线程初始核心代码文件url
   */
  initialize(maxThreadsTotal: number, coreCodeUrl: string, baseCodeStr: string = ""): void {
    if (this.m_initBoo) {
      if (this.getThreadEnabled() && this.isSupported()) {
        if (coreCodeUrl == "") {
          throw Error('coreCodeUrl == "" !!!');
        }
        coreCodeUrl = this.getUrl(coreCodeUrl);
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open("GET", coreCodeUrl, true);

        request.onload = () => {
          if (request.status <= 206) {
            let defCode: string = "let __$tstl="+ThreadConfigure.MAX_TASKS_TOTAL+";";
            let bolb: Blob = new Blob([defCode + baseCodeStr + request.responseText]);
            this.initThread(maxThreadsTotal, bolb);
          } else {
            console.error(
              "load thread core code file url error: ",
              coreCodeUrl
            );
          }
        };
        request.onerror = (e) => {
          console.error("load thread core code file url error: ", coreCodeUrl);
        };

        request.send(null);
      }
      this.m_initBoo = false;
    }
  }
  private initThread(maxThreadsTotal: number, bolb: Blob): void {
    if (maxThreadsTotal < 1) maxThreadsTotal = 1;
    this.m_codeBlob = bolb;
    this.m_maxThreadsTotal = maxThreadsTotal;
    this.createThread();
  }
  private getUrl(url: string): string {
    let k = url.indexOf("http://");
    if (k < 0) k = url.indexOf("https://");
    if (k >= 0) return url;
    let scriptDir = window.location.href;
    let baseUrl = scriptDir.slice(0, scriptDir.lastIndexOf("/") + 1);
    url = baseUrl + url;
    return url;
  }
}

export { ThreadSchedule };
import { TDRParam } from "./TDRParam";
import { TaskDataRouter } from "./TaskDataRouter";
import { IThreadBase } from "../base/IThreadBase";

/**
 * TaskDataRouter 管理器
 */
class TDRManager {
  private m_taskClassTotal: number;
  private m_routers: TaskDataRouter[];
  private m_rfs: number[];
  private m_waitParams: TDRParam[] = [];
  private m_enabledParams: TDRParam[] = [];
  private m_threads: IThreadBase[] = null;

  constructor(taskClassTotal: number) {
    this.m_taskClassTotal = taskClassTotal > 1024 ? taskClassTotal : 1024;
    this.m_routers = new Array(taskClassTotal);
    this.m_routers.fill(null);
    this.m_rfs = new Array(taskClassTotal);
    this.m_rfs.fill(0);
  }
  setThreads(threads: IThreadBase[]): void {
    this.m_threads = threads;
  }
  hasRouterByTaskClass(taskclass: number): boolean {
    if (taskclass >= 0 && taskclass < this.m_taskClassTotal) {
      return this.m_routers[taskclass] != null;
    }
    return false;
  }
  getRouterByTaskClass(taskclass: number): TaskDataRouter {
    if (taskclass >= 0 && taskclass < this.m_taskClassTotal) {
      return this.m_routers[taskclass];
    } else {
      console.log("illegal taskclass value: " + taskclass + " !!!");
    }
  }
  setRouter(router: TaskDataRouter): void {
    let taskclass = router.getTaskClass();
    if (taskclass >= 0 && taskclass < this.m_taskClassTotal) {
      if(this.m_routers[taskclass] == null) {
          this.m_routers[taskclass] = router;
      }
    } else {
      throw Error("illegal object !!!");
    }
  }

  waitRouterByParam(param: TDRParam): void {
    if (param.status != 0) {
      throw Error("illegal param !!!");
    }
    let taskclass = param.taskclass;
    if (taskclass >= 0 && taskclass < this.m_taskClassTotal) {
      this.m_waitParams.push(param);
      param.status = 1;
    } else {
      throw Error("illegal object !!!");
    }
  }
  run(): void {
    let len = this.m_waitParams.length;
    if (len > 0) {
      let params = this.m_waitParams;
      let router = null;
      let param = null;
      for (let i: number = 0; i < len; ++i) {
        param = params[i];
        router = this.m_routers[param.taskclass];
        if (router != null && router.isDataEnabled() && !router.isTransmission()) {
          router.acquireTrigger();
          router.param = param;
          this.m_enabledParams.push(param);
          param.status = 2;
          params.splice(i, 1);
          --i;
          --len;
        }
      }
      len = this.m_enabledParams.length;
      if(len > 0) {
        params = this.m_enabledParams;
        for (let i: number = 0; i < len; ++i) {
          this.m_threads[params[i].threadIndex].sendRouterDataTo( this.getRouterByTaskClass(params[i].taskclass) );
        }
        this.m_enabledParams = [];
      }
    }
  }
  getEnabledParams(): TDRParam[] {
    if (this.m_enabledParams.length > 0) {
      let list = this.m_enabledParams;
      this.m_enabledParams = [];
      return list;
    }
    return null;
  }
  destroy(): void {
    this.m_taskClassTotal = 0;
    this.m_routers.length = 0;
  }
}
export { TDRManager };

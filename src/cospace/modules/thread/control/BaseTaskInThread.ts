/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { SubThreadModule } from "../control/SubThreadModule";
import { IThreadReceiveData } from "../base/IThreadReceiveData";
import { IThreadCore } from "./IThreadCore";

declare var ThreadCore: IThreadCore;
/**
 * 作为多线程 worker 内部执行的任务处理功能的基类
 */
class BaseTaskInThread implements SubThreadModule{
  constructor(enabled: boolean = true) {
    if(enabled) {
      ThreadCore.initializeExternModule(this);
    }
  }
  receiveData(data: IThreadReceiveData): void {
  }
  protected postMessageToThread(data: unknown, transfers: ArrayBuffer[] = null): void {

    if (transfers != null) {
      ThreadCore.postMessageToThread(data);
    } else {
      ThreadCore.postMessageToThread(data, transfers);
    }
  }

  getTaskClass(): number {
    throw Error("the taskClass value is illegal !!!");
    return 0;
  }
  
  dependencyFinish(): void {
  }
  getUniqueName(): string {
    throw Error("the uniqueName value is illegal !!!");
    return "";
  }
}
export { BaseTaskInThread };

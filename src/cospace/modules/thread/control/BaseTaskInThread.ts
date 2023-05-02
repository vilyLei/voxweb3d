/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { SubThreadModule } from "../control/SubThreadModule";
import { IThreadReceiveData } from "../base/IThreadReceiveData";
import { IThreadCore } from "./IThreadCore";

declare var ThreadCore: IThreadCore;
/**
 * 作为多线程 thread 内部执行的任务处理功能的基类
 */
class BaseTaskInThread implements SubThreadModule {
    private m_sysEnabled: boolean = false;
    constructor(enabled: boolean = true) {
        this.m_sysEnabled = typeof ThreadCore !== "undefined";
        if (enabled) {
            if (this.m_sysEnabled) {
                ThreadCore.initializeExternModule(this);
            } else {
                throw Error("Can not find ThreadCore module !!!");
            }
        }
    }
    receiveData(data: IThreadReceiveData): void {
    }
    protected postMessageToThread(data: unknown, transfers: ArrayBuffer[] = null): void {
        if (this.m_sysEnabled) {
            if (transfers != null) {
                ThreadCore.postMessageToThread(data);
            } else {
                ThreadCore.postMessageToThread(data, transfers);
            }
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

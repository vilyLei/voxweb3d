/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRunnable from "../../vox/base/IRunnable";
export default class RunnableObject implements IRunnable {
    private m_runFlag: number = -1;
    protected m_running: boolean = true;
    constructor() { }

    setRunFlag(flag: number): void { this.m_runFlag = flag; }
    getRunFlag(): number { return this.m_runFlag; }
    isRunning(): boolean { return this.m_running; }
    isStopped(): boolean { return !this.m_running }
    run(): void { }
}
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ThreadTask from "../../thread/control/ThreadTask";
import ThreadSystem from "../../thread/ThreadSystem";

export interface DracoTaskListener {
    dracoParse(module: any, index: number, total: number): void;
    dracoParseFinish(modules: any[], total: number): void;
}
class DracoTask extends ThreadTask {
    private m_enabled: boolean = true;
    private static s_inited: boolean = false;
    private static s_taskTotal: number = 1;
    private static s_initedTaskTotal: number = 1;
    private m_listener: DracoTaskListener = null;
    private m_modules: any[] = [];
    constructor(taskTotal: number) {
        super();
        DracoTask.s_taskTotal = taskTotal;
    }
    reset(): void {
        super.reset();
        this.m_modules = [];
        this.m_segIndex = 0;
    }
    setListener(l: DracoTaskListener): void {
        this.m_listener = l;
    }

    private initCurrTask(wasmBin: ArrayBuffer, index: number = 0): void {
        this.m_enabled = false;
        ThreadSystem.SendDataToWorkerAt(index, this.createSendDataWithParam("DRACO_INIT", [new Uint8Array(wasmBin)]));
    }

    initTask(wasmBin: ArrayBuffer): void {
        if (wasmBin != null && !DracoTask.s_inited && this.m_enabled) {
            this.m_wasmBin = wasmBin;
            this.initCurrTask(wasmBin);
        }
    }
    private parseData(bufData: ArrayBuffer, beginI: number, endI: number): void {
        if (bufData != null && DracoTask.s_inited) {
            this.m_enabled = false;
            this.addDataWithParam("DRACO_PARSE", [new Uint8Array(bufData)], {beginI: beginI, endI: endI, status: 0});
        }
    }
    
    private m_srcBuf: ArrayBuffer = null;
    private m_segs: number[] = null;
    private m_segIndex: number = 0;

    private parseNextSeg(): void {
        if (DracoTask.s_inited && this.m_enabled && this.m_segs != null && this.m_segIndex < this.m_segs.length) {
            for (let i: number = 0; i < DracoTask.s_taskTotal; i++) {
                if (this.m_segIndex < this.m_segs.length) {
                    let buf: ArrayBuffer = this.m_srcBuf.slice(this.m_segs[this.m_segIndex], this.m_segs[this.m_segIndex + 1]);
                    this.parseData(buf, 0, buf.byteLength);
                    this.m_segIndex += 2;
                }
                else {
                    break;
                }
            }
        }
    }
    parseSrcData(bufData: ArrayBuffer, segs: number[]): void {
        if (bufData != null && segs != null) {
            this.m_segIndex = 0;
            this.m_srcBuf = bufData;
            this.m_segs = segs;
            this.setParseTotal(segs.length / 2);
            this.parseNextSeg();
        }
    }
    private m_wasmBin: ArrayBuffer;
    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {

        // console.log("DracoTask::parseDone(), data.taskCmd: ", data.taskCmd);

        switch (data.taskCmd) {
            case "DRACO_INIT":
                this.m_enabled = true;
                DracoTask.s_inited = true;
                this.m_wasmBin = data.streams[0].buffer;
                if (DracoTask.s_initedTaskTotal >= DracoTask.s_taskTotal) {
                    if (this.m_segIndex == 0 && this.m_segs != null && this.m_segs.length > 0) {
                        this.parseNextSeg();
                    }
                }
                else {
                    this.initCurrTask(this.m_wasmBin, DracoTask.s_initedTaskTotal);
                }
                DracoTask.s_initedTaskTotal++;
                break;
            case "DRACO_PARSE":
                this.m_enabled = true;
                this.m_parseIndex++;
                this.m_modules.push(data.data.module);
                if (this.m_listener != null) {
                    //console.log("this.isFinished(): ", this.isFinished());
                    if (this.isFinished()) {
                        this.m_listener.dracoParseFinish(this.m_modules, this.getParseTotal());
                    }
                    else {
                        this.parseNextSeg();
                        this.m_listener.dracoParse(data.data.module, this.getParsedIndex(), this.getParseTotal());
                    }
                }
                break;
            default:
                break;
        }
        return true;
    }

    getTaskClass(): number {
        return 0;
    }
}

export default DracoTask;
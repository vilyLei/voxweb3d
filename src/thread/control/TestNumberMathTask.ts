/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example
import ThreadTask from "../../thread/control/ThreadTask";

class TestNumberMathTask extends ThreadTask {
    constructor() {
        super();
    }
    addNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            let sd = this.createSendData();
            sd.taskCmd = "MATH_ADD";
            sd.streams = [typeData];
            this.addData(sd);
        }
    }
    subNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            let sd = this.createSendData();
            sd.taskCmd = "MATH_SUB";
            sd.streams = [typeData];
            this.addData(sd);
        }
    }
    divNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            let sd = this.createSendData();
            sd.taskCmd = "MATH_DIV";
            sd.streams = [typeData];
            this.addData(sd);
        }
    }
    mulNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            let sd = this.createSendData();
            sd.taskCmd = "MATH_MUL";
            sd.streams = [typeData];
            this.addData(sd);
        }
    }

    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {

        this.m_parseIndex++;
        console.log("TestNumberMathTask::parseDone(), data: ", data,"this.m_parseIndex: " + this.m_parseIndex + "," + this.m_parseTotal);
        if (this.m_parseIndex == this.m_parseTotal) {
            console.log("TestNumberMathTask::parseDone() finish.");
        }
        return true;
    }
    getTaskClass(): number {
        return 2;
    }
}

export default TestNumberMathTask;
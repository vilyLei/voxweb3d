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
            this.addDataWithParam("MATH_ADD", [typeData]);
        }
    }
    subNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            this.addDataWithParam("MATH_SUB", [typeData]);
        }
    }
    divNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            this.addDataWithParam("MATH_DIV", [typeData]);
        }
    }
    mulNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            this.addDataWithParam("MATH_MUL", [typeData]);
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
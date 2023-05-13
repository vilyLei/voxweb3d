/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example
import ThreadTask from "../../thread/control/ThreadTask";

class TestNumberMultTask extends ThreadTask {
    constructor() {
        super();
        this.threadCodeURL = "static/thread/ThreadMultNum";
    }
    clacNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            this.addDataWithParam("MULT_NUMBER", [typeData]);
        }
    }

    parseDone(data: any, flag: number): boolean {
        console.log("TestNumberAddTask::parseDone(), data: ", data);
        return true;
    }
    getTaskClass(): number {
        return 1;
    }
}

export default TestNumberMultTask;
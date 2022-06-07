/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import ThreadTask from "../../thread/control/ThreadTask";

class TestNumberAddTask extends ThreadTask {
    constructor() {
        super();
        this.threadCodeURL = "static/thread/ThreadAddNum";
    }
    clacNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            this.addDataWithParam("ADD_NUMBER", [typeData]);
        }
    }
    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {
        console.log("TestNumberAddTask::parseDone(), data: ", data);
        return true;
    }

    getTaskClass(): number {
        return 0;
    }
}

export default TestNumberAddTask;
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// ThreadTask example
import ThreadTask from "../../thread/control/ThreadTask";

class TestNumberMultTask extends ThreadTask {
    constructor() {
        super();
    }
    clacNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            let sd = this.createSendData();
            sd.taskCmd = "MULT_NUMBER";
            sd.streams = [typeData];
            this.addData(sd);
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
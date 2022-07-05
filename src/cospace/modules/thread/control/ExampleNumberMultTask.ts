import { ITaskReceiveData } from "../base/ITaskReceiveData";
import { ThreadTask } from "../../thread/control/ThreadTask";
import { TaskJSFileDependency } from "./TaskDependency";

class ExampleNumberMultTask extends ThreadTask {
    constructor() {
        super();
        this.dependency = new TaskJSFileDependency("static/cospace/thread/TaskMultNum.js");
    }
    clacNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            console.log("ExampleNumberMultTask::clacNumberList(), data: ", typeData);
            this.addDataWithParam("MULT_NUMBER", [typeData]);
        }
    }

    parseDone(data: ITaskReceiveData<number>, flag: number): boolean {
        console.log("ExampleNumberMultTask::parseDone(), data: ", data);
        return true;
    }
    // getTaskClass(): number {
    //     return 1;
    // }
}

export default ExampleNumberMultTask;

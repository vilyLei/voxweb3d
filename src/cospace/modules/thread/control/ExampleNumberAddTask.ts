import { ITaskReceiveData } from "../base/ITaskReceiveData";
import { ThreadTask } from "../../thread/control/ThreadTask";
import { TaskJSFileDependency } from "./TaskDependency";

class ExampleNumberAddTask extends ThreadTask {
    constructor() {
        super();
        this.dependency = new TaskJSFileDependency("static/cospace/thread/TaskAddNum.js");
    }
    clacNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            this.addDataWithParam("ADD_NUMBER", [typeData]);
        }
    }
    // return true, task finish; return false, task continue...
    parseDone(data: ITaskReceiveData<number>, flag: number): boolean {
        console.log("ExampleNumberAddTask::parseDone(), data.data: ", data.data);
        return true;
    }
    getTaskClass(): number {
        return 0;
    }
}

export default ExampleNumberAddTask;

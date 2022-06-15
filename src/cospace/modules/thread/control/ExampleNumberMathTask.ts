import { ITaskReceiveData } from "../base/ITaskReceiveData";
import { ThreadTask } from "../../thread/control/ThreadTask";
import { TaskJSFileDependency } from "./TaskDependency";

class ExampleNumberMathTask extends ThreadTask {
    constructor() {
        super();
        this.dependency = new TaskJSFileDependency("static/thread/ThreadMathNum");
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
    parseDone(data: ITaskReceiveData<number>, flag: number): boolean {

        this.m_parseIndex++;
        console.log("ExampleNumberMathTask::parseDone(), data: ", data,"this.m_parseIndex: " + this.m_parseIndex + "," + this.m_parseTotal);
        if (this.m_parseIndex == this.m_parseTotal) {
            console.log("ExampleNumberMathTask::parseDone() finish.");
        }
        return true;
    }
    getTaskClass(): number {
        return 2;
    }
}

export default ExampleNumberMathTask;
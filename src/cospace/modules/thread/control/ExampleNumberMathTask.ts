import { ITaskReceiveData } from "../base/ITaskReceiveData";
import { ThreadTask } from "../../thread/control/ThreadTask";
import { TaskJSFileDependency } from "./TaskDependency";

class ExampleNumberMathTask extends ThreadTask {
    constructor() {
        super();
        this.dependency = new TaskJSFileDependency("static/cospace/thread/TaskMathNum.js");
    }
    addNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            console.log("ExampleNumberMathTask::addNumberList(), data: ", typeData);
            this.addDataWithParam("MATH_ADD", [typeData]);
        }
    }
    subNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            console.log("ExampleNumberMathTask::subNumberList(), data: ", typeData);
            this.addDataWithParam("MATH_SUB", [typeData]);
        }
    }
    divNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            console.log("ExampleNumberMathTask::divNumberList(), data: ", typeData);
            this.addDataWithParam("MATH_DIV", [typeData]);
        }
    }
    mulNumberList(typeData: Float32Array): void {
        if (typeData != null) {
            console.log("ExampleNumberMathTask::mulNumberList(), data: ", typeData);
            this.addDataWithParam("MATH_MUL", [typeData]);
        }
    }

    // return true, task finish; return false, task continue...
    parseDone(data: ITaskReceiveData<number>, flag: number): boolean {

        this.m_parseIndex++;
        console.log("ExampleNumberMathTask::parseDone(), data: ", data,"this.m_parseIndex: " + this.m_parseIndex + "," + this.m_parseTotal);
        if (this.m_parseIndex == this.m_parseTotal) {
            console.log("ExampleNumberMathTask::parse done() finish.");
        }
        return true;
    }
    // getTaskClass(): number {
    //     return 2;
    // }
}

export default ExampleNumberMathTask;

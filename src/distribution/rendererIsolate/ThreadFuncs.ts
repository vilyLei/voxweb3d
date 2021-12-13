
import ThreadSystem from "../../thread/ThreadSystem";
import {StreamType, IThreadSendData} from "../../thread/base/IThreadSendData";
import {ThreadSystemTask} from "../../thread/control/ThreadSystemTask";


var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];

VoxCore["ThreadSystem"] = ThreadSystem;
VoxCore["ThreadSystemTask"] = ThreadSystemTask;

class ThreadFuncs {

    constructor() { }

    initialize(pmodule: any): void {
        console.log("ThreadFuncs::initialize(),initializeThread......");
    }

    initializeThread(threadsTotal: number,  codeStr: string = ""): void {
        if(threadsTotal < 1) threadsTotal = 1;
        else if(threadsTotal > 6) threadsTotal = 6;
        ThreadSystem.Initialize( threadsTotal, codeStr );
    }
    initTaskByURL(url: string, classId: number): void {
        ThreadSystem.InitTaskByURL(url, classId);
    }
    initTaskByCodeStr(url: string, classId: number, moudleClassName: string): void {
        ThreadSystem.InitTaskByCodeStr(url, classId, moudleClassName);
    }
    /**
     * @returns 返回是否在队列中还有待处理的数据
     */
    hasTaskData(): boolean {
        return ThreadSystem.HasData();
    }
    addTaskData(thrData: IThreadSendData): void {
        ThreadSystem.AddData(thrData);
    }
    sendDataToWorkerAt(i: number, sendData: IThreadSendData): void {
        ThreadSystem.SendDataToWorkerAt(i, sendData);
    }

    createThreadSystemTask(classId: number): ThreadSystemTask {
        return new ThreadSystemTask(classId);
    }
    run(): void {
        ThreadSystem.Run();
    }
    getModuleName():string {
        return "threadFuncs";
    }
    getModuleClassName():string {
        return "threadFuncs";
    }
    getRuntimeType():string {
        return "system_running";
    }
}

export {ThreadFuncs};
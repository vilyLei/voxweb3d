import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import ExampleNumberAddTask from "../modules/thread/control/ExampleNumberAddTask";
/**
 * thread(worker) 用法示例
 */
export class DemoThread {
    constructor() { }
    private m_threadSchedule: ThreadSchedule = new ThreadSchedule();
    private m_numberAddTask: ExampleNumberAddTask = new ExampleNumberAddTask();
    // 线程中的代码模块可以通过下面这样的字符串初始化，如果不是必须不建议这么做
    private m_mathAddWorkerCode: string =
        `
function ThreadAddNum()
{
    console.log("ThreadAddNum instance init run ... from code str");

    let m_dataIndex = 0;
    let m_srcuid = 0;
    this.threadIndex = 0;
    let selfT = this;
    this.receiveData = function(data)
    {
        m_srcuid = data.srcuid;
        m_dataIndex = data.dataIndex;
        console.log("ThreadAddNum::receiveData(),data: ",data);
        let fs32 = data.streams[0];
        let vdata = 0;
        for(let i = 0; i < fs32.length; ++i)
        {
            vdata += fs32[i];
        }
        let sendData =
        {
            cmd:data.cmd,
            taskCmd: data.taskCmd,
            threadIndex:selfT.threadIndex,
            taskclass:selfT.getTaskClass(),
            srcuid:m_srcuid,
            dataIndex:m_dataIndex,
            data:vdata
        };
        postMessage(sendData);
    }
    this.getTaskClass = function()
    {
        return 0;
    }
}
`;

    initialize(): void {
        console.log("DemoThread::initialize()...");
        // 建立多任务调度器
        this.m_threadSchedule.initialize(1, "static/cospace/core/code/ThreadCore.umd.js");
        // 初始化线程中的公用代码模块, 加载这两个代码模块只是为了测试
        this.m_threadSchedule.initModules([
            "static/cospace/thread/mathLib.js",
            "static/cospace/thread/sortLib.js"
        ]);


        // 注意: m_mathAddWorkerCode 代码中描述的 getTaskClass() 返回值 要和 ExampleNumberAddTask 中的 getTaskClass() 返回值 要相等
        // 可以明确指定直接从字符串初始化线程中的任务程序，当然也可以不这么用
        // this.m_threadSchedule.initTaskByCodeStr(this.m_mathAddWorkerCode,   0, "ThreadAddNum");
        // 可以明确指定从外部js文件初始化线程中的任务程序，当然也可以不这么用
        // this.m_threadSchedule.initTaskByURL("static/thread/ThreadAddNum", 0);

        // 绑定当前任务到多线程调度器
        this.m_threadSchedule.bindTask(this.m_numberAddTask);

        this.useTask();
        this.update();
        document.onmousedown = (evt: any): void => {
            // console.log("mouse down().");
            this.mouseDown(evt);
        }
    }
    private useTask(): void {
        let stream: Float32Array = new Float32Array([10, 11, 12, 13]);
        console.log("math add input :", stream);
        this.showCorectResult(stream);
        // 发送一份任务处理数据，一份数据一个子线程处理一次
        this.m_numberAddTask.clacNumberList(stream);
    }
    private showCorectResult(stream: Float32Array): void {
        let value: number = 0;
        for (let i = 0; i < stream.length; ++i) {
            value += stream[i];
        }
        console.log("corect result :", value);
    }
    private mouseDown(evt: any): void {
        console.log("mouse down evt: ", evt);

        let stream: Float32Array = new Float32Array((Math.round(Math.random() * 6 + 4)));
        for (let i = 0; i < stream.length; ++i) {
            stream[i] = Math.round(Math.random() * 60 - 30);
        }
        console.log("math add input :", stream);
        this.showCorectResult(stream);
        this.m_numberAddTask.clacNumberList(stream);
    }
    private m_timeoutId: any = -1;
    /**
     * 定时调度
     */
    private update(): void {
        this.m_threadSchedule.run();
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 25 fps
    }
    run(): void {
    }
}

export default DemoThread;

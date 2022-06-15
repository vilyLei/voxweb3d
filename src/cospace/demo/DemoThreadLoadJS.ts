import{IThreadSendData} from "../modules/thread/base/IThreadSendData";
import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import ExampleNumberAddTask from "../modules/thread/control/ExampleNumberAddTask";
import ExampleNumberMultTask from "../modules/thread/control/ExampleNumberMultTask";
import ExampleNumberMathTask from "../modules/thread/control/ExampleNumberMathTask";
/**
 * thread(worker) 用法示例
 */
export class DemoThreadLoadJS
{
    constructor(){}
    private m_threadSchedule: ThreadSchedule = new ThreadSchedule();
    private m_numberAddTask: ExampleNumberAddTask = new ExampleNumberAddTask();
    private m_numberMultTask: ExampleNumberMultTask = new ExampleNumberMultTask();
    private m_numberMathTask: ExampleNumberMathTask = new ExampleNumberMathTask();
    private m_flag: number = 0;
    
    initialize():void
    {
        console.log("DemoThreadLoadJS::initialize()...");

        this.m_threadSchedule.initModules(["static/thread/mathLib.js"]);
        this.m_threadSchedule.initialize(3, "cospace/core/code/ThreadCore.umd.min.js");

        this.m_threadSchedule.bindTask(this.m_numberAddTask);
        this.m_threadSchedule.bindTask(this.m_numberMultTask);
        this.m_threadSchedule.bindTask(this.m_numberMathTask);

        this.useTask();
        this.update();

        document.onmousedown = (evt: any): void => {
            // console.log("mouse down().");
            this.mouseDown(evt);
        }
    }
    private useTask():void
    {
        let param:Float32Array = new Float32Array([10,11,12,13]);
        console.log("math add input :",param);
        this.m_numberAddTask.clacNumberList(param);
    }
    
    private useMathTask(): void {
        let total: number = 5;
        this.m_numberMathTask.reset();
        this.m_numberMathTask.setParseTotal(total);
        let sd: IThreadSendData = null;
        for (let i: number = 0; i < total; ++i) {
            let f: number = Math.round(Math.random() * 1000) % 4;
            switch (f) {
                case 0:
                    this.m_numberMathTask.addNumberList(new Float32Array([10, 12, 21, 22]));
                    break;
                case 1:
                    this.m_numberMathTask.subNumberList(new Float32Array([10, 12, 21, 22]));
                    break;
                case 2:
                    this.m_numberMathTask.divNumberList(new Float32Array([10, 12, 21, 22]));
                    break;
                case 3:
                    this.m_numberMathTask.mulNumberList(new Float32Array([10, 12, 21, 22]));
                    break;
                default:
                    break;
            }
            this.testTask2();
        }
    }
    private testTask2(): void {
        let t: number = this.m_flag % 3;
        this.m_numberAddTask.clacNumberList(new Float32Array([10, 12, 21, 22]));
        this.m_numberAddTask.clacNumberList(new Float32Array([-10, -12, -21, -22]));
        //t = 0;
        switch (t) {
            case 0:
                console.log("testTask::NumberAddTask");
                this.m_numberAddTask.clacNumberList(new Float32Array([10, 12, 21, 22]));
                break;
            case 1:
                console.log("testTask::NumberMultTask");
                this.m_numberMultTask.clacNumberList(new Float32Array([10, 12, 21, 22]));
                break;
            case 2:
                break;
            default:
                break;

        }
        this.m_flag++;
    }
    private testTask(): void {
        this.m_flag = Math.round(Math.random() * 100);
        let t: number = this.m_flag % 3;
        this.m_numberAddTask.clacNumberList(new Float32Array([10, 12, 21, 22]));
        this.m_numberAddTask.clacNumberList(new Float32Array([-10, -12, -21, -22]));
        //t = 11;
        switch (t) {
            case 0:
                console.log("testTask::NumberAddTask");
                this.m_numberAddTask.clacNumberList(new Float32Array([10, 12, 21, 22]));
                break;
            case 1:
                console.log("testTask::NumberMultTask");
                this.m_numberMultTask.clacNumberList(new Float32Array([10, 12, 21, 22]));
                break;
            case 2:
                this.useMathTask();
                break;
            default:
                break;

        }
        this.m_flag++;
    }
    private mouseDown(evt: any): void {
        console.log("mouse down evt: ", evt);
        this.testTask();
    }
    private m_timeoutId:any = -1;
    /**
     * 定时调度
     */
    private update():void
    {
        this.m_threadSchedule.run();
        if(this.m_timeoutId > -1)
        {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this),100);// 25 fps
    }
    run():void
    {
    }
}

export default DemoThreadLoadJS;
import { ThreadSchedule } from "../../thread/ThreadSchedule";
import ExampleNumberAddTask from "../../thread/control/ExampleNumberAddTask";
/**
 * thread(worker) 用法示例
 */
export class DemoThread
{
    constructor(){}
    private m_threadSchedule: ThreadSchedule = new ThreadSchedule();
    initialize():void
    {
        // this.m_threadSchedule.initialize(1, "cospace/core/threadCode.thrjs");
        this.m_threadSchedule.initialize(1, "cospace/core/code/ThreadCore.umd.js");
        this.m_threadSchedule.bindTask(this.m_numberAddTask);
        this.useTask();
        this.update();
    }
    private m_numberAddTask:ExampleNumberAddTask = new ExampleNumberAddTask();
    private useTask():void
    {
        let param:Float32Array = new Float32Array([10,11,12,13]);
        console.log("math add input :",param);
        this.m_numberAddTask.clacNumberList(param);   
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
        this.m_timeoutId = setTimeout(this.update.bind(this),40);// 25 fps
    }
    run():void
    {
    }
}

export default DemoThread;
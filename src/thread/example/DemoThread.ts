import ThreadSystem from "../../thread/ThreadSystem";
import TestNumberAddTask from "../../thread/control/TestNumberAddTask";
/**
 * thread(worker) 用法示例
 */
export class DemoThread
{
    constructor(){}
    // thread code example(demonstrate: 通过后续添加的代码字符串来扩充worker中的功能示例)
    private m_mathAddWorkerCode:string = 
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
        let fs32 = data.numberData;
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

    self.TaskSlot[this.getTaskClass()] = this;
    let INIT_TASK = 3701;
    postMessage({cmd:INIT_TASK,taskclass:this.getTaskClass()});
}
let workerIns_ThreadAddNum = new ThreadAddNum();
`;

    initialize():void
    {
        // 注意: m_mathAddWorkerCode 代码中描述的 getTaskClass() 返回值 要和 TestNumberAddTask 中的 getTaskClass() 返回值 要相等
        ThreadSystem.InitTaskByCodeStr(this.m_mathAddWorkerCode,0);
        ThreadSystem.Initsialize(1);
        this.useTask();
        this.update();
    }
    private m_numberAddTask:TestNumberAddTask = new TestNumberAddTask();
    private useTask():void
    {
        let param:Float32Array = new Float32Array([10,11,12,13]);
        console.log("math add input :",param);
        ThreadSystem.AddData(this.m_numberAddTask.clacNumberList(param));   
    }
    private m_timeoutId:any = -1;
    /**
     * 定时运行 ThreadSystem
     */
    private update():void
    {
        ThreadSystem.Run();
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
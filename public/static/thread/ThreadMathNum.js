/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// thread code example, for parsing a special thread task data(equal getTaskClass() value)

function ThreadMathNum()
{
    console.log("ThreadMathNum instance init run ...");
    
    let m_dataIndex = 0;
    let m_srcuid = 0;
    this.threadIndex = 0;
    let selfT = this;
    
    this.receiveData = function(data)
    {
        m_srcuid = data.srcuid;
        m_dataIndex = data.dataIndex;
        console.log("ThreadMathNum::receiveData(),data.taskCmd: ",data.taskCmd);
        let fs32 = data.numberData;
        let vdata = this.mathCalc(fs32, data.taskCmd);
        let sendData = 
        {
            cmd:data.cmd,
            taskCmd: data.taskCmd,
            threadIndex:selfT.threadIndex,
            taskclass:selfT.getTaskClass(),
            srcuid:m_srcuid,
            dataIndex:m_dataIndex,
            vdata:vdata
        };
        postMessage(sendData);
    }
    this.mathCalc = function(fs32,taskCmd)
    {
        let vdata = fs32[0];
        let len = fs32.length;
        let i = 1;
        switch(taskCmd)
        {
            case "MATH_ADD":
                for(i = 0; i < len; ++i)
                {
                    vdata += fs32[i];
                }
            break;
            case "MATH_SUB":
                for(i = 0; i < len; ++i)
                {
                    vdata -= fs32[i];
                }
            break;
            case "MATH_DIV":
                for(i = 0; i < len; ++i)
                {
                    vdata /= fs32[i];
                }
            break;
            case "MATH_MUL":
                for(i = 0; i < len; ++i)
                {
                    vdata *= fs32[i];
                }
            break;
            default:
            break;
        }
        return vdata;
    }
    this.getTaskClass = function()
    {
        return 2;
    }

    // 如果是在worker中运行，则执行如下代码
    self.initializeExternModule(this);
}
let workerIns_ThreadMathNum = new ThreadMathNum();
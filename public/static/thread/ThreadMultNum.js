/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// thread code example, for parsing a special thread task data(equal getTaskClass() value)

function ThreadMultNum()
{
    console.log("ThreadMultNum instance init run ...");
    
    let m_dataIndex = 0;
    let m_srcuid = 0;
    this.threadIndex = 0;
    let selfT = this;
    this.receiveData = function(data)
    {
        m_srcuid = data.srcuid;
        m_dataIndex = data.dataIndex;
        //  console.log("ThreadMultNum::receiveData(),data: ",data);
        //  postMessage({cmd:"DATA_PARSE",threadIndex:selfT.threadIndex,taskclass:selfT.getTaskClass(),srcuid:m_srcuid,dataIndex:m_dataIndex});
        console.log("ThreadMultNum::receiveData(),data: ",data);
        let fs32 = data.numberData;
        let vdata = 1;
        for(let i = 0; i < fs32.length; ++i)
        {
            vdata *= fs32[i];
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
        return 1;
    }
    
    // 如果是在worker中运行，则执行如下代码
    self.initializeExternModule(this);
}
let workerIns_ThreadMultNum = new ThreadMultNum();
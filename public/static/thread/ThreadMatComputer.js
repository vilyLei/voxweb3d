/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// thread code example, for parsing a special thread task data(equal getTaskClass() value)

var Module = {};

function ThreadMatComputer()
{
    console.log("ThreadMatComputer instance init run ...");
    
    let m_dataIndex = 0;
    let m_srcuid = 0;
    this.threadIndex = 0;
    let selfT = this;
    let m_allTot = 0;
    let m_matComputer = null;
    this.initialize = function()
    {
        //      m_matComputer = new Module.MatrixComputer();
        //      m_matComputer.allocate(16);
        //  matCompter.setScaleXYZParamAt(10.0, 4.5, 2.1, index);
        //  matCompter.setRotationEulerAngleParamAt(30.0, 20.0, 80.0, index);
        //  matCompter.setTranslationXYZParamAt(30.0, 20.0, 80.0, index);
        //  let paramFS32 = m_matComputer.getParamData();
        //  console.log("ThreadMatComputer MatrixComputer paramFS32: \n",paramFS32);
    }
    this.receiveData = function(data)
    {
        if(m_matComputer == null)
        {
            m_matComputer = new Module.MatrixComputer();
            //console.log("data.allTot: "+data.allTot);
            m_allTot = data.allTot;
            m_matComputer.allocate(m_allTot);
        }
        m_srcuid = data.srcuid;
        m_dataIndex = data.dataIndex;
        //console.log("ThreadMatComputer::receiveData(),data: ",data);
        //  postMessage({cmd:"DATA_PARSE",threadIndex:selfT.threadIndex,taskclass:selfT.getTaskClass(),srcuid:m_srcuid,dataIndex:m_dataIndex});
        //console.log("ThreadMatComputer::receiveData(),data: ",data);
        //let fs32 = data.paramData;//new Float32Array(data.paramData);
        let fs32 = (data.paramData);
        let matTotal = data.matTotal;
        //  console.log("ThreadMatComputer::receiveData(),fs32: ",fs32);
        //console.log("ThreadMatComputer::receiveData(),matTotal: ",matTotal,",threadIndex: "+data.threadIndex);
        let len = matTotal * 9;
        let subArr = fs32.subarray(0,len);
        let paramFS32 = m_matComputer.getParamData();
        paramFS32.set(subArr,0);
        //console.log("ThreadMatComputer::receiveData paramFS32: \n",paramFS32);
        m_matComputer.calc(matTotal);
        //m_matComputer.coutThisMatAt(0);

        //console.log("data.allTot: "+data.allTot);
        paramFS32 = m_matComputer.getMatData();
        if(matTotal < m_allTot)
        {
            len = matTotal * 16;
            subArr = paramFS32.subarray(0,len);
            fs32.set(subArr,0);
        }
        else
        {
            fs32.set(paramFS32,0);
        }

        let sendData = 
        {
            cmd:data.cmd,
            taskCmd: data.taskCmd,
            threadIndex:selfT.threadIndex,
            taskclass:selfT.getTaskClass(),
            srcuid:m_srcuid,
            dataIndex:m_dataIndex,
            matTotal:matTotal,
            paramData:fs32
        };
        postMessage(sendData,[fs32.buffer]);
    }
    this.getTaskClass = function()
    {
        return 0;
    }
    //  postMessage({cmd:"INIT_TASK",taskclass:this.getTaskClass()});
}
let workerIns_ThreadMatComputer = new ThreadMatComputer();

Module["onModuleLoaded"] = function()
{
    console.log("ThreadMatComputer onModuleLoaded ...");
    workerIns_ThreadMatComputer.initialize();
    postMessage({cmd:"INIT_TASK",taskclass:workerIns_ThreadMatComputer.getTaskClass()});
}

var baseUrl = self.location.href.slice(0,scriptDir.lastIndexOf("/")+1);
var k = baseUrl.indexOf("http://");
if(k < 0)
{
    k = baseUrl.indexOf("https://");
}
if(k < 0) k = 0;
baseUrl = baseUrl.slice(k) + "static/wasm/matDemo.js";
console.log("ThreadMatComputer::baseUrl: "+baseUrl);
importScripts(baseUrl);
self.TaskSlot[workerIns_ThreadMatComputer.getTaskClass()] = workerIns_ThreadMatComputer;
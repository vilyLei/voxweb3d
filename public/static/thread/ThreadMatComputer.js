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
    let m_allTot = 0;
    let m_matComputer = null;
    let m_time = 0.0;
    let m_paramFS32 = null;
    let m_matFS32 = null;
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
        let matTotal = data.matTotal;
        m_dataIndex = data.dataIndex;
        let fs32 = (data.paramData);

        ///*
        if(m_matComputer == null)
        {
            m_matComputer = new Module.MatrixComputer();
            m_allTot = data.allTot;
            m_matComputer.allocate(m_allTot);

            m_matFS32 = m_matComputer.getMatData();
            m_paramFS32 = m_matComputer.getParamData();
        }
        
        let len = matTotal * 9;
        //let subArr = null;//fs32.subarray(0,len);
        m_paramFS32 = m_matComputer.getParamData();
        let i = 0;
        for(; i < len; i++)
        {
            m_paramFS32[i] = fs32[i];
        }
        //m_paramFS32.set(subArr,0);
        m_matComputer.calcMotion(-100.0,100.0,m_time,35.0, 8.0,matTotal);
        m_matComputer.calcMotion(50.0,-70.0,m_time,20.0, 7.0,matTotal);
        m_time += 0.01;
        //console.log("ThreadMatComputer::receiveData m_paramFS32: \n",m_paramFS32);
        m_matComputer.calc(matTotal);
        //m_matComputer.coutThisMatAt(0);

        //console.log("data.allTot: "+data.allTot);
        len = matTotal * 16;
        for(i = 0; i < len; i++)
        {
            fs32[i] = m_matFS32[i];
        }
        //  if(matTotal < m_allTot)
        //  {
        //      len = matTotal * 16;
        //      subArr = paramFS32.subarray(0,len);
        //      fs32.set(subArr,0);
        //  }
        //  else
        //  {
        //      fs32.set(paramFS32,0);
        //  }
        //*/
        //fs32 = null;
        let sendData = 
        {
            cmd:data.cmd,
            taskCmd: data.taskCmd,
            threadIndex:data.threadIndex,
            taskclass:this.getTaskClass(),
            srcuid:data.srcuid,
            dataIndex:m_dataIndex,
            matTotal:matTotal,
            paramData:fs32
        };
        if(fs32 != null)
        {
            postMessage(sendData,[fs32.buffer]);
        }
        else
        {
            postMessage(sendData);
        }
    }
    this.getTaskClass = function()
    {
        return 0;
    }
}
let workerIns_ThreadMatComputer = new ThreadMatComputer();

Module["onModuleLoaded"] = function()
{
    console.log("ThreadMatComputer onModuleLoaded ...");
    workerIns_ThreadMatComputer.initialize();
    let INIT_TASK = 3701;
    postMessage({cmd:INIT_TASK,taskclass:workerIns_ThreadMatComputer.getTaskClass()});
}

var baseUrl = self.location.href.slice(0,scriptDir.lastIndexOf("/")+1);
var k = baseUrl.indexOf("http://");
if(k < 0)
{
    k = baseUrl.indexOf("https://");
}
if(k < 0) k = 0;
baseUrl = baseUrl.slice(k) + "static/wasm/";
Module["moduleUrl"] = baseUrl;
baseUrl += "matDemo.js"
console.log("ThreadMatComputer::baseUrl: "+baseUrl);
importScripts(baseUrl);
self.__$TaskSlot[workerIns_ThreadMatComputer.getTaskClass()] = workerIns_ThreadMatComputer;
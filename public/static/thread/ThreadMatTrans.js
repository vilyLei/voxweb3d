/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// thread code example, for parsing a special thread task data(equal getTaskClass() value)

var Module = {};

function ThreadMatTrans()
{
    console.log("ThreadMatTrans instance init run ...");
    
    let m_dataIndex = 0;
    let m_srcuid = 0;
    this.threadIndex = 0;
    let m_allTot = 0;
    let m_matTrans = null;
    let m_time = 0.0;
    let m_matFS32 = null;
    let m_paramFS32 = null;
    this.initialize = function()
    {
        //      m_matTrans = new Module.MatTransform();
        //      m_matTrans.allocate(16);
        //  matCompter.setScaleXYZParamAt(10.0, 4.5, 2.1, index);
        //  matCompter.setRotationEulerAngleParamAt(30.0, 20.0, 80.0, index);
        //  matCompter.setTranslationXYZParamAt(30.0, 20.0, 80.0, index);
        //  let paramFS32 = m_matTrans.getParamData();
        //  console.log("ThreadMatTrans MatTransform paramFS32: \n",paramFS32);
    }
    this.receiveData = function(data)
    {
        let matTotal = data.matTotal;
        //  matTotal = 1;
        //  data.allTot = 1;
        m_dataIndex = data.dataIndex;
        let fs32 = (data.paramData);

        ///*
        if(m_matTrans == null)
        {
            console.log("Init MatTransform ins....");
            m_matTrans = new Module.MatTransform();
            m_allTot = data.allTot;
            m_matTrans.allocate(m_allTot);
            m_matFS32 = m_matTrans.getMatData();
            m_paramFS32 = m_matTrans.getParamData();
        }
        let i = 0;
        let len = matTotal * 9;
        if(data.flag < 1)
        {
            for(i = 0; i < len; i++)
            {
                m_paramFS32[i] = fs32[i];
            }
            //console.log("fs32: ",fs32);
            m_matTrans.updateParam();
        }
        m_matTrans.calc();
        
        //  console.log("paramFS32: ",m_matFS32);
        len = matTotal * 32;
        for(i = 0; i < len; i++)
        {
            fs32[i] = m_matFS32[i];
        }
        
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
let workerIns_ThreadMatTrans = new ThreadMatTrans();

Module["onModuleLoaded"] = function()
{
    console.log("ThreadMatTrans onModuleLoaded ...");
    workerIns_ThreadMatTrans.initialize();
    let INIT_TASK = 3701;
    postMessage({cmd:INIT_TASK,taskclass:workerIns_ThreadMatTrans.getTaskClass()});
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
baseUrl += "transformDemo.js"
console.log("ThreadMatTrans::baseUrl: "+baseUrl);
importScripts(baseUrl);
self.TaskSlot[workerIns_ThreadMatTrans.getTaskClass()] = workerIns_ThreadMatTrans;
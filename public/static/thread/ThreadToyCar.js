/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// thread code example, for parsing a special thread task data(equal getTaskClass() value)
"use strict";

var Module = {};

function CarTransModule(pmodule, taskClass) {

    let m_taskClass = taskClass;
    let m_module = pmodule;
    let m_matFS32 = null;
    let m_paramFS32 = null;

    let m_dataIndex = 0;
    let m_calcType = -1;
    let m_allTotal = 0;

    this.initialize = function(data) {
        let descriptor = data.descriptor;
        m_calcType = descriptor.calcType;
        m_allTotal = descriptor.allTotal;
        console.log("Init MatTransform ins....m_calcType: ",m_calcType, m_allTotal);
        switch (m_calcType) {
            case 0:
                m_module.allocate(m_allTotal);
                break;
            case 1:
                m_module.allocate2(m_allTotal);
                break;
            default:
                break;
        }
        m_matFS32 = m_module.getMatData();
        m_paramFS32 = m_module.getParamData();
    }

    this.run = function(data) {
        if(m_matFS32) {

            let descriptor = data.descriptor;
            let matsTotal = descriptor.matsTotal;
            //console.log("descriptor.calcType: ",descriptor.calcType);
            m_calcType = descriptor.calcType;
            //console.log("matsTotal: ", matsTotal);
            m_dataIndex = data.dataIndex;
            let fs32 = data.streams[0];
            ///*
            let i = 0;
            let len = 0;
            if (descriptor.flag < 1) {
                //console.log("XXXXXXXXXXXX m_calcType: ",m_calcType);
                switch (m_calcType) {
                    case 0:
                        len = matsTotal * 9;
                        for (i = 0; i < len; i++) m_paramFS32[i] = fs32[i];
                        m_module.updateParam();
                        len = matsTotal * 16;
                        break;
                    case 1:
                        len = matsTotal * 15;
                        for (i = 0; i < len; i++) m_paramFS32[i] = fs32[i];
                        m_module.updateParam2();
                        len = matsTotal * 16;
                        break;
                    default:
                        break;
                }
                //console.log("fs32: ",fs32);
            }
            else {
                switch (m_calcType) {
                    case 0:
                        len = matsTotal * 16;
                        break;
                    case 1:
                        len = matsTotal * 16;
                        //console.log("len: ",len);
                        break;
                    default:
                        break;
                }
            }
            m_module.calc();
    
            //  console.log("paramFS32: ",m_matFS32);
            //console.log("len: ",len);
            for (i = 0; i < len; i++) {
                fs32[i] = m_matFS32[i];
            }
            
            let sendData =
            {
                cmd: data.cmd,
                taskCmd: data.taskCmd,
                threadIndex: data.threadIndex,
                taskclass: m_taskClass,
                srcuid: data.srcuid,
                dataIndex: m_dataIndex,
                //  matsTotal: m_matsTotal,
                streams: [fs32]
            };
            if (fs32 != null) {
                postMessage(sendData, [fs32.buffer]);
            }
            else {
                postMessage(sendData);
            }
        }
    }
}

function AStarNavModule(pmodule, taskClass) {

    let m_taskClass = taskClass;
    let m_module = pmodule;
    let m_running = true;
    let m_dataIndex = 0;
    
    this.initialize = function(data) {

        m_dataIndex = data.dataIndex;
        let descriptor = data.descriptor;
        let rn = descriptor.rn;
        let cn = descriptor.cn;
        let stvs = descriptor.stvs;
        m_module.allocate(rn * cn + 32);
        m_module.initialize(rn, cn, 100);
        let r = 0;
        let c = 0;
        let tot = rn * cn;
        let i = 0;
        for (; i < tot; ++i) {
            m_module.setGoValueByRC(stvs[i], r, c);
            c++;
            if (c >= cn) {
                c = 0;
                r++;
            }
        }
        
        let sendData =
        {
            cmd: data.cmd,
            taskCmd: data.taskCmd,
            threadIndex: data.threadIndex,
            taskclass: m_taskClass,
            srcuid: data.srcuid,
            dataIndex: m_dataIndex,
            //  matsTotal: m_matsTotal,
            streams: null
        };
        postMessage(sendData);
    }
    this.run = function(data) {
        if(m_running) {
            let descriptor = data.descriptor;
            console.log("path descriptor: ",descriptor);
            m_module.searchPathDataByRC(descriptor.r0, descriptor.c0, descriptor.r1, descriptor.c1);
            let dataLen = m_module.getPathDataTotal();
            let vs = m_module.getPathData();
            console.log("path dataLen: " + dataLen);
            console.log("path vs: ", vs);
            
            let sendData =
            {
                cmd: data.cmd,
                taskCmd: data.taskCmd,
                threadIndex: data.threadIndex,
                taskclass: m_taskClass,
                srcuid: data.srcuid,
                dataIndex: m_dataIndex,
                //  matsTotal: m_matsTotal,
                streams: data.streams
            };
            postMessage(sendData, [data.streams[0].buffer]);
        }
    }
    this.search = function(data) {
        if(m_running) {
            let descriptor = data.descriptor;
            console.log("path descriptor: ",descriptor);
            //m_module.searchPathDataByRC(descriptor.r0, descriptor.c0, descriptor.r1, descriptor.c1);
            let dataLen = 0;
            let vs = null;
            let paramVS = data.streams[0];
            let pathDataVS = data.streams[1];
            let paramLen = paramVS[0];
            let index = 1;
            paramLen = paramLen * 5 + index;
            let total = 0;
            for(let i = index; i < paramLen; ) {
                i++;
                index = i;
                let r0 = paramVS[i++];
                let c0 = paramVS[i++];
                let r1 = paramVS[i++];
                let c1 = paramVS[i++];
                console.log("r0,c0, r1,c1: ",r0,c0, r1,c1,", index: ",index);
                m_module.searchPathDataByRC(r0,c0, r1,c1);
                dataLen = m_module.getPathDataTotal();
                vs = m_module.getPathData();

                let subVS = vs.subarray(0, dataLen * 2);
                pathDataVS.set(subVS, total * 2);
                
                paramVS[index] = dataLen;
                total += dataLen;
                console.log("work search path dataLen: " + dataLen);
                console.log("work search path vs: ", vs);
            }
            
            console.log("paramVS: ",paramVS);
            console.log("pathDataVS: ",pathDataVS);
            let sendData =
            {
                cmd: data.cmd,
                taskCmd: data.taskCmd,
                threadIndex: data.threadIndex,
                taskclass: m_taskClass,
                srcuid: data.srcuid,
                dataIndex: m_dataIndex,
                streams: data.streams
            };
            postMessage(sendData, [paramVS.buffer, pathDataVS.buffer]);
        }
    }
}
function ThreadAStarNav() {
    console.log("ThreadAStarNav instance init run ...");

    this.threadIndex = 0;
    let m_aStarNav = null;
    let m_carTrans = null;
    this.initialize = function () {
    }
    this.receiveData = function (data) {

        //  console.log("data.taskCmd: ",data.taskCmd);
        switch(data.taskCmd) {
            case "car_trans":

                if(m_carTrans != null) {
                    m_carTrans.run( data );
                }
                else {
                    m_carTrans = new CarTransModule( new Module.MatTransform(), this.getTaskClass() );
                    m_carTrans.initialize( data );
                    m_carTrans.run( data );
                }
                break;
            case "aStar_search":
                
                if(m_aStarNav != null) {
                    m_aStarNav.search( data );
                }
                break;
            case "aStar_exec":

                if(m_aStarNav != null) {
                    m_aStarNav.run( data );
                }
                else {
                    m_aStarNav = new AStarNavModule( new Module.StarA(), this.getTaskClass() );
                    let descriptor = {rn: 6, cn: 6, stvs: null};
                    descriptor.stvs = new Uint16Array(
                        [
                            0, 0, 0, 0, 0, 0,
                            0, 0, 1, 1, 0, 0,
                            0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 0, 0,
                            0, 0, 0, 1, 0, 0,
                            0, 0, 0, 0, 0, 0
                        ]
                    );
                    data.descriptor = descriptor;
                    m_aStarNav.initialize( data );
                }
                break;
            case "aStar_init":
                console.log("worker XXXX aStar_init...");
                if(m_aStarNav == null) {
                    m_aStarNav = new AStarNavModule( new Module.StarA(), this.getTaskClass() );
                }
                m_aStarNav.initialize( data );
                break;
            default:
                console.log("worker XXXX receiveData default...");
                break;
        }
    }
    this.getTaskClass = function () {
        return 0;
    }
    
    function constructor(ins) {

        Module["onModuleLoaded"] = function () {
            console.log("ThreadAStarNav onModuleLoaded ...");
            ins.initialize();
            // 如果是在worker中运行，则执行如下代码
            self.initializeExternModule(ins);
        }

        var baseUrl = self.location.href.slice(0, scriptDir.lastIndexOf("/") + 1);
        var k = baseUrl.indexOf("http://");
        if (k < 0) {
            k = baseUrl.indexOf("https://");
            if (k < 0) k = 0;
        }
        baseUrl = baseUrl.slice(k) + "static/wasm/";
        Module["moduleUrl"] = baseUrl;
        baseUrl += "transformDemo.js";
        importScripts(baseUrl);
    }
    constructor( this );
}
let workerIns_ThreadAStarNav = new ThreadAStarNav();
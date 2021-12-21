/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// thread code example, for parsing a special thread task data(equal getTaskClass() value)
"use strict";

var Module = {};
function TransformInstance(pmodule) {

    let m_module = pmodule;
    let m_matFS32 = null;
    let m_paramFS32 = null;
    let m_stU16Array = null;

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
        m_stU16Array = m_module.getStatusData();
    }

    this.run = function(data) {
        if(m_matFS32 != null) {

            let descriptor = data.descriptor;
            let matsTotal = descriptor.matsTotal;
            let allTotal = descriptor.allTotal;
            //console.log("descriptor.calcType: ",descriptor.calcType);
            m_calcType = descriptor.calcType;
            let inputFS32 = data.streams[0];
            let outputFS32 = data.streams[1];
            let stUint16Arr = data.streams[2];
            ///*
            let i = 0;
            for (i = 0; i < allTotal; i++) m_stU16Array[i] = stUint16Arr[i];
            let len = 0;
            if (descriptor.flag < 1) {
                switch (m_calcType) {
                    case 0:
                        //len = matsTotal/5 * 15;
                        len = matsTotal * 3;
                        for (i = 0; i < len; i++) m_paramFS32[i] = inputFS32[i];
                        m_module.updateParam2MIn();
                        break;
                    case 1:
                        //len = matsTotal/5 * 15;
                        len = matsTotal * 3;
                        for (i = 0; i < len; i++) m_paramFS32[i] = inputFS32[i];
                        m_module.updateParam2();
                        break;
                    default:
                        break;
                }
                //console.log("inputFS32: ",inputFS32);
            }
            len = matsTotal * 16;
            m_module.calc();
    
            //  console.log("paramFS32: ",m_matFS32);
            //console.log("len: ",len);
            for (i = 0; i < len; i++) {
                outputFS32[i] = m_matFS32[i];
            }
            
            for (i = 0; i < allTotal; i++) {
                stUint16Arr[i] = m_stU16Array[i];
            }
            
            postMessage(data, [inputFS32.buffer, outputFS32.buffer, stUint16Arr.buffer]);
        }
    }
}
function CarTransformModule() {

    let m_insList = [null, null];// = new TransformInstance( new Module.MatTransform() );
    this.receiveData = function (data) {

        let descriptor = data.descriptor;
        //  console.log("data.taskCmd: ",data.taskCmd);
        switch(data.taskCmd) {
            case "car_trans":
                if(m_insList[descriptor.taskIndex] != null) {
                    m_insList[descriptor.taskIndex].run( data );
                }
                else {
                    m_insList[descriptor.taskIndex] = new TransformInstance( new Module.MatTransform() );
                    m_insList[descriptor.taskIndex].initialize( data );
                    m_insList[descriptor.taskIndex].run( data );
                }
                // if(m_carTrans != null) {
                //     m_carTrans.run( data );
                // }
                // else {
                //     m_carTrans = new CarTransformModule( new Module.MatTransform() );
                //     m_carTrans.initialize( data );
                //     m_carTrans.run( data );
                // }
                break;
            default:
                console.log("worker CarTransformModule receiveData default...");
                break;
        }
    }
}

// ############################################################

function AStarNavInstance(pmodule) {

    let m_module = pmodule;
    let m_running = true;
    
    this.initialize = function(data) {

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
        
        postMessage(data);
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
            postMessage(data, [data.streams[0].buffer]);
        }
    }
    this.search = function(data) {
        if(m_running) {
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
                m_module.searchPathDataByRC(r0,c0, r1,c1);
                dataLen = m_module.getPathDataTotal();
                vs = m_module.getPathData();

                let subVS = vs.subarray(0, dataLen * 2);
                pathDataVS.set(subVS, total * 2);
                
                paramVS[index] = dataLen;
                total += dataLen;
            }
            
            postMessage(data, [paramVS.buffer, pathDataVS.buffer]);
        }
    }
}
function AStarNavModule() {

    let m_insList = [null, null];
    this.receiveData = function (data) {
        let descriptor = data.descriptor;
        switch(data.taskCmd) {
            case "aStar_search":

                if(m_insList[descriptor.taskIndex] != null) {
                    m_insList[descriptor.taskIndex].search( data );
                }
                break;
            case "aStar_exec":

                if(m_insList[descriptor.taskIndex] != null) {
                    m_insList[descriptor.taskIndex].run( data );
                }
                else {
                    m_insList[descriptor.taskIndex] = new AStarNavInstance( new Module.StarA() );
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
                    m_insList[descriptor.taskIndex].initialize( data );
                }
                break;
            case "aStar_init":
                console.log("worker XXXX aStar_init...");
                if(m_insList[descriptor.taskIndex] == null) {
                    m_insList[descriptor.taskIndex] = new AStarNavInstance( new Module.StarA() );
                }
                m_insList[descriptor.taskIndex].initialize( data );
                break;
            default:
                console.log("worker AStarNavModule receiveData default...");
                break;
        }
    }
}
function ToyCarTask() {
    console.log("ToyCarTask instance init run ...");

    this.threadIndex = 0;
    let m_navModule = new AStarNavModule();
    let m_transModule = new CarTransformModule();

    this.initialize = function () {
    }
    this.receiveData = function (data) {

        //  console.log("data.taskCmd: ",data.taskCmd);
        switch(data.taskCmd) {
            case "car_trans":
                m_transModule.receiveData( data );
                break;
            case "aStar_search":
            case "aStar_exec":
            case "aStar_init":
                m_navModule.receiveData( data );
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
            console.log("ToyCarTask onModuleLoaded ...");
            ins.initialize();
            // 如果是在worker中运行，则执行如下代码
            self.initializeExternModule(ins);
        }

        let baseUrl = self.location.href.slice(0, scriptDir.lastIndexOf("/") + 1);
        let k = baseUrl.indexOf("http://");
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
let workerIns_ThreadAStarNav = new ToyCarTask();

import { CoTextureDataUnit, CoModuleFileType, CoGeomDataType, CoModuleNS, CoDataFormat, CoGeomDataUnit, CoTaskCodeModuleParam } from "../app/CoSpaceAppData";

import { ICoSpaceApp } from "../app/ICoSpaceApp";
import { ICoSpaceAppIns } from "../app/ICoSpaceAppIns";
import { EngineInstance } from "../engine/EngineInstance";
import { AppEngineInstance } from "../engine/AppEngineInstance";

declare var CoSpaceApp: ICoSpaceApp;
declare var AppEngine: any;
declare var AppBase: any;
/**
 * 引擎数据/资源协同空间
 */
export class DemoCoEngine {

	private m_beginTime: number = 0;
    private m_appIns: ICoSpaceAppIns;
    private m_engineIns: AppEngineInstance;
    private m_modules: CoTaskCodeModuleParam[];
    constructor() { }

    private initCurr(): void {
        let modules: CoTaskCodeModuleParam[] = [
            { url: "static/cospace/core/coapp/CoSpaceApp.umd.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
            { url: "static/cospace/core/code/ThreadCore.umd.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/png/ModulePNGParser.umd.js", name: CoModuleNS.pngParser, type: CoModuleFileType.JS }
        ];
        this.m_modules = modules;
    }

    private initTestSvr(): void {
        let modules: CoTaskCodeModuleParam[] = [
            { url: "http://localhost:9090/static/renderingVerifier/modules/coapp1.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
            { url: "http://localhost:9090/static/renderingVerifier/modules/th1.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
            { url: "http://localhost:9090/static/renderingVerifier/modules/ct1.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
            { url: "http://localhost:9090/static/renderingVerifier/modules/ob1.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS }
        ];
        this.m_modules = modules;
    }
    initialize(): void {

        this.initCurr();
        // this.initTestSvr();

        console.log("DemoCoEngine::initialize()...");

        let url: string = this.m_modules[0].url;
        this.loadAppModule( url );

        this.loadEngineModule( "static/cospace/engine/AppEngine.umd.js" );

        // 启用鼠标点击事件
        document.onmousedown = (evt: any): void => {
            this.mouseDown(evt);
        }
    }
    private initApp(): void {

        let modules = this.m_modules;
        this.m_appIns.setTaskModuleParams(modules);
        this.m_appIns.initialize(3, modules[1].url, true);

        // this.loadCTM();
    }
	private initEngine(): void {
		console.log("initEngine()...");
	}
	private m_pngs: string[] = [
		"static/assets/xulie_49.png",
		"static/private/image/bigPng.png",
		"static/assets/letterA.png"
	];
	private loadPNGByCallback(url: string): void {

		//let url: string = "static/assets/letterA.png";
		this.m_appIns.getCPUDataByUrlAndCallback(
			url,
			CoDataFormat.Png,
			(unit: CoTextureDataUnit, status: number): void => {
				console.log("DemoCospace::loadPNGByCallback(), texture data:", unit.data.imageDatas[0]);
				console.log("DemoCospace::loadPNGByCallback(), texture des:", unit.data.desList[0]);
				// console.log("lossTime: ", unit.lossTime + " ms");
			},
			true
		);
	}
    private loadCTM(): void {

        let baseUrl: string = "static/private/ctm/";
        let urls: string[] = [];
        for (let i = 0; i <= 26; ++i) {
            urls.push(baseUrl + "sh202/sh202_" + i + ".ctm");
        }
        urls = [baseUrl + "errorNormal.ctm"];

        let url = urls[0];
        this.m_appIns.getCPUDataByUrlAndCallback(
            url,
            CoDataFormat.CTM,
            (unit: CoGeomDataUnit, status: number): void => {
                let model: CoGeomDataType = unit.data.models[0];
                console.log("parsing finish ctm model: ", model);
            },
            true
        );
    }
    private loadOBJ(): void {

        let baseUrl: string = "static/private/obj/";
        let url = baseUrl + "base.obj";

        this.m_appIns.getCPUDataByUrlAndCallback(
            url,
            CoDataFormat.OBJ,
            (unit: CoGeomDataUnit, status: number): void => {
                let model: CoGeomDataType = unit.data.models[0];
                console.log("parsing finish obj model: ", model);
            },
            true
        );
    }
    private mouseDown(evt: any): void {

        this.m_beginTime = Date.now();
        // this.loadOBJ();
        this.loadPNGByCallback(this.m_pngs[0]);
        this.loadPNGByCallback(this.m_pngs[1]);
    }

    private loadEngineModule(purl: string): void {

        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
        }
        codeLoader.onload = (evt) => {

            console.log("engine module js file loaded.");
            let scriptEle: HTMLScriptElement = document.createElement("script");
            scriptEle.onerror = (evt) => {
                console.error("module script onerror, e: ", evt);
            }
            scriptEle.type = "text\/javascript";
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
			this.initEngineCode();
        }
        codeLoader.send(null);
    }

	private initEngineCode(): void {
		console.log("typeof AppEngine: ", typeof AppEngine);
		if (typeof AppEngine !== "undefined") {
            console.log("engine 代码块加载完毕");
            this.m_engineIns = new AppEngine.Instance();
            console.log("this.m_engineIns: ", this.m_engineIns);
            this.initEngine();
		}
	}

    private loadAppModule(purl: string): void {

        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
        }
        codeLoader.onload = (evt) => {

            console.log("module js file loaded.");
            let scriptEle: HTMLScriptElement = document.createElement("script");
            scriptEle.onerror = (evt) => {
                console.error("module script onerror, e: ", evt);
            }
            scriptEle.type = "text\/javascript";
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
			this.initAppCode();
        }
        codeLoader.send(null);
    }
	private initAppCode(): void {
		console.log("typeof CoSpaceApp: ", typeof CoSpaceApp);
		if (typeof CoSpaceApp !== "undefined") {
            console.log("cospace 代码块加载完毕");
            this.m_appIns = CoSpaceApp.createInstance();
            console.log("this.m_appIns: ", this.m_appIns);
            this.initApp();
		}
	}

    run(): void { }
}

export default DemoCoEngine;

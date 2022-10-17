
import { CoTextureDataUnit, CoModuleFileType, CoGeomDataType, CoModuleNS, CoDataFormat, CoGeomDataUnit, CoTaskCodeModuleParam } from "../app/CoSpaceAppData";

import { ICoSpaceApp } from "../app/ICoSpaceApp";
import { ICoSpaceAppIns } from "../app/ICoSpaceAppIns";

declare var CoSpaceApp: ICoSpaceApp;
/**
 * 引擎数据/资源协同空间
 */
export class DemoCoApp {

    private m_beginTime: number = 0;
    private m_appIns: ICoSpaceAppIns;
    private m_modules: CoTaskCodeModuleParam[];
    private m_dependencyJson: string = "";
    constructor() { }

    private initCurr(): void {
        // new TaskCodeModuleParam("static/cospace/modules/fbxFast/ModuleFBXGeomFastParser.umd.js", ModuleNS.fbxFastParser, ModuleFileType.JS),
        let modules: CoTaskCodeModuleParam[] = [
            { url: "static/cospace/core/coapp/CoSpaceApp.umd.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
            { url: "static/cospace/core/code/ThreadCore.umd.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/png/ModulePNGParser.umd.js", name: CoModuleNS.pngParser, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/fbxFast/ModuleFBXGeomFastParser.umd.js", name: CoModuleNS.fbxFastParser, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js", name: CoModuleNS.dracoParser, type: CoModuleFileType.JS, params: ["static/cospace/modules/dracoLib/"] },
        ];
        this.m_modules = modules;
        
		// 初始化数据协同中心
		let dependencyGraphObj: object = {
			nodes: [
				{ uniqueName: "dracoGeomParser", path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js" },
				{ uniqueName: "dracoWasmWrapper", path: "static/cospace/modules/dracoLib/w2.js" },
				{ uniqueName: "ctmGeomParser", path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js" }
			],
			maps: [
				{ uniqueName: "dracoGeomParser", includes: [1] } // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
			]
		};
		this.m_dependencyJson = JSON.stringify(dependencyGraphObj);
    }

    private initTestSvr(): void {
        let modules: CoTaskCodeModuleParam[] = [
            { url: "http://localhost:9090/static/renderingVerifier/modules/coapp1.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
            { url: "http://localhost:9090/static/renderingVerifier/modules/th1.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
            { url: "http://localhost:9090/static/renderingVerifier/modules/ct1.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
            { url: "http://localhost:9090/static/renderingVerifier/modules/ob1.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS },
            { url: "http://localhost:9090/static/renderingVerifier/modules/drc.js", name: CoModuleNS.dracoParser, type: CoModuleFileType.JS, params: ["http://localhost:9090/static/renderingVerifier/modules/drc/"] }
        ];
        this.m_modules = modules;
    }
    initialize(): void {

        this.initCurr();
        // this.initTestSvr();

        console.log("DemoCoApp::initialize()...");

        let url: string = this.m_modules[0].url;
        this.loadAppModule(url);
        // 启用鼠标点击事件
        document.onmousedown = (evt: any): void => {
            this.mouseDown(evt);
        }
    }
    private initApp(): void {

        let modules = this.m_modules;
        this.m_appIns.setThreadDependencyGraphJsonString(this.m_dependencyJson);
        this.m_appIns.setTaskModuleParams(modules);
        this.m_appIns.initialize(3, modules[1].url, true);

        // this.loadCTM();
        this.loadFBX();
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
    
    private loadFBX(): void {

		let url = "static/private/fbx/hat_hasNormal.fbx";
        this.m_appIns.getCPUDataByUrlAndCallback(
            url,
            CoDataFormat.FBX,
            (unit: CoGeomDataUnit, status: number): void => {
                let model: CoGeomDataType = unit.data.models[0];
                console.log("parsing finish fbx unit.data.models: ", unit.data.models);
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
    private loadDraco(): void {

        let baseUrl: string = "static/private/draco/";
        let urls: string[] = [];
        for (let i = 0; i <= 3; ++i) {
            urls.push(baseUrl + "sh202/sh202_" + i + ".drc");
        }
        urls = [baseUrl + "errorNormal.drc"];

        let url = urls[0];
        this.m_appIns.getCPUDataByUrlAndCallback(
            url,
            CoDataFormat.Draco,
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
        // this.loadPNGByCallback(this.m_pngs[0]);
        // this.loadPNGByCallback(this.m_pngs[1]);

        this.loadDraco();
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
            console.log("代码块加载完毕");
            this.m_appIns = CoSpaceApp.createInstance();
            console.log("this.m_appIns: ", this.m_appIns);
            this.initApp();
		}
	}
    run(): void { }
}

export default DemoCoApp;


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
    constructor() { }

    private initCurr(): void {
        let modules: CoTaskCodeModuleParam[] = [
            { url: "static/cospace/core/coapp/CoSpaceApp.umd.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
            { url: "static/cospace/core/code/ThreadCore.umd.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS },
            { url: "static/cospace/modules/png/ModulePNGParser.umd.min.js", name: CoModuleNS.pngParser, type: CoModuleFileType.JS }
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

        console.log("DemoCoApp::initialize()...");

        let url: string = this.m_modules[0].url;
        this.loadModule(url, (): void => {
        });
        // 启用鼠标点击事件
        document.onmousedown = (evt: any): void => {
            this.mouseDown(evt);
        }
    }
    private initApp(): void {

        let modules = this.m_modules;
        this.m_appIns.setTaskModuleParams(modules);
        this.m_appIns.initialize(3, modules[1].url, true);

        this.loadCTM();
    }
	private m_pngs: string[] = [
		"static/assets/xulie_49.png",
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

    private loadModule(purl: string, onBuild: () => void = null): void {

        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            // if (listener != null) listener.showLoadInfo(e, this.index);
        };
        codeLoader.onload = (evt) => {
            this.update();
            console.log("module js file loaded.");
            let scriptEle: HTMLScriptElement = document.createElement("script");
            scriptEle.onerror = (evt) => {
                console.error("module script onerror, e: ", evt);
            }
            scriptEle.type = "text\/javascript";
            scriptEle.onload = (evt) => {
                console.log("module script loaded.");
                if (onBuild != null) {
                    onBuild();
                }
            }
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
        }
        codeLoader.send(null);
    }

    private m_timeoutId: any = -1;
    /**
     * 定时调度
     */
    private update(): void {
        let delay: number = 100;      // 10 fps

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        if (typeof CoSpaceApp === "undefined") {
            this.m_timeoutId = setTimeout(this.update.bind(this), delay);
        } else {
            console.log("代码块加载完毕");
            this.m_appIns = CoSpaceApp.createInstance();
            console.log("this.m_appIns: ", this.m_appIns);
            this.initApp();
        }
    }
    run(): void { }
}

export default DemoCoApp;

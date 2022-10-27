import {
	CoModuleFileType,
	CoModuleNS,
	CoTaskCodeModuleParam
} from "../../app/CoSpaceAppData";

import { ICoSpaceApp } from "../../app/ICoSpaceApp";
import { ICoSpaceAppIns } from "../../app/ICoSpaceAppIns";

import { ModuleLoader } from "../../modules/loaders/ModuleLoader";


declare var CoSpaceApp: ICoSpaceApp;

export class ViewerCoSApp {

	readonly coappIns: ICoSpaceAppIns;

	private m_modules: CoTaskCodeModuleParam[];
	private m_dependencyGraphObj: Object;

	constructor() {}

	initialize(callback: () => void, urlChecker: (url: string) => string = null): void {
		let modules: CoTaskCodeModuleParam[] = [
			{ url: "static/cospace/core/coapp/CoSpaceApp.umd.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
			{ url: "static/cospace/core/code/ThreadCore.umd.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.min.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/png/ModulePNGParser.umd.js", name: CoModuleNS.pngParser, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/fbxFast/ModuleFBXGeomFastParser.umd.js", name: CoModuleNS.fbxFastParser, type: CoModuleFileType.JS }
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
		this.m_dependencyGraphObj = dependencyGraphObj;

		if(urlChecker != null) {
			for(let i = 0; i < modules.length; ++i) {
				modules[i].url = urlChecker(modules[i].url);
			}
			let nodes = (dependencyGraphObj as any).nodes;
			for(let i = 0; i < nodes.length; ++i) {
				nodes[i].path = urlChecker(nodes[i].path);
			}
		}

		new ModuleLoader(1,null,urlChecker)
			.setCallback((): void => {
				this.initCoSpaceApp();
				if(callback != null) {
					callback();
				}
			})
			.load(this.m_modules[0].url);
	}
	private initCoSpaceApp(): void {
		if (this.coappIns == null && typeof CoSpaceApp !== "undefined") {
			let coappIns = CoSpaceApp.createInstance();
			let modules = this.m_modules;
			
			let jsonStr = JSON.stringify(this.m_dependencyGraphObj);
			coappIns.setThreadDependencyGraphJsonString(jsonStr);
			coappIns.setTaskModuleParams(modules);
			coappIns.initialize(3, modules[1].url, true);

			let t: any = this;
			t.coappIns = coappIns;
		}
	}
}

export default ViewerCoSApp;

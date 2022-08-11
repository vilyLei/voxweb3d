import {
	CoModuleFileType,
	CoModuleNS,
	CoTaskCodeModuleParam
} from "../../app/CoSpaceAppData";

import { ICoSpaceApp } from "../../app/ICoSpaceApp";
import { ICoSpaceAppIns } from "../../app/ICoSpaceAppIns";

import { ModuleLoader } from "../../modules/base/ModuleLoader";


declare var CoSpaceApp: ICoSpaceApp;

export class ViewerCoSApp {

	readonly coappIns: ICoSpaceAppIns;

	private m_modules: CoTaskCodeModuleParam[];

	constructor() {}

	initialize(callback: () => void): void {
		let modules: CoTaskCodeModuleParam[] = [
			{ url: "static/cospace/core/coapp/CoSpaceApp.umd.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
			{ url: "static/cospace/core/code/ThreadCore.umd.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.min.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS },
			{ url: "static/cospace/modules/png/ModulePNGParser.umd.js", name: CoModuleNS.pngParser, type: CoModuleFileType.JS }
		];
		this.m_modules = modules;

		new ModuleLoader(1)
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
			coappIns.setTaskModuleParams(modules);
			coappIns.initialize(3, modules[1].url, true);

			let t: any = this;
			t.coappIns = coappIns;
		}
	}
}

export default ViewerCoSApp;

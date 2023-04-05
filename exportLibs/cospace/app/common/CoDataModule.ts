import {
	CoModuleFileType,
	CoModuleNS,
	CoTaskCodeModuleParam,
	CoGeomDataType,
	CoDataFormat,
	CoGeomDataUnit,
	CoTextureDataUnit
} from "../../app/CoSpaceAppData";

import { ICoSpaceApp } from "../../app/ICoSpaceApp";
import { ICoSpaceAppIns } from "../../app/ICoSpaceAppIns";
import { CoModuleLoader } from "../utils/CoModuleLoader";

declare var CoSpaceApp: ICoSpaceApp;
interface I_CoDataModule {
}
export class CoDataModule {
	private m_init = true;
	private m_sysIniting = true;
	private m_initInsFlag = true;
	private m_modules: CoTaskCodeModuleParam[];
	private m_dependencyGraphObj: Object;
	private m_deferredInit: boolean;
	private m_sysInitCallback: () => void;
	// private m_urlChecker: (url: string) => string = null;

	readonly coappIns: ICoSpaceAppIns;
	constructor() { }
	/**
	 * 初始化
	 * @param sysInitCallback the default value is null
	 * @param urlChecker the default value is null
	 * @param deferredInit the default value is false
	 */
	initialize(sysInitCallback: () => void = null, deferredInit: boolean = false): void {
		if (this.m_init) {
			this.m_init = false;

			this.m_sysInitCallback = sysInitCallback;
			// this.m_urlChecker = urlChecker;
			this.m_deferredInit = deferredInit;
			let modules: CoTaskCodeModuleParam[] = [
				{ url: "static/cospace/core/coapp/CoSpaceApp.umd.js", name: CoModuleNS.coSpaceApp, type: CoModuleFileType.JS },
				{ url: "static/cospace/core/code/ThreadCore.umd.js", name: CoModuleNS.threadCore, type: CoModuleFileType.JS },
				{ url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", name: CoModuleNS.ctmParser, type: CoModuleFileType.JS },
				{ url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.js", name: CoModuleNS.objParser, type: CoModuleFileType.JS },
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

			let loader = new CoModuleLoader(1);
			let urlChecker = loader.getUrlChecker();
			if (urlChecker != null) {
				for (let i = 0; i < modules.length; ++i) {
					modules[i].url = urlChecker(modules[i].url);
				}
				let nodes = (dependencyGraphObj as any).nodes;
				for (let i = 0; i < nodes.length; ++i) {
					nodes[i].path = urlChecker(nodes[i].path);
				}
			}
			if (!deferredInit) {
				this.loadSys();
			}
		}
	}
	private loadSys(): void {
		if (this.m_sysIniting) {
			new CoModuleLoader(1, (): void => {
				this.initCoSpaceSys();
			})
				.load(this.m_modules[0].url);
			this.m_sysIniting = false;
		}
	}
	/**
	 * 注意: 不建议过多使用这个函数,因为回调函数不安全如果是lambda表达式则由性能问题。
	 * 立即获得CPU侧的数据单元实例, 但是数据单元中的数据可能是空的, 因为数据获取的操作实际是异步的。
	 * 需要通过 isCpuPhase() 或者 isGpuPhase() 等函数来判定具体数据情况
	 * @param url 数据资源url
	 * @param dataFormat 数据资源类型
	 * @param callback 数据资源接收回调函数, 其值建议为lambda函数表达式
	 * @param immediate 是否立即返回数据, 默认是false
	 * @returns 数据单元实例，用户只能访问不能更改这个实例内部的数据状态，如果必要则可以申请复制一份
	 */
	getCPUDataByUrlAndCallback(url: string, dataFormat: CoDataFormat, callback: (unit: CoGeomDataUnit | CoTextureDataUnit, status: number) => void, immediate?: boolean): CoGeomDataUnit {
		if (this.coappIns != null) {
			let unit = this.coappIns.getCPUDataByUrlAndCallback(
				url,
				dataFormat, callback,
				immediate
			);
			if (this.m_deferredInit) {
				if (this.m_initInsFlag) {
					this.m_initInsFlag = false;
					let modules = this.m_modules;
					this.coappIns.initialize(3, modules[1].url, true);
				}
			}
			return unit;
		}
		return null;
	}
	private m_initCalls: (() => void)[] = [];
	deferredInit(callback: () => void): void {
		if (this.coappIns == null) {

			this.m_initCalls.push(callback);
			this.loadSys();
		} else if (callback != null) {
			callback();
		}
	}
	private initCoSpaceSys(): void {

		if (this.coappIns == null && typeof CoSpaceApp !== "undefined") {

			let coappIns = CoSpaceApp.createInstance();
			let modules = this.m_modules;

			let jsonStr = JSON.stringify(this.m_dependencyGraphObj);
			coappIns.setThreadDependencyGraphJsonString(jsonStr);
			coappIns.setTaskModuleParams(modules);
			if (!this.m_deferredInit) {
				coappIns.initialize(3, modules[1].url, true);
			}

			let t: any = this;
			t.coappIns = coappIns;
			for (let i = 0; i < this.m_initCalls.length; ++i) {
				if (this.m_initCalls[i] != null) {
					this.m_initCalls[i]();
				}
			}
			this.m_initCalls = [];
		}

		if (this.m_sysInitCallback != null) {
			this.m_sysInitCallback();
		}
		this.m_sysInitCallback = null;
	}
	destroy(): void {

	}
}

export default CoDataModule;

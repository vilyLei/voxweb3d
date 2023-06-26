import { CoSpace } from "../CoSpace";
import { DataFormat } from "../schedule/base/DataUnit";
import { GeometryModelDataType, GeometryDataUnit } from "../schedule/base/GeometryDataUnit";
import { TestRenderableEntity } from "./scene/TestRenderableEntity";
import DivLog from "../../vox/utils/DivLog";
import { TaskCodeModuleParam } from "../schedule/base/TaskCodeModuleParam";
import { ModuleFileType } from "../modules/base/ModuleFileType";
import { ModuleNS } from "../modules/base/ModuleNS";
import { TextureDataUnit } from "../schedule/base/TextureDataUnit";

/**
 * 引擎数据/资源协同空间
 */
export class DemoCospace {
	/**
	 * (引擎)数据协同中心实例
	 */
	private m_cospace: CoSpace = new CoSpace();
	private m_beginTime: number = 0;
	constructor() { }

	initialize(): void {
		console.log("DemoCospace::initialize()...");
		DivLog.SetDebugEnabled(true);

		let dracoModuleParam = new TaskCodeModuleParam("static/cospace/modules/draco/ModuleDracoGeomParser.umd.js", ModuleNS.dracoParser, ModuleFileType.JS);
		dracoModuleParam.params = ["static/cospace/modules/dracoLib/"];
		let modules: TaskCodeModuleParam[] = [
			new TaskCodeModuleParam("static/cospace/core/coapp/CoSpaceApp.umd.js", ModuleNS.coSpaceApp, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/core/code/ThreadCore.umd.js", ModuleNS.threadCore, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", ModuleNS.ctmParser, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/modules/obj/ModuleOBJGeomParser.umd.js", ModuleNS.objParser, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/modules/png/ModulePNGParser.umd.min.js", ModuleNS.pngParser, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/modules/fbxFast/ModuleFBXGeomFastParser.umd.min.js", ModuleNS.fbxFastParser, ModuleFileType.JS),
			dracoModuleParam,
		];
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
		let jsonStr: string = JSON.stringify(dependencyGraphObj);
		this.m_cospace.setThreadDependencyGraphJsonString(jsonStr);

		this.m_cospace.setTaskModuleParams(modules);
		this.m_cospace.initialize(3, "static/cospace/core/code/ThreadCore.umd.js", true, 500);

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			// this.mouseDown(evt);
		};
		// this.initCTMLoad();
		// this.initFBXLoad();
		this.loadDraco();
	}
	private m_files: string[] = ["hand.ctm", "f2.ctm", "h1.ctm", "s3.ctm"];

	private m_pngs: string[] = [
		"static/assets/xulie_49.png",
		"static/assets/letterA.png"
	];
	private m_dracoResIndex = 0;
	private loadDraco(): void {

		// let url = "static/private/draco/errorNormal.drc";
		let url = "static/private/draco/sh202/sh202_" + this.m_dracoResIndex + ".drc";
		url = "static/private/draco/t01.drc";
		url = "static/private/ply/scene01_ply/export_0.drc";
		this.loadDracoCallback(url);
		this.m_dracoResIndex++;
	}
	private mouseDown(evt: any): void {
		this.m_beginTime = Date.now();
		// this.initCTMLoad();

		// this.loadPNGByCallback( this.m_pngs[0] );
		// this.loadPNGByCallback( this.m_pngs[1] );
		this.loadDraco();
	}
	private loadPNGByCallback(url: string): void {

		// let url: string = "static/assets/letterA.png";
		let texture = this.m_cospace.texture;

		texture.getCPUDataByUrlAndCallback(
			url,
			DataFormat.Png,
			(unit: TextureDataUnit, status: number): void => {
				console.log("DemoCospace::loadPNGByCallback(), texture data:", unit.data.imageDatas[0]);
				console.log("DemoCospace::loadPNGByCallback(), texture des:", unit.data.desList[0]);
				console.log("lossTime: ", unit.lossTime + " ms");
			},
			true
		);
	}

	private loadDracoCallback(url: string): void {

		let geom = this.m_cospace.geometry;
		geom.getCPUDataByUrlAndCallback(
			url,
			DataFormat.Draco,
			(unit: GeometryDataUnit, status: number): void => {
				console.log("DemoCospace::loadDracoCallback(), draco model data:", unit.data.models[0]);
				console.log("lossTime: ", unit.lossTime + " ms");
			},
			true
		);
	}
	private initCTMLoad(): void {
		//this.loadCTM();
		// this.loadCTMByCallback();

		// for (let i: number = 0; i < 8; ++i) {
		//     this.loadCTMByCallback();
		// }
		//for (let i: number = 1; i <= 39; ++i) {
		//for (let i: number = 0; i <= 26; ++i) {
		// for (let i: number = 26; i >= 0; --i) {
		for (let i: number = 2; i >= 0; --i) {
			this.loadCtMAt(i);
		}
	}
	private m_receivedTotal: number = 0;
	private loadCtMAt(index: number): void {
		let baseUrl: string = window.location.href + "static/private/ctm/";
		// let url: string = baseUrl + "sh0/1 (" + index +").ctm";
		let url: string = baseUrl + "sh202/sh202_" + index + ".ctm";
		this.m_cospace.geometry.getCPUDataByUrlAndCallback(
			url,
			DataFormat.CTM,
			(unit: GeometryDataUnit, status: number): void => {
				this.m_receivedTotal++;
				let totLossTime: number = Date.now() - this.m_beginTime;
				// console.log("DemoCospace::loadCTMByCallback(), geometry model", unit.data.model);
				// console.log("model: ", unit.data.model);
				// console.log("one res lossTime: ", unit.lossTime + " ms");
				console.log("### loaded a ctm model total lossTime: ", totLossTime + " ms");

				let info: string = "one lossTime: " + unit.lossTime + " ms";
				info += "</br>";
				info += "ALL lossTime: " + totLossTime + " ms, tot: " + this.m_receivedTotal;
				DivLog.ShowLogOnce(info);
			},
			true
		);
	}

	private initFBXLoad(): void {
		// let url = "static/private/fbx/hat_hasNormal.fbx";
		let url = "static/private/fbx/base4.fbx";
		// url = "static/private/fbx/hat_hasNotNormal.fbx";
		this.loadFBX(url);
	}
	private loadFBX(url: string): void {
		this.m_beginTime = Date.now();
		//let baseUrl: string = window.location.href + "static/private/ctm/";

		// let url: string = baseUrl + "sh0/1 (" + index +").ctm";
		//let url: string = baseUrl + "sh202/sh202_" + index + ".ctm";
		console.log("start load fbx...");
		let unit = this.m_cospace.geometry.getCPUDataByUrlAndCallback(
			url,
			DataFormat.FBX,
			(unit: GeometryDataUnit, status: number): void => {
				this.m_receivedTotal++;
				let totLossTime: number = Date.now() - this.m_beginTime;
				console.log("AAAYYYT05, geometry models:", unit.data.models);
				// console.log("DemoCospace::loadFBX(), geometry models:", unit.data.models);
				// console.log("model: ", unit.data.model);
				// console.log("one res lossTime: ", unit.lossTime + " ms");
				console.log("### loaded a fbx model total lossTime: ", totLossTime + " ms");

				let info: string = "fbx one lossTime: " + unit.lossTime + " ms";
				info += "</br>";
				info += "ALL lossTime: " + totLossTime + " ms, tot: " + this.m_receivedTotal;
				DivLog.ShowLogOnce(info);
			},
			true
		);
		unit.data.modelReceiver = (models: GeometryModelDataType[], transforms: Float32Array[], index: number, total: number): void => {
			console.log("XXXX modelReceiver: ", index, total, models);
		}
	}
	private loadCTM(): void {
		let baseUrl: string = window.location.href + "static/assets/ctm/";

		// 随机获取ctm url
		let index: number = Math.round(Math.random() * 1000) % this.m_files.length;
		console.log("index: ", index);
		let url: string = baseUrl + this.m_files[index];

		let entity = new TestRenderableEntity();
		let geometry = entity.geometryEntity;
		this.m_cospace.geometry.getCPUDataByUrl(url, DataFormat.CTM, geometry, true);
	}

	private loadCTMByCallback(): void {
		let baseUrl: string = window.location.href + "static/assets/ctm/";

		// 随机获取ctm url
		let index: number = Math.round(Math.random() * 1000) % this.m_files.length;
		console.log("index: ", index);

		let url: string = baseUrl + this.m_files[index];
		let geometry = this.m_cospace.geometry;

		geometry.getCPUDataByUrlAndCallback(
			url,
			DataFormat.CTM,
			(unit: GeometryDataUnit, status: number): void => {
				console.log("DemoCospace::loadCTMByCallback(), geometry model", unit.data.models[0]);
				console.log("model: ", unit.data.models[0]);
				console.log("lossTime: ", unit.lossTime + " ms");
			},
			true
		);
	}
	run(): void { }
}

export default DemoCospace;

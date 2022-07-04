import { CoSpace } from "../CoSpace";
import { DataFormat } from "../schedule/base/DataUnit";
import { GeometryDataUnit } from "../schedule/base/GeometryDataUnit";
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
	constructor() {}

	initialize(): void {
		console.log("DemoCospace::initialize()...");
		DivLog.SetDebugEnabled(true);

		let modules: TaskCodeModuleParam[] = [
			new TaskCodeModuleParam("static/cospace/core/coapp/CoSpaceApp.umd.js", ModuleNS.coSpaceApp, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/core/code/ThreadCore.umd.js", ModuleNS.threadCore, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", ModuleNS.ctmParser, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/modules/obj/ModuleOBJGeomParser.umd.js", ModuleNS.objParser, ModuleFileType.JS),
			new TaskCodeModuleParam("static/cospace/modules/png/ModulePNGParser.umd.min.js", ModuleNS.pngParser, ModuleFileType.JS)
		];
		// 初始化数据协同中心
		this.m_cospace.setTaskModuleParams(modules);
		this.m_cospace.initialize(3, "static/cospace/core/code/ThreadCore.umd.js", true);

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
	}
	private m_files: string[] = ["hand.ctm", "f2.ctm", "h1.ctm", "s3.ctm"];

	private m_pngs: string[] = [
		"static/assets/xulie_49.png",
		"static/assets/letterA.png"
	];
	private mouseDown(evt: any): void {
		this.m_beginTime = Date.now();
		// this.initCTMLoad();
		this.loadPNGByCallback( this.m_pngs[0] );
		this.loadPNGByCallback( this.m_pngs[1] );

	}
	private loadPNGByCallback(url: string): void {

		// let url: string = "static/assets/letterA.png";
		let texture = this.m_cospace.texture;

		texture.getCPUDataByUrlAndCallback(
			url,
			DataFormat.Png,
			(unit: TextureDataUnit, status: number): void => {
				console.log("DemoCospace::loadPNGByCallback(), texture data", unit.data.imageDatas[0]);
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
		for (let i: number = 26; i >= 0; --i) {
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
				console.log("### total lossTime: ", totLossTime + " ms");

				let info: string = "one lossTime: " + unit.lossTime + " ms";
				info += "</br>";
				info += "ALL lossTime: " + totLossTime + " ms, tot: " + this.m_receivedTotal;
				DivLog.ShowLogOnce(info);
			},
			true
		);
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
	run(): void {}
}

export default DemoCospace;

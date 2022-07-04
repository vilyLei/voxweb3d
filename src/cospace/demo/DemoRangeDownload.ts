import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import BinaryLoader from "../../vox/assets/BinaryLoader";
import { DracoGeomBuilder } from "../modules/draco/DracoGeomBuilder";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
/**
 * 通过加载到的CTM模型二进制数据，发送CTM资源解析任务给多线程数据处理系统，获取解析之后的CTM模型数据
 */
export class DemoRangeDownload {

	private m_threadSchedule: ThreadSchedule = new ThreadSchedule();
	private m_dracoGeomBuilder: DracoGeomBuilder;

	constructor() { }

	initialize(): void {
		console.log("DemoRangeDownload::initialize()...");
		this.initCommon();
		// this.initDracoThread();
	}
	private initCommon(): void{
		let  url: string = "http://localhost:9090/static/assets/draco/cr.rawmd";
		// let  url: string = "http://localhost:9090/static/assets/box.jpg";
		//console.log("loadBinBuffer, dataRange != '': ", dataRange != "");
		const reader = new FileReader();
		reader.onload = e => {
			this.loadedSeg(<ArrayBuffer>reader.result);
		};
		const req = new XMLHttpRequest();
		req.open("GET", url, true);
		let dataRange: string = "0:950486";
		if (dataRange != "") {
			// req.withCredentials = true;
			// // req.setRequestHeader("Access-Control-Allow-Origin", "*");
			req.setRequestHeader('Range', dataRange);
		}

		req.responseType = "blob";
		req.onload = (e) => {
			// console.log("loaded binary buffer req.status: ", req.status,e);
			if (req.status <= 206) {
				reader.readAsArrayBuffer(req.response);
			}
			else {
				console.error("loading error.");
			}
		};
		req.onerror = e => {
			console.error("load error binary buffer req.status: ", req.status);
		};
		req.send(null);
	}
	private loadedSeg(seg: ArrayBuffer): void {

	}

	private initDracoThread(): void {

		let dependencyGraphObj: object = {
			nodes:
				[
					{ uniqueName: "dracoGeomParser", path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.min.js" },
					{ uniqueName: "dracoWasmWrapper", path: "static/cospace/modules/dracoLib/w2.js" },
					{ uniqueName: "ctmGeomParser", path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.min.js" }
				],
			maps:
				[
					{ uniqueName: "dracoGeomParser", includes: [1] } // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
				]
		};
		let jsonStr: string = JSON.stringify(dependencyGraphObj);

		// 初始化多线程调度器
		// this.m_threadSchedule.initialize(1, "cospace/core/code/ThreadCore.umd.min.js");
		this.m_threadSchedule.setDependencyGraphJsonString(jsonStr);
		this.m_threadSchedule.initialize(1, "static/cospace/core/code/ThreadCore.umd.js");

		// 建立 draco 模型数据builder(包含加载和解析)
		this.m_dracoGeomBuilder = new DracoGeomBuilder("static/cospace/modules/draco/ModuleDracoGeomParser.umd.js");

		// draco 模型数据url
		let url = "static/assets/modules/clothRoll.rawmd";
		this.m_dracoGeomBuilder.initialize(this.m_threadSchedule);
		this.m_dracoGeomBuilder.setListener(this);

		// draco模型数据字节分段信息
		let segRangeList: number[] = [950486, 1900738, 0, 950486, 1900738, 1907181, 1907181, 1912537, 1912537, 1920151, 1920151, 1924126];
		this.m_dracoGeomBuilder.load(url, segRangeList);

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		this.update();
	}
	// 单个draco segment 几何数据解析结束之后的回调
	dracoParse(model: GeometryModelDataType, index: number, total: number): void {
	}
	// 所有 draco segment 几何数据解析结束之后的回调，表示本次加载解析任务结束
	dracoParseFinish(models: GeometryModelDataType[], total: number): void {
		console.log("dracoParseFinish models: ", models);
	}
	private mouseDown(evt: any): void {

	}
	private m_timeoutId: any = -1;
	/**
	 * 定时调度
	 */
	private update(): void {
		this.m_threadSchedule.run();
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 40); // 25 fps
	}
	run(): void { }
}

export default DemoRangeDownload;

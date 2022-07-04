import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { PNGDescriptorType, PNGParseTask } from "../modules/png/PNGParseTask";
import BinaryLoader from "../../vox/assets/BinaryLoader";
/**
 * 通过加载到的 PNG 模型二进制数据，发送CTM资源解析任务给多线程数据处理系统，获取解析之后的CTM模型数据
 */
export class DemoPNGParser {

	private m_threadSchedule: ThreadSchedule;
	private m_pngParseTask: PNGParseTask;

	constructor() { }

	initialize(): void {

		console.log("DemoPNGParser::initialize()...");

		// 创建多线程调度器(多线程系统)
		let schedule = new ThreadSchedule();
		// 初始化多线程调度器
		schedule.initialize(2, "static/cospace/core/code/ThreadCore.umd.js");

		// 创建 png 加载解析任务
		let pngParseTask = new PNGParseTask("static/cospace/modules/png/ModulePNGParser.umd.min.js");
		// 绑定当前任务到多线程调度器
		schedule.bindTask(pngParseTask);

		// 设置一个任务完成的侦听器
		pngParseTask.setListener(this);

		this.m_threadSchedule = schedule;
		this.m_pngParseTask = pngParseTask;

		// 启动循环调度
		this.update();
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		//console.log("getBaseUrl(): ", this.getBaseUrl());
	}

	// 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
	pngParseFinish(pngBuffer: ArrayBuffer, des: PNGDescriptorType): void {

		console.log("DemoPNGParser::pngParseFinish(), pngBuffer: ", pngBuffer, ", des: ", des);
	}

	private setBinaryDataToTask(pngDataBuffer: Uint8Array, url: string): void {
		// 发送一份任务处理数据，一份数据一个子线程处理一次
		this.m_pngParseTask.addBinaryData(pngDataBuffer, url);
	}
	private mouseDown(evt: any): void {
		let pngUrl: string = "static/assets/letterA.png";
		this.initPNGFromBin(pngUrl);
	}

	private initPNGFromBin(pngUrl: string): void {
		let pngLoader: BinaryLoader = new BinaryLoader();
		pngLoader.uuid = pngUrl;
		pngLoader.load(pngUrl, this);
	}

	loaded(buffer: Uint8Array, uuid: string): void {
		this.setBinaryDataToTask(buffer, uuid);
	}
	loadError(status: number, uuid: string): void { }

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

export default DemoPNGParser;

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { FileLoader } from "../../modules/loaders/FileLoader";
import { DataUnitPool } from "../base/DataUnitPool";
import { ReceiverSchedule } from "../ReceiverSchedule";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { ThreadSchedule } from "../../modules/thread/ThreadSchedule";
import { TaskCodeModuleParam } from "../TaskCodeModuleParam";

import { DataUnitLock, GeometryDataUnit } from "../base/GeometryDataUnit";
import { CTMParseTask } from "../../modules/ctm/CTMParseTask";
import DivLog from "../../../vox/utils/DivLog";

class CTMParserListerner {

	private m_unitPool: DataUnitPool<GeometryDataUnit>;
	private m_parseTask: CTMParseTask;
	private m_receiverSchedule: ReceiverSchedule;	
	constructor(unitPool: DataUnitPool<GeometryDataUnit>, threadSchedule: ThreadSchedule, module: TaskCodeModuleParam, receiverSchedule: ReceiverSchedule) {

		// let task = new CTMParseTask();// 创建ctm 加载解析任务
		let parseTask = new CTMParseTask(module.url);
		// 绑定当前任务到多线程调度器
		threadSchedule.bindTask(parseTask);
		parseTask.setListener(this);

		this.m_unitPool = unitPool;
		this.m_parseTask = parseTask;
		this.m_receiverSchedule = receiverSchedule;
	}
	
	addUrlToTask(url: string): void {

		if (!this.m_unitPool.hasUnitByUrl(url)) {
			
			new FileLoader().load(
				url,
				(buf: ArrayBuffer, url: string): void => {
					DivLog.ShowLogOnce("正在解析CTM数据...");
					this.m_parseTask.addBinaryData(new Uint8Array(buf), url);
				},
				(evt: ProgressEvent, url: string): void => {
					let k = Math.round(100 * evt.loaded/evt.total);
					DivLog.ShowLogOnce("ctm file loading " + k + "%");
				},
				(status: number, url: string): void => {
					console.error("load ctm mesh data error, url: ", url);
				}
			);
		}
	}
	// 一个任务数据处理完成后的侦听器回调函数
	ctmParseFinish(model: GeometryModelDataType, url: string): void {

		// console.log("CTMParserListerner::ctmParseFinish(), model: ", model, ", url: ", url);

		if (this.m_unitPool.hasUnitByUrl(url)) {

			let unit: GeometryDataUnit = this.m_unitPool.getUnitByUrl(url);
			if (unit != null) {
				
				unit.lossTime = Date.now() - unit.lossTime;
				unit.data.models = [model];

				DataUnitLock.lockStatus = 209;
				unit.toCpuPhase();
				if (unit.immediate) {
					// console.log("geom data receive at once.");
					this.m_receiverSchedule.testUnit(unit);
				}
			}
		}
	}
}
export { CTMParserListerner };

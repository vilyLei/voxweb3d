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
import { ITaskCodeModuleParam } from "../base/ITaskCodeModuleParam";

import { DataFormat, DataUnitLock, GeometryDataUnit } from "../base/GeometryDataUnit";
import { OBJParseTask } from "../../modules/obj/OBJParseTask";
import DivLog from "../../../vox/utils/DivLog";

class OBJParserListerner {

	private m_parseTask: OBJParseTask = null;
	private m_unitPool: DataUnitPool<GeometryDataUnit>;
	private m_receiverSchedule: ReceiverSchedule;
	private m_threadSchedule: ThreadSchedule;
	private m_moduleUrl: string;

	constructor(unitPool: DataUnitPool<GeometryDataUnit>, threadSchedule: ThreadSchedule, module: ITaskCodeModuleParam, receiverSchedule: ReceiverSchedule) {
		
		this.m_moduleUrl = module.url;
		this.m_unitPool = unitPool;
		this.m_threadSchedule = threadSchedule;
		this.m_receiverSchedule = receiverSchedule;
	}
	
	addUrlToTask(url: string): void {

		if (!this.m_unitPool.hasUnitByUrl(url)) {

			if(this.m_parseTask == null) {				
				// 创建ctm 加载解析任务
				let parseTask = new OBJParseTask(this.m_moduleUrl);
				// 绑定当前任务到多线程调度器
				this.m_threadSchedule.bindTask(parseTask);
				parseTask.setListener(this);
				this.m_parseTask = parseTask;
			}
			
			new FileLoader().load(
				url,
				(buf: ArrayBuffer, url: string): void => {
					DivLog.ShowLogOnce("正在解析OBJ数据...");
					this.m_parseTask.addBinaryData(buf, url);
				},
				(evt: ProgressEvent, url: string): void => {
					let k = Math.round(100 * evt.loaded/evt.total);
					DivLog.ShowLogOnce("obj file loading " + k + "%");
				},
				(status: number, url: string): void => {
					console.error("load ctm mesh data error, url: ", url);
				}
			);
		}
	}
	// 一个任务数据处理完成后的侦听器回调函数
	objParseFinish(models: GeometryModelDataType[], url: string): void {

		// console.log("ObjParserListerner::ctmParseFinish(), models: ", models, ", url: ", url);

		if (this.m_unitPool.hasUnitByUrl(url)) {

			let unit: GeometryDataUnit = this.m_unitPool.getUnitByUrl(url);
			if (unit != null) {
				
				unit.lossTime = Date.now() - unit.lossTime;
				unit.data.dataFormat = DataFormat.OBJ;
				unit.data.models = models;

				DataUnitLock.lockStatus = 209;
				unit.toCpuPhase();
				if (unit.immediate) {
					// console.log("geom data receive at once.");
					this.m_receiverSchedule.testUnit(unit);
				}
			}
		}
	}
	destroy(): void {
		if(this.m_parseTask != null) {
			this.m_parseTask.destroy();
			this.m_parseTask = null;
		}
		this.m_unitPool = null;
		this.m_threadSchedule = null;
		this.m_receiverSchedule = null;
	}
}
export { OBJParserListerner };

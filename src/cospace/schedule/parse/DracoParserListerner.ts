/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { HttpFileLoader } from "../../modules/loaders/HttpFileLoader";
import { DataUnitPool } from "../base/DataUnitPool";
import { ReceiverSchedule } from "../ReceiverSchedule";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { ThreadSchedule } from "../../modules/thread/ThreadSchedule";
import { ITaskCodeModuleParam } from "../base/ITaskCodeModuleParam";

import { DataUnitLock, GeometryDataUnit } from "../base/GeometryDataUnit";
import DivLog from "../../../vox/utils/DivLog";
import { DracoGeomBuilder } from "../../modules/draco/DracoGeomBuilder";

class DracoParserListerner {

	private m_parseTask: DracoGeomBuilder = null;
	private m_unitPool: DataUnitPool<GeometryDataUnit>;
	private m_receiverSchedule: ReceiverSchedule;
	private m_threadSchedule: ThreadSchedule;
	private m_moduleUrl: string;
	private m_dirUrl: string;
	constructor(unitPool: DataUnitPool<GeometryDataUnit>, threadSchedule: ThreadSchedule, module: ITaskCodeModuleParam, receiverSchedule: ReceiverSchedule) {

		this.m_moduleUrl = module.url;
		this.m_dirUrl = module.params[0] as string;
		this.m_unitPool = unitPool;
		this.m_threadSchedule = threadSchedule;
		this.m_receiverSchedule = receiverSchedule;
	}

	addUrlToTask(url: string): void {

		console.log("### DracoParserListerner()::addUrlToTask(), url: ", url);
		if (!this.m_unitPool.hasUnitByUrl(url)) {
			if (this.m_parseTask == null) {

				console.log("### DracoParserListerner()::addUrlToTask(), build task..., this.m_dirUrl: ", this.m_dirUrl);
				// 建立 draco 模型数据builder(包含加载和解析)
				let task = new DracoGeomBuilder(this.m_moduleUrl);

				task.initialize(this.m_threadSchedule, this.m_dirUrl);
				task.setListener(this);

				this.m_parseTask = task;
			}
			console.log("### DracoParserListerner()::addUrlToTask(), start load url: ", url);
			new HttpFileLoader().load(
				url,
				(buf: ArrayBuffer, url: string): void => {
					DivLog.ShowLogOnce("正在解析Draco数据...");
					this.m_parseTask.parseSingleSegData(buf, url);
				},
				(progress: number, url: string): void => {
					let k = Math.round(100 * progress);
					DivLog.ShowLogOnce("draco file loading " + k + "%");
				},
				(status: number, url: string): void => {
					console.error("load draco mesh data error, url: ", url);

					this.dracoParseSingle({vertices: null, uvsList: null, normals: null, indices: null}, url, 0);
				}
			);
		}
	}

	dracoParseSingle(model: GeometryModelDataType, url: string, index: number): void {

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

	// 单个draco segment 几何数据解析结束之后的回调
	dracoParse(model: GeometryModelDataType, index: number, total: number): void {
	}
	// 所有 draco segment 几何数据解析结束之后的回调，表示本次加载解析任务结束
	dracoParseFinish(models: GeometryModelDataType[], total: number): void {
	}
	destroy(): void {
		if (this.m_parseTask != null) {
			this.m_parseTask.destroy();
			this.m_parseTask = null;
		}
		this.m_unitPool = null;
		this.m_threadSchedule = null;
		this.m_receiverSchedule = null;
	}
}
export { DracoParserListerner };

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { FileLoader } from "../modules/loaders/FileLoader";

import { DataUnitPool } from "./base/DataUnitPool";
import { DataFormat } from "./base/DataUnit";
import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { ResourceSchedule } from "./ResourceSchedule";
import { ReceiverSchedule } from "./ReceiverSchedule";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";

import { DataUnitLock, GeometryDataContainer, GeometryDataUnit } from "./base/GeometryDataUnit";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";

class CTMParserListerner {

	private m_unitPool: DataUnitPool<GeometryDataUnit>;
	private m_ctmParseTask: CTMParseTask;
	private m_receiverSchedule: ReceiverSchedule;
	private m_loader: FileLoader = new FileLoader();

	constructor(unitPool: DataUnitPool<GeometryDataUnit>, ctmParseTask: CTMParseTask, receiverSchedule: ReceiverSchedule) {

		this.m_unitPool = unitPool;
		this.m_ctmParseTask = ctmParseTask;
		ctmParseTask.setListener(this);
		this.m_receiverSchedule = receiverSchedule;
	}
	
	addUrlToTask(url: string): void {

		if (!this.m_unitPool.hasUnitByUrl(url)) {
			
			this.m_loader.load(
				url,
				(buf: ArrayBuffer, url: string): void => {
					// 创建一个实例来解析，杜绝了异步加载带来的顺序错乱的问题，保证解析的是加载结束后获得的数据
					this.m_ctmParseTask.addBinaryData(new Uint8Array(buf), url);
				},
				null,
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
				unit.data.model = model;

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
/**
 * 数据资源调度器基类
 */
class GeometryResourceSchedule extends ResourceSchedule<GeometryDataUnit> {

	private m_ctmListener: CTMParserListerner;
	constructor() {
		super();
	}
	/**
	 * 覆盖父类函数，实现具体功能
	 */
	protected createDataUnit(url: string, dataFormat: DataFormat, immediate: boolean = false): GeometryDataUnit {

		DataUnitLock.lockStatus = 207;
		let unit = new GeometryDataUnit();
		unit.lossTime = Date.now();
		unit.immediate = immediate;
		unit.data = new GeometryDataContainer();
		unit.data.dataFormat = dataFormat;

		switch (unit.data.dataFormat) {
			case DataFormat.CTM:
				this.m_ctmListener.addUrlToTask(url);
				break
			case DataFormat.Draco:
				//this.m_ctmListener.addUrlToTask(url);
				break
			default:
				console.error("illegal url: ", url);
				break;
		}
		return unit;
	}
	/**
	 * 被子类覆盖，以便实现具体功能
	 */
	protected initTask(unitPool: DataUnitPool<GeometryDataUnit>, threadSchedule: ThreadSchedule, receiverSchedule: ReceiverSchedule, taskModuleUrls: string[]): void {

		// 创建ctm 加载解析任务
		let ctmParseTask = new CTMParseTask(taskModuleUrls[ 0 ]);
		// 绑定当前任务到多线程调度器
		threadSchedule.bindTask(ctmParseTask);

		this.m_ctmListener = new CTMParserListerner(unitPool, ctmParseTask, receiverSchedule);
	}
	/**
	 * 销毁当前实例
	 */
	destroy(): void {
		super.destroy();
	}
}

export { GeometryResourceSchedule };

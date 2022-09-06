/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import { DataUnitPool } from "./base/DataUnitPool";
import { DataFormat } from "./base/DataUnit";
import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { ResourceSchedule } from "./ResourceSchedule";
import { ReceiverSchedule } from "./ReceiverSchedule";
import { ITaskCodeModuleParam } from "./base/ITaskCodeModuleParam";
import { ModuleNS } from "../modules/base/ModuleNS";

import { DataUnitLock, GeometryDataContainer, GeometryDataUnit } from "./base/GeometryDataUnit";
import { CTMParserListerner } from "./parse/CTMParserListerner";
import { DracoParserListerner } from "./parse/DracoParserListerner";
import { OBJParserListerner } from "./parse/OBJParserListerner";
import { FBXParserListerner } from "./parse/FBXParserListerner";

/**
 * 数据资源调度器基类
 */
class GeometryResourceSchedule extends ResourceSchedule<GeometryDataUnit> {

	private m_ctmListener: CTMParserListerner;
	private m_dracoListener: DracoParserListerner;
	private m_objListener: OBJParserListerner;
	private m_fbxListener: FBXParserListerner;
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
		console.log("GeometryResourceSchedule::createDataUnit(), unit.data.dataFormat: ", unit.data.dataFormat);
		switch (unit.data.dataFormat) {
			case DataFormat.CTM:
				this.m_ctmListener.addUrlToTask(url);
				break;
			case DataFormat.Draco:
				this.m_dracoListener.addUrlToTask(url);
				break;
			case DataFormat.OBJ:
				this.m_objListener.addUrlToTask(url);
				break;
			case DataFormat.FBX:
				this.m_fbxListener.addUrlToTask(url);
				break;
			default:
				console.error("GeometryResourceSchedule::createDataUnit(), illegal data format:", unit.data.dataFormat, ", its url: ", url);
				break;
		}
		return unit;
	}
	/**
	 * 被子类覆盖，以便实现具体功能
	 */
	protected initTask(unitPool: DataUnitPool<GeometryDataUnit>, threadSchedule: ThreadSchedule, receiverSchedule: ReceiverSchedule, taskModules: ITaskCodeModuleParam[]): void {

		for (let i: number = 0; i < taskModules.length; ++i) {
			const module = taskModules[i];
			console.log("GeometryResourceSchedule::initTask(), module.name ", module.name);
			switch (module.name) {
				case ModuleNS.ctmParser:
					this.m_ctmListener = new CTMParserListerner(unitPool, threadSchedule, module, receiverSchedule);
					break;
				case ModuleNS.dracoParser:
					this.m_dracoListener = new DracoParserListerner(unitPool, threadSchedule, module, receiverSchedule);
					break;
				case ModuleNS.objParser:
					this.m_objListener = new OBJParserListerner(unitPool, threadSchedule, module, receiverSchedule);
					break;
				case ModuleNS.fbxFastParser:
					this.m_fbxListener = new FBXParserListerner(unitPool, threadSchedule, module, receiverSchedule);
					break;
				default:
					break;
			}
		}
	}
	/**
	 * 销毁当前实例
	 */
	destroy(): void {
		super.destroy();
		if (this.m_ctmListener != null) {
			this.m_ctmListener.destroy();
			this.m_ctmListener = null;
		}
		if (this.m_objListener != null) {
			this.m_objListener.destroy();
			this.m_objListener = null;
		}
		if (this.m_fbxListener != null) {
			this.m_fbxListener.destroy();
			this.m_fbxListener = null;
		}
	}
}

export { GeometryResourceSchedule };

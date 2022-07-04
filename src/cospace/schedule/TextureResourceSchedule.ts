import { DataUnitPool } from "./base/DataUnitPool";
import { DataFormat } from "./base/DataUnit";
import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { ResourceSchedule } from "./ResourceSchedule";
import { ReceiverSchedule } from "./ReceiverSchedule";
import { DataUnitLock, TextureDataContainer, TextureDataUnit } from "./base/TextureDataUnit";
import { ITaskCodeModuleParam } from "./base/ITaskCodeModuleParam";
import { PNGParserListerner } from "./parse/PNGParserListerner";
import { ModuleNS } from "../modules/base/ModuleNS";

class TextureResourceSchedule extends ResourceSchedule<TextureDataUnit> {
	private m_pngListener: PNGParserListerner;
	constructor() {
		super();
	}

	/**
	 * 被子类覆盖，以便实现具体功能
	 */
	protected createDataUnit(url: string, dataFormat: DataFormat, immediate: boolean = false): TextureDataUnit {
		DataUnitLock.lockStatus = 207;
		let unit = new TextureDataUnit();
		unit.lossTime = Date.now();
		unit.immediate = immediate;
		unit.data = new TextureDataContainer();
		unit.data.dataFormat = dataFormat;

		switch (unit.data.dataFormat) {
			case DataFormat.Jpg:
				break;
			case DataFormat.Png:
				this.m_pngListener.addUrlToTask(url);
				break;
			default:
				console.error("TextureResourceSchedule::createDataUnit(), illegal data format:",unit.data.dataFormat,", its url: ", url);
				break;
		}
		return unit;
	}

	/**
	 * 被子类覆盖，以便实现具体功能
	 */
	protected initTask(
		unitPool: DataUnitPool<TextureDataUnit>,
		threadSchedule: ThreadSchedule,
		receiverSchedule: ReceiverSchedule,
		taskModules: ITaskCodeModuleParam[]
	): void {
		for (let i: number = 0; i < taskModules.length; ++i) {
			const module = taskModules[i];
			console.log("TextureResourceSchedule::initTask(), module.name ", module.name);
			switch (module.name) {
				case ModuleNS.pngParser:
					this.m_pngListener = new PNGParserListerner(unitPool, threadSchedule, module, receiverSchedule);
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
	}
}

export { TextureResourceSchedule };

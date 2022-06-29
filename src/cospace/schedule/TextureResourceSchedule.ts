import { DataUnitPool } from "./base/DataUnitPool";
import { DataFormat } from "./base/DataUnit";
import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { ResourceSchedule } from "./ResourceSchedule";
import { ReceiverSchedule } from "./ReceiverSchedule";
import { DataUnitLock, TextureDataContainer, TextureDataUnit } from "./base/TextureDataUnit";
import { TaskCodeModuleParam } from "./TaskCodeModuleParam";

class TextureResourceSchedule extends ResourceSchedule<TextureDataUnit> {

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
			case DataFormat.Png:
				break;
			default:
				console.error("illegal url: ", url);
				break;
		}
		return unit;
	}
	/**
	 * 被子类覆盖，以便实现具体功能
	 */
	protected initTask(unitPool: DataUnitPool<TextureDataUnit>, threadSchedule: ThreadSchedule, receiverSchedule: ReceiverSchedule, taskModules: TaskCodeModuleParam[]): void {

	}
	/**
	 * 销毁当前实例
	 */
	destroy(): void {
		super.destroy();
	}
}

export { TextureResourceSchedule };

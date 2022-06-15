import { DataUnit } from "./DataUnit";
import { ListPoolItem } from "./ListPoolItem";

interface DataUnitReceiver extends ListPoolItem {

    // 表示 none/net/cpu/gpu 三个阶段的信息, 初始值必须是DataPhaseFlag.PHASE_NONE, 外部用户不能操作
    dataPhaseFlag: number;
    // 初始值必须是0, 外部用户不能操作
    dataUnitUUID: number;
    receiveDataUnit(unit: DataUnit, status: number): void;
}
export { DataUnitReceiver };

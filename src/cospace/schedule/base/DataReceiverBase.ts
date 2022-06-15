import { DataPhaseFlag } from "./DataPhaseFlag";
import { DataUnit } from "./DataUnit";
import { DataUnitReceiver } from "./DataUnitReceiver";
/**
 * 实现 DataUnitReceiver 行为的 基类
 */
class DataReceiverBase implements DataUnitReceiver {

    // 表示 none/net/cpu/gpu 三个阶段的信息, 初始值必须是DataPhaseFlag.PHASE_NONE, 外部用户不能操作
    dataPhaseFlag: number = DataPhaseFlag.PHASE_NONE;
    // 初始值必须是0, 外部用户不能操作
    dataUnitUUID: number = 0;
    // 初始值必须是0, 外部用户不能操作
    listUUID: number = 0;
    constructor(){}
    receiveDataUnit(unit: DataUnit, status: number): void {
        console.log("DataReceiverBase::receiveDataUnit(), unit: ",unit);
    }
}

export { DataReceiverBase }
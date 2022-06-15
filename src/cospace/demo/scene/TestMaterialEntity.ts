import { DataUnit } from "../../schedule/base/DataUnit";
import { DataReceiverBase } from "../../schedule/base/DataReceiverBase";
/**
 * 模拟引擎中的材质对象
 */
class TestMaterialEntity extends DataReceiverBase {
    constructor(){
        super();
    }
    receiveDataUnit(unit: DataUnit, status: number): void {
        console.log("TestMaterialEntity::receiveDataUnit(), unit: ", unit);
    }
}

export { TestMaterialEntity }
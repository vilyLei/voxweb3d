import { DataUnit } from "../../schedule/base/DataUnit";
import { DataReceiverBase } from "../../schedule/base/DataReceiverBase";
import { GeometryDataContainer, GeometryDataUnit } from "../../schedule/base/GeometryDataUnit";
/**
 * 模拟引擎中的几何对象
 */
class TestGeometryEntity extends DataReceiverBase {
    constructor(){
        super();
    }
    receiveDataUnit(unit: GeometryDataUnit, status: number): void {
        console.log("TestGeometryEntity::receiveDataUnit(), geometry model: ",unit.data.models[0]);
    }
}

export { TestGeometryEntity }
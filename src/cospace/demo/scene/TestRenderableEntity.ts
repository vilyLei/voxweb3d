import { TestGeometryEntity } from "./TestGeometryEntity";
import { TestMaterialEntity } from "./TestMaterialEntity";
/**
 * 模拟引擎中的可渲染对象
 */
class TestRenderableEntity {
    /**
     * 几何对象实例
     */
    geometryEntity: TestGeometryEntity = new TestGeometryEntity();
    /**
     * 材质对象实例
     */
    materialEntity: TestMaterialEntity = new TestMaterialEntity();
    constructor(){}
}
export { TestRenderableEntity };

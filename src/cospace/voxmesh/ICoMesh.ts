import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import ITransformEntity from "../../vox/entity/ITransformEntity";

interface ICoMesh {

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;
	/**
	 * @param size the default value is 100
	 */
	createCrossAxis3DEntity(size: number): ITransformEntity;
}
export { ICoMesh };

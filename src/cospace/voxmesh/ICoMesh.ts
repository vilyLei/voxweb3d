import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";

interface ICoMesh {

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;
}
export { ICoMesh };

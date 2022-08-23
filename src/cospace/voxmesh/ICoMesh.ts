import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";

interface ICoMesh {

	/**
	 * plane mesh builder
	 */
	planeMeshBuilder: IPlaneMeshBuilder;

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;	
	createBoundsMesh(): IBoundsMesh;
	/**
	 * @param size the default value is 100
	 */
	createCrossAxis3DEntity(size: number): ITransformEntity;
}
export { ICoMesh };

import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";
import { ILineMeshBuilder } from "./build/ILineMeshBuilder";

interface ICoMesh {

	/**
	 * plane mesh builder
	 */
	readonly planeMeshBuilder: IPlaneMeshBuilder;
	readonly lineMeshBuilder: ILineMeshBuilder;

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;	
	createBoundsMesh(): IBoundsMesh;
}
export { ICoMesh };

import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";
import { ILineMeshBuilder } from "./build/ILineMeshBuilder";
import { IConeMeshBuilder } from "./build/IConeMeshBuilder";

interface ICoMesh {

	/**
	 * plane mesh builder
	 */
	readonly planeMeshBuilder: IPlaneMeshBuilder;
	/**
	 * line mesh builder
	 */
	readonly lineMeshBuilder: ILineMeshBuilder;
	/**
	 * cone mesh builder
	 */
	readonly coneMeshBuilder: IConeMeshBuilder;

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;	
	createBoundsMesh(): IBoundsMesh;
}
export { ICoMesh };

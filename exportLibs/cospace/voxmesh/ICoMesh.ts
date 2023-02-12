import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";
import { ILineMeshBuilder } from "./build/ILineMeshBuilder";
import { IConeMeshBuilder } from "./build/IConeMeshBuilder";
import { IBoxMeshBuilder } from "./build/IBoxMeshBuilder";

interface ICoMesh {

	/**
	 * plane mesh builder
	 */
	readonly plane: IPlaneMeshBuilder;
	/**
	 * line mesh builder
	 */
	readonly line: ILineMeshBuilder;
	/**
	 * cone mesh builder
	 */
	readonly cone: IConeMeshBuilder;
	/**
	 * box mesh builder
	 */
	readonly box: IBoxMeshBuilder;

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;	
	createBoundsMesh(): IBoundsMesh;
}
export { ICoMesh };

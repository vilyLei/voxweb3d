import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";

interface ICoMesh {

	/**
	 * plane mesh builder
	 */
	planeMeshBuilder: IPlaneMeshBuilder;

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;	
	createBoundsMesh(): IBoundsMesh;
}
export { ICoMesh };

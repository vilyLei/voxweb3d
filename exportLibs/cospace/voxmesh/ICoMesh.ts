import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";
import { ILineMeshBuilder } from "./build/ILineMeshBuilder";
import { IConeMeshBuilder } from "./build/IConeMeshBuilder";
import { IBoxMeshBuilder } from "./build/IBoxMeshBuilder";
import { ISphereMeshBuilder } from "./build/ISphereMeshBuilder";
import { ICylinderMeshBuilder } from "./build/ICylinderMeshBuilder";
import { ITubeMeshBuilder } from "./build/ITubeMeshBuilder";
import { ITorusMeshBuilder } from "./build/ITorusMeshBuilder";

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
	/**
	 * sphere mesh builder
	 */
	readonly sphere: ISphereMeshBuilder;
	/**
	 * cylinder mesh builder
	 */
	readonly cylinder: ICylinderMeshBuilder;
	/**
	 * tube mesh builder
	 */
	readonly tube: ITubeMeshBuilder;
	/**
	 * torus mesh builder
	 */
	readonly torus: ITorusMeshBuilder;

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;	
	createBoundsMesh(): IBoundsMesh;
}
export { ICoMesh };

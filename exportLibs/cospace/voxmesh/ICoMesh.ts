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
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { CoGeomDataType } from "../app/CoSpaceAppData";

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
	/**
	 * @param model geometry model data
	 * @param material IRenderMaterial instance, the default value is null.
	 * @param texEnabled the default value is false;
	 */
	createDataMeshFromModel(model: CoGeomDataType, material?: IRenderMaterial, texEnabled?: boolean): IDataMesh;
	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;
	createBoundsMesh(): IBoundsMesh;
}
export { ICoMesh };

import IVector3D from "../../vox/math/IVector3D";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";
import IMouseEventEntity from "../../vox/entity/IMouseEventEntity";
import IBoundsEntity from "../../vox/entity/IBoundsEntity";
import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";

interface ICoEntity {

	/**
	 * @param model geometry model
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	createDataMeshFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, vbWhole?: boolean): IDataMesh;
	/**
	 * @param model geometry model
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param texEnabled texture enabled in the material, the default is true.
	 * @param vbWhole vtx buffer is whole data or not, the default is false.
	 */
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, texEnabled?: boolean, vbWhole?: boolean): ITransformEntity;

	createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D): ITransformEntity;
	/**
	 * @param size th default value is 100.0
	 */
	createAxis3DEntity(size?: number): ITransformEntity;

	/**
	 * @param model IDataMesh instance
	 * @param material IRenderMaterial instance.
	 * @param texEnabled use texture yes or no.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	createDisplayEntityWithDataMesh(mesh: IDataMesh, material: IRenderMaterial, texEnabled?: boolean, vbWhole?: boolean): ITransformEntity;
	createDisplayEntity(): ITransformEntity;
	createMouseEventEntity(): IMouseEventEntity;
	createBoundsEntity(): IBoundsEntity;

	/**
	 * create a cross axis randerable entity
	 * @param size the default value is 100
	 */
	createCrossAxis3DEntity(size: number): ITransformEntity;
	
	createDisplayEntityContainer(): IDisplayEntityContainer;
}
export { ICoEntity };

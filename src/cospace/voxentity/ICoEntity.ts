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

	/**
	 * 
	 * @param minX min x-axis value
	 * @param minY min y-axis value
	 * @param width plane width value
	 * @param height plane height value
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a plane entity, it is parallel with xoy plane
	 */
	createXOYPlane(minX: number, minY: number, width: number, height: number, material?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
	/**
	 * @param minX min x-axis value
	 * @param minZ min z-axis value 
	 * @param width plane width value 
	 * @param long plane long value
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a plane entity, it is parallel with xoz plane
	 */
	createXOZPlane(minX: number, minZ: number, width: number, long: number, material?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
	/**
	 * @param minY min y-axis value 
	 * @param minZ min z-axis value 
	 * @param height plane height value 
	 * @param long plane long value 
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a plane entity, it is parallel with yoz plane
	 */
	createYOZPlane(minY: number, minZ: number, height: number, long: number, material?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
	/**
	 * @param minV min position
	 * @param maxV max position
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a box entity
	 */
	createBox(minV: IVector3D, maxV: IVector3D, material?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
	/**
	 * @param size cube size
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a box entity
	 */
	createCube(size: number, material?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
	/**
	 * @param radius the sphere radius
	 * @param longitudeNumSegments the default value is 20
	 * @param latitudeNumSegments the default value is 20
	 * @param doubleTriFaceEnabled the default value is false
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a sphere entity
	 */
	createSphere(radius: number, longitudeNumSegments?: number, latitudeNumSegments?: number, doubleTriFaceEnabled?: boolean, material?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
	/**
	 * @param radius the cone radius 
	 * @param height the cone height  
	 * @param longitudeNumSegments the default value is 20
	 * @param alignYRatio the default value is -0.5 
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a cone entity
	 */
	createCone(radius: number, height: number, longitudeNumSegments?: number, alignYRatio?: number, material?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
}
export { ICoEntity };

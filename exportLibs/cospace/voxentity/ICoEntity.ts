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
	 * @param pmaterial IRenderMaterial instance, the default value is null.
	 * @param vbWhole texture enabled in the material, the default value is false.
	 */
	createDataMeshFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, texEnabled?: boolean): IDataMesh;
	/**
	 * @param model geometry model data
	 * @param pmaterial IRenderMaterial instance, the default value is null.
	 * @param texEnabled texture enabled in the material, the default value is false.
	 */
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;

	createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D): ITransformEntity;
	/**
	 * @param size th default value is 100.0
	 */
	createAxis3DEntity(size?: number): ITransformEntity;

	/**
	 * @param model IDataMesh instance
	 * @param material IRenderMaterial instance.
	 * @param texEnabled use texture yes or no, the default value is false.
	 */
	createDisplayEntityWithDataMesh(mesh: IDataMesh, material: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
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
	createXOYPlane(minX: number, minY: number, width: number, height: number, material?: IRenderMaterial, texEnabled?: boolean): IMouseEventEntity;
	/**
	 * @param minX min x-axis value
	 * @param minZ min z-axis value 
	 * @param width plane width value 
	 * @param long plane long value
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a plane entity, it is parallel with xoz plane
	 */
	createXOZPlane(minX: number, minZ: number, width: number, long: number, material?: IRenderMaterial, texEnabled?: boolean): IMouseEventEntity;
	/**
	 * @param minY min y-axis value 
	 * @param minZ min z-axis value 
	 * @param height plane height value 
	 * @param long plane long value 
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a plane entity, it is parallel with yoz plane
	 */
	createYOZPlane(minY: number, minZ: number, height: number, long: number, material?: IRenderMaterial, texEnabled?: boolean): IMouseEventEntity;
	/**
	 * @param minV min position
	 * @param maxV max position
	 * @param material the default value is null
	 * @param texEnabled the default value is false
	 * @returns a box entity
	 */
	createBox(minV: IVector3D, maxV: IVector3D, material?: IRenderMaterial, texEnabled?: boolean): IMouseEventEntity;
	/**
	 * @param size cube size
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @returns a box entity
	 */
	createCube(size: number, material?: IRenderMaterial, texEnabled?: boolean): IMouseEventEntity;
	/**
	 * @param radius the sphere radius
	 * @param longitudeNumSegments the default value is 20
	 * @param latitudeNumSegments the default value is 20
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @param doubleTriFaceEnabled the default value is false
	 * @returns a sphere entity
	 */
	createSphere(radius: number, longitudeNumSegments?: number, latitudeNumSegments?: number, material?: IRenderMaterial, texEnabled?: boolean, doubleTriFaceEnabled?: boolean): IMouseEventEntity;
	/**
	 * @param radius cone radius 
	 * @param height cone height  
	 * @param longitudeNumSegments the default value is 20
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @param alignYRatio the default value is -0.5 
	 * @returns a cone entity
	 */
	createCone(radius: number, height: number, longitudeNumSegments?: number, material?: IRenderMaterial, texEnabled?: boolean, alignYRatio?: number): IMouseEventEntity;
	/**
	 * @param radius cylinder radius
	 * @param height cylinder height
	 * @param longitudeNumSegments the default value is 20
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @param uvType the default value is 1
	 * @param alignYRatio the default value is -0.5
	 * @returns a cylinder entity
	 */
	createCylinder(radius: number, height: number, longitudeNumSegments?: number, material?: IRenderMaterial, texEnabled?: boolean, uvType?: number, alignYRatio?: number): IMouseEventEntity;
	/**
     * @param radius tube radius
     * @param long tube long
     * @param longitudeNumSegments the default value is 20
     * @param latitudeNumSegments the default value is 1
	 * @param axisType 0: vertical to x-axis, 1: vertical to y-axis, 2: vertical to z-axis, the default value is 0
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
     * @param uvType the default value is 1
     * @param alignYRatio the default value is -0.5
	 * @returns a tube entity
     */
    createTube(radius: number, long: number, longitudeNumSegments?: number, latitudeNumSegments?: number, axisType?: number, material?: IRenderMaterial, texEnabled?: boolean, uvType?: number, alignYRatio?: number): IMouseEventEntity;
	/**
     * @param ringRadius the default value is 200
     * @param axisRadius the default value is 50
     * @param longitudeNumSegments the default value is 30
     * @param latitudeNumSegments the default value is 20
	 * @param axisType 0: vertical to x-axis, 1: vertical to y-axis, 2: vertical to z-axis, the default value is 0
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
     * @param uvType the default value is 1
     * @param alignYRatio the default value is -0.5
	 * @returns a torus entity
     */
    createTorus(ringRadius?: number, axisRadius?: number, longitudeNumSegments?: number, latitudeNumSegments?: number, axisType?: number, material?: IRenderMaterial, texEnabled?: boolean, uvType?: number, alignYRatio?: number): IMouseEventEntity;


}
export { ICoEntity };

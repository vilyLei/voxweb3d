import IVector3D from "../../vox/math/IVector3D";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";
import IMouseEventEntity from "../../vox/entity/IMouseEventEntity";
import IBoundsEntity from "../../vox/entity/IBoundsEntity";
import IDataMesh from "../../vox/mesh/IDataMesh";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";

import { ICoEntity } from "./ICoEntity";
declare var CoEntity: ICoEntity;

import { ICoRScene } from "../voxengine/ICoRScene";
import IDisplayEntity from "../../vox/entity/IDisplayEntity";
declare var CoRScene: ICoRScene;

interface I_CoEntity {
}

class T_CoEntity {

	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
		this.m_init = !this.isEnabled();
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
				url = "static/cospace/coentity/CoEntity.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

			return true;
		}
		return false;
	}
	isEnabled(): boolean {
		return typeof CoEntity !== "undefined" && typeof CoRScene !== "undefined";
	}
	/**
	 * @param model geometry model data
	 * @param material IRenderMaterial instance, the default value is null.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	createDataMeshFromModel(model: CoGeomDataType, material?: IRenderMaterial, vbWhole?: boolean): IDataMesh {
		return CoEntity.createDataMeshFromModel(model, material, vbWhole);
	}
	/**
	 * @param model geometry model data
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param texEnabled texture enabled in the material, the default value is true.
	 */
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, texEnabled?: boolean): ITransformEntity {
		return CoEntity.createDisplayEntityFromModel(model, pmaterial, texEnabled);
	}

	createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D): ITransformEntity {
		return CoEntity.createFreeAxis3DEntity(minV, maxV);
	}
	/**
	 * @param size th default value is 100.0
	 */
	createAxis3DEntity(size?: number): ITransformEntity {
		return CoEntity.createAxis3DEntity(size);
	}

	/**
	 * @param model IDataMesh instance
	 * @param material IRenderMaterial instance
	 * @param texEnabled use texture yes or no, the default value is false
	 */
	createDisplayEntityWithDataMesh(mesh: IDataMesh, material: IRenderMaterial, texEnabled?: boolean): ITransformEntity {
		return CoEntity.createDisplayEntityWithDataMesh(mesh, material, texEnabled);
	}
	createDisplayEntity(): ITransformEntity {
		return CoEntity.createDisplayEntity();
	}
	createMouseEventEntity(): IMouseEventEntity {
		return CoEntity.createMouseEventEntity();
	}
	createBoundsEntity(): IBoundsEntity {
		return CoEntity.createBoundsEntity();
	}

	/**
	 * create a cross axis randerable entity
	 * @param size the default value is 100
	 */
	createCrossAxis3DEntity(size: number): ITransformEntity {
		return CoEntity.createCrossAxis3DEntity(size);
	}

	createDisplayEntityContainer(): IDisplayEntityContainer {
		return CoEntity.createDisplayEntityContainer();
	}

	/**
	 * @param minX the default value is -1.0
	 * @param minY the default value is -1.0 
	 * @param width the default value is 2.0 
	 * @param height the default value is 2.0 
	 * @returns a plane entity, it is fixed the screen, it is parallel with xoy plane
	 */
	createFixScreenPlane(minX: number = -1.0, minY: number = -1.0, width: number = 2.0, height: number = 2.0, material: IRenderMaterial = null, texEnabled: boolean = false): IDisplayEntity {
		return CoEntity.createFixScreenPlane(minX, minY, width, height, material, texEnabled);
	}
	createXOYPlane(minX: number, minY: number, width: number, height: number, material: IRenderMaterial = null, texEnabled: boolean = false): IMouseEventEntity {
		return CoEntity.createXOYPlane(minX, minY, width, height, material, texEnabled);
	}
	createXOZPlane(minX: number, minZ: number, width: number, long: number, material: IRenderMaterial = null, texEnabled: boolean = false): IMouseEventEntity {
		return CoEntity.createXOZPlane(minX, minZ, width, long, material, texEnabled);
	}

	createYOZPlane(minY: number, minZ: number, height: number, long: number, material: IRenderMaterial = null, texEnabled: boolean = false): IMouseEventEntity {
		return CoEntity.createYOZPlane(minY, minZ, height, long, material, texEnabled);
	}

	createCube(size: number, material: IRenderMaterial = null, texEnabled: boolean = false): IMouseEventEntity {
		return CoEntity.createCube(size, material, texEnabled);
	}
	createBox(minV: IVector3D, maxV: IVector3D, material: IRenderMaterial = null, texEnabled: boolean = false): IMouseEventEntity {
		return CoEntity.createBox(minV, maxV, material, texEnabled);
	}

	createSphere(radius: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 20, material: IRenderMaterial = null, texEnabled: boolean = false, doubleTriFaceEnabled: boolean = false): IMouseEventEntity {
		return CoEntity.createSphere(radius, longitudeNumSegments, latitudeNumSegments, material, texEnabled, doubleTriFaceEnabled);
	}
	/**
	 * @param radius cone radius 
	 * @param height cone height  
	 * @param longitudeNumSegments the default value is 20
	 * @param material the default value is null 
	 * @param texEnabled the default value is false
	 * @param alignYRatio the default value is -0.5 
	 * @returns a cone entity
	 */
	createCone(radius: number, height: number, longitudeNumSegments: number = 20, material: IRenderMaterial = null, texEnabled: boolean = false, alignYRatio: number = -0.5): IMouseEventEntity {
		return CoEntity.createCone(radius, height, longitudeNumSegments, material, texEnabled, alignYRatio);
	}
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
	createCylinder(radius: number, height: number, longitudeNumSegments: number = 20, material: IRenderMaterial = null, texEnabled: boolean = false, alignYRatio: number = -0.5): IMouseEventEntity {
		return CoEntity.createCylinder(radius, height, longitudeNumSegments, material, texEnabled, alignYRatio);
	}
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
	createTube(radius: number, long: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 1, axisType: number = 0, material: IRenderMaterial = null, texEnabled: boolean = false, uvType: number = 1, alignRatio: number = -0.5): IMouseEventEntity {
		return CoEntity.createTube(radius, long, longitudeNumSegments, latitudeNumSegments, axisType, material, texEnabled, uvType, alignRatio);
	}
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
	createTorus(radius: number, axisRadius: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 1, axisType: number = 0, material: IRenderMaterial = null, texEnabled: boolean = false, uvType: number = 1, alignRatio: number = -0.5): IMouseEventEntity {
		return CoEntity.createTorus(radius, axisRadius, longitudeNumSegments, latitudeNumSegments, axisType, material, texEnabled, uvType, alignRatio);
	}
}
const VoxEntity = new T_CoEntity();
export { VoxEntity };

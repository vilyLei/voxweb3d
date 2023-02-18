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
	 * @param model geometry model
	 * @param material IRenderMaterial instance, the default is null.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	createDataMeshFromModel(model: CoGeomDataType, material?: IRenderMaterial, vbWhole?: boolean): IDataMesh {
		return CoEntity.createDataMeshFromModel(model, material, vbWhole);
	}
	/**
	 * @param model geometry model
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param texEnabled texture enabled in the material, the default is true.
	 * @param vbWhole vtx buffer is whole data or not, the default is false.
	 */
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, texEnabled?: boolean, vbWhole?: boolean): ITransformEntity {
		return CoEntity.createDisplayEntityFromModel(model, pmaterial, texEnabled, vbWhole);
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
	 * @param material IRenderMaterial instance.
	 * @param texEnabled use texture yes or no.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	createDisplayEntityWithDataMesh(mesh: IDataMesh, material: IRenderMaterial, texEnabled?: boolean, vbWhole?: boolean): ITransformEntity {
		return CoEntity.createDisplayEntityWithDataMesh(mesh, material, texEnabled, vbWhole);
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

	createSphere(radius: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 20, doubleTriFaceEnabled: boolean = false, material: IRenderMaterial = null, texEnabled: boolean = false): IMouseEventEntity {
		return CoEntity.createSphere(radius, longitudeNumSegments, latitudeNumSegments, doubleTriFaceEnabled, material, texEnabled);
	}

	createCone(radius: number, height: number, longitudeNumSegments: number = 20, alignYRatio: number = -0.5, material: IRenderMaterial = null, texEnabled: boolean = false): IMouseEventEntity {
		return CoEntity.createCone(radius, height, longitudeNumSegments, alignYRatio, material, texEnabled);
	}
}
const VoxEntity = new T_CoEntity();
export { VoxEntity };

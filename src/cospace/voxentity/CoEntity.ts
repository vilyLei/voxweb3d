import IVector3D from "../../vox/math/IVector3D";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";
import IMouseEventEntity from "../../vox/entity/IMouseEventEntity";
import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsEntity from "../../vox/entity/IBoundsEntity";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

function createDisplayEntityFromModel(model: CoGeomDataType, material: IRenderMaterial = null, vbWhole: boolean = false): ITransformEntity {
	
	return CoRScene.createDisplayEntityFromModel(model, material, vbWhole);
}
function createDisplayEntityWithDataMesh(mesh: IDataMesh, pmaterial: IRenderMaterial,texEnabled: boolean = true,vbWhole: boolean = false): ITransformEntity {
	
	return CoRScene.createDisplayEntityWithDataMesh(mesh, pmaterial, texEnabled, vbWhole);
}
function createDisplayEntity(): ITransformEntity {
	return CoRScene.createDisplayEntity();
}
function createMouseEventEntity(): IMouseEventEntity {
	return CoRScene.createMouseEventEntity();
}
function createBoundsEntity(): IBoundsEntity {
	return CoRScene.createBoundsEntity();
}

function createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D): ITransformEntity {
	return CoRScene.createFreeAxis3DEntity(minV, maxV);
}
function createAxis3DEntity(size: number = 100.0): ITransformEntity {

	if(size < 0.0001)size = 0.0001;
	let cf = CoRScene.createVec3;
	return createFreeAxis3DEntity(cf(), cf(size, size, size));
}

function createCrossAxis3DEntity(size: number = 100): ITransformEntity {
	let min = -0.5 * size;
	let max = 0.5 * size;
	let cf = CoRScene.createVec3;
	return CoRScene.createFreeAxis3DEntity(cf(min,min,min), cf(max,max,max));
}

function createDisplayEntityContainer(): IDisplayEntityContainer {
	return CoRScene.createDisplayEntityContainer();
}
export {
	
	createDisplayEntityFromModel,
	createFreeAxis3DEntity,
	createAxis3DEntity,
	createDisplayEntityWithDataMesh,
	createDisplayEntity,
	createMouseEventEntity,
	createBoundsEntity,
	createCrossAxis3DEntity,
	createDisplayEntityContainer
};

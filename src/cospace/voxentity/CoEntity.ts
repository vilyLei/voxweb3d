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
import { ICoMesh } from "../voxmesh/ICoMesh";
import IMeshBase from "../../vox/mesh/IMeshBase";
declare var CoMesh: ICoMesh;

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

function createXOYPlane(minX: number, minY: number, width: number, height: number, material: IRenderMaterial = null, texEnabled: boolean = false): ITransformEntity {
	if(typeof CoMesh !== "undefined") {
		// if(!material) {
		// 	material = CoRScene.createDefaultMaterial();
		// }
		// texEnabled = texEnabled || material.getTextureAt(0) != null;
		// material.initializeByCodeBuf( texEnabled );

		// let builder = CoMesh.plane;
		// builder.applyMaterial(material, texEnabled);
		// let mesh = builder.createXOY(minX, minY, width, height);

		// let entity = CoRScene.createMouseEventEntity();
		// entity.setMaterial(material);
		// entity.setMesh(mesh);
		// return entity;
		let builder = CoMesh.plane;
		material = initAMaterial(material, texEnabled, (pm: IRenderMaterial, pt: boolean): void => {
			builder.applyMaterial(pm, pt);
		});
		let mesh = builder.createXOY(minX, minY, width, height);
		return createAMouseEventEntity(mesh, material);
	}
	return null;
}
function createXOZPlane(minX: number, minZ: number, width: number, long: number, material: IRenderMaterial = null, texEnabled: boolean = false): ITransformEntity {
	if(typeof CoMesh !== "undefined") {
		// if(!material) {
		// 	material = CoRScene.createDefaultMaterial();
		// }
		// texEnabled = texEnabled || material.getTextureAt(0) != null;
		// material.initializeByCodeBuf( texEnabled );

		// let builder = CoMesh.plane;
		// builder.applyMaterial(material, texEnabled);
		// let mesh = builder.createXOZ(minX, minZ, width, long);

		// let entity = CoRScene.createMouseEventEntity();
		// entity.setMaterial(material);
		// entity.setMesh(mesh);
		// return entity;
		let builder = CoMesh.plane;
		material = initAMaterial(material, texEnabled, (pm: IRenderMaterial, pt: boolean): void => {
			builder.applyMaterial(pm, pt);
		});
		let mesh = builder.createXOZ(minX, minZ, width, long);
		return createAMouseEventEntity(mesh, material);
	}
	return null;
}

function createYOZPlane(minY: number, minZ: number, height: number, long: number, material: IRenderMaterial = null, texEnabled: boolean = false): ITransformEntity {
	if(typeof CoMesh !== "undefined") {
		// if(!material) {
		// 	material = CoRScene.createDefaultMaterial();
		// }
		// texEnabled = texEnabled || material.getTextureAt(0) != null;
		// material.initializeByCodeBuf( texEnabled );

		// let builder = CoMesh.plane;
		// builder.applyMaterial(material, texEnabled);
		// let mesh = builder.createYOZ(minY, minZ, height, long);

		// let entity = CoRScene.createMouseEventEntity();
		// entity.setMaterial(material);
		// entity.setMesh(mesh);
		// return entity;
		let builder = CoMesh.plane;
		material = initAMaterial(material, texEnabled, (pm: IRenderMaterial, pt: boolean): void => {
			builder.applyMaterial(pm, pt);
		});
		let mesh = builder.createYOZ(minY, minZ, height, long);
		return createAMouseEventEntity(mesh, material);
	}
	return null;
}

function createCube(size: number, material: IRenderMaterial = null, texEnabled: boolean = false): ITransformEntity {
	
	if(typeof CoMesh !== "undefined") {
		// if(!material) {
		// 	material = CoRScene.createDefaultMaterial();
		// }
		// texEnabled = texEnabled || material.getTextureAt(0) != null;
		// material.initializeByCodeBuf( texEnabled );
		
		// let builder = CoMesh.box;
		// builder.applyMaterial(material, texEnabled);
		// let mesh = builder.createCube(size);

		// let entity = CoRScene.createMouseEventEntity();
		// entity.setMaterial(material);
		// entity.setMesh(mesh);
		// return entity;		
		let builder = CoMesh.box;
		material = initAMaterial(material, texEnabled, (pm: IRenderMaterial, pt: boolean): void => {
			builder.applyMaterial(pm, pt);
		});
		let mesh = builder.createCube(size);
		return createAMouseEventEntity(mesh, material);
	}
	return null;
}
function createBox(minV: IVector3D, maxV: IVector3D, material: IRenderMaterial = null, texEnabled: boolean = false): ITransformEntity {
	
	if(typeof CoMesh !== "undefined") {
		// if(!material) {
		// 	material = CoRScene.createDefaultMaterial();
		// }
		// texEnabled = texEnabled || material.getTextureAt(0) != null;
		// material.initializeByCodeBuf( texEnabled );
		
		// let builder = CoMesh.box;
		// builder.applyMaterial(material, texEnabled);
		// let mesh = builder.create(minV, maxV);

		// let entity = CoRScene.createMouseEventEntity();
		// entity.setMaterial(material);
		// entity.setMesh(mesh);
		// return entity;
		
		let builder = CoMesh.box;
		material = initAMaterial(material, texEnabled, (pm: IRenderMaterial, pt: boolean): void => {
			builder.applyMaterial(pm, pt);
		});
		let mesh = builder.create(minV, maxV);
		return createAMouseEventEntity(mesh, material);
	}
	return null;
}

function createSphere(radius: number, longitudeNumSegments: number = 20, latitudeNumSegments: number = 20, doubleTriFaceEnabled: boolean = false, material: IRenderMaterial = null, texEnabled: boolean = false): ITransformEntity {
	
	if(typeof CoMesh !== "undefined") {
		// if(!material) {
		// 	material = CoRScene.createDefaultMaterial();
		// }
		// texEnabled = texEnabled || material.getTextureAt(0) != null;
		// material.initializeByCodeBuf( texEnabled );

		// let builder = CoMesh.sphere;
		// builder.applyMaterial(material, texEnabled);
		// let mesh = builder.create(radius, longitudeNumSegments, latitudeNumSegments, doubleTriFaceEnabled);

		// let entity = CoRScene.createMouseEventEntity();
		// entity.setMaterial(material);
		// entity.setMesh(mesh);
		// return entity;

		let builder = CoMesh.sphere;
		material = initAMaterial(material, texEnabled, (pm: IRenderMaterial, pt: boolean): void => {
			builder.applyMaterial(pm, pt);
		});
		let mesh = builder.create(radius, longitudeNumSegments, latitudeNumSegments, doubleTriFaceEnabled);
		return createAMouseEventEntity(mesh, material);
	}
	return null;
}

function createCone(radius: number, height: number, longitudeNumSegments: number = 20, alignYRatio: number = -0.5, material: IRenderMaterial = null, texEnabled: boolean = false): ITransformEntity {
	
	if(typeof CoMesh !== "undefined") {
		// if(!material) {
		// 	material = CoRScene.createDefaultMaterial();
		// }
		// texEnabled = texEnabled || material.getTextureAt(0) != null;
		// material.initializeByCodeBuf( texEnabled );

		// let builder = CoMesh.cone;
		// builder.applyMaterial(material, texEnabled);
		// let mesh = builder.create(radius, height, longitudeNumSegments, alignYRatio);
		let builder = CoMesh.cone;
		material = initAMaterial(material, texEnabled, (pm: IRenderMaterial, pt: boolean): void => {
			builder.applyMaterial(pm, pt);
		});
		let mesh = builder.create(radius, height, longitudeNumSegments, alignYRatio);
		return createAMouseEventEntity(mesh, material);		
	}
	return null;
}

function initAMaterial(material: IRenderMaterial, texEnabled: boolean, callback: (pm: IRenderMaterial, pt: boolean) => void): IRenderMaterial {
	if(!material) {
		material = CoRScene.createDefaultMaterial();
	}
	texEnabled = texEnabled || material.getTextureAt(0) != null;
	material.initializeByCodeBuf( texEnabled );
	callback(material, texEnabled);
	return material;
}
function createAMouseEventEntity(mesh: IMeshBase, material: IRenderMaterial): ITransformEntity {
	let entity = CoRScene.createMouseEventEntity();
	entity.mouseEnabled = false;
	entity.setMaterial(material);
	entity.setMesh(mesh);
	return entity;
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
	createDisplayEntityContainer,
	createXOYPlane,
	createXOZPlane,
	createYOZPlane,
	createBox,
	createCube,
	createSphere,
	createCone
};

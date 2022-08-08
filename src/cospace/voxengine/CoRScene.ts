
import IVector3D from "../../vox/math/IVector3D";
import Vector3D from "../../vox/math/Vector3D";
import { IMatrix4 } from "../../vox/math/IMatrix4";
import Matrix4 from "../../vox/math/Matrix4";
import RendererParam from "../../vox/scene/RendererParam";
import { ICoRendererScene } from "./scene/ICoRendererScene";
import CoRendererScene from "./scene/CoRendererScene";

import DataMesh from "../../vox/mesh/DataMesh";
import MaterialBase from "../../vox/material/MaterialBase";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import ShaderMaterial from "../../vox/material/mcase/ShaderMaterial";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import Line3DEntity from "../../vox/entity/Line3DEntity";

import { ICoDisplayEntity } from "./engine/ICoDisplayEntity";
import { IShaderMaterial } from "./material/IShaderMaterial";
import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";

function createVec3(px: number, py: number, pz: number, pw: number = 1.0): IVector3D {
	return new Vector3D(px, py, pz, pw);
}
function createMat4(pfs32: Float32Array = null, index: number = 0): IMatrix4 {
	return new Matrix4(pfs32, index);
}

function createRendererSceneParam(div: HTMLDivElement = null): RendererParam {
	return new RendererParam(div);
}
function createRendererScene(): ICoRendererScene {
	return new CoRendererScene();
}


function createShaderMaterial(shd_uniqueName: string): IShaderMaterial {
	return new ShaderMaterial(shd_uniqueName);
}
function createDisplayEntityFromModel(model: CoGeomDataType, pmaterial: IShaderMaterial = null): ICoDisplayEntity {
	let material: MaterialBase = pmaterial as MaterialBase;
	if (material == null) {
		material = new Default3DMaterial();
		material.initializeByCodeBuf();
	}
	if (material.getCodeBuf() == null || material.getBufSortFormat() < 0x1) {
		throw Error("the material does not call initializeByCodeBuf() function. !!!");
	}
	const dataMesh: any = new DataMesh();
	dataMesh.vbWholeDataEnabled = false;
	dataMesh.setVS(model.vertices);
	dataMesh.setUVS(model.uvsList[0]);
	dataMesh.setNVS(model.normals);
	dataMesh.setIVS(model.indices);
	dataMesh.setVtxBufRenderData(material);
	dataMesh.initialize();
	// console.log("dataMesh: ", dataMesh);

	const entity: any = new DisplayEntity();
	entity.setMesh(dataMesh);
	entity.setMaterial(material);
	return entity;
}
function createAxis3DEntity(size: number = 100): ICoDisplayEntity {
	let axis = new Axis3DEntity();
	axis.initialize(size);
	return axis;
}


export {

	RendererParam,
	CoRendererScene,

	createVec3,
	createMat4,

	createRendererSceneParam,
	createRendererScene,

	createShaderMaterial,
	createDisplayEntityFromModel,
	createAxis3DEntity
}

import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import Vector3D from "../../vox/math/Vector3D";
import RendererState from "../../vox/render/RendererState";
import Matrix4 from "../../vox/math/Matrix4";
import DataMesh from "../../vox/mesh/DataMesh";

import IRenderEntity from "../../vox/render/IRenderEntity";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";

import MaterialBase from "../../vox/material/MaterialBase";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import ShaderMaterial from "../../vox/material/mcase/ShaderMaterial";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import Line3DEntity from "../../vox/entity/Line3DEntity";
import { UserInteraction } from "../../vox/engine/UserInteraction";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import { ICoRendererParam } from "./engine/ICoRendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import { EngineBase as Engine } from "../../vox/engine/EngineBase";

import { ICoVec3 } from "./math/ICoVec3";
import { ICoMat4 } from "./math/ICoMat4";
import { ICoDisplayEntity } from "./engine/ICoDisplayEntity";
import { IShaderMaterial } from "./material/IShaderMaterial";
import { IEngineBase } from "./engine/IEngineBase";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";

function createVec3(px: number, py: number, pz: number, pw: number = 1.0): ICoVec3 {
	return new Vector3D(px, py, pz, pw);
}
function createMat4(pfs32: Float32Array = null, index: number = 0): ICoMat4 {
	return new Matrix4(pfs32, index);
}
function createRendererParam(div: HTMLDivElement = null): ICoRendererParam {
	return new RendererParam(div);
}
function createEngine(): IEngineBase {
	return new Engine();
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
	console.log("dataMesh: ", dataMesh);

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
	RendererDevice,
	Vector3D,
	Matrix4,
	RendererState,
	RendererParam,
	UserInteraction,
	DisplayEntityContainer,
	BoxFrame3D,
	Line3DEntity,
	Axis3DEntity,
	DisplayEntity,
	ShaderMaterial,
	Default3DMaterial,
	DataMesh,
	RendererScene,
	Engine,

	createVec3,
	createMat4,
	createRendererParam,
	createEngine,
	createShaderMaterial,
	createDisplayEntityFromModel,
	createAxis3DEntity
};


import IVector3D from "../../vox/math/IVector3D";
import Vector3D from "../../vox/math/Vector3D";
import { IMatrix4 } from "../../vox/math/IMatrix4";
import Matrix4 from "../../vox/math/Matrix4";
import IColor4 from "../../vox/material/IColor4";
import Color4 from "../../vox/material/Color4";

import RendererParam from "../../vox/scene/RendererParam";
import { ICoRendererScene } from "./scene/ICoRendererScene";

import MouseEvent from "../../vox/event/MouseEvent";

import CoRendererScene from "./scene/CoRendererScene";

import { IDataMesh } from "../../vox/mesh/IDataMesh";
import DataMesh from "../../vox/mesh/DataMesh";
import MaterialBase from "../../vox/material/MaterialBase";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import ShaderMaterial from "../../vox/material/mcase/ShaderMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../vox/scene/block/RenderableEntityBlock";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";
import { MaterialContextParam } from "../../materialLab/base/MaterialContextParam";
import { MaterialContext } from "../../materialLab/base/MaterialContext";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";

import { ICoDisplayEntity } from "./entity/ICoDisplayEntity";
import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";

function createVec3(px: number = 0.0, py: number = 0.0, pz: number = 0.0, pw: number = 1.0): IVector3D {
	return new Vector3D(px, py, pz, pw);
}
function createMat4(pfs32: Float32Array = null, index: number = 0): IMatrix4 {
	return new Matrix4(pfs32, index);
}
function createColor4(pr: number = 1.0, pg: number = 1.0, pb: number = 1.0, pa: number = 1.0): IColor4 {
	return new Color4(pr, pg, pb, pa);
}

function createRendererSceneParam(div: HTMLDivElement = null): RendererParam {
	return new RendererParam(div);
}
function createRendererScene(): ICoRendererScene {
	return new CoRendererScene();
}
function applySceneBlock(rsecne: ICoRendererScene): void {

	let rscene = rsecne;
	let materialBlock = new RenderableMaterialBlock();
	materialBlock.initialize();
	rscene.materialBlock = materialBlock;
	let entityBlock = new RenderableEntityBlock();
	entityBlock.initialize();
	rscene.entityBlock = entityBlock;
}


function createDefaultMaterial(normalEnabled: boolean = false): IRenderMaterial {
	let m = new Default3DMaterial();
	m.normalEnabled = normalEnabled;
	return m;
}
function createShaderMaterial(shd_uniqueName: string): IShaderMaterial {
	return new ShaderMaterial(shd_uniqueName);
}
function createDisplayEntityFromModel(model: CoGeomDataType, material: MaterialBase = null): ICoDisplayEntity {

	if (material == null) {
		material = new Default3DMaterial();
		material.initializeByCodeBuf();
	}
	if (material.getCodeBuf() == null || material.getBufSortFormat() < 0x1) {
		throw Error("the material does not call initializeByCodeBuf() function. !!!");
	}
	const dataMesh = new DataMesh();
	dataMesh.vbWholeDataEnabled = false;
	dataMesh.setVS(model.vertices);
	dataMesh.setUVS(model.uvsList[0]);
	dataMesh.setNVS(model.normals);
	dataMesh.setIVS(model.indices);
	dataMesh.setVtxBufRenderData(material);
	dataMesh.initialize();
	// console.log("dataMesh: ", dataMesh);

	const entity = new DisplayEntity();
	entity.setMesh(dataMesh);
	entity.setMaterial(material);
	return entity;
}

function createDisplayEntity(): ICoDisplayEntity {
	return new DisplayEntity();
}
function createDataMesh(): IDataMesh {
	return new DataMesh();
}

function createAxis3DEntity(size: number = 100): ICoDisplayEntity {
	let axis = new Axis3DEntity();
	axis.initialize(size);
	return axis;
}


function createMaterialContext(): IMaterialContext {
	return new MaterialContext();
}
function creatMaterialContextParam(): MaterialContextParam {
	return new MaterialContextParam();
}

export {

	Vector3D,
	Matrix4,
	
	Color4,

	MouseEvent,

	ShaderCodeUUID,
	MaterialPipeType,

	MaterialContextParam,
	RendererParam,
	CoRendererScene,

	createVec3,
	createMat4,
	createColor4,

	createRendererSceneParam,
	createRendererScene,
	applySceneBlock,

	createDefaultMaterial,
	createShaderMaterial,
	createDisplayEntityFromModel,
	createAxis3DEntity,
	createDisplayEntity,
	createDataMesh,

	createMaterialContext,
	creatMaterialContextParam
}

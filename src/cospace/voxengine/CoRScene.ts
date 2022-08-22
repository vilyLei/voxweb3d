import IVector3D from "../../vox/math/IVector3D";
import Vector3D from "../../vox/math/Vector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import Matrix4 from "../../vox/math/Matrix4";
import IColor4 from "../../vox/material/IColor4";
import Color4 from "../../vox/material/Color4";
import IAABB from "../../vox/geom/IAABB";
import AABB from "../../vox/geom/AABB";

import RendererDevice from "../../vox/render/RendererDevice";
import RendererState from "../../vox/render/RendererState";

import RendererParam from "../../vox/scene/RendererParam";
import { ICoRendererScene } from "./scene/ICoRendererScene";

import MouseEvent from "../../vox/event/MouseEvent";

import CoRendererScene from "./scene/CoRendererScene";

import IDataMesh from "../../vox/mesh/IDataMesh";
import DataMesh from "../../vox/mesh/DataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import RawMesh from "../../vox/mesh/RawMesh";
import MaterialBase from "../../vox/material/MaterialBase";

import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IMouseEventEntity from "../../vox/entity/IMouseEventEntity";
import MouseEventEntity from "../../vox/entity/MouseEventEntity";

import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { IMaterial } from "../../vox/material/IMaterial";
import { Material } from "../../vox/material/Material";
import ShaderMaterial from "../../vox/material/mcase/ShaderMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";

import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../vox/scene/block/RenderableEntityBlock";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";
import { MaterialContextParam } from "../../materialLab/base/MaterialContextParam";
import { MaterialContext } from "../../materialLab/base/MaterialContext";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";
import { RenderDrawMode } from "../../vox/render/RenderConst";
import VtxBufConst from "../../vox/mesh/VtxBufConst";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";
import Line3DMaterial from "../../vox/material/mcase/Line3DMaterial";

function createVec3(px: number = 0.0, py: number = 0.0, pz: number = 0.0, pw: number = 1.0): IVector3D {
	return new Vector3D(px, py, pz, pw);
}
function createMat4(pfs32: Float32Array = null, index: number = 0): IMatrix4 {
	return new Matrix4(pfs32, index);
}
function createColor4(pr: number = 1.0, pg: number = 1.0, pb: number = 1.0, pa: number = 1.0): IColor4 {
	return new Color4(pr, pg, pb, pa);
}
function createAABB(): IAABB {
	return new AABB();
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
function createRendererSceneParam(div: HTMLDivElement = null): RendererParam {
	return new RendererParam(div);
}
let __$$$RenderScene: ICoRendererScene = null;
function createRendererScene(rparam: RendererParam = null, renderProcessesTotal: number = 3, sceneBlockEnabled: boolean = true): ICoRendererScene {
	let rs = new CoRendererScene();
	if (rparam != null) {
		rs.initialize(rparam, 3);
		if (sceneBlockEnabled) {
			applySceneBlock(rs);
		}
	}
	__$$$RenderScene = rs;
	return rs;
}
function setRendererScene(rs: ICoRendererScene): void {
	__$$$RenderScene = rs;
}
function getRendererScene(): ICoRendererScene {
	return __$$$RenderScene;
}

function createMouseEvt3DDispatcher(): IEvtDispatcher {
	return new MouseEvt3DDispatcher();
}
function createDataMesh(): IDataMesh {
	return new DataMesh();
}

function createRawMesh(): IRawMesh {
	return new RawMesh();
}
function createDataMeshFromModel(model: CoGeomDataType, material: MaterialBase = null, vbWhole: boolean = false): IDataMesh {
	const dataMesh = new DataMesh();
	dataMesh.vbWholeDataEnabled = vbWhole;
	dataMesh.setVS(model.vertices);
	dataMesh.setUVS(model.uvsList[0]);
	dataMesh.setNVS(model.normals);
	dataMesh.setIVS(model.indices);

	if (material != null) {
		dataMesh.setVtxBufRenderData(material);
		dataMesh.initialize();
	}
	return dataMesh;
}

function createDefaultMaterial(normalEnabled: boolean = false): IRenderMaterial {
	let m = new Default3DMaterial();
	m.normalEnabled = normalEnabled;
	return m;
}
function createShaderMaterial(shd_uniqueName: string): IShaderMaterial {
	return new ShaderMaterial(shd_uniqueName);
}
function createMaterial(dcr: IMaterialDecorator): IMaterial {
	let m = new Material();
	m.setDecorator(dcr);
	return m;
}

function createDisplayEntityFromModel(model: CoGeomDataType, material: MaterialBase = null, vbWhole: boolean = false): ITransformEntity {
	if (material == null) {
		material = new Default3DMaterial();
		material.initializeByCodeBuf();
	}
	if (material.getCodeBuf() == null || material.getBufSortFormat() < 0x1) {
		throw Error("the material does not call the initializeByCodeBuf() function. !!!");
	}
	const dataMesh = new DataMesh();
	dataMesh.vbWholeDataEnabled = vbWhole;
	dataMesh.setVS(model.vertices);
	dataMesh.setUVS(model.uvsList[0]);
	dataMesh.setNVS(model.normals);
	dataMesh.setIVS(model.indices);
	dataMesh.setVtxBufRenderData(material);
	dataMesh.initialize();

	const entity = new DisplayEntity();
	entity.setMesh(dataMesh);
	entity.setMaterial(material);
	return entity;
}
function createDisplayEntityWithDataMesh(
	mesh: IDataMesh,
	pmaterial: IRenderMaterial,
	texEnabled: boolean = true,
	vbWhole: boolean = false
): ITransformEntity {
	
	if (pmaterial != null) {
		pmaterial.initializeByCodeBuf(texEnabled);
		mesh.setBufSortFormat(pmaterial.getBufSortFormat());
		mesh.vbWholeDataEnabled = vbWhole;
		mesh.initialize();
	}
	let entity = new DisplayEntity();
	entity.setMaterial(pmaterial);
	entity.setMesh(mesh);
	return entity;
}
function createDisplayEntity(): ITransformEntity {
	return new DisplayEntity();
}
function createMouseEventEntity(): IMouseEventEntity {
	return new MouseEventEntity();
}

function createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D): ITransformEntity {

	let vs = new Float32Array([minV.x, 0, 0, maxV.x, 0, 0, 0, minV.y, 0, 0, maxV.y, 0, 0, 0, minV.z, 0, 0, maxV.z]);
	let colors = new Float32Array([1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1]);
	let mesh: RawMesh = new RawMesh();
	mesh.ivsEnabled = false;
	mesh.aabbEnabled = true;
	mesh.reset();
	mesh.addFloat32Data(vs, 3);
	mesh.addFloat32Data(colors, 3);
	mesh.initialize();
	mesh.toArraysLines();
	mesh.vtCount = Math.floor(vs.length / 3);
	mesh.setPolyhedral( false );

	let material = new Line3DMaterial(false);
	let axis = new DisplayEntity();
	axis.setMaterial(material);
	axis.setMesh(mesh);
	
	return axis;
}
function createAxis3DEntity(size: number = 100.0): ITransformEntity {

	if(size < 0.0001)size = 0.0001;
	return createFreeAxis3DEntity(new Vector3D(), new Vector3D(size, size, size));
}

function creatMaterialContextParam(): MaterialContextParam {
	return new MaterialContextParam();
}
function createMaterialContext(): IMaterialContext {
	return new MaterialContext();
}

export {

	RendererDevice,
	RendererState,

	RenderDrawMode,
	VtxBufConst,

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
	createAABB,

	applySceneBlock,
	createRendererSceneParam,
	createRendererScene,
	setRendererScene,
	getRendererScene,
	createMouseEvt3DDispatcher,
	createDataMesh,
	createRawMesh,

	createDataMeshFromModel,
	createDefaultMaterial,
	createShaderMaterial,
	createMaterial,

	createDisplayEntityFromModel,
	createFreeAxis3DEntity,
	createAxis3DEntity,
	createDisplayEntityWithDataMesh,
	createDisplayEntity,
	createMouseEventEntity,

	creatMaterialContextParam,
	createMaterialContext
};

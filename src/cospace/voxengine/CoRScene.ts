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

import EventBase from "../../vox/event/EventBase";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import SelectionEvent from "../../vox/event/SelectionEvent";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import MouseEvent from "../../vox/event/MouseEvent";
import KeyboardEvent from "../../vox/event/KeyboardEvent";
import EvtNode from "../../vox/event/EvtNode";
import IRendererScene from "../../vox/scene/IRendererScene";

import CoRendererScene from "./scene/CoRendererScene";

import IDataMesh from "../../vox/mesh/IDataMesh";
import DataMesh from "../../vox/mesh/DataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import RawMesh from "../../vox/mesh/RawMesh";

import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import BoundsMesh from "../../vox/mesh/BoundsMesh";

import MaterialBase from "../../vox/material/MaterialBase";

import IROTransform from "../../vox/display/IROTransform";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IMouseEventEntity from "../../vox/entity/IMouseEventEntity";
import MouseEventEntity from "../../vox/entity/MouseEventEntity";
import IBoundsEntity from "../../vox/entity/IBoundsEntity";
import BoundsEntity from "../../vox/entity/BoundsEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";

import IColorMaterial from "../../vox/material/mcase/IColorMaterial";
import IDefault3DMaterial from "../../vox/material/mcase/IDefault3DMaterial";
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
import TextureConst from "../../vox/texture/TextureConst";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";
import Line3DMaterial from "../../vox/material/mcase/Line3DMaterial";
import BrokenQuadLine3DMaterial from "../../vox/material/mcase/BrokenQuadLine3DMaterial";
import IRendererSceneGraph from "../../vox/scene/IRendererSceneGraph";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";
import Keyboard from "../../vox/ui/Keyboard";


import { ICoAGeom } from "../ageom/ICoAGeom";
import IGeomModelData from "../../vox/mesh/IGeomModelData";
import MeshFactor from "../../vox/mesh/MeshFactory";
declare var CoAGeom: ICoAGeom;

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

function applySceneBlock(rsecne: IRendererScene): void {
	let rscene = rsecne;
	if (rscene.materialBlock == null) {
		let materialBlock = new RenderableMaterialBlock();
		materialBlock.initialize();
		(rscene as any).materialBlock = materialBlock;
	}
	if (rscene.entityBlock == null) {
		let entityBlock = new RenderableEntityBlock();
		entityBlock.initialize();
		(rscene as any).entityBlock = entityBlock;
	}
}
function createRendererSceneParam(div: HTMLDivElement = null): RendererParam {
	return new RendererParam(div);
}
let __$$$RenderScene: IRendererScene = null;
function createRendererScene(rparam: RendererParam = null, renderProcessesTotal: number = 3, sceneBlockEnabled: boolean = true): IRendererScene {
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
function setRendererScene(rs: IRendererScene): void {
	__$$$RenderScene = rs;
}
function getRendererScene(): IRendererScene {
	return __$$$RenderScene;
}

function createMouseEvt3DDispatcher(): IEvtDispatcher {
	return new MouseEvt3DDispatcher();
}
function createEventBaseDispatcher(): EventBaseDispatcher {
	return new EventBaseDispatcher();
}
function createDataMesh(): IDataMesh {
	return new DataMesh();
}

function createRawMesh(): IRawMesh {
	return new RawMesh();
}
function createBoundsMesh(): IBoundsMesh {
	return new BoundsMesh();
}

function createDataMeshFromModel(model: IGeomModelData, material: IRenderMaterial = null, texEnabled: boolean = false): IDataMesh {
	return MeshFactor.createDataMeshFromModel(model, material, texEnabled);
	/*
	if (material != null) {
		texEnabled = texEnabled || material.getTextureAt(0) != null;
	}
	const vbWhole = model.vbWhole ? model.vbWhole : false;
	let stride = Math.round(model.stride ? model.stride : 3);
	stride = stride > 0 && stride < 4 ? stride : 3;
	const dataMesh = new DataMesh();
	dataMesh.vbWholeDataEnabled = vbWhole;
	let vtxTotal = model.vertices.length / stride;
	dataMesh.setVS(model.vertices);
	if (model.uvsList && model.uvsList.length > 0) {
		dataMesh.setUVS(model.uvsList[0]);
		if (model.uvsList.length > 1) {
			dataMesh.setUVS2(model.uvsList[0]);
		}
	} else if (texEnabled) {
		dataMesh.setUVS(new Float32Array(Math.floor(model.vertices.length / stride) * 2));
		console.error("hasn't uv data !!!, in the createDataMeshFromModel(...) function.");
	}
	if (model.normals) {
		dataMesh.setNVS(model.normals);
	}
	if (model.indices) {
		dataMesh.setIVS(model.indices);
	} else {
		let ivs = vtxTotal <= 65535 ? new Uint16Array(vtxTotal) : new Uint32Array(vtxTotal);
		for (let i = 0; i < vtxTotal; ++i) {
			ivs[i] = i;
		}
		// console.log("crate a new ivs: ", ivs);
		dataMesh.setIVS(ivs);
		console.warn("hasn't indices data !, in the createDataMeshFromModel(...) function.");
	}

	if (material != null) {
		material.initializeByCodeBuf(texEnabled);
		dataMesh.setVtxBufRenderData(material);
	} else {
		console.warn("the material parameter value is null, so this mesh will build all vtx bufs.");
	}
	dataMesh.initialize();
	return dataMesh;
	//*/
}

function createDefaultMaterial(normalEnabled: boolean = false): IDefault3DMaterial {
	let m = new Default3DMaterial();
	m.normalEnabled = normalEnabled;
	return m;
}
function createLineMaterial(dynColorEnabled: boolean = false): IColorMaterial {
	return new Line3DMaterial(dynColorEnabled);
}
/**
 * build 3d quad line entity rendering material
 * @param dynColorEnabled the default value is false
 */
function createQuadLineMaterial(dynColorEnabled?: boolean): IColorMaterial {
	return new BrokenQuadLine3DMaterial(dynColorEnabled);
}
function createShaderMaterial(shd_uniqueName: string): IShaderMaterial {
	return new ShaderMaterial(shd_uniqueName);
}
function createMaterial(dcr: IMaterialDecorator): IMaterial {
	let m = new Material();
	m.setDecorator(dcr);
	return m;
}

function createDisplayEntityFromModel(model: CoGeomDataType, material: IRenderMaterial = null, texEnabled: boolean = false): ITransformEntity {
	if (!material) {
		material = new Default3DMaterial();
		material.initializeByCodeBuf(texEnabled);
	}
	// else {
	// 	material.initializeByCodeBuf(texEnabled || material.getTextureAt(0) != null);
	// }
	// if (material.getCodeBuf() == null || material.getBufSortFormat() < 0x1) {
	// 	throw Error("the material does not call the initializeByCodeBuf() function. !!!");
	// }

	// let ivs = model.indices;
	// let vs = model.vertices;
	// let uvs: Float32Array;
	// if (model.uvsList) {
	// 	uvs = model.uvsList[0];
	// } else {
	// 	uvs = new Float32Array( 2 * vs.length / 3 );
	// }
	// let nvs = model.normals;
	// if (nvs && typeof CoAGeom !== "undefined") {
	// 	CoAGeom.SurfaceNormal.ClacTrisNormal(vs, vs.length, ivs.length / 3, ivs, nvs);
	// }

	// const dataMesh = new DataMesh();
	// dataMesh.vbWholeDataEnabled = vbWhole;
	// dataMesh.setVS(vs);
	// dataMesh.setUVS(uvs);
	// dataMesh.setNVS(nvs);
	// dataMesh.setIVS(ivs);
	// dataMesh.setVtxBufRenderData(material);
	// dataMesh.initialize();

	let dataMesh = this.createDataMeshFromModel(model, material, texEnabled);
	const entity = new DisplayEntity();
	entity.setMesh(dataMesh);
	entity.setMaterial(material);
	return entity;
}
function createDisplayEntityWithDataMesh(
	mesh: IDataMesh,
	pmaterial: IRenderMaterial,
	texEnabled: boolean = false
): ITransformEntity {

	if (pmaterial != null) {
		pmaterial.initializeByCodeBuf(texEnabled);
		mesh.setBufSortFormat(pmaterial.getBufSortFormat());
		mesh.initialize();
	}
	let entity = new DisplayEntity();
	entity.setMaterial(pmaterial);
	entity.setMesh(mesh);
	return entity;
}
function createDisplayEntity(transform: IROTransform = null): ITransformEntity {
	return new DisplayEntity(transform);
}
function createMouseEventEntity(transform: IROTransform = null): IMouseEventEntity {
	return new MouseEventEntity(transform);
}
function createBoundsEntity(transform: IROTransform = null): IBoundsEntity {
	return new BoundsEntity(transform);
}
function createDisplayEntityContainer(): DisplayEntityContainer {
	return new DisplayEntityContainer();
}
function createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D, transform: IROTransform = null): ITransformEntity {

	let material = new Line3DMaterial(false);
	material.initializeByCodeBuf(false);

	let vs = new Float32Array([minV.x, 0, 0, maxV.x, 0, 0, 0, minV.y, 0, 0, maxV.y, 0, 0, 0, minV.z, 0, 0, maxV.z]);
	let colors = new Float32Array([1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1]);
	let mesh: RawMesh = new RawMesh();
	mesh.ivsEnabled = false;
	mesh.aabbEnabled = true;
	mesh.reset();
	mesh.setBufSortFormat(material.getBufSortFormat());
	mesh.addFloat32Data(vs, 3);
	mesh.addFloat32Data(colors, 3);
	mesh.initialize();
	mesh.toArraysLines();
	mesh.vtCount = Math.floor(vs.length / 3);
	// mesh.setPolyhedral( false );

	let axis = new DisplayEntity(transform);
	axis.setMaterial(material);
	axis.setMesh(mesh);

	return axis;
}
function createAxis3DEntity(size: number = 100.0, transform: IROTransform = null): ITransformEntity {

	if (size < 0.0001) size = 0.0001;
	return createFreeAxis3DEntity(new Vector3D(), new Vector3D(size, size, size), transform);
}
function createCrossAxis3DEntity(size: number = 100.0, transform: IROTransform = null): ITransformEntity {

	if (size < 0.0001) size = 0.0001;
	size *= 0.5;
	return createFreeAxis3DEntity(new Vector3D(-size, -size, -size), new Vector3D(size, size, size), transform);
}

function creatMaterialContextParam(): MaterialContextParam {
	return new MaterialContextParam();
}
function createMaterialContext(): IMaterialContext {
	return new MaterialContext();
}

function createRendererSceneGraph(): IRendererSceneGraph {
	return new RendererSceneGraph();
}
function createEvtNode(): EvtNode {
	return new EvtNode();
}
function createSelectionEvent(): SelectionEvent {
	return new SelectionEvent();
}
function createProgressDataEvent(): ProgressDataEvent {
	return new ProgressDataEvent();
}

export {

	RendererDevice,
	RendererState,

	RenderDrawMode,
	VtxBufConst,

	TextureConst,

	Vector3D,
	Matrix4,
	Color4,
	MouseEvent,
	EventBase,
	SelectionEvent,
	ProgressDataEvent,
	KeyboardEvent,
	Keyboard,

	ShaderCodeUUID,
	MaterialPipeType,
	MaterialContextParam,
	RendererParam,
	CoRendererScene,

	createSelectionEvent,
	createProgressDataEvent,

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
	createEventBaseDispatcher,

	createDataMesh,
	createRawMesh,
	createBoundsMesh,

	createDataMeshFromModel,
	createDefaultMaterial,
	createLineMaterial,
	createQuadLineMaterial,
	createShaderMaterial,
	createMaterial,

	createDisplayEntityFromModel,
	createFreeAxis3DEntity,
	createAxis3DEntity,
	createCrossAxis3DEntity,
	createDisplayEntityWithDataMesh,
	createDisplayEntity,
	createMouseEventEntity,
	createBoundsEntity,
	createDisplayEntityContainer,

	creatMaterialContextParam,
	createMaterialContext,
	createRendererSceneGraph,
	createEvtNode
};

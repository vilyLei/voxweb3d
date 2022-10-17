
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import { TransUI } from "../../../edit/demo/edit/ui/TransUI";
import IRawMesh from "../../../../vox/mesh/IRawMesh";

import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUI } from "../../../voxui/ICoUI";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import IMouseEventEntity from "../../../../vox/entity/IMouseEventEntity";
import IColorMaterial from "../../../../vox/material/mcase/IColorMaterial";
import { ICoMesh } from "../../../voxmesh/ICoMesh";
import { ICoAGeom } from "../../../ageom/ICoAGeom";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import IVector3D from "../../../../vox/math/IVector3D";
import { NormalLineMaterial } from "../material/NormalLineMaterial";
import { NormalEntityMaterial } from "../material/NormalEntityMaterial";
import IRenderMaterial from "../../../../vox/render/IRenderMaterial";

declare var CoUI: ICoUI;
declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoMesh: ICoMesh;
declare var CoAGeom: ICoAGeom;

class NormalEntityNode {

	rsc: IRendererScene;
	transUI: TransUI;
	uid = -1;
	entity: IMouseEventEntity = null;
	// normalColorEntity: ITransformEntity = null;
	// differenceColorEntity: ITransformEntity = null;
	normalLine: ITransformEntity = null;
	// flagEndity: ITransformEntity = null;
	private m_entityMaterial: NormalEntityMaterial;
	private m_normalMaterial: NormalLineMaterial;
	private m_entities: ITransformEntity[] = null;
	private m_scale = 0.5;
	private m_normalScale = 1.0;
	private m_normalScale0 = 1.0;
	constructor() {
	}
	
	showLocalNormal(): void {
		this.m_entityMaterial.applyLocalNormal();
		this.m_entityMaterial.applyNormalColor();
	}
	showGlobalNormal(): void {
		this.m_entityMaterial.applyGlobalNormal();
		this.m_entityMaterial.applyNormalColor();
	}
	showModelColor(boo: boolean): void {
		if(boo) {
			this.m_entityMaterial.applyModelColor();
		}else {
			this.m_entityMaterial.applyNormalColor();
		}
	}
	showDifference(): void {
		this.m_entityMaterial.applyDifference();
	}
	
	setEntityModel(model: CoGeomDataType): IMouseEventEntity {

		this.entity = this.createEntity(model);

		this.m_entities = [this.entity];
		let ls = this.m_entities;

		this.applyEvt(this.entity);
		return this.entity;
	}
	select(): void {
		this.m_normalScale0 = this.m_normalScale;
	}
	applyNormalLineScale(s: number): void {
		// s = s/this.m_scaleBase;
		this.m_normalScale = s * this.m_normalScale0;		
		this.m_normalMaterial.setLength(this.m_normalScale);
	}
	private createEntity(model: CoGeomDataType): IMouseEventEntity {
		// let rst = CoRenderer.RendererState;
		this.m_entityMaterial = new NormalEntityMaterial();
		// let material = new CoNormalMaterial().build().material;
		let material = this.m_entityMaterial.create();//CoRScene.createDefaultMaterial(true);
		material.initializeByCodeBuf(false);
		this.m_entityMaterial.setRGB3f(0.7, 0.7, 0.7);
		//material.setRGB3f(0.7, 0.7, 0.7);
		// model.normals = null;
		
		let vs = model.vertices;
		let ivs = model.indices;
		let trisNumber = ivs.length / 3;
		let nvs2 = new Float32Array(vs.length);
		CoAGeom.SurfaceNormal.ClacTrisNormal(vs, vs.length, trisNumber,ivs, nvs2);
		// nvs2.fill(1.0);
		// model.normals = nvs2;

		let s = this.m_scale;
		// let mesh = CoRScene.createDataMeshFromModel(model, material);
		let bounds = CoRScene.createAABB();
		bounds.addXYZFloat32Arr(vs, 3);
		bounds.updateFast();
		let cv = bounds.center.clone();
		console.log("create normal entity node, bounds: ",bounds);
		let tot = vs.length;
		for (let i = 0; i < tot;) {
			vs[i++] -= cv.x;
			vs[i++] -= cv.y;
			vs[i++] -= cv.z;
		}
		cv.scaleBy(this.m_scale);
		let mesh = this.createEntityMesh(model.indices, model.vertices, nvs2, model.normals, material);
		// mesh = CoRScene.createDataMeshFromModel(model, material);
		// mesh
		let entity = CoRScene.createMouseEventEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setPosition(cv);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		entity.setScaleXYZ(s, s, s);
		entity.update();
		this.rsc.addEntity(entity);

		this.createNormalLine(entity, vs, model.vertices, s);

		// let axisEntity = CoRScene.createCrossAxis3DEntity(5, entity.getTransform());
		// this.rsc.addEntity( axisEntity );
		// this.flagEndity = axisEntity;
		return entity;
	}
	
	private createEntityMesh(ivs: Uint16Array | Uint32Array , vs: Float32Array, uvs: Float32Array, nvs: Float32Array, matrial: IRenderMaterial): IRawMesh {

		let mesh = CoMesh.createRawMesh();
		// mesh.ivsEnabled = false;
		// mesh.aabbEnabled = true;
		mesh.reset();
		mesh.setBufSortFormat(matrial.getBufSortFormat());
		mesh.setIVS(ivs);
		mesh.addFloat32Data(vs, 3);
		mesh.addFloat32Data(uvs, 3);
		mesh.addFloat32Data(nvs, 3);
		mesh.vbWholeDataEnabled = false;
		mesh.initialize();
		// mesh.toArraysLines();
		// mesh.vtCount = Math.floor(vs.length / 3);
		return mesh;
	}
	private createNormalLine(srcEntity: ITransformEntity, svs: Float32Array, snvs: Float32Array, scale: number, size: number = 2): void {
		let ml = CoMesh.line;
		ml.dynColorEnabled = true;
		let mesh: IRawMesh;
		// let srcMesh = srcEntity.getMesh();
		let vs = svs;
		let nvs = snvs;
		let tot = vs.length / 3;
		let j = 0;
		let k_vs = 0;
		let k_uvs = 0;
		let k_nvs = 0;

		let pvs = new Float32Array(tot * 6);
		let puvs = new Float32Array(tot * 4);
		let pnvs = new Float32Array(tot * 6);

		let v0 = CoRScene.createVec3();
		let v1 = CoRScene.createVec3();
		scale = size / scale;
		this.m_normalScale = scale;
		for (let i = 0; i < tot; ++i) {
			j = i * 3;

			// v0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
			// v1.setXYZ(nvs[j], nvs[j + 1], nvs[j + 2]);
			// v1.scaleBy(scale);
			// v1.addBy(v0);
			// v0.toArray(pvs, k);
			// k += 3;
			// v1.toArray(pvs, k);
			// k += 3;

			v0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
			v1.setXYZ(nvs[j], nvs[j + 1], nvs[j + 2]);
			// v1.scaleBy(scale);
			// v1.addBy(v0);

			v0.toArray(pvs, k_vs);
			k_vs += 3;
			v0.toArray(pvs, k_vs);
			k_vs += 3;


			v1.toArray(pnvs, k_nvs);
			k_nvs += 3;
			v1.toArray(pnvs, k_nvs);
			k_nvs += 3;


			let k = k_uvs;
			puvs[k++] = 0.0;
			puvs[k++] = 0.0;
			puvs[k++] = 1.0;
			puvs[k++] = 1.0;
			k_uvs += 6;
		}

		let entity: ITransformEntity;

		entity = CoRScene.createDisplayEntity(srcEntity.getTransform());
		// mesh = ml.createLinesWithFS32(posList);
		mesh = this.createLineMesh(pvs, puvs, pnvs);
		entity.setMesh(mesh);
		let mb = new NormalLineMaterial();
		this.m_normalMaterial = mb;
		this.m_normalMaterial.setLength(scale);
		mb.setRGB3f(1.0, 0.0, 1.0);
		let material = mb.create();
		entity.setMaterial(material);

		// entity = CoRScene.createCrossAxis3DEntity(5, srcEntity.getTransform());
		this.normalLine = entity;
		entity.setVisible(false);
		this.rsc.addEntity(entity);
	}
	private createLineMesh(vs: Float32Array, uvs: Float32Array, nvs: Float32Array): IRawMesh {

		let mesh = CoMesh.createRawMesh();
		mesh.ivsEnabled = false;
		mesh.aabbEnabled = true;
		mesh.reset();
		mesh.addFloat32Data(vs, 3);
		mesh.addFloat32Data(uvs, 2);
		mesh.addFloat32Data(nvs, 3);
		mesh.vbWholeDataEnabled = false;
		mesh.initialize();
		mesh.toArraysLines();
		mesh.vtCount = Math.floor(vs.length / 3);
		return mesh;
	}
	private applyEvt(entity: IMouseEventEntity): void {

		let ME = CoRScene.MouseEvent;
		entity.addEventListener(ME.MOUSE_OVER, this, this.mouseOverTargetListener);
		entity.addEventListener(ME.MOUSE_OUT, this, this.mouseOutTargetListener);
		entity.addEventListener(ME.MOUSE_DOWN, this, this.mouseDownTargetListener);
		// entity.addEventListener(ME.MOUSE_UP, this, this.mouseUpTargetListener);
	}
	private mouseOverTargetListener(evt: any): void {
		// console.log("mouseOverTargetListener()..., evt.target: ", evt.target);
		// let entity = evt.target as ITransformEntity;
		// let material = entity.getMaterial() as IColorMaterial;
		// material.setRGB3f(0.8, 0.8, 0.8);
		this.m_entityMaterial.setRGB3f(0.8, 0.8, 0.8);
	}
	private mouseOutTargetListener(evt: any): void {
		// console.log("mouseOutTargetListener()..., evt.target: ", evt.target);
		// let entity = evt.target as ITransformEntity;
		// let material = entity.getMaterial() as IColorMaterial;
		// material.setRGB3f(0.7, 0.7, 0.7);
		this.m_entityMaterial.setRGB3f(0.7, 0.7, 0.7);
	}
	private mouseDownTargetListener(evt: any): void {
		// console.log("mouseDownTargetListener()..., evt.target: ", evt.target);
		let entity = evt.target as ITransformEntity;
		this.transUI.selectEntities([entity]);
	}
	// private mouseUpTargetListener(evt: any): void {
	// 	console.log("mouseUpTargetListener() mouse up...");
	// }

	destroy(): void {
		this.rsc = null;
		if (this.entity != null) {

			this.rsc.removeEntity(this.entity);
			// this.rsc.removeEntity(this.normalColorEntity);
			// this.rsc.removeEntity(this.differenceColorEntity);
			this.rsc.removeEntity(this.normalLine);

			this.entity.destroy();

			this.entity = null;
			// this.normalColorEntity = null;
			// this.differenceColorEntity = null;
			this.normalLine = null;
		}
		this.m_entities = null;
	}
}
export { NormalEntityNode };

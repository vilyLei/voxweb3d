
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import IRawMesh from "../../../../vox/mesh/IRawMesh";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import IMouseEventEntity from "../../../../vox/entity/IMouseEventEntity";
import { ICoMath } from "../../../math/ICoMath";
import { ICoMesh } from "../../../voxmesh/ICoMesh";
import { ICoAGeom } from "../../../ageom/ICoAGeom";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import { NormalLineMaterial } from "../material/NormalLineMaterial";
import { NormalEntityMaterial } from "../material/NormalEntityMaterial";
import IRenderMaterial from "../../../../vox/render/IRenderMaterial";

declare var CoRScene: ICoRScene;
declare var CoMesh: ICoMesh;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;

class NormalEntityBuilder {

	private m_entityMaterial: NormalEntityMaterial;
	private m_normalLineMaterial: NormalLineMaterial;
	private m_normalLineScale = 1.0;
	constructor() {
	}
	getEntityMaterial(): NormalEntityMaterial {
		return this.m_entityMaterial;
	}
	getNormalLineMaterial(): NormalLineMaterial {
		return this.m_normalLineMaterial;
	}
	getNormalLineScale(): number {
		return this.m_normalLineScale;
	}
	createNormalEntity(model: CoGeomDataType, nivs: Uint16Array | Uint32Array = null): IMouseEventEntity {

		this.m_entityMaterial = new NormalEntityMaterial();
		let material = this.m_entityMaterial.create();
		material.initializeByCodeBuf(false);
		this.m_entityMaterial.setRGB3f(0.7, 0.7, 0.7);

		let vs = model.vertices;
		let ivs = model.indices;
		let trisNumber = ivs.length / 3;

		let nvs2 = new Float32Array(vs.length);
		CoAGeom.SurfaceNormal.ClacTrisNormal(vs, vs.length, trisNumber, nivs != null ? nivs : ivs, nvs2);
		// nvs2.fill(1.0);

		let nvs = model.normals;
		if(nvs == null) {
			nvs = new Float32Array(vs.length);
		}
		let mesh = this.createEntityMesh(model.indices, model.vertices, nvs2, nvs, material);

		let entity = CoRScene.createMouseEventEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setRenderState(CoRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
		return entity;
	}
	
	createNormalLineEntity(srcEntity: ITransformEntity, srcvs: Float32Array, srcnvs: Float32Array, size: number = 5): ITransformEntity {

		// let spv = CoRScene.createVec3(1.0);
		// srcEntity.localToGlobal(spv);
		// let scale = Math.abs(spv.x);
		let mat = srcEntity.getMatrix();
		let params = mat.decompose(CoMath.OrientationType.EULER_ANGLES);
		let scale = params[2].x;
		this.m_normalLineScale = size / scale;
		// console.log("line size: ", size, ", scale: ",scale, "lineScale: ", this.m_normalLineScale);

		let mb = new NormalLineMaterial();
		mb.setRGB3f(1.0, 0.0, 1.0);
		this.m_normalLineMaterial = mb;
		this.m_normalLineMaterial.setLength( this.m_normalLineScale );

		if(srcnvs == null) {
			let entity = CoRScene.createDisplayEntity();
			// this.normalLine = entity;
			entity.setVisible(false);
			return entity ;
		}
		let ml = CoMesh.line;
		ml.dynColorEnabled = true;
		let mesh: IRawMesh;

		let vs = srcvs;
		let nvs = srcnvs;
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
		for (let i = 0; i < tot; ++i) {
			j = i * 3;

			v0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
			v1.setXYZ(nvs[j], nvs[j + 1], nvs[j + 2]);

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

		let material = mb.create();
		let entity: ITransformEntity;

		entity = CoRScene.createDisplayEntity(srcEntity.getTransform());
		mesh = this.createLineMesh(pvs, puvs, pnvs, material);
		entity.setMesh(mesh);
		entity.setMaterial(material);

		entity.setVisible(false);
		return entity;
	}
	createLineMesh(vs: Float32Array, uvs: Float32Array, nvs: Float32Array, material: IRenderMaterial): IRawMesh {

		let mesh = CoMesh.createRawMesh();
		mesh.ivsEnabled = false;
		mesh.aabbEnabled = true;
		mesh.reset();
		mesh.setBufSortFormat(material.getBufSortFormat());
		mesh.addFloat32Data(vs, 3);
		mesh.addFloat32Data(uvs, 2);
		mesh.addFloat32Data(nvs, 3);
		mesh.vbWholeDataEnabled = false;
		mesh.initialize();
		mesh.toArraysLines();
		mesh.vtCount = Math.floor(vs.length / 3);
		return mesh;
	}
	
	createEntityMesh(ivs: Uint16Array | Uint32Array , vs: Float32Array, uvs: Float32Array, nvs: Float32Array, matrial: IRenderMaterial): IRawMesh {

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
	destroy(): void {
		this.m_entityMaterial = null;
		this.m_normalLineMaterial = null;
	}
}
export { NormalEntityBuilder };

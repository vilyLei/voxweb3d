import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

import DataMesh from "../../../vox/mesh/DataMesh";
import DivLog from "../../../vox/utils/DivLog";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { CoSpace } from "../../CoSpace";
import { NormalViewerMaterial } from "../material/NormalViewerMaterial";
import RendererState from "../../../vox/render/RendererState";
import { ISceneNode } from "./ISceneNode";
import Matrix4 from "../../../vox/math/Matrix4";
import { EntityLayout } from "./EntityLayout";
import BoxFrame3D from "../../../vox/entity/BoxFrame3D";

class SceneNode implements ISceneNode {

	private m_delay = 2;
	private m_vtxTotal: number = 0;
	protected m_partsTotal: number = 0;
	private m_wait_entities: DisplayEntity[] = [];

	protected m_cospace: CoSpace = null;
	protected m_rscene: RendererScene = null;

	protected m_scaleV: Vector3D = new Vector3D(1.0, 1.0, 1.0);
	protected m_time: number = 0;

	protected m_modelsTotal: number = 0;
	protected m_showTotal: number = 0;
	constructor() { }

	initialize(rscene: RendererScene, cospace: CoSpace): void {

		if (this.m_rscene == null) {

			this.m_rscene = rscene;
			this.m_cospace = cospace;
		}
	}
	mouseDown(evt: any): void {
	}
	load(urls: string[]): void {

		DivLog.ShowLogOnce("正在解析原数据...");
		this.m_time = Date.now();
	}
	showInfo(info: string): void {
		DivLog.ShowLogOnce( info );
	}
	protected m_waitPartsTotal: number = -1;
	private m_entities: DisplayEntity[] = [];
	private m_transforms: Matrix4[] = [];
	private m_transes: DisplayEntity[] = [];
	private m_entityLayout: EntityLayout = new EntityLayout();
	private m_frameBox: BoxFrame3D = null;
	private fitToCenter(): void {
		
		this.m_entityLayout.fixToPosition(this.m_transes, this.m_transforms, Vector3D.ZERO, 300.0);

		// //this.m_entityLayout.calcAABB(this.m_entities, this.m_transforms);
		// if(this.m_frameBox == null) {
		// 	this.m_frameBox = new BoxFrame3D();
		// 	this.m_frameBox.initializeByAABB( this.m_entityLayout.getAABB() );
		// 	this.m_rscene.addEntity( this.m_frameBox );
		// } else {
		// 	this.m_frameBox.updateFrameByAABB(this.m_entityLayout.getAABB());
		// 	this.m_frameBox.updateMeshToGpu();
		// }
	}
	private normalCorrectionTest(model: GeometryModelDataType): boolean {
		let k = 3 * 5;
		let vs = model.vertices;
		let ivs = model.indices;
		let nvs = model.normals;
		
		// for(let i: number = 0; i < nvs.length; ++i) {
		// 	nvs[i] *= -1;
		// }

		let ia = ivs[k];
		let ib = ivs[k + 1];
		let ic = ivs[k + 2];
		let va: Vector3D = new Vector3D();
		let vb: Vector3D = new Vector3D();
		let vc: Vector3D = new Vector3D();
		k = ia * 3;
		va.setXYZ(vs[k], vs[k+1], vs[k+2]);
		k = ib * 3;
		vb.setXYZ(vs[k], vs[k+1], vs[k+2]);
		k = ic * 3;
		vc.setXYZ(vs[k], vs[k+1], vs[k+2]);

		// va.subtractBy(vb);
		// va.scaleBy(-1);
		// vc.subtractBy( vb );
		// va.normalize();
		// vc.normalize();
		// Vector3D.Cross(va, vc, vb);

		
		va.subtractBy(vb);
		vc.subtractBy( vb );
		vc.scaleBy(-1);		
		va.normalize();
		vc.normalize();
		Vector3D.Cross(vc, va, vb);

		
		let na: Vector3D = new Vector3D();
		let nb: Vector3D = new Vector3D();
		let nc: Vector3D = new Vector3D();
		k = ia * 3;
		na.setXYZ(nvs[k], nvs[k+1], nvs[k+2]);
		k = ib * 3;
		nb.setXYZ(nvs[k], nvs[k+1], nvs[k+2]);
		k = ic * 3;
		nc.setXYZ(nvs[k], nvs[k+1], nvs[k+2]);

		na.normalize();
		nb.normalize();
		nc.normalize();
		na.addBy(nb);
		na.addBy(nc);
		na.normalize();
		
		let correct = va.dot(na) > 0;
		
		console.log("XXXX correct: ",correct, vb);

		return correct;
	}
	private m_lossTime: number = 0;
	private m_verticesTotal: number = 0;
	protected initEntity(model: GeometryModelDataType, transform: Matrix4 = null, index: number = 0): void {
		if (this.m_rscene != null && model != null) {
			if(model.vertices.length < 3) {
				this.m_modelsTotal--;
				return;
			}
			this.m_partsTotal++;
			this.m_verticesTotal += model.vertices.length/3;
			// let correct = this.normalCorrectionTest( model );

			this.m_lossTime = (Date.now() - this.m_time);
			// console.log("initEntity lossTime: ", (Date.now() - this.m_time) + " ms");

			this.m_vtxTotal += model.vertices.length;

			let material = new NormalViewerMaterial();
			material.initializeByCodeBuf();
			let dataMesh: DataMesh = new DataMesh();
			// dataMesh.wireframe = true;
			dataMesh.vbWholeDataEnabled = false;
			dataMesh.setVS(model.vertices);
			dataMesh.setUVS(model.uvsList[0]);
			dataMesh.setNVS(model.normals);
			dataMesh.setIVS(model.indices);
			dataMesh.setVtxBufRenderData(material);

			dataMesh.initialize();

			// console.log(index, ",dataMesh.bounds.radius: ", dataMesh.bounds.radius);

			// console.log("build lossTime: ", (Date.now() - time) + " ms");
			// console.log("this.m_vtxTotal: ", this.m_vtxTotal + "个顶点， tris: ", dataMesh.trisNumber, ",vtCount: ", dataMesh.vtCount);
			// console.log("this.m_vtxTotal: ", this.m_vtxTotal + "个顶点， tris: ",this.m_vtxTotal/3);
			// DivLog.ShowLog("三角面数量: " + dataMesh.trisNumber + "个");

			let entity: DisplayEntity = new DisplayEntity();
			// entity.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
			// entity.setRenderState(RendererState.NORMAL_STATE);
			entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
			entity.setMesh(dataMesh);
			entity.setMaterial(material);
			entity.setVisible(false);

			this.m_transforms.push( transform );
			this.m_transes.push( entity );


			this.fitToCenter();
			this.m_wait_entities.push(entity);
			this.m_entities.push(entity);
			this.m_rscene.addEntity(entity);
			entity.update();
		}
	}

	isFinish(): boolean {
		return this.m_modelsTotal > 0 && this.m_showTotal == this.m_modelsTotal;
	}

	clear(): void {
		if (this.isFinish()) {
			if(this.m_frameBox != null) {
				this.m_rscene.removeEntity( this.m_frameBox );
				this.m_frameBox = null;
			}
			this.m_verticesTotal = 0;
			this.m_transforms = [];
			this.m_transes = [];
			if (this.m_entities != null) {
				let entities = this.m_entities;
				for (let k: number = 0; k < entities.length; ++k) {
					entities[k].setVisible(false);
				}
				this.m_entities = null;
			}
			this.m_rscene = null;
			this.m_cospace = null;
		}
	}
	private m_entity: DisplayEntity;
	private m_rotV: Vector3D = new Vector3D();
	run(): void {
		
		// if(this.m_entity != null) {
		// 	this.m_entity.setRotation3(this.m_rotV);
		// 	this.m_entity.update();
		// 	this.m_rotV.x += 0.5;
		// 	this.m_rotV.y += 0.5;
		// }
		if (!this.isFinish()) {
			// if (this.m_waitPartsTotal == 0) {
			// 	this.m_waitPartsTotal = -1;
			// 	this.m_delay = 2;
			// 	this.fitToCenter();
			// }
			if (this.m_delay < 1) {
				if (this.m_wait_entities.length > 0) {
					let entity = this.m_wait_entities[this.m_wait_entities.length - 1];
					let tot = Math.floor(entity.getMesh().vtxTotal / 20000);
					tot = Math.min(tot, 10);
					this.m_delay = tot + 1;
					entity = this.m_wait_entities.pop();
					entity.setVisible(true);
					this.m_entity = entity;
					// if(this.m_showTotal == 0) {
					// 	console.log("############# show geom begin.");
					// }
					this.m_showTotal++;

					let info = "initialize entity loss time: " + this.m_lossTime + "ms";
					info += "</br>顶点数量: " + this.m_verticesTotal + "个";
					info += "</br>子模型数量: " + this.m_showTotal + "/" + this.m_modelsTotal + "个";
					if (this.isFinish()) {
						info += "</br>当前模型加载展示完成";
					}
					DivLog.ShowLogOnce(info);
				}
			} else if (this.m_delay > 0) {
				this.m_delay--;
			}
		}
	}
}

export { SceneNode };

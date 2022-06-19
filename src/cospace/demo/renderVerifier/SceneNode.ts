import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

import DataMesh from "../../../vox/mesh/DataMesh";
import DivLog from "../../../vox/utils/DivLog";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { CoSpace } from "../../CoSpace";
import { NormalViewerMaterial } from "../material/NormalViewerMaterial";
import RendererState from "../../../vox/render/RendererState";
import AABB from "../../../vox/geom/AABB";
import { ISceneNode } from "./ISceneNode";

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
	load(urls: string[]): void {

		DivLog.ShowLogOnce("正在解析原数据...");
		this.m_time = Date.now();
	}
	private m_entities: DisplayEntity[] = [];
	protected m_waitPartsTotal: number = -1;
	private fitToCenter(): void {

		let entities = this.m_entities;
		let aabb: AABB = new AABB();
		for (let k: number = 0; k < entities.length; ++k) {

			entities[k].update();
			if (k > 0) aabb.union(entities[k].getGlobalBounds());
			else aabb.copyFrom(entities[k].getGlobalBounds());
		}
		aabb.update();
		let sx = 300 / aabb.getWidth();
		let sy = 300 / aabb.getHeight();
		let sz = 300 / aabb.getLong();

		sx = Math.min(sx, sy, sz);
		this.m_scaleV.setXYZ(sx, sx, sx);

		let cv = aabb.center;
		let offsetV: Vector3D = new Vector3D(-cv.x, -cv.y, -cv.z);
		offsetV.scaleBy(sx);

		for (let k: number = 0; k < entities.length; ++k) {
			entities[k].setScale3(this.m_scaleV);
			entities[k].offsetPosition(offsetV);
			entities[k].update();
		}
	}
	private m_lossTime: number = 0;
	protected initEntity(model: GeometryModelDataType): void {
		if (this.m_rscene != null) {

			this.m_lossTime = (Date.now() - this.m_time);
			this.m_partsTotal++;
			//console.log("lossTime: ", (Date.now() - this.m_time)+" ms");
			let info = "initEntity lossTime: " + this.m_lossTime + "ms";
			info += "</br>子模型数量: " + this.m_partsTotal;
			DivLog.ShowLogOnce(info);
			console.log("initEntity lossTime: ", (Date.now() - this.m_time) + " ms");

			this.m_vtxTotal += model.vertices.length;
			let time = Date.now();

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

			// console.log("ctm dataMesh: ", dataMesh);

			console.log("build lossTime: ", (Date.now() - time) + " ms");
			console.log("this.m_vtxTotal: ", this.m_vtxTotal + "个顶点， tris: ", dataMesh.trisNumber, ",vtCount: ", dataMesh.vtCount);
			// console.log("this.m_vtxTotal: ", this.m_vtxTotal + "个顶点， tris: ",this.m_vtxTotal/3);
			// DivLog.ShowLog("三角面数量: " + dataMesh.trisNumber + "个");

			let entity: DisplayEntity = new DisplayEntity();
			// entity.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
			// entity.setRenderState(RendererState.NORMAL_STATE);
			entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
			entity.setMesh(dataMesh);
			entity.setMaterial(material);
			// entity.setScale3( this.m_scaleV );
			entity.setVisible(false);
			this.m_wait_entities.push(entity);
			// entity.setIvsParam(0, dataMesh.vtCount / 3);
			this.m_rscene.addEntity(entity);
			this.m_entities.push(entity);
		}
	}

	isFinish(): boolean {
		return this.m_modelsTotal > 0 && this.m_showTotal == this.m_modelsTotal;
	}

	clear(): void {
		if (this.isFinish()) {
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
	run(): void {

		if (!this.isFinish()) {
			if (this.m_waitPartsTotal == 0) {
				this.m_waitPartsTotal = -1;
				this.m_delay = 2;
				this.fitToCenter();
			}
			if (this.m_delay < 1) {
				if (this.m_wait_entities.length > 0) {
					let entity = this.m_wait_entities[this.m_wait_entities.length - 1];
					let tot = Math.floor(entity.getMesh().vtxTotal / 12000);
					tot = Math.min(tot, 10);
					this.m_delay = tot + 1;
					entity = this.m_wait_entities.pop();
					entity.setVisible(true);
					this.m_showTotal++;
					if (this.isFinish()) {
						let info = "initEntity lossTime: " + this.m_lossTime + "ms";
						info += "</br>子模型数量: " + this.m_partsTotal;
						info += "</br>当前模型加载、展示完成";
						DivLog.ShowLogOnce(info);
					}
				}
			} else if (this.m_delay > 0) {
				this.m_delay--;
			}
		}
	}
}

export { SceneNode };

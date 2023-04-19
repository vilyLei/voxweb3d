import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

import DataMesh from "../../../vox/mesh/DataMesh";
import DivLog from "../../../vox/utils/DivLog";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { CoSpace } from "../../CoSpace";
import RendererState from "../../../vox/render/RendererState";
import { ISceneNode } from "./ISceneNode";
import Matrix4 from "../../../vox/math/Matrix4";
import { EntityLayout } from "./EntityLayout";
import BoxFrame3D from "../../../vox/entity/BoxFrame3D";
import { NormalCheckMaterial } from "./NormalCheckMaterial";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";

class SceneNode implements ISceneNode {

	private m_delay = 2;
	private m_vtxTotal: number = 0;
	protected m_partsTotal: number = 0;
	private m_wait_entities: DisplayEntity[] = [];

	protected m_cospace: CoSpace = null;
	protected m_rscene: RendererScene = null;

	protected m_scaleV = new Vector3D(1.0, 1.0, 1.0);
	protected m_time = 0;

	protected m_modelsTotal = 0;
	protected m_showTotal = 0;
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
		DivLog.ShowLogOnce(info);
	}
	protected m_waitPartsTotal: number = -1;
	private m_entities: DisplayEntity[] = [];
	private m_transforms: Matrix4[] = [];
	private m_transes: DisplayEntity[] = [];
	private m_transles: DisplayEntity[] = [];
	private m_models: GeometryModelDataType[] = [];
	private m_entityLayout: EntityLayout = new EntityLayout();
	private m_frameBox: BoxFrame3D = null;
	private m_sizeScale: number = 1.0;
	private fitToCenter(): void {

		this.m_entityLayout.fixToPosition(this.m_transes, this.m_transforms, Vector3D.ZERO, 300.0);
		this.m_sizeScale = this.m_entityLayout.getSizeScale();
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
	private initEntityFinish(): void {
		let es = this.m_transes;
		this.m_transles = new Array(es.length);
		let dis = 5.0 / this.m_sizeScale;
		/*
		// console.log("XXXXXXXXXXXX this.m_sizeScale: ",this.m_sizeScale);
		for (let k: number = 0; k < es.length; ++k) {
			const entity = this.buildModelNVLine(this.m_models[k], dis);
			entity.getTransform().setParentMatrix(es[k].getMatrix());
			entity.update();
		}
		//*/
		//this.m_vels
		// console.log("XXX XXX XXX, initEntityFinish().");
		// for(let i = 0; i < this.m_vels.length; ++i) {
		// 	this.m_vels[i].setVisible(false);
		// }
	}
	private m_lossTime = 0;
	private m_verticesTotal = 0;
	private m_trianglesTotal = 0;
	private m_errModelTotal = 0;
	private m_normalErrInfo = "";
	private m_vels: DisplayEntity[] = [];
	private m_uvErrTotal = 0;
	protected initEntity(model: GeometryModelDataType, transform: Matrix4 = null, index: number = 0): void {
		if (model != null) {
			// console.log("initEntity(), model: ", model);
			this.m_partsTotal++;
			if (model.vertices == null || model.vertices.length < 3) {
				//this.m_modelsTotal--;
				// this.m_errInfo = "注意: 子模型数据有错误"
				this.m_errModelTotal++;
				return;
			}
			if (model.normals == null) {
				this.m_normalErrInfo = "当前模型法线数据丢失!!!";
				console.error(this.m_normalErrInfo);
			}
			this.m_models.push(model);
			// this.buildModelNVLine( model );
			this.m_verticesTotal += model.vertices.length / 3;
			// let correct = this.normalCorrectionTest( model );

			this.m_lossTime = (Date.now() - this.m_time);
			// console.log("initEntity lossTime: ", (Date.now() - this.m_time) + " ms");

			let flag = false;
			let uvErrorCheck = false;
			let hostUrl = window.location.href;
			if(hostUrl.indexOf("uvCheck=true") > 0) {
				uvErrorCheck = true;
			}
			if(uvErrorCheck) {
				if(model.status != undefined && model.status > 0) {
					console.log("Error model.status: ", model.status);
					this.m_uvErrTotal ++;
				}else {
					flag = true;
				}
			}

			this.m_vtxTotal += model.vertices.length;

			let vs = model.vertices;
			let ivs = model.indices;
			let uvDataFlag = false;
			let uvDataSpedValue = 0;
			if(model.uvsList && model.uvsList.length > 0) {
				let uvs = model.uvsList[0];
				if((uvs.length / 3) != (vs.length / 3)) {
					console.error("error uv data length, len:", (uvs.length / 3),(vs.length / 3));
				}
				for(let i = 0; i < uvs.length; ++i) {
					if(Math.abs(uvs[i]) > 1.0) {
						uvDataFlag = true;
						uvDataSpedValue = uvs[i];
						break;
					}
				}
			}
			if(uvDataFlag) {
				console.error("error uv data, v:", uvDataSpedValue);
			}
			let trisNumber = ivs.length / 3;
			this.m_trianglesTotal += trisNumber;
			let nvs2 = new Float32Array(vs.length);
			SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs2);

			let mb = new NormalCheckMaterial();

			mb.applyDifference(true);
			// let material = new NormalViewerMaterial();
			let material = mb.create(flag);
			material.initializeByCodeBuf();
			let dataMesh: DataMesh = new DataMesh();
			dataMesh.wireframe = flag;
			dataMesh.shape = !uvErrorCheck;
			dataMesh.vbWholeDataEnabled = false;
			dataMesh.setVS(model.vertices);
			// dataMesh.setUVS(model.uvsList[0]);
			dataMesh.setUVS(nvs2);
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

			this.m_transforms.push(transform);
			this.m_transes.push(entity);


			this.fitToCenter();
			this.m_wait_entities.push(entity);
			this.m_entities.push(entity);
			this.m_rscene.addEntity(entity);
			entity.update();

			if(model.status != undefined && model.status > 0) {
				console.log("Error model.status: ", model.status);
			}else {
				// entity.setIvsParam(0,0);
				// this.m_vels.push( entity );
			}
		}
	}

	isFinish(): boolean {
		return this.m_modelsTotal > 0 && (this.m_showTotal + this.m_errModelTotal) == this.m_modelsTotal;
	}

	clear(): void {
		if (this.isFinish()) {
			if (this.m_frameBox != null) {
				this.m_rscene.removeEntity(this.m_frameBox);
				this.m_frameBox = null;
			}
			this.m_uvErrTotal = 0;
			this.m_normalErrInfo = "";
			this.m_verticesTotal = 0;
			this.m_trianglesTotal = 0;
			this.m_transforms = [];
			this.m_transes = [];
			this.m_transles = [];
			this.m_vels = [];
			if (this.m_entities != null) {
				let entities = this.m_entities;
				for (let k: number = 0; k < entities.length; ++k) {
					entities[k].setVisible(false);
				}
				this.m_entities = null;
			}
			this.m_models = [];
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
					info += "</br>三角面数量: " + this.m_trianglesTotal + "个";
					info += "</br>子模型数量: " + this.m_showTotal + "/" + this.m_modelsTotal + "个";
					if (this.isFinish()) {
						info += "</br>当前模型加载展示完成";
						if (this.m_errModelTotal > 0) {
							info += "</br><font color='#ee00aa'>注意: 有" + this.m_errModelTotal + "个子模型法线数据有问题</font>";
						}
						if(this.m_uvErrTotal) {
							info += "</br><font color='#ee00aa'>注意: 有" + this.m_uvErrTotal + "个子模型uv数据有问题</font>";
						}
						if (this.m_normalErrInfo != "") {
							info += "</br><font color='#ee00aa'>注意: " + this.m_normalErrInfo + ",当前所见的法线由此程序生成</font>";
						}

						info += "</br><b><pre><font color='#eeFFaa'>printLog(info)</font></pre></b>";

						this.initEntityFinish();
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

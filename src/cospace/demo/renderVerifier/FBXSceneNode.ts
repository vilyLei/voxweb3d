import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";

import DebugFlag from "../../../vox/debug/DebugFlag";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

import DataMesh from "../../../vox/mesh/DataMesh";
import DivLog from "../../../vox/utils/DivLog";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";
import { CoSpace } from "../../CoSpace";
import { DataFormat } from "../../schedule/base/DataUnit";
import { GeometryDataUnit } from "../../schedule/base/GeometryDataUnit";
import { NormalViewerMaterial } from "../material/NormalViewerMaterial";
import RendererState from "../../../vox/render/RendererState";
import { FBXBufferLoader } from "../../modules/fbx/FBXBufferLoader";
import AABB from "../../../vox/geom/AABB";
import { SceneNode } from "./SceneNode";

class FBXSceneNode extends SceneNode {


	constructor() { super(); }

	load(urls: string[]): void {
		
		super.load( urls);
		this.loadFBXBySteps(urls[0]);
	}
	private loadFBXBySteps(url: string): void {

		// let url: string = "static/assets/fbx/test01.fbx";
		// // url = "static/assets/fbx/box.fbx";
		// url = "static/private/fbx/test_500W.fbx";
		// // url = "static/private/fbx/Samba_Dancing.fbx";

		DivLog.ShowLogOnce("正在解析数据...");
		this.m_partsTotal = 0;
		this.m_showTotal = 0;
		let fbxBufLoader = new FBXBufferLoader();
		fbxBufLoader.loadBySteps(
			url,
			(model: GeometryModelDataType, id: number, index: number, total: number, url: string): void => {

				// console.log("loadFBXBySteps(), model: ", index + "/" + total);
				this.m_modelsTotal = total;
				// this.m_showTotal = 0
				this.m_waitPartsTotal = total;
				this.initEntity(model);
				if ((index + 1) == total) {
					this.m_waitPartsTotal = 0;
				}
			}
		);
	}
	private loadFBX(): void {

		let url: string = "static/assets/fbx/test01.fbx";
		// url = "static/assets/fbx/box.fbx";
		// url = "static/private/fbx/test_500W.fbx";
		// url = "static/private/fbx/Samba_Dancing.fbx";

		let fbxBufLoader = new FBXBufferLoader();
		fbxBufLoader.load(
			url,
			(modelMap: Map<number, GeometryModelDataType>, url: string): void => {
				// this.m_scaleV.setXYZ(-2.0, -2.0, 2.0);
				// this.m_scaleV.setXYZ(56.0, 56.0, 56.0);
				//this.m_scaleV.setXYZ(2.0, 2.0, 2.0);
				// console.log("loadFBX(), modelMap: ",modelMap);
				this.m_partsTotal = 0;
				for (let [key, value] of modelMap) {
					this.m_partsTotal++;
					this.initEntity(value);
				}
				console.log("partsTotal: ", this.m_partsTotal);
				// 
				this.m_waitPartsTotal = 0;
			}
		);
	}

	// private loadCTM(): void {

	// 	//this.m_scaleV.setXYZ(2.0,2.0,2.0);

	// 	let baseUrl: string = window.location.href + "static/private/ctm/";

	// 	let multi: boolean = true;
	// 	multi = false;
	// 	if (multi) {
	// 		for (let i: number = 26; i >= 0; --i) {
	// 			let url: string = baseUrl + "sh202/sh202_" + i + ".ctm";
	// 			this.loadCTMByUrl(url);
	// 		}
	// 	} else {
	// 		//this.loadCTMByUrl("static/private/ctm/errorNormal.ctm");
	// 		this.loadCTMByUrl("static/private/ctm/ctm_500W.ctm");
	// 	}
	// }
	// private loadCTMByUrl(url: string): void {
	// 	this.m_cospace.geometry.getCPUDataByUrlAndCallback(
	// 		url,
	// 		DataFormat.CTM,
	// 		(unit: GeometryDataUnit, status: number): void => {
	// 			let model: GeometryModelDataType = unit.data.model;
	// 			if (model.normals == null) {
	// 				console.error("model.normals == null, url: ", url);
	// 			}
	// 			this.initEntity(model);
	// 		},
	// 		true
	// 	);
	// }
	/*
	private m_vtxTotal: number = 0;
	private m_partsTotal: number = 0;
	private m_wait_entities: DisplayEntity[] = [];
	private initEntity(model: GeometryModelDataType): void {
		this.m_partsTotal++;
		//console.log("lossTime: ", (Date.now() - this.m_time)+" ms");
		let info = "initEntity lossTime: " + (Date.now() - this.m_time) + " ms";
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

	isFinish(): boolean {
		return this.m_modelsTotal>0 && this.m_showTotal == this.m_modelsTotal;
	}

	clear(): void {
		if(this.isFinish()) {
			if(this.m_entities != null) {
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
				}
			} else if (this.m_delay > 0) {
				this.m_delay--;
			}
		}
	}
	//*/
}

export { FBXSceneNode };

import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { FBXParseTaskListener, FBXParseTask } from "../modules/fbx/FBXParseTask";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import ShaderMaterial from "../../vox/material/mcase/ShaderMaterial";
import DataMesh from "../../vox/mesh/DataMesh";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import { UserInteraction } from "../../vox/engine/UserInteraction";

import MaterialBase from "../../vox/material/MaterialBase";
import DivLog from "../../vox/utils/DivLog";

import { TransST, ThreadWFST } from "../modules/thread/base/ThreadWFST";
import { FBXBufferLoader } from "../modules/fbx/FBXBufferLoader";
import { HttpFileLoader } from "../modules/loaders/HttpFileLoader";
import { FBXBufferObject } from "../modules/fbx/FBXBufferObject";
import { NormalUVViewerMaterial } from "./material/NormalUVViewerMaterial";

/**
 * 通过加载到的fbx模型二进制数据，发送CTM资源解析任务给多线程数据处理系统，获取解析之后的CTM模型数据
 */
export class DemoFBXFastParser {
	private m_threadSchedule: ThreadSchedule;

	private m_fbxParseTask: FBXParseTask;

	private m_userInterac: UserInteraction = new UserInteraction();
	private m_rscene: RendererScene = null;
	constructor() { }

	initialize(): void {
		console.log("DemoFBXFastParser::initialize()...");
		// 创建多线程调度器(多线程系统)
		let schedule = new ThreadSchedule();
		// 初始化多线程调度器
		schedule.initialize(3, "static/cospace/core/code/ThreadCore.umd.min.js");

		// 创建 ctm 加载解析任务
		let fbxParseTask = new FBXParseTask("static/cospace/modules/fbxFast/ModuleFBXGeomFastParser.umd.js");
		// 绑定当前任务到多线程调度器
		schedule.bindTask(fbxParseTask);
		// 设置一个任务完成的侦听器
		fbxParseTask.setListener(this);
		this.m_fbxParseTask = fbxParseTask;
		
			//ModuleFBXGeomFastParser

			this.m_threadSchedule = schedule;

		DivLog.SetDebugEnabled(true);

		let wsft = ThreadWFST.Build(0, 0, 0, 9);
		console.log("step0 wsft: ", wsft);
		wsft = ThreadWFST.ModifyTransStatus(wsft, TransST.Finish);
		console.log("step1 wsft: ", wsft);
		let transST = ThreadWFST.GetTransStatus(wsft);
		console.log("step2 transST: ", transST);


		// 启动循环调度
		this.update();
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		//console.log("getBaseUrl(): ", this.getBaseUrl());

		this.initRenderer();

		this.m_lossTime = Date.now();
		
		let url: string = "static/private/fbx/box.fbx";
		url = "static/private/fbx/base3.fbx";
		// url = "static/private/fbx/model_500W.fbx";
		// url = "static/private/fbx/hat_hasNormal.fbx";
		// url = "static/private/fbx/hat_hasNotNormal.fbx";
		this.loadFBX(url);
	}

	private m_lossTime: number = 0;
	private m_vtxTotal: number = 0;
	private m_trisNumber: number = 0;
	fbxParseFinish(models: GeometryModelDataType[], transform: Float32Array, url: string, index: number, total: number): void {
		console.log("DemoFBXFastParser::fbxParseFinish(), geometry models:", models);
		// console.log("loss time: ", (Date.now() - this.m_lossTime));
		let info: string = "fbx lossTime: " + ((Date.now() - this.m_lossTime));
		let model = models[0];
		let vtxTotal: number = model.vertices.length / 3;
		let trisNumber: number = model.indices.length / 3;
		this.m_vtxTotal += vtxTotal;
		this.m_trisNumber += trisNumber;
		info += "</br>vtx: " + this.m_vtxTotal;
		info += "</br>tri: " + this.m_trisNumber;

		DivLog.ShowLogOnce(info);
		// return;
		if(model.normals == null) {
			console.error("has not normal in the model");
		}
		let material = new NormalUVViewerMaterial();
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

		let entity: DisplayEntity = new DisplayEntity();
		// entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.getTransform().setParentMatrix( new Matrix4(transform) );
		entity.setMesh(dataMesh);
		entity.setMaterial(material);
		this.m_rscene.addEntity(entity);
	}
	private loadFBX(url: string): void {


		let httpFileLoader = new HttpFileLoader();
		httpFileLoader.load(
			url,
			(buf: ArrayBuffer, url: string): void => {

				// this.m_fbxParseTask.addBinaryData(buf, url);
				///*
				let fbxLoader = new FBXBufferLoader();
				fbxLoader.parseBufBySteps(buf, url,
					(model: GeometryModelDataType, bufObj: FBXBufferObject, index: number, total: number, url: string): void => {
						console.log("main thread fbx parsing finish, model: ", model);
						this.fbxParseFinish([model], bufObj.transform.getLocalFS32(), url, 0, 1);
					}
				);
				//*/
			},
			null,
			(status: number, url: string): void => {
				console.error("load fbx data error, url: ", url);

			}
		);
	}
	private initRenderer(): void {

		RendererDevice.SHADERCODE_TRACE_ENABLED = false;
		RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
		RendererDevice.SetWebBodyColor("black");

		let rparam: any = new RendererParam();
		rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
		rparam.setCamPosition(1800.0, 1800.0, 1800.0);
		rparam.setCamProject(45, 20.0, 9000.0);
		this.m_rscene = new RendererScene();
		this.m_rscene.initialize(rparam, 3);
		this.m_userInterac.initialize(this.m_rscene);
		this.m_userInterac.cameraZoomController.syncLookAt = true;

		let axis = new Axis3DEntity();
		axis.initialize(500);
		this.m_rscene.addEntity( axis );
	}
	private mouseDown(evt: MouseEvent): void {

	}
	private m_timeoutId: any = -1;
	/**
	 * 定时调度
	 */
	private update(): void {
		if (this.m_threadSchedule != null) {
			this.m_threadSchedule.run();
			if (this.m_timeoutId > -1) {
				clearTimeout(this.m_timeoutId);
			}
			this.m_timeoutId = setTimeout(this.update.bind(this), 40); // 25 fps
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			this.m_userInterac.run();
			this.m_rscene.run();
		}
	}
}

export default DemoFBXFastParser;

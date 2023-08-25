import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import BinaryLoader from "../../vox/assets/BinaryLoader";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";

import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererState from "../../vox/render/RendererState";
import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import ShaderMaterial from "../../vox/material/mcase/ShaderMaterial";
import DataMesh from "../../vox/mesh/DataMesh";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import { UserInteraction } from "../../app/engine/UserInteraction";

import MaterialBase from "../../vox/material/MaterialBase";
import DivLog from "../../vox/utils/DivLog";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
/**
 * 通过加载到的CTM模型二进制数据，发送CTM资源解析任务给多线程数据处理系统，获取解析之后的CTM模型数据
 */
export class DemoCTMParser {
	private m_threadSchedule: ThreadSchedule;

	private m_ctmParseTask: CTMParseTask;

	private m_userInterac: UserInteraction = new UserInteraction();
	private m_rscene: RendererScene = new RendererScene();
	constructor() {}

	initialize(): void {
		console.log("DemoCTMParser::initialize()...");
		// 创建多线程调度器(多线程系统)
		let schedule = new ThreadSchedule();
		// 初始化多线程调度器
		schedule.initialize(3, "static/cospace/core/code/ThreadCore.umd.min.js");

		// 创建 ctm 加载解析任务
		let ctmParseTask = new CTMParseTask("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js");
		// 绑定当前任务到多线程调度器
		schedule.bindTask(ctmParseTask);
		// 设置一个任务完成的侦听器
		ctmParseTask.setListener(this);
		this.m_ctmParseTask = ctmParseTask;

		this.m_threadSchedule = schedule;

		// 启动循环调度
		this.update();
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		//console.log("getBaseUrl(): ", this.getBaseUrl());

		this.initRenderer();

		this.m_lossTime = Date.now();
		this.loadCTM01();
		// this.loadCTM02();
	}

	private m_lossTime: number = 0;
	private m_vtxTotal: number = 0;
	private m_trisNumber: number = 0;
	private loadCTM02(): void {
		// for(let i: number = 0; i < 27; ++i) {
		// 	let url = "static/private/ctm/sh202/sh202_"+i+".ctm";
		// 	this.initCTMFromBin(url);
		// }
		for(let i: number = 0; i < 194; ++i) {
			let url = "static/private/ctm/sh03/sh03_"+i+".ctm";
			this.initCTMFromBin(url);
		}
	}
	private loadCTM01(): void {
		let baseUrl: string = "static/private/ctm/";
		let urls: string[] = [];
		for (let i = 0; i <= 26; ++i) {
			urls.push(baseUrl + "sh202/sh202_" + i + ".ctm");
		}
		urls = [baseUrl + "errorNormal.ctm"];
		urls = [baseUrl + "sh202/sh202_4.ctm"];
		urls = [baseUrl + "sh202/sh202_25.ctm"];
		urls = [baseUrl + "sh202/sh202_26.ctm"];
		urls = ["static/private/test/tst.ctm"];
		urls = ["static/private/bake/three_box/285f9af37ce172cf067f9ae155cfa8d6.ctm"];

		// urls = [baseUrl + "sh202/sh202_5.ctm"];
		//let ctmUrl: string = "static/assets/ctm/hand.ctm";
		this.initCTMFromBin(urls[0]);
	}
	private initRenderer(): void {
		RendererDevice.SHADERCODE_TRACE_ENABLED = false;
		RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
		RendererDevice.SetWebBodyColor("black");

		let rparam: any = new RendererParam();
		rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
		rparam.setCamPosition(1800.0, 1800.0, 1800.0);
		rparam.setCamProject(45, 20.0, 9000.0);
		this.m_rscene.initialize(rparam, 3);
		this.m_userInterac.initialize(this.m_rscene);
		this.m_userInterac.cameraZoomController.syncLookAt = true;
		DivLog.SetDebugEnabled( true );
		// let axis = new Axis3DEntity();
		// axis.initialize(500);
		// this.m_rscene.addEntity( axis );
		new RenderStatusDisplay(this.m_rscene, true);
	}

	// 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
	ctmParseFinish(model: GeometryModelDataType, url: string): void {
		// console.log("loss time: ", (Date.now() - this.m_lossTime));
		let info: string = "ctm lossTime: "+((Date.now() - this.m_lossTime));

		let vtxTotal: number = model.vertices.length / 3;
		let trisNumber: number = model.indices.length / 3;
		this.m_vtxTotal += vtxTotal;
		this.m_trisNumber += trisNumber;
		info += "</br>vtx: " + this.m_vtxTotal;
		info += "</br>tri: " + this.m_trisNumber;

		DivLog.ShowLogOnce(info);
		// return;

		let material = this.buildShdMaterial();
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
		entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMesh(dataMesh);
		entity.setMaterial(material);
		this.m_rscene.addEntity(entity);

		console.log("DemoCTMParser::ctmParseFinish(), model: ", model, ", url: ", url);
	}

	buildShdMaterial(textureEnabled: boolean = false): ShaderMaterial {
		let material = new ShaderMaterial("shd_nv_material");
		material.setShaderBuilder((coderBuilder: any): void => {
			let coder = coderBuilder.getShaderCodeBuilder();
			coder.addVertLayout("vec3", "a_nvs");
			coder.addVarying("vec3", "v_worldNormal");
			coder.vertMatrixInverseEnabled = true;
			coder.addVertMainCode(
				`
			localPosition = vec4(a_vs.xyz,1.0);
			worldPosition = u_objMat * localPosition;
			oWorldPosition = worldPosition;
			viewPosition = u_viewMat * worldPosition;
			gl_Position = u_projMat * viewPosition;
			v_worldNormal = normalize( a_nvs.xyz * inverse(mat3(u_objMat)) );

		`
			);
			coder.addFragMainCode(
				`
			FragColor0 = vec4(v_worldNormal.xyz, 1.0);
		`
			);
		});
		// material.initializeByCodeBuf(textureEnabled);

		return material;
	}
	private setBinaryDataToTask(ctmDataBuffer: ArrayBuffer, url: string): void {
		let data = new Uint8Array(ctmDataBuffer);
		// 发送一份任务处理数据，一份数据一个子线程处理一次
		this.m_ctmParseTask.addBinaryData(data, url);
	}
	private mouseDown(evt: any): void {}

	private initCTMFromBin(ctmUrl: string): void {
		let ctmLoader: BinaryLoader = new BinaryLoader();
		ctmLoader.uuid = ctmUrl;
		ctmLoader.load(ctmUrl, this);
	}

	loaded(buffer: ArrayBuffer, uuid: string): void {
		this.setBinaryDataToTask(buffer, uuid);
	}
	loadError(status: number, uuid: string): void {}

	private m_timeoutId: any = -1;
	/**
	 * 定时调度
	 */
	private update(): void {
		this.m_threadSchedule.run();
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 40); // 25 fps
	}
	run(): void {
		this.m_userInterac.run();
		this.m_rscene.run();
	}
}

export default DemoCTMParser;

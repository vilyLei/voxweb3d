import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import { FBXParseTaskListener, FBXParseTask } from "../modules/fbx/FBXParseTask";
import BinaryLoader from "../../vox/assets/BinaryLoader";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import {
	Axis3DEntity,
	DataMesh,
	Default3DMaterial,
	DisplayEntity,
	Matrix4,
	RendererDevice,
	RendererParam,
	RendererScene,
	ShaderMaterial,
	UserInteraction
} from "../voxengine/CoEngine";
import MaterialBase from "../../vox/material/MaterialBase";
import DivLog from "../../vox/utils/DivLog";

import { TransST, ThreadWFST } from "../modules/thread/base/ThreadWFST";
import { FBXBufferLoader } from "../modules/fbx/FBXBufferLoader";
import { HttpFileLoader } from "../modules/loaders/HttpFileLoader";
import { FBXBufferObject } from "../modules/fbx/FBXBufferObject";

/**
 * 通过加载到的fbx模型二进制数据，发送CTM资源解析任务给多线程数据处理系统，获取解析之后的CTM模型数据
 */
export class DemoFBXFastParser {
	private m_threadSchedule: ThreadSchedule;

	private m_ctmParseTask: CTMParseTask;
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
		// let ctmParseTask = new CTMParseTask("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js");
		// // 绑定当前任务到多线程调度器
		// schedule.bindTask(ctmParseTask);
		// // 设置一个任务完成的侦听器
		// ctmParseTask.setListener(this);
		// this.m_ctmParseTask = ctmParseTask;

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
		// this.loadCTM02();
		// this.loadCTM();

		let url: string = "static/private/fbx/box.fbx";
		url = "static/private/fbx/base3.fbx";
		this.loadFBX(url);
	}

	private m_lossTime: number = 0;
	private m_vtxTotal: number = 0;
	private m_trisNumber: number = 0;
	fbxParseFinish(models: GeometryModelDataType[], transform: Float32Array, url: string, index: number, total: number): void {
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

		// let mat4 = new Matrix4(transform);
		let material = this.createNormalMaterial();
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

				this.m_fbxParseTask.addBinaryData(buf, url);
				/*
				let fbxLoader = new FBXBufferLoader();
				fbxLoader.parseBufBySteps(buf, url,
					(model: GeometryModelDataType, bufObj: FBXBufferObject, index: number, total: number, url: string): void => {
						console.log("fbx parse finish, model: ", model);
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
	private loadCTM(): void {
		let baseUrl: string = "static/private/ctm/";
		let urls: string[] = [];
		for (let i = 0; i <= 26; ++i) {
			urls.push(baseUrl + "sh202/sh202_" + i + ".ctm");
		}
		urls = [baseUrl + "errorNormal.ctm"];
		urls = [baseUrl + "sh202/sh202_4.ctm"];
		urls = [baseUrl + "sh202/sh202_22.ctm"];
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
		this.m_rscene = new RendererScene();
		this.m_rscene.initialize(rparam, 3);
		this.m_userInterac.initialize(this.m_rscene);
		this.m_userInterac.cameraZoomController.syncLookAt = true;
		// let axis = new Axis3DEntity();
		// axis.initialize(500);
		// this.m_rscene.addEntity( axis );
	}

	// 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
	ctmParseFinish(model: GeometryModelDataType, url: string): void {
		// console.log("loss time: ", (Date.now() - this.m_lossTime));
		let info: string = "ctm lossTime: " + ((Date.now() - this.m_lossTime));

		let vtxTotal: number = model.vertices.length / 3;
		let trisNumber: number = model.indices.length / 3;
		this.m_vtxTotal += vtxTotal;
		this.m_trisNumber += trisNumber;
		info += "</br>vtx: " + this.m_vtxTotal;
		info += "</br>tri: " + this.m_trisNumber;

		DivLog.ShowLogOnce(info);
		return;
		if (this.m_rscene == null) return;

		let material = this.createNormalMaterial();
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
		entity.setMesh(dataMesh);
		entity.setMaterial(material);
		this.m_rscene.addEntity(entity);

		console.log("DemoFBXFastParser::ctmParseFinish(), model: ", model, ", url: ", url);
	}

	private m_nv_vertCode = `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec4 v_param;
void main()
{
	vec4 viewPv = u_viewMat * u_objMat * vec4(a_vs, 1.0);
	gl_Position = u_projMat * viewPv;
	vec3 pnv = normalize(a_nvs * inverse(mat3(u_objMat)));
	v_param = vec4(pnv, 1.0);
}
	`;
	private m_nv_fragCode = `#version 300 es
precision mediump float;
const float MATH_PI = 3.14159265;
const float MATH_2PI = 2.0 * MATH_PI;
const float MATH_3PI = 3.0 * MATH_PI;
const float MATH_1PER2PI = 0.5 * MATH_PI;
const float MATH_3PER2PI = 3.0 * MATH_PI * 0.5;

const vec3 gama = vec3(1.0/2.2);
in vec4 v_param;
layout(location = 0) out vec4 FragColor;
void main() {

	bool facing = gl_FrontFacing;
	vec2 dv = fract(gl_FragCoord.xy/vec2(5.0)) - vec2(0.5);
	vec2 f2 = sign(dv);

	vec3 nv = normalize(v_param.xyz);
	vec3 color = pow(nv, gama);

	vec3 frontColor = color.xyz;
	vec3 backColor = vec3(sign(f2.x * f2.y), 1.0, 1.0);
	vec3 dstColor = facing ? frontColor : backColor;

	FragColor = vec4(dstColor, 1.0);
	// FragColor = vec4(color, 1.0);
}
	`;

	private m_nv_material: ShaderMaterial = null;
	private createNormalMaterial(): MaterialBase {
		// return new Default3DMaterial();
		if (this.m_nv_material != null) {
			return this.m_nv_material;
		}
		let material = new ShaderMaterial("nv_material");
		material.setVtxShaderCode(this.m_nv_vertCode);
		material.setFragShaderCode(this.m_nv_fragCode);
		material.initializeByCodeBuf();
		this.m_nv_material = material;
		return material;
	}
	private setBinaryDataToTask(ctmDataBuffer: ArrayBuffer, url: string): void {
		let data = new Uint8Array(ctmDataBuffer);
		// 发送一份任务处理数据，一份数据一个子线程处理一次
		this.m_ctmParseTask.addBinaryData(data, url);
	}
	private mouseDown(evt: any): void { }

	private initCTMFromBin(ctmUrl: string): void {
		let ctmLoader: BinaryLoader = new BinaryLoader();
		ctmLoader.uuid = ctmUrl;
		ctmLoader.load(ctmUrl, this);
	}

	loaded(buffer: ArrayBuffer, uuid: string): void {
		this.setBinaryDataToTask(buffer, uuid);
	}
	loadError(status: number, uuid: string): void { }

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

import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import BinaryLoader from "../../vox/assets/BinaryLoader";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import {
	Axis3DEntity,
	DataMesh,
	Default3DMaterial,
	DisplayEntity,
	RendererDevice,
	RendererParam,
	RendererScene,
	ShaderMaterial,
	UserInteraction
} from "../voxengine/CoEngine";
import MaterialBase from "../../vox/material/MaterialBase";
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
		schedule.initialize(2, "static/cospace/core/code/ThreadCore.umd.min.js");

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

		let baseUrl: string = "static/private/ctm/";
		let urls: string[] = [];
		for (let i = 0; i <= 26; ++i) {
			urls.push(baseUrl + "sh202/sh202_" + i + ".ctm");
		}
		urls = [baseUrl + "errorNormal.ctm"];
		urls = [baseUrl + "sh202/sh202_5.ctm"];
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

		// let axis = new Axis3DEntity();
		// axis.initialize(500);
		// this.m_rscene.addEntity( axis );
	}
	// 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
	ctmParseFinish(model: GeometryModelDataType, url: string): void {
		console.log("this.m_lossTime: ", (Date.now() - this.m_lossTime));
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

		console.log("DemoCTMParser::ctmParseFinish(), model: ", model, ", url: ", url);
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
	private mouseDown(evt: any): void {}

	private m_lossTime = 0;
	private initCTMFromBin(ctmUrl: string): void {
		this.m_lossTime = Date.now();
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

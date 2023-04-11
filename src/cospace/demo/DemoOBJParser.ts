import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { OBJParseTask } from "../modules/obj/OBJParseTask";
import BinaryLoader from "../../vox/assets/BinaryLoader";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../vox/scene/block/RenderableEntityBlock";

import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
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

import { MaterialContextParam } from "../../materialLab/base/MaterialContextParam";
import { MaterialContext } from "../../materialLab/base/MaterialContext";
import { ILightModule } from "../../light/base/ILightModule";
import { LightModule } from "../../light/base/LightModule";
import PBRModuleTest from "./coViewer/PBRModuleTest";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import { MaterialPipeType } from "../voxengine/CoRScene";
import EnvLightModule from "../../light/base/EnvLightModule";
import { ShadowVSMModule } from "../../shadow/vsm/base/ShadowVSMModule";

/**
 * 通过加载到的CTM模型二进制数据，发送CTM资源解析任务给多线程数据处理系统，获取解析之后的CTM模型数据
 */
export class DemoOBJParser {
	private m_threadSchedule: ThreadSchedule;

	private m_objParseTask: OBJParseTask;

	private m_userInterac: UserInteraction = new UserInteraction();
	private m_rscene: RendererScene = null;
	private m_mctx: MaterialContext = null;
	private m_pbrModule: PBRModuleTest = null;
	constructor() {}

	initialize(): void {
		console.log("DemoOBJParser::initialize()...");
		// 创建多线程调度器(多线程系统)
		let schedule = new ThreadSchedule();
		// 初始化多线程调度器
		schedule.initialize(3, "static/cospace/core/code/ThreadCore.umd.min.js");

		// 创建 ctm 加载解析任务
		let ctmParseTask = new OBJParseTask("static/cospace/modules/obj/ModuleOBJGeomParser.umd.min.js");
		// 绑定当前任务到多线程调度器
		schedule.bindTask(ctmParseTask);
		// 设置一个任务完成的侦听器
		ctmParseTask.setListener(this);
		this.m_objParseTask = ctmParseTask;

		this.m_threadSchedule = schedule;

		// 启动循环调度
		this.update();
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		//console.log("getBaseUrl(): ", this.getBaseUrl());


		this.m_pbrModule = new PBRModuleTest();
		this.m_pbrModule.preload((): void => {
			this.initRenderer();
		});

	}

	private m_lossTime: number = 0;
	private m_vtxTotal: number = 0;
	private m_trisNumber: number = 0;

	private loadObj(): void {
		let baseUrl: string = "static/private/obj/";
		let urls: string[] = [];
		urls = [baseUrl + "base.obj"];
		this.initCTMFromBin(urls[0]);
	}
	private createSceneBlock(rsecne: RendererScene): void {

		let rscene = rsecne;
		let materialBlock = new RenderableMaterialBlock();
		materialBlock.initialize();
		//rscene.materialBlock = materialBlock;
		let entityBlock = new RenderableEntityBlock();
		entityBlock.initialize();
		//rscene.entityBlock = entityBlock;
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

		DivLog.SetDebugEnabled(true);
		// let axis = new Axis3DEntity();
		// axis.initialize(500);
		// this.m_rscene.addEntity( axis );

		this.createSceneBlock( this.m_rscene );

		let mcParam = new MaterialContextParam();
		mcParam.shaderLibVersion = "v101";
		mcParam.pointLightsTotal = 1;
		mcParam.directionLightsTotal = 2;
		mcParam.spotLightsTotal = 0;
		mcParam.loadAllShaderCode = true;
		mcParam.shaderCodeBinary = true;
		mcParam.pbrMaterialEnabled = true; //this.pbrMaterialEnabled;
		mcParam.lambertMaterialEnabled = false; //this.lambertMaterialEnabled;
		mcParam.shaderFileNickname = true;
		mcParam.vsmFboIndex = 0;
		//nickname
		// mcParam.vsmEnabled = true;
		mcParam.vsmEnabled = true;
		// mcParam.buildBinaryFile = true;
		this.m_mctx = new MaterialContext();
		this.m_mctx.addShaderLibListener(this);

		this.buildEnvLight();
		this.buildShadowModule(mcParam);
		this.buildLightModule(mcParam);

		this.m_mctx.initialize( this.m_rscene, mcParam);

		this.m_pbrModule.active(this.m_rscene, this.m_mctx, mcParam.vsmEnabled);


		console.log("############## initRenderer() ... 2");

	}

	private buildEnvLight(): void {

		let rproxy = this.m_rscene.getRenderProxy();
		let module = new EnvLightModule(rproxy.uniformContext);
		module.initialize();
		module.setFogColorRGB3f(0.0, 0.8, 0.1);

		this.m_mctx.envLightModule = module;
	}
	private buildBGBox(): void {

		let rscene = this.m_rscene;
		// return;
		let material = this.m_pbrModule.createMaterial(true);

		let scale = 700.0;
		let boxEntity = rscene.entityBlock.createEntity();
		boxEntity.setMaterial(material);
		boxEntity.copyMeshFrom(rscene.entityBlock.unitBox);
		boxEntity.setScaleXYZ(scale, scale * 0.05, scale);
		boxEntity.setXYZ(0, -200, 0);
		rscene.addEntity(boxEntity);
	}

	private buildShadowModule(param: MaterialContextParam): void {

		let vsmModule = new ShadowVSMModule(param.vsmFboIndex);//VSMShadowModule.create(param.vsmFboIndex);
		vsmModule.setCameraPosition( new Vector3D(1, 800, 1));
		vsmModule.setCameraNear(10.0);
		vsmModule.setCameraFar(3000.0);
		vsmModule.setMapSize(512.0, 512.0);
		vsmModule.setCameraViewSize(4000, 4000);
		vsmModule.setShadowRadius(2);
		vsmModule.setShadowBias(-0.0005);
		vsmModule.initialize(this.m_rscene, [0], 3000);
		vsmModule.setShadowIntensity(0.8);
		vsmModule.setColorIntensity(0.3);
		this.m_mctx.vsmModule = vsmModule;
		console.log("buildShadowModule(), vsmModule: ", vsmModule);

	}
	private buildEnvBox(): void {

		const mctx = this.m_mctx;

		let renderingState = this.m_rscene.getRenderProxy().renderingState;
		let rscene = this.m_rscene;
		let material = new Default3DMaterial();
		material.pipeTypes = [MaterialPipeType.FOG_EXP2];
		material.setMaterialPipeline(mctx.pipeline);
		material.setTextureList([mctx.getTextureByUrl("static/assets/box.jpg")]);
		material.initializeByCodeBuf(true);

		let scale: number = 3000.0;
		let entity = rscene.entityBlock.createEntity();
		entity.setRenderState(renderingState.FRONT_CULLFACE_NORMAL_STATE);
		entity.setMaterial(material);
		entity.copyMeshFrom(rscene.entityBlock.unitBox);
		entity.setScaleXYZ(scale, scale, scale);
		rscene.addEntity(entity, 1);
	}
	private createLightModule(rsecne: RendererScene): ILightModule {
		let ctx = rsecne.getRenderProxy().uniformContext;
		return new LightModule(ctx);
	}
	shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
		console.log("############## shaderLibLoadComplete().................");
		this.buildBGBox();

		this.m_lossTime = Date.now();

		// let material = this.m_pbrModule.createMaterial( false );
		// let srcSph = new Sphere3DEntity();
        // srcSph.setMaterial(material);
        // srcSph.initialize(100.0, 20, 20);
        // this.m_rscene.addEntity(srcSph);

		this.loadObj();
	}
	// 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
	objParseFinish(models: GeometryModelDataType[], url: string): void {

		let model = models[0];
		let info: string = "obj lossTime: " + (Date.now() - this.m_lossTime);
		let vtxTotal: number = model.vertices.length / 3;
		let trisNumber: number = model.indices.length / 3;
		this.m_vtxTotal += vtxTotal;
		this.m_trisNumber += trisNumber;
		info += "</br>vtx: " + this.m_vtxTotal;
		info += "</br>tri: " + this.m_trisNumber;

		DivLog.ShowLogOnce(info);
		console.log("DemoOBJParser::ctmParseFinish(), model: ", model, ", url: ", url);

		for(let i = 0; i < models.length; ++i) {
			this.createEntity( models[i] );
		}
	}
	private createEntity(model: GeometryModelDataType): void {
		// console.log("loss time: ", (Date.now() - this.m_lossTime));


		// return;

		// let material = this.createNormalMaterial();
		// material.initializeByCodeBuf();

		let material = this.m_pbrModule.createMaterial( true );
		material.initializeByCodeBuf( true );

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
		entity.setScaleXYZ(80, 80, 80);
		this.m_rscene.addEntity(entity);

	}

	private buildLightModule(param: MaterialContextParam): ILightModule {
		// if (this.m_mf.hasLightModule()) {
		let lightModule = this.createLightModule(this.m_rscene);
		// let lightModule = lightModuleFactor.createLightModule(this.m_rscene);

		for (let i: number = 0; i < param.pointLightsTotal; ++i) {
			lightModule.appendPointLight();
		}
		for (let i: number = 0; i < param.directionLightsTotal; ++i) {
			lightModule.appendDirectionLight();
		}
		for (let i: number = 0; i < param.spotLightsTotal; ++i) {
			lightModule.appendSpotLight();
		}
		this.initLightModuleData(lightModule);

		this.m_mctx.lightModule = lightModule;
		return lightModule;
		// }
		// return null;
	}

	private initLightModuleData(lightModule: ILightModule): void {
		// this.m_materialCtx.initialize(this.m_rscene, mcParam);

		let pointLight = lightModule.getPointLightAt(0);
		if (pointLight != null) {
			// pointLight.position.setXYZ(200.0, 180.0, 200.0);
			pointLight.position.setXYZ(0.0, 190.0, 0.0);
			pointLight.color.setRGB3f(0.0, 2.2, 0.0);
			pointLight.attenuationFactor1 = 0.00001;
			pointLight.attenuationFactor2 = 0.00005;
		}
		let spotLight = lightModule.getSpotLightAt(0);
		if (spotLight != null) {
			spotLight.position.setXYZ(0.0, 30.0, 0.0);
			spotLight.direction.setXYZ(0.0, -1.0, 0.0);
			spotLight.color.setRGB3f(0.0, 40.2, 0.0);
			spotLight.attenuationFactor1 = 0.000001;
			spotLight.attenuationFactor2 = 0.000001;
			spotLight.angleDegree = 30.0;
		}
		let directLight = lightModule.getDirectionLightAt(0);
		if (directLight != null) {
			directLight.color.setRGB3f(2.0, 0.0, 0.0);
			directLight.direction.setXYZ(-1.0, -1.0, 0.0);
			directLight = lightModule.getDirectionLightAt(1);
			if (directLight != null) {
				directLight.color.setRGB3f(0.0, 0.0, 2.0);
				directLight.direction.setXYZ(1.0, 1.0, 0.0);
			}
		}
		lightModule.update();
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
		material.setVertShaderCode(this.m_nv_vertCode);
		material.setFragShaderCode(this.m_nv_fragCode);
		material.initializeByCodeBuf();
		this.m_nv_material = material;
		return material;
	}
	private setBinaryDataToTask(ctmDataBuffer: ArrayBuffer, url: string): void {
		let data = new Uint8Array(ctmDataBuffer);
		// 发送一份任务处理数据，一份数据一个子线程处理一次
		this.m_objParseTask.addBinaryData(data, url);
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
		if(this.m_threadSchedule != null) {
			this.m_threadSchedule.run();
		}
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 40); // 25 fps
	}
	run(): void {
		if(this.m_rscene != null) {
			this.m_userInterac.run();
			this.m_mctx.run();
			this.m_rscene.run();
		}
	}
}

export default DemoOBJParser;

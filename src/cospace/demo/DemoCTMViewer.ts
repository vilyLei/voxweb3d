import Vector3D from "../../vox/math/Vector3D";
import MouseEvent from "../../vox/event/MouseEvent";
import RendererDevice from "../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import CameraTrack from "../../vox/view/CameraTrack";

import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import DebugFlag from "../../vox/debug/DebugFlag";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { SpecularTextureLoader } from "../../pbr/mana/TextureLoader";

import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";

import DisplayEntity from "../../vox/entity/DisplayEntity";

import { PointLight } from "../../light/base/PointLight";
import { DirectionLight } from "../../light/base/DirectionLight";
import { SpotLight } from "../../light/base/SpotLight";
import {
	DebugMaterialContext,
	MaterialContextParam,
} from "../../materialLab/base/DebugMaterialContext";
import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";

import { VertUniformComp } from "../../vox/material/component/VertUniformComp";
import DataMesh from "../../vox/mesh/DataMesh";
import DivLog from "../../vox/utils/DivLog";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
import { CoSpace } from "../CoSpace";
import { DataFormat } from "../schedule/base/DataUnit";
import { GeometryDataUnit } from "../schedule/base/GeometryDataUnit";
import { TaskCodeModuleParam } from "../schedule/base/TaskCodeModuleParam";
import { ModuleNS } from "../modules/base/ModuleNS";
import { ModuleFileType } from "../modules/base/ModuleFileType";

export class DemoCTMViewer {
	constructor() { }
	/**
	 * (引擎)数据协同中心实例
	 */
	private m_cospace: CoSpace = new CoSpace();

	private m_rscene: RendererScene = null;
	private m_camTrack: CameraTrack = null;
	private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

	private m_profileInstance: ProfileInstance = new ProfileInstance();
	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();

	private m_envMap: IRenderTexture = null;
	private m_modelScale: number = 10.0;

	private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

	fogEnabled: boolean = false;
	hdrBrnEnabled: boolean = true;
	vtxFlatNormal: boolean = false;
	aoMapEnabled: boolean = false;
	private m_time: number = 0;
	initialize(): void {
		console.log("DemoCTMViewer::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			DivLog.SetDebugEnabled(true);

			let rparam: RendererParam = new RendererParam();
			//rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45, 50.0, 10000.0);
			rparam.setAttriStencil(true);
			rparam.setAttriAntialias(true);
			rparam.setCamPosition(2000.0, 2000.0, 2000.0);
			rparam.setCamLookAtPos(this.m_lookV.x, this.m_lookV.y, this.m_lookV.z);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 5);
			this.m_rscene.updateCamera();

			let rscene = this.m_rscene;
			let materialBlock = new RenderableMaterialBlock();
			materialBlock.initialize();
			rscene.materialBlock = materialBlock;
			// let entityBlock = new RenderableEntityBlock();
			// entityBlock.initialize();
			// rscene.entityBlock = entityBlock;

			this.m_rscene.addEventListener(
				MouseEvent.MOUSE_DOWN,
				this,
				this.mouseDown
			);
			this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

			this.m_rscene.enableMouseEvent(true);
			this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
			this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
			this.m_cameraZoomController.syncLookAt = true;

			this.m_stageDragSwinger.initialize(
				this.m_rscene.getStage3D(),
				this.m_rscene.getCamera()
			);
			this.m_camTrack = new CameraTrack();
			this.m_camTrack.bindCamera(this.m_rscene.getCamera());

			this.m_statusDisp.initialize();
			//this.m_profileInstance.initialize(this.m_rscene.getRenderer());

			this.m_rscene.setClearRGBColor3f(0.5, 0.5, 0.5);

			//   DivLog.ShowLog("renderer inited.");
			//   DivLog.ShowLog(RendererDevice.GPU_RENDERER);
			// let k = this.calcTotal(9);
			// console.log("k: ",k);
			// k = this.calcTotal2(55);
			// console.log("k2: ",k);
			// return;

			let mcParam: MaterialContextParam = new MaterialContextParam();
			mcParam.pointLightsTotal = 1;
			mcParam.directionLightsTotal = 1;
			mcParam.spotLightsTotal = 1;
			mcParam.vsmEnabled = false;

			let lightDisScale: number = 4.0;
			this.m_materialCtx.initialize(this.m_rscene, mcParam);
			let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
			if (pointLight != null) {
				// pointLight.position.setXYZ(200.0, 180.0, 200.0);
				pointLight.position.setXYZ(
					0.0,
					lightDisScale * 130.0,
					lightDisScale * 130.0
				);
				pointLight.color.setRGB3f(0.0, 2.2, 0.0);
				pointLight.attenuationFactor1 = 0.00001;
				pointLight.attenuationFactor2 = 0.00005;
			}
			let spotLight: SpotLight = this.m_materialCtx.lightModule.getSpotLightAt(
				0
			);
			if (spotLight != null) {
				spotLight.position.setXYZ(0.0, lightDisScale * 230.0, 0.0);
				spotLight.direction.setXYZ(0.0, -1.0, 0.0);
				spotLight.color.setRGB3f(1.0, 0.0, 1.0);
				spotLight.attenuationFactor1 = 0.000001;
				spotLight.attenuationFactor2 = 0.000001;
				spotLight.angleDegree = 30.0;
			}

			let directLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(
				0
			);
			if (directLight != null) {
				directLight.color.setRGB3f(0.0, 0.0, 10.0);
				directLight.direction.setTo(1.0, -1.0, 0.0);
			}
			this.m_materialCtx.lightModule.update();
			// this.m_materialCtx.lightModule.showInfo();

			let envMapUrl: string = "static/bytes/spe.mdf";
			if (this.hdrBrnEnabled) {
				envMapUrl = "static/bytes/spe.hdrBrn";
			}
			let loader: SpecularTextureLoader = new SpecularTextureLoader();
			loader.hdrBrnEnabled = this.hdrBrnEnabled;
			loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
			this.m_envMap = loader.texture;

			//   let axis: Axis3DEntity = new Axis3DEntity();
			//   axis.initialize(300);
			//   this.m_rscene.addEntity(axis);

			let modules: TaskCodeModuleParam[] = [
				new TaskCodeModuleParam("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js", ModuleNS.ctmParser, ModuleFileType.JS)
			];
			this.m_cospace.setTaskModuleParams(modules);
			// 初始化数据协同中心
			this.m_cospace.initialize(
				3,
				"static/cospace/core/code/ThreadCore.umd.min.js",
				true
			);
			//   this.m_cospace.initialize(4, "cospace/core/code/ThreadCore.umd.js", true);

			let ctmUrl: string;
			ctmUrl = "static/assets/ctm/hand.ctm";
			this.m_modelScale = 1000.0;

			// ctmUrl = "static/assets/ctm/WaltHead.ctm";
			// this.m_modelScale = 20.0;

			this.m_modelScale = 2.0;
			let baseUrl: string = window.location.href + "static/private/ctm/";
			this.m_time = Date.now();
			// let url: string = baseUrl + "sh0/1 (" + index +").ctm";
			//for (let i: number = 0; i <= 26; ++i) {
			for (let i: number = 26; i >= 0; --i) {
				let url: string = baseUrl + "sh202/sh202_" + i + ".ctm";
				this.loadCTM(url);
			}
		}
	}
	private loadCTM(url: string): void {
		this.m_cospace.geometry.getCPUDataByUrlAndCallback(
			url,
			DataFormat.CTM,
			(unit: GeometryDataUnit, status: number): void => {
				let model: GeometryModelDataType = unit.data.models[0];
				if (model.normals == null) {
					console.error("model.normals == null, url: ", url);
				}
				this.initCTMEntity(model);
			},
			true
		);
	}

	private initCTMEntity(model: GeometryModelDataType): void {
		//console.log("lossTime: ", (Date.now() - this.m_time)+" ms");
		DivLog.ShowLogOnce("lossTime: " + (Date.now() - this.m_time) + " ms");

		let time = Date.now();

		let material: PBRMaterial;
		material = this.createMaterial();
		material.decorator.aoMapEnabled = this.aoMapEnabled;
		//material.setTextureList(texList);
		this.useMaterialTex(material);
		material.initializeByCodeBuf(true);
		material.setAlbedoColor(
			0.1 + Math.random() * 1.9,
			0.1 + Math.random() * 1.9,
			0.1 + Math.random() * 1.9
		);
		material.setSideIntensity(Math.random() * 10.0 + 0.2);

		let dataMesh: DataMesh = new DataMesh();
		dataMesh.vbWholeDataEnabled = false;
		dataMesh.setVS(model.vertices);
		dataMesh.setUVS(model.uvsList[0]);
		dataMesh.setNVS(model.normals);
		dataMesh.setIVS(model.indices);
		dataMesh.setVtxBufRenderData(material);

		dataMesh.initialize();
		// console.log("ctm dataMesh: ", dataMesh);

		console.log("build lossTime: ", (Date.now() - time) + " ms");
		// DivLog.ShowLog("三角面数量: " + dataMesh.trisNumber + "个");

		let entity: DisplayEntity = new DisplayEntity();
		entity.setMesh(dataMesh);
		entity.setMaterial(material);
		entity.setScaleXYZ(this.m_modelScale, this.m_modelScale, this.m_modelScale);
		this.m_rscene.addEntity(entity);

	}

	makePBRMaterial(
		metallic: number,
		roughness: number,
		ao: number
	): PBRMaterial {
		let vertUniform = new VertUniformComp();
		vertUniform.uvTransformEnabled = true;
		vertUniform.initialize();
		// let fragUniform = new FragUniformComp();

		let material: PBRMaterial = new PBRMaterial();
		material.vertUniform = vertUniform;
		let uvScale = 0.1 + Math.random() * 0.5;
		vertUniform.setUVScale(uvScale, uvScale);

		material.setMaterialPipeline(this.m_materialCtx.pipeline);
		material.decorator = new PBRShaderDecorator();

		let decorator: PBRShaderDecorator = material.decorator;

		decorator.woolEnabled = true;
		decorator.toneMappingEnabled = true;
		decorator.specularEnvMapEnabled = true;
		decorator.specularBleedEnabled = true;
		decorator.metallicCorrection = true;
		decorator.absorbEnabled = false;
		decorator.normalNoiseEnabled = false;
		decorator.pixelNormalNoiseEnabled = false;
		decorator.hdrBrnEnabled = this.hdrBrnEnabled;
		decorator.vtxFlatNormal = this.vtxFlatNormal;

		material.setMetallic(metallic);
		material.setRoughness(roughness);
		material.setAO(ao);

		return material;
	}
	createMaterial(): PBRMaterial {
		let material: PBRMaterial;
		material = this.makePBRMaterial(
			Math.random(),
			Math.random() * 0.4,
			0.7 + Math.random() * 0.3
		);
		// material = this.makePBRMaterial(0.3 + Math,0.3,1.0);

		let decorator: PBRShaderDecorator = material.decorator;
		decorator.shadowReceiveEnabled = false;
		decorator.fogEnabled = this.fogEnabled;
		decorator.indirectEnvMapEnabled = false;
		decorator.specularEnvMapEnabled = true;
		decorator.diffuseMapEnabled = true;
		decorator.normalMapEnabled = true;
		return material;
	}
	private useMaterialTex(material: PBRMaterial): void {
		let decorator = material.decorator;
		decorator.specularEnvMap = this.m_envMap;
		// decorator.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/color_01.jpg");
		decorator.diffuseMap = this.m_materialCtx.getTextureByUrl(
			"static/assets/brickwall_big.jpg"
		);
		decorator.normalMap = this.m_materialCtx.getTextureByUrl(
			"static/assets/rock_a_n.jpg"
		);
		if (this.aoMapEnabled) {
			decorator.aoMap = this.m_materialCtx.getTextureByUrl(
				"static/assets/disp/rock_a.jpg"
			);
		}
	}
	private m_runFlag: boolean = true;
	private mouseDown(evt: any): void {
		this.m_runFlag = true;
		DebugFlag.Flag_0 = 1;
	}
	private mouseUp(evt: any): void { }
	private update(): void {
		this.m_statusDisp.update(true);
	}
	private m_lookV: Vector3D = new Vector3D(0.0, 0.0, 0.0);
	run(): void {
		this.update();

		this.m_stageDragSwinger.runWithYAxis();
		this.m_cameraZoomController.run(this.m_lookV, 30.0);

		this.m_rscene.run(true);

		DebugFlag.Flag_0 = 0;
	}
}

export default DemoCTMViewer;

import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";
import { ICoLightModule } from "../../renderEffect/light/ICoLightModule";
import { ICoEnvLightModule } from "../../renderEffect/light/ICoEnvLightModule";
import { IVSMShadowModule } from "../../renderEffect/shadow/IVSMShadowModule";

import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { ILightModule } from "../../../light/base/ILightModule";
import PBRModule from "../../renderEffect/pbr/PBRModule";
import { ModuleLoader } from "../../modules/base/ModuleLoader";

declare var CoRScene: ICoRScene;
declare var CoLightModule: ICoLightModule;
declare var CoEnvLightModule: ICoEnvLightModule;
declare var VSMShadowModule: IVSMShadowModule;

export class ViewerMaterialCtx {
	private m_rscene: ICoRendererScene;
	private m_mctx: IMaterialContext;

	private m_mctxFlag: number = 0;

	private m_callback: () => void = null;
	private m_materialData: any;

	readonly pbrModule: PBRModule = new PBRModule();
	constructor() {}

	getMaterialCtx(): IMaterialContext {
		return this.m_mctx;
	}
	initialize(rscene: ICoRendererScene, materialData: any, callback: () => void): void {

		this.m_rscene = rscene;
		this.m_materialData = materialData;
		this.m_callback = callback;
		this.pbrModule.initialize( materialData );

		this.initMaterialModule();
	}
	private initMaterialModule(): void {
		this.pbrModule.preload((): void => {
			console.log("pbrModule.preload()....");
			this.updateMCTXInit();
		});

		let url0 = "static/cospace/renderEffect/pbr/PBREffect.umd.js";
		let url1 = "static/cospace/renderEffect/lightModule/CoLightModule.umd.js";
		let url2 = "static/cospace/renderEffect/envLight/CoEnvLightModule.umd.js";
		let url3 = "static/cospace/renderEffect/vsmShadow/VSMShadowModule.umd.js";

		new ModuleLoader(4)
			.setCallback((): void => {
				this.updateMCTXInit();
			})
			.loadModule(url0)
			.loadModule(url1)
			.loadModule(url2)
			.loadModule(url3);
	}
	private updateMCTXInit(): void {
		this.m_mctxFlag++;
		if (this.isMCTXEnabled()) {
			this.initMaterialCtx();
		}
	}
	isMCTXEnabled(): boolean {
		return this.m_mctxFlag == 2;
	}

	private buildEnvLight(mctx: IMaterialContext, param: CoMaterialContextParam, data: any): void {
		let module = CoEnvLightModule.create(this.m_rscene);
		module.initialize();
		if (data != undefined && data != null) {
			module.setFogDensity(data.density);
			let rgb = data.rgb;
			console.log("XXXXXXXXXXXXXXX TTTTTTTTTT rgb: ",rgb);
			module.setFogColorRGB3f( rgb[0], rgb[1], rgb[2] );
		} else {
			module.setFogDensity(0.0005);
			module.setFogColorRGB3f(0.0, 0.8, 0.1);
		}
		mctx.envLightModule = module;
	}
	private buildLightModule(mctx: IMaterialContext, param: CoMaterialContextParam, data: any): void {

		param.pointLightsTotal = 0;
		param.spotLightsTotal = 0;
		param.directionLightsTotal = 0;

		if(data.pointLights != undefined && data.pointLights != null) {
			param.pointLightsTotal = data.pointLights.length;
		}
		if(data.spotLights != undefined && data.spotLights != null) {
			param.spotLightsTotal = data.spotLights.length;
		}
		if(data.directionLights != undefined && data.directionLights != null) {
			param.directionLightsTotal = data.directionLights.length;
		}

		let lightModule = CoLightModule.createLightModule(this.m_rscene);

		for (let i: number = 0; i < param.pointLightsTotal; ++i) {
			lightModule.appendPointLight();
		}
		for (let i: number = 0; i < param.spotLightsTotal; ++i) {
			lightModule.appendSpotLight();
		}
		for (let i: number = 0; i < param.directionLightsTotal; ++i) {
			lightModule.appendDirectionLight();
		}
		this.initLightModuleData(lightModule, param, data);

		mctx.lightModule = lightModule;
	}

	private initLightModuleData(lightModule: ILightModule, param: CoMaterialContextParam, data: any): void {

		for (let i: number = 0; i < param.pointLightsTotal; ++i) {

			let lo = data.pointLights[i];

			let light = lightModule.getPointLightAt(i);
			light.position.fromArray(lo.position);
			light.color.fromArray(lo.rgb);
			light.attenuationFactor1 = lo.factor1;
			light.attenuationFactor2 = lo.factor2;
		}
		for (let i: number = 0; i < param.spotLightsTotal; ++i) {

			let lo = data.spotLights[i];

			let light = lightModule.getSpotLightAt(i);
			light.position.fromArray(lo.position);
			light.direction.fromArray(lo.direction);
			light.color.fromArray(lo.rgb);
			light.attenuationFactor1 = lo.factor1;
			light.attenuationFactor2 = lo.factor2;
		}
		for (let i: number = 0; i < param.directionLightsTotal; ++i) {

			let lo = data.directionLights[i];

			let light = lightModule.getDirectionLightAt(i);
			light.direction.fromArray(lo.direction);
			light.color.fromArray(lo.rgb);
			light.attenuationFactor1 = lo.factor1;
			light.attenuationFactor2 = lo.factor2;
		}
		lightModule.update();
		return;
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
	private initMaterialCtx(): void {
		console.log("initMaterialCtx() ....");

		this.m_mctx = CoRScene.createMaterialContext();
		let mctx = this.m_mctx;

		let md = this.m_materialData;
		let mc = md.context;

		let mcParam = CoRScene.creatMaterialContextParam();
		mcParam.shaderLibVersion = mc.shaderLibVersion;
		// mcParam.pointLightsTotal = 1;
		// mcParam.directionLightsTotal = 2;
		// mcParam.spotLightsTotal = 0;
		mcParam.loadAllShaderCode = true;
		mcParam.shaderCodeBinary = true;
		mcParam.pbrMaterialEnabled = true;
		mcParam.lambertMaterialEnabled = false;
		mcParam.shaderFileNickname = true;
		mcParam.vsmFboIndex = 0;

		mcParam.vsmEnabled = true;
		// mcParam.vsmEnabled = false;
		// mcParam.buildBinaryFile = true;

		this.buildEnvLight(mctx, mcParam, md.fog);
		this.buildLightModule(mctx, mcParam, md.light);
		this.buildShadowModule(mctx, mcParam, md.shadow);

		mctx.addShaderLibListener(this);
		mctx.initialize(this.m_rscene, mcParam);

		this.pbrModule.active(this.m_rscene, mctx, mcParam.vsmEnabled);
		console.log("initMaterialCtx() ... 2");
	}
	shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
		console.log("############## shaderLibLoadComplete().................");
		if (this.m_callback != null) {
			this.m_callback();
			this.m_callback = null;
		}
	}

	private buildShadowModule(mctx: IMaterialContext, param: CoMaterialContextParam, data: any): void {

		let v3 = CoRScene.createVec3();
		v3.fromArray(data.cameraPosition);
		let vsmModule = VSMShadowModule.create(param.vsmFboIndex);
		vsmModule.setCameraPosition(v3);
		vsmModule.setCameraNear(data.cameraNear);
		vsmModule.setCameraFar(data.cameraFar);
		let mapSize = data.mapSize;
		let cameraViewSize = data.cameraViewSize;
		vsmModule.setMapSize(mapSize[0], mapSize[1]);
		vsmModule.setCameraViewSize(cameraViewSize[0], cameraViewSize[1]);

		vsmModule.setShadowRadius(data.radius);
		vsmModule.setShadowBias( data.bias );
		vsmModule.initialize(this.m_rscene, [0], 3000);
		vsmModule.setShadowIntensity(data.shadowIntensity);
		vsmModule.setColorIntensity(data.colorIntensity);
		mctx.vsmModule = vsmModule;
		return;
		// let vsmModule = VSMShadowModule.create(param.vsmFboIndex);
		// vsmModule.setCameraPosition(CoRScene.createVec3(1, 800, 1));
		// vsmModule.setCameraNear(10.0);
		// vsmModule.setCameraFar(3000.0);
		// vsmModule.setMapSize(512.0, 512.0);
		// vsmModule.setCameraViewSize(4000, 4000);
		// vsmModule.setShadowRadius(2);
		// vsmModule.setShadowBias(-0.0005);
		// vsmModule.initialize(this.m_rscene, [0], 3000);
		// vsmModule.setShadowIntensity(0.8);
		// vsmModule.setColorIntensity(0.3);
		// mctx.vsmModule = vsmModule;
		// console.log("buildShadowModule(), vsmModule: ", vsmModule);
	}
	run(): void {
		if (this.m_mctx != null) {
			this.m_mctx.run();
		}
	}
}

export default ViewerMaterialCtx;

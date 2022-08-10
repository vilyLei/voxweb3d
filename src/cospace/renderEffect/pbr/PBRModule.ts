import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { IMaterial } from "../../../vox/material/IMaterial";
import { IPBREffect, IPBREffectInstance } from "../../renderEffect/pbr/IPBREffect";
import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IMaterialModule from "../../voxengine/material/IMaterialModule";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { HttpFileLoader } from "../../modules/loaders/HttpFileLoader";

declare var PBREffect: IPBREffect;
type PBRMapUrl = {
	envMap: string;
	envBrnMap: string;
	diffuseMap?: string;
	normalMap?: string;
	armMap?: string;
	parallaxMap?: string;
	displacementMap?: string;
};

type PBRMap = {
	envMap: IRenderTexture;
	diffuseMap: IRenderTexture;
	normalMap: IRenderTexture;
	armMap: IRenderTexture;
	parallaxMap: IRenderTexture;
	displacementMap: IRenderTexture;
	aoMap: IRenderTexture;
};

type PBRParam = {
	metallic: number;
	roughness: number;
	ao: number;

	scatterIntensity: number;
	sideIntensity: number;

	shadowReceiveEnabled: boolean;
	fogEnabled: boolean;

	scatterEnabled: boolean;
	woolEnabled: boolean;
	absorbEnabled: boolean;
	normalNoiseEnabled: boolean;

	displacementParams: number[];
	albedoColor: number[];
	parallaxParams: number[];
};

export default class PBRModule implements IMaterialModule {
	private m_rscene: IRendererScene;
	private m_effect: IPBREffectInstance = null;
	private m_materialCtx: IMaterialContext;
	private m_preLoadMaps: boolean = true;
	private m_loadSpecularData: boolean = true;
	private m_specEnvMapBuf: ArrayBuffer = null;
	private m_specEnvMap: IRenderTexture = null;
	private m_shadowEnabled: boolean = false;
	private m_loadSpecCallback: () => void = null;
	private m_materialData: any;
	private m_pbrMapUrl: PBRMapUrl;
	constructor() {}
	initialize(materialData: any): void {
		this.m_materialData = materialData;
		this.m_pbrMapUrl = materialData.pbr.map as PBRMapUrl;
	}
	preload(callback: () => void): void {
		this.loadSpecularData(true);
		this.m_loadSpecCallback = callback;
	}
	active(rscene: IRendererScene, materialCtx: IMaterialContext, shadowEnabled: boolean): void {
		this.m_shadowEnabled = shadowEnabled;
		this.m_materialCtx = materialCtx;
		if (this.m_effect == null) {
			this.m_rscene = rscene;
			this.m_effect = PBREffect.create();
			this.m_effect.initialize(this.m_rscene);
		}
		// this.preloadMap(this.m_materialCtx, "box", true, false, true);
		this.preloadMap();
	}
	// loaded(buffer: ArrayBuffer, uuid: string): void {
	// 	this.m_specEnvMapBuf = buffer;
	// 	if (this.m_effect != null) {
	// 		this.m_specEnvMap = this.m_effect.createSpecularTex(this.m_specEnvMapBuf, true, this.m_specEnvMap);
	// 	}
	// 	if (this.m_loadSpecCallback != null) {
	// 		this.m_loadSpecCallback();
	// 		this.m_loadSpecCallback = null;
	// 	}
	// }
	// loadError(status: number, uuid: string): void {}
	private loadSpecularData(hdrBrnEnabled: boolean): void {
		if (this.m_loadSpecularData) {
			// let envMapUrl: string = "static/bytes/spe.mdf";
			let url: string = this.m_pbrMapUrl.envBrnMap;
			if (hdrBrnEnabled) {
				// envMapUrl = "static/bytes/spb.bin";
				url = this.m_pbrMapUrl.envBrnMap;
			}
			console.log("start load spec map ata.");
			// let load = new BinaryLoader();
			// load.load(envMapUrl, this);

			new HttpFileLoader().load(url, (buf: ArrayBuffer, url: string): void => {
				this.m_specEnvMapBuf = buf;
				if (this.m_effect != null) {
					this.m_specEnvMap = this.m_effect.createSpecularTex(this.m_specEnvMapBuf, true, this.m_specEnvMap);
				}
				if (this.m_loadSpecCallback != null) {
					this.m_loadSpecCallback();
					this.m_loadSpecCallback = null;
				}
			});
			this.m_loadSpecularData = false;
		}
	}
	// private preloadMap(
	// 	materialCtx: IMaterialContext,
	// 	ns: string,
	// 	normalMapEnabled: boolean = true,
	// 	displacementMap: boolean = true,
	// 	shadowReceiveEnabled: boolean = false,
	// 	aoMapEnabled: boolean = false
	// ): void {
	private preloadMap(): void {
		if (this.m_preLoadMaps) {
			/*
			ns = "rust_coarse_01";
			ns = "medieval_blocks_02";
			ns = "rough_plaster_broken";
			//ns = "metal_plate";

			this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_diff_1k.jpg");
			this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_nor_1k.jpg");
			this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_arm_1k.jpg");

			this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_disp_1k.jpg");

			//*/
			let tmUrl = this.m_pbrMapUrl;
			if (tmUrl.diffuseMap != undefined) this.m_materialCtx.getTextureByUrl(tmUrl.diffuseMap);
			if (tmUrl.normalMap != undefined) this.m_materialCtx.getTextureByUrl(tmUrl.normalMap);
			if (tmUrl.armMap != undefined) this.m_materialCtx.getTextureByUrl(tmUrl.armMap);
			if (tmUrl.displacementMap != undefined) this.m_materialCtx.getTextureByUrl(tmUrl.displacementMap);

			this.m_preLoadMaps = false;
		}
	}
	getUUID(): ShaderCodeUUID {
		return ShaderCodeUUID.PBR;
	}
	isEnabled(): boolean {
		let boo = this.m_materialCtx != null && this.m_materialCtx.hasShaderCodeObjectWithUUID(this.getUUID());
		// DivLog.ShowLog("pbr isEnabled: "+boo);
		return boo; // && this.m_specEnvMapBuf != null;
	}
	createMaterial(shadowReceiveEnabled: boolean, materialParam: any = null): IMaterial {
		// console.log("### pbr createMaterial().");
		if (this.m_specEnvMap == null) {
			if (this.m_specEnvMapBuf == null) {
				throw Error("this.m_specEnvMapBuf is null !!!");
			}
			this.m_specEnvMap = this.m_effect.createSpecularTex(this.m_specEnvMapBuf, true, this.m_specEnvMap);
			this.m_specEnvMap.__$attachThis();
		}
		// DivLog.ShowLog("pbr createMaterial, uid: "+this.m_specEnvMap.getUid());
		// let diffuseMap: IRenderTexture = null;
		// let normalMap: IRenderTexture = null;
		// let armMap: IRenderTexture = null;
		// let displacementMap: IRenderTexture = null;
		// let parallaxMap: IRenderTexture = null;
		// let fogEnabled: boolean = this.m_materialData.fog !== undefined;

		let tmUrl = this.m_pbrMapUrl;
		let mapData: PBRMap = {
			envMap: this.m_specEnvMap,
			diffuseMap: tmUrl.diffuseMap != undefined ? this.m_materialCtx.getTextureByUrl(tmUrl.diffuseMap) : null,
			normalMap: tmUrl.normalMap != undefined ? this.m_materialCtx.getTextureByUrl(tmUrl.normalMap) : null,
			armMap: tmUrl.armMap != undefined ? this.m_materialCtx.getTextureByUrl(tmUrl.armMap) : null,
			displacementMap: tmUrl.displacementMap != undefined ? this.m_materialCtx.getTextureByUrl(tmUrl.displacementMap) : null,
			parallaxMap: tmUrl.parallaxMap != undefined ? this.m_materialCtx.getTextureByUrl(tmUrl.parallaxMap) : null,
			aoMap: null
		};

		/*
		let ns: string = "rust_coarse_01";
		ns = "medieval_blocks_02";
		ns = "rough_plaster_broken";
		//ns = "metal_plate";
		diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_diff_1k.jpg");
		//diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg");
		normalMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_nor_1k.jpg");
		armMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_arm_1k.jpg");

		let aoMap: IRenderTexture = null;
		let aoMapEnabled: boolean = true;
		if (aoMapEnabled) {
			//aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
			//aoMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
		}
		displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/" + ns + "_disp_1k.jpg");

		//parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/brick_bumpy01.jpg");
		parallaxMap = displacementMap;
		//*/
		// let tmUrl = this.m_pbrMapUrl;
		// if (tmUrl.diffuseMap != undefined) diffuseMap = this.m_materialCtx.getTextureByUrl(tmUrl.diffuseMap);
		// if (tmUrl.normalMap != undefined) normalMap = this.m_materialCtx.getTextureByUrl(tmUrl.normalMap);
		// if (tmUrl.armMap != undefined) armMap = this.m_materialCtx.getTextureByUrl(tmUrl.armMap);
		// if (tmUrl.displacementMap != undefined) displacementMap = this.m_materialCtx.getTextureByUrl(tmUrl.displacementMap);
		// if (tmUrl.parallaxMap != undefined) parallaxMap = this.m_materialCtx.getTextureByUrl(tmUrl.parallaxMap);

		// let param: PBRParam = {
		// 	metallic: 1.0,
		// 	roughness: 0.4,
		// 	ao: 1.0,
		// 	scatterIntensity: 8.0,
		// 	sideIntensity: 8.0,

		// 	shadowReceiveEnabled: shadowReceiveEnabled && this.m_shadowEnabled,
		// 	fogEnabled: this.m_materialData.fog !== undefined,

		// 	scatterEnabled: false,
		// 	woolEnabled: true,
		// 	absorbEnabled: false,
		// 	normalNoiseEnabled: false,

		// 	displacementParams: [0.02, -0.01],
		// 	albedoColor: [1.0, 1.0, 1.0],
		// 	parallaxParams: [1, 10, 5.0, 0.02]
		// };

		// param.metallic = 1.0;
		// param.roughness = 0.4;
		// param.ao = 1.0;
		// param.shadowReceiveEnabled = shadowReceiveEnabled && this.m_shadowEnabled;
		// param.fogEnabled = fogEnabled;
		let param: PBRParam;
		if (materialParam !== undefined && materialParam !== null) {
			param = materialParam;
		} else {
			param = this.m_materialData.pbr.defaultParam;
		}
		let m = this.m_effect.createMaterial();
		let decor: any = m.getDecorator();
		let vertUniform = decor.vertUniform;

		m.setMaterialPipeline(this.m_materialCtx.pipeline);

		decor.scatterEnabled = param.scatterEnabled;
		decor.woolEnabled = param.woolEnabled;
		decor.absorbEnabled = param.absorbEnabled;
		decor.normalNoiseEnabled = param.normalNoiseEnabled;

		decor.setMetallic(param.metallic);
		decor.setRoughness(param.roughness);
		decor.setAO(param.ao);

		decor.shadowReceiveEnabled = param.shadowReceiveEnabled && shadowReceiveEnabled && this.m_shadowEnabled;
		decor.fogEnabled = this.m_materialData.fog !== undefined && param.fogEnabled;

		// init maps
		decor.specularEnvMap = mapData.envMap;
		decor.armMap = mapData.armMap;
		decor.diffuseMap = mapData.diffuseMap;
		decor.normalMap = mapData.normalMap;
		decor.aoMap = mapData.aoMap;
		decor.parallaxMap = mapData.parallaxMap;
		vertUniform.displacementMap = mapData.displacementMap;

		decor.initialize();
		vertUniform.initialize();

		let vs = param.displacementParams;
		vertUniform.setDisplacementParams(vs[0], vs[1]);
		vs = param.albedoColor;
		decor.setAlbedoColor(vs[0], vs[1], vs[2]);
		decor.setScatterIntensity(param.scatterIntensity);
		vs = param.parallaxParams;
		decor.setParallaxParams(vs[0], vs[1], vs[2], vs[3]);
		decor.setSideIntensity(param.sideIntensity);
		/*
		//vertUniform.setDisplacementParams(10.0, -5.0);
		vertUniform.setDisplacementParams(0.02, -0.01);
		decor.setAlbedoColor(1.0, 1.0, 1.0);
		decor.setScatterIntensity(8.0);
		decor.setParallaxParams(1, 10, 5.0, 0.02);
		decor.setSideIntensity(8.0);
		//*/
		//m.initializeByCodeBuf( true );
		return m;
	}
	destroy(): void {
		this.m_rscene = null;
		this.m_effect = null;
		this.m_materialCtx = null;
		this.m_materialData = null;
		this.m_pbrMapUrl = null;
		if (this.m_specEnvMap != null) {
			this.m_specEnvMap.__$detachThis();
			this.m_specEnvMap = null;
		}
	}
}

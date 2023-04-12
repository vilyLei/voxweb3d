import { DebugMaterialContext, MaterialContextParam } from "../../materialLab/base/DebugMaterialContext";
import URLFilter from "../../tool/base/URLFilter";
import TextureResLoader from "../../vox/assets/TextureResLoader";
import { VertUniformComp } from "../../vox/material/component/VertUniformComp";
import RendererDevice from "../../vox/render/RendererDevice";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IRendererScene from "../../vox/scene/IRendererScene";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import PBRMaterial from "../material/PBRMaterial";
import PBRDecoratorParam from "../material/PBRDecoratorParam";

export default class DebugPBRScene {

	private m_init = true;

	graph = new RendererSceneGraph();
	texLoader: TextureResLoader = null;
	rscene: IRendererScene = null;
	materialCtx = new DebugMaterialContext();
	constructor() {}

	getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		url = URLFilter.filterUrl(url);
		return this.texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {

		console.log("DebugPBRScene::initialize()......");

		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			// let rparam = new RendererParam(this.createDiv(0,0, 512, 512));
			let rparam = this.graph.createRendererParam();
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			// rparam.setAttriAlpha(true);
			rparam.setAttriAntialias( true );
			// rparam.autoSyncRenderBufferAndWindowSize = false;
			// 保持 html body color 和 renderer clear color 同步，以便正确表现alpha混合
			// rparam.syncBgColor = false;

			let rscene = this.graph.createScene(rparam);

			this.rscene = rscene;
			this.texLoader = new TextureResLoader(rscene);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initMaterialCtx();
		}
	}
	protected materialSystemInited(): void {

	}
	shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
		console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
		this.materialSystemInited();
	}
	createPBRDecoratorParam(): PBRDecoratorParam {
		return new PBRDecoratorParam();
	}
	private initMaterialCtx(): void {
		let mcParam = new MaterialContextParam();
		mcParam.pointLightsTotal = 2;
		mcParam.directionLightsTotal = 2;
		mcParam.spotLightsTotal = 0;
		mcParam.loadAllShaderCode = false;
		mcParam.shaderCodeBinary = false;
		mcParam.lambertMaterialEnabled = false;
		mcParam.pbrMaterialEnabled = true;
		this.materialCtx.addShaderLibListener(this);
		this.materialCtx.initialize(this.rscene, mcParam);

		let pointLight = this.materialCtx.lightModule.getPointLightAt(0);
		if (pointLight != null) {
			// pointLight.position.setXYZ(200.0, 180.0, 200.0);
			pointLight.position.setXYZ(0.0, 550.0, -200.0);
			// pointLight.color.setRGB3f(0.0, 1.5, 0.0);
			pointLight.color.randomRGB(1.5);
			pointLight.attenuationFactor1 = 0.00001;
			pointLight.attenuationFactor2 = 0.00005;
		}

		pointLight = this.materialCtx.lightModule.getPointLightAt(1);
		if (pointLight != null) {
			// pointLight.position.setXYZ(200.0, 180.0, 200.0);
			pointLight.position.setXYZ(0.0, -650.0, 0.0);
			// pointLight.color.setRGB3f(0.5, 0.2, 1.0);
			pointLight.color.randomRGB(1.7);
			pointLight.attenuationFactor1 = 0.00001;
			pointLight.attenuationFactor2 = 0.00005;
		}

		let spotLight = this.materialCtx.lightModule.getSpotLightAt(0);
		if (spotLight != null) {
			spotLight.position.setXYZ(0.0, 30.0, 0.0);
			spotLight.direction.setXYZ(0.0, -1.0, 0.0);
			spotLight.color.setRGB3f(0.0, 40.2, 0.0);
			spotLight.attenuationFactor1 = 0.000001;
			spotLight.attenuationFactor2 = 0.000001;
			spotLight.angleDegree = 30.0;
		}
		let directLight = this.materialCtx.lightModule.getDirectionLightAt(0);
		if (directLight != null) {
			// directLight.color.setRGB3f(1.0, 0.0, 0.5);
			directLight.color.randomRGB(1.5);
			directLight.direction.setXYZ(-1.0, -1.0, 0.0);
			directLight = this.materialCtx.lightModule.getDirectionLightAt(1);
			if (directLight != null) {
				// directLight.color.setRGB3f(0.0, 0.0, 1.0);
				directLight.color.randomRGB(1.0);
				directLight.direction.setXYZ(0.2, 1.0, 0.0);
			}
		}
		this.materialCtx.lightModule.update();
		//  this.materialCtx.lightModule.showInfo();
	}
	protected createPBRMaterial(param: PBRDecoratorParam): PBRMaterial {

		// let normalMap = this.getTexByUrl(this.m_normalTexUrl);
        // normalMap.flipY = true;

		let material: PBRMaterial;

		let vertUniform: VertUniformComp;
		material = this.makePBRMaterial(param);
		vertUniform = material.vertUniform as VertUniformComp;
		vertUniform.uvTransformEnabled = true;
		material.decorator.initWithParam(param);

		material.initializeByCodeBuf(true);
		// vertUniform.setDisplacementParams(50.0, 0.0);
        material.setToneMapingExposure(5.0);
		material.setAlbedoColor(1.0, 1.0, 1.0);
		material.setScatterIntensity(64.0);
		material.setParallaxParams(1, 10, 5.0, 0.02);
		material.setSideIntensity(8);
		return material;
	}
	private makePBRMaterial(param: PBRDecoratorParam): PBRMaterial {

		// material = this.makePBRMaterial(0.9, 0.0, 1.0);
		let material = this.materialCtx.createPBRLightMaterial(true, true, true);
		let decorator = material.decorator;
		decorator.scatterEnabled = false;
		decorator.woolEnabled = true;
		decorator.toneMappingEnabled = true;
		decorator.specularEnvMapEnabled = true;
		decorator.specularBleedEnabled = true;
		decorator.metallicCorrection = true;
		decorator.absorbEnabled = false;
		decorator.normalNoiseEnabled = false;
		decorator.pixelNormalNoiseEnabled = true;
		decorator.hdrBrnEnabled = true;
		decorator.vtxFlatNormal = false;

		material.setMetallic(0.1);
		material.setRoughness(0.3);
		material.setAO(1.0);

		decorator.shadowReceiveEnabled = false;
		decorator.fogEnabled = false;
		decorator.indirectEnvMapEnabled = false;
		decorator.specularEnvMapEnabled = true;
		decorator.diffuseMapEnabled = true;
		decorator.normalMapEnabled = true;
		return material;
	}
}

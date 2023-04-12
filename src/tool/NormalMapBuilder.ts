import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import RendererScene from "../vox/scene/RendererScene";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import RemoveBlackBGMaterial from "./material/RemoveBlackBGMaterial";
import NormalMapBuilderMaterial from "./material/NormalMapBuilderMaterial";
import MouseEvent from "../vox/event/MouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";
import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../orthoui/usage/ParamCtrlUI";
import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "./base/DropFileController";
import Color4 from "../vox/material/Color4";

import { IAwardSceneParam } from "./base/award/IAwardSceneParam";
import { VoxAwardScene } from "./base/award/VoxAwardScene";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import IDisplayEntityContainer from "../vox/entity/IDisplayEntityContainer";
import IRenderEntity from "../vox/render/IRenderEntity";
import RendererState from "../vox/render/RendererState";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

// import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { IShaderLibListener, MaterialContextParam, DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import PBRMaterial from "../pbr/material/PBRMaterial";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Torus3DEntity from "../vox/entity/Torus3DEntity";
import Vector3D from "../vox/math/Vector3D";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";
import IColorMaterial from "../vox/material/mcase/IColorMaterial";
import Matrix4 from "../vox/math/Matrix4";
import EventBase from "../vox/event/EventBase";
import RenderingImageBuilder from "./base/RenderingImageBuilder";
import { IImageTexture } from "../vox/render/texture/IImageTexture";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";
import ColorRectImgButton from "../orthoui/button/ColorRectImgButton";
import ScreenAlignPlaneEntity from "../vox/entity/ScreenAlignPlaneEntity";

class AwardSceneParam implements IAwardSceneParam {
	texLoader: TextureResLoader = null;
	constructor() {}
	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		let hostUrl = window.location.href;
		if (hostUrl.indexOf(".artvily.") > 0) {
			hostUrl = "http://www.artvily.com:9090/";
			url = hostUrl + url;
		}
		return this.texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}
	createContainer(): IDisplayEntityContainer {
		return new DisplayEntityContainer(true, true);
	}
	createXOYPlane(x: number, y: number, w: number, h: number, tex: IRenderTexture): IRenderEntity {
		let pl = new Plane3DEntity();
		pl.initializeXOY(x, y, w, h, [tex]);
		return pl;
	}
	pid = 1;
}

export class NormalMapBuilder {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_ctrlui = new ParamCtrlUI(false);
	private m_ctrlui2 = new ParamCtrlUI(false);

	private m_dropController = new DropFileController();
	private m_aspParam = new AwardSceneParam();
	private m_vasScene = new VoxAwardScene();

	private m_imgBuilder: RenderingImageBuilder = null;
	private m_materialCtx = new DebugMaterialContext();
	constructor() {}

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_aspParam.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {
		console.log("NormalMapBuilder::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			// let rparam = new RendererParam(this.createDiv(0,0, 512, 512));
			let rparam = new RendererParam();
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			// rparam.setAttriAlpha(true);
			rparam.setAttriAntialias(true);
			// rparam.autoSyncRenderBufferAndWindowSize = false;
			// 保持 html body color 和 renderer clear color 同步，以便正确表现alpha混合
			// rparam.syncBgColor = false;

			let rscene = this.m_graph.createScene(rparam);
			// rscene.initialize(rparam).setAutoRunning(true);
			rscene.setClearRGBAColor4f(0.2, 0.3, 0.2, 0.0);
			rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);
			this.m_aspParam.texLoader = this.m_texLoader;

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initMaterialCtx();
		}
	}
	private openDir(): void {
		const input = document.createElement("input");
		input.type = "file";
		// (input as any).webkitdirectory = true;//这行代码用了即变成上传了
		// input.accept = "image/png, image/jpeg";
		input.addEventListener("change", () => {
			let files = Array.from(input.files);
			console.log("files: ", files);
			this.m_dropController.initFilesLoad(files);
		});
		input.click();
		// if ("showPicker" in HTMLInputElement.prototype) {
		// 	(input as any).showPicker();
		// } else {
		// 	input.click();
		// }
	}
	private initImgBuilder(): void {
		if (this.m_imgBuilder == null) {
			this.m_imgBuilder = new RenderingImageBuilder();
			let rparam = new RendererParam();
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			rparam.cameraPerspectiveEnabled = false;
			rparam.offscreenRenderEnabled = true;
			rparam.divW = 200;
			rparam.divH = 200;
			rparam.autoAttachingHtmlDoc = !rparam.offscreenRenderEnabled;
			rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.sysEvtReceived = false;
			rparam.setAttriAlpha(false);
			this.m_imgBuilder.initialize(rparam, new Color4(0, 0, 0, 1.0));
		}
	}
	private saveToImg(): void {
		this.initImgBuilder();
		if (this.m_imgBuilder.isEnabled()) {
			let currTex = this.m_currTexture;
			let tex = this.m_rscene.textureBlock.createImageTex2D();
			tex.setDataFromImage((currTex as ImageTextureProxy).getTexData().data);
			// tex.flipY = true;
			let material = new NormalMapBuilderMaterial();
			material.fixScreen = true;
			material.setTextureList([tex]);
			if (this.m_mapMaterial) {
				material.dataCopyFrom(this.m_mapMaterial);
			}
			let pl0 = new Plane3DEntity();
			pl0.setMaterial(material);
			pl0.initializeXOY(-1.0, -1.0, 2, 2);
			this.m_imgBuilder.setName(this.m_normalMapName);
			this.m_imgBuilder.addEntity(pl0);
			this.m_imgBuilder.setSize(currTex.getWidth(), currTex.getHeight());
		}
	}
	private m_mapMaterial: NormalMapBuilderMaterial = null;
	private m_mapPlane: Plane3DEntity = null;
	private m_mapAreaFactor = 0.4;

	private m_loadingTex: IRenderTexture = null;
	private m_clickBtn: ColorRectImgButton = null;

	private createClickArea(): void {
		let clickBtn = new ColorRectImgButton();
		clickBtn.outColor.setRGBA4f(0.0, 0.0, 0.0, 0.5);
		clickBtn.overColor.setRGBA4f(0.0, 0.0, 0.0, 0.6);
		clickBtn.downColor.setRGBA4f(0.0, 0.0, 0.0, 0.6);
		clickBtn.initialize(-0.5, -0.5, 1, 1);
		this.m_ctrlui.ruisc.addEntity(clickBtn);
		this.m_clickBtn = clickBtn;
		clickBtn.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		clickBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, (): void => {
			this.openDir();
		});
	}
	private layoutMapPlane(): void {

		let st = this.m_rscene.getStage3D();
		let stw = Math.round(st.stageWidth * this.m_mapAreaFactor);
		let tex = this.m_currTexture;

		let pw = tex.getWidth();
		let ph = tex.getHeight();
		let k = ph / pw;
		if (pw > Math.round(0.9 * stw)) {
			pw = Math.round(0.9 * stw);
		}
		ph = Math.round(pw * k);
		let px = Math.round((stw - pw) * 0.5);
		let pl0 = this.m_mapPlane;
		pl0.setScaleXYZ(pw, ph, 1.0);
		pl0.setXYZ(px, 490, 0.0);
		pl0.update();

		pw = stw * 0.95;
		let btn = this.m_clickBtn;
		btn.setScaleXYZ(pw, pw, 1.0);
		btn.setXYZ(stw * 0.5, 490 + 0.5 * ph, 0.0);
		btn.update();
	}
	private createAMapPlane(url: string): void {
		let tex = this.getTexByUrl(url);
		this.m_loadingTex = tex;
		this.m_currTexture = tex;
		// tex.flipY = true;
		let material = new NormalMapBuilderMaterial();
		material.setTextureList([tex]);
		if (this.m_mapMaterial) {
			material.dataCopyFrom(this.m_mapMaterial);
		}
		this.m_mapMaterial = material;
		let pl0 = this.m_mapPlane;
		if (pl0 == null) {
			pl0 = new Plane3DEntity();
			pl0.setMaterial(material);
			pl0.initializeXOY(0, 0, 1, 1);
		} else {
			this.m_ctrlui.ruisc.removeEntity(pl0);
			pl0.setMaterial(material);
		}
		if (tex.isDataEnough()) {
			material.setTexSize(tex.getWidth(), tex.getHeight());
			this.layoutMapPlane();
		} else {
			pl0.intoRendererListener = (): void => {
				material.setTexSize(tex.getWidth(), tex.getHeight());
				this.layoutMapPlane();
			};
		}
		this.m_mapPlane = pl0;
		this.m_ctrlui.ruisc.addEntity(pl0, 1);
		//this.m_ctrlui
	}
	shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
		console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);

		this.initScene(this.m_rscene);
		this.initUI();

		this.m_dropController.initialize(document.body as any, this);
		this.initTextDiv();

		let color = new Color4();
		color.randomRGB(0.2);
		let srcPlane = new ScreenFixedAlignPlaneEntity();
		srcPlane.initialize(-1.0, -1.0, 2.0, 2.0);
		(srcPlane.getMaterial() as IColorMaterial).setColor(color);
		srcPlane.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
		this.m_rscene.addEntity(srcPlane, 0);

		let axis = new Axis3DEntity();
		axis.initialize(300);
		this.m_rscene.addEntity(axis, 0);
		this.m_rscene.addEventListener(EventBase.RESIZE, this, this.resize);
		this.resize(null);
	}

	private resize(evt: any): void {
		let st = this.m_rscene.getStage3D();
		let px = Math.round(st.stageWidth * this.m_mapAreaFactor);
		this.m_rscene.setViewPort(px, 0, st.stageWidth - px, st.stageHeight);

		this.m_ctrlui.updateLayout(true);
		let stw = Math.round(st.stageWidth * this.m_mapAreaFactor);
		this.m_ctrlui2.updateLayout(true, new Vector3D(stw));

		this.layoutMapPlane();
	}

	private initTextDiv(): void {
		let div = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		pdiv.width = 256;
		pdiv.height = 64;
		// pdiv.style.backgroundColor = "#112211";

		pdiv.style.left = 10 + "px";
		pdiv.style.top = 80 + "px";
		pdiv.style.zIndex = "99999";
		pdiv.style.position = "absolute";
		document.body.appendChild(pdiv);
		pdiv.innerHTML = "<font color='#eeee00'>将生成法线图的原图拖入任意区域</font>";
	}
	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		console.log("initFileLoad(), files.length: ", files.length);
		for (let i = 0; i < files.length; ++i) {
			this.loadedRes(files[i].url, files[i].name);
		}
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}
	private m_normalMapName = "";
	private loadedRes(url: string, name: string): void {
		// console.log("loadedRes A, url: ", url,", name: ", name);
		if (name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadedRes, url: ", url, ", name: ", name);
		this.m_normalMapName = name;
		// this.createAEntityByTexUrl(url);
		this.createAMapPlane(url);
	}
	private mouseDown(evt: any): void {
		console.log("mouseDown() ...");
		// this.openDir();
	}
	private initScene(rscene: IRendererScene): void {
		// this.createAEntityByTexUrl("static/assets/rock_a_n.jpg");
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
		this.m_materialCtx.addShaderLibListener(this);
		this.m_materialCtx.initialize(this.m_rscene as RendererScene, mcParam);

		let pointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
		if (pointLight != null) {
			// pointLight.position.setXYZ(200.0, 180.0, 200.0);
			pointLight.position.setXYZ(0.0, 300.0, -200.0);
			// pointLight.color.setRGB3f(0.0, 1.5, 0.0);
			pointLight.color.randomRGB(1.5);
			pointLight.attenuationFactor1 = 0.00001;
			pointLight.attenuationFactor2 = 0.00005;
		}

		pointLight = this.m_materialCtx.lightModule.getPointLightAt(1);
		if (pointLight != null) {
			// pointLight.position.setXYZ(200.0, 180.0, 200.0);
			pointLight.position.setXYZ(0.0, -400.0, 0.0);
			// pointLight.color.setRGB3f(0.5, 0.2, 1.0);
			pointLight.color.randomRGB(1.7);
			pointLight.attenuationFactor1 = 0.00001;
			pointLight.attenuationFactor2 = 0.00005;
		}

		let spotLight = this.m_materialCtx.lightModule.getSpotLightAt(0);
		if (spotLight != null) {
			spotLight.position.setXYZ(0.0, 30.0, 0.0);
			spotLight.direction.setXYZ(0.0, -1.0, 0.0);
			spotLight.color.setRGB3f(0.0, 40.2, 0.0);
			spotLight.attenuationFactor1 = 0.000001;
			spotLight.attenuationFactor2 = 0.000001;
			spotLight.angleDegree = 30.0;
		}
		let directLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
		if (directLight != null) {
			// directLight.color.setRGB3f(1.0, 0.0, 0.5);
			directLight.color.randomRGB(1.5);
			directLight.direction.setXYZ(-1.0, -1.0, 0.0);
			directLight = this.m_materialCtx.lightModule.getDirectionLightAt(1);
			if (directLight != null) {
				// directLight.color.setRGB3f(0.0, 0.0, 1.0);
				directLight.color.randomRGB(1.0);
				directLight.direction.setXYZ(0.2, 1.0, 0.0);
			}
		}
		this.m_materialCtx.lightModule.update();
		//  this.m_materialCtx.lightModule.showInfo();
	}
	private m_currMaterial: PBRMaterial = null;
	private m_baseEntities: DisplayEntity[] = new Array(5);
	private m_entityIndex = 0;

	private createBaseEntities(): void {
		if (this.m_baseEntities[0] == null) {
			let tex = this.getTexByUrl("static/assets/rock_a_n.jpg");
			let entity0 = new Box3DEntity();
			entity0.normalEnabled = true;
			entity0.initializeSizeXYZ(600, 1.0, 600, [tex]);
			this.m_baseEntities[0] = entity0;

			let entity1 = new Sphere3DEntity();
			entity1.normalEnabled = true;
			entity1.initialize(300, 40, 40, [tex]);
			this.m_baseEntities[1] = entity1;

			let entity2 = new Box3DEntity();
			entity2.normalEnabled = true;
			entity2.initializeCube(400, [tex]);
			this.m_baseEntities[2] = entity2;

			let entity3 = new Cylinder3DEntity();
			entity3.normalEnabled = true;
			entity3.initialize(200, 400, 40, [tex]);
			this.m_baseEntities[3] = entity3;

			let entity4 = new Torus3DEntity();
			entity4.normalEnabled = true;
			entity4.initialize(300, 80, 30, 30, [tex]);
			this.m_baseEntities[4] = entity4;
		}
	}
	private createAEntityByTexUrl(url: string): void {
		this.createBaseEntities();

		let material = this.m_currMaterial;
		material = this.createPBREntityMaterial(url);
		this.m_currMaterial = material;
		console.log("material.getTextureList(): ", material.getTextureList());

		let ls = this.m_baseEntities;

		for (let i = 0; i < ls.length; ++i) {
			this.m_rscene.removeEntity(ls[i]);
		}
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setMaterial(material);
		}
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setVisible(false);
			this.m_rscene.addEntity(ls[i]);
		}

		if (ls.length > 0) {
			(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
			ls[this.m_entityIndex].setVisible(true);
		}

		// // let entity = new Sphere3DEntity();
		// // // entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		// // entity.setMaterial( material );
		// // entity.initialize(200, 30, 30);
		// // this.m_rscene.addEntity(entity, 1);
		// // this.m_mapPlane = entity;
	}
	private showNextModel(): void {
		let ls = this.m_baseEntities;
		if (ls.length > 0) {
			ls[this.m_entityIndex].setVisible(false);
			this.m_entityIndex++;
			this.m_entityIndex %= ls.length;
			ls[this.m_entityIndex].setVisible(true);
		}
	}
	private createPBREntityMaterial(url: string): PBRMaterial {
		// let normalMap = this.m_materialCtx.getTextureByUrl(url);
		let normalMap = this.getTexByUrl(url);
		normalMap.flipY = true;

		let material: PBRMaterial;

		let vertUniform: VertUniformComp;
		material = this.createMaterial();
		vertUniform = material.vertUniform as VertUniformComp;
		vertUniform.uvTransformEnabled = true;

		material.decorator.aoMapEnabled = false;
		material.decorator.scatterEnabled = false;
		material.decorator.diffuseMapEnabled = false;
		material.decorator.normalMap = normalMap;

		material.initializeByCodeBuf(true);
		vertUniform.setDisplacementParams(50.0, 0.0);
		material.setToneMapingExposure(5.0);
		material.setAlbedoColor(1.0, 1.0, 1.0);
		material.setRoughness(0.3);
		material.setScatterIntensity(64.0);
		material.setParallaxParams(1, 10, 5.0, 0.02);
		material.setSideIntensity(8);
		material.setMetallic(0.1);
		return material;
	}
	private makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {
		let material = this.m_materialCtx.createPBRLightMaterial(true, true, true);
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

		material.setMetallic(metallic);
		material.setRoughness(roughness);
		material.setAO(ao);

		return material;
	}
	private createMaterial(): PBRMaterial {
		let material: PBRMaterial;
		material = this.makePBRMaterial(0.9, 0.0, 1.0);

		let decorator = material.decorator;
		decorator.shadowReceiveEnabled = false;
		decorator.fogEnabled = false;
		decorator.indirectEnvMapEnabled = false;
		decorator.specularEnvMapEnabled = true;
		decorator.diffuseMapEnabled = true;
		decorator.normalMapEnabled = true;
		//material.setTextureList(ptexList);
		return material;
	}
	private m_initUI = true;
	private m_uv = new Vector3D(1.0, 1.0);
	private initUI(): void {
		if (!this.m_initUI) {
			return;
		}
		this.m_initUI = false;

		let ui = this.m_ctrlui;
		ui.fontBgColor.setRGBA4f(0.7, 0.8, 0.6, 0.6);
		ui.proBarBGBarAlpha = 0.9;
		ui.proBarBGPlaneAlpha = 0.7;
		ui.initialize(this.m_rscene, true);
		this.createClickArea();
		this.initMapBuildCtrlUIItem();
		ui.updateLayout(true);
		this.m_graph.addScene(ui.ruisc);
		// /*
		ui = this.m_ctrlui2;
		ui.fontBgColor.setRGBA4f(0.7, 0.8, 0.6, 0.6);
		ui.proBarBGBarAlpha = 0.9;
		ui.proBarBGPlaneAlpha = 0.7;
		ui.initialize(this.m_rscene, true);
		this.initMapApplyCtrlUIItem();

		let st = this.m_rscene.getStage3D();
		let stw = Math.round(st.stageWidth * this.m_mapAreaFactor);
		ui.updateLayout(true, new Vector3D(stw));
		this.m_graph.addScene(ui.ruisc);

		// this.m_rscene.addEventListener(EventBase.RESIZE, this, (): void => {
		// 	let stw = Math.round(st.stageWidth * this.m_mapAreaFactor);
		// 	this.m_ctrlui2.updateLayout(true, new Vector3D(stw));
		// });
		//*/
		// this.m_vasScene.initialize(ui.ruisc, this.m_aspParam);
		this.createAMapPlane("static/assets/guangyun_H_0007.png");
	}
	private resetMapBuildCtrlValue(): void {
		let ui = this.m_ctrlui;
		ui.setUIItemValue("strength", 5.0);
		ui.setUIItemValue("sharpness", 1.0);
		ui.setUIItemFlag("invert", false);
		ui.setUIItemFlag("invert-x", false);
		ui.setUIItemFlag("invert-y", false);
	}
	private initMapBuildCtrlUIItem(): void {
		let ui = this.m_ctrlui;

		ui.addStatusItem(
			"保存",
			"saveNormalMap",
			"法线图",
			"法线图",
			true,
			(info: CtrlInfo): void => {
				// this.m_savingImg = true;
				this.saveToImg();
			},
			true,
			false
		);
		ui.addStatusItem(
			"恢复",
			"resetBuildSetting",
			"默认设置",
			"默认设置",
			true,
			(info: CtrlInfo): void => {
				this.resetMapBuildCtrlValue();
			},
			true,
			false
		);
		ui.addStatusItem(
			"翻转法线",
			"invert",
			"是",
			"否",
			false,
			(info: CtrlInfo): void => {
				if (this.m_mapMaterial) {
					this.m_mapMaterial.setInvertEnabled(info.flag);
				}
			},
			true,
			false
		);
		ui.addStatusItem(
			"翻转法线X值",
			"invert-x",
			"是",
			"否",
			false,
			(info: CtrlInfo): void => {
				if (this.m_mapMaterial) {
					this.m_mapMaterial.setInvertXEnabled(info.flag);
				}
			},
			true,
			false
		);
		ui.addStatusItem(
			"翻转法线Y值",
			"invert-y",
			"是",
			"否",
			false,
			(info: CtrlInfo): void => {
				if (this.m_mapMaterial) {
					this.m_mapMaterial.setInvertYEnabled(info.flag);
				}
			},
			true,
			false
		);
		ui.addValueItem(
			"强度",
			"strength",
			5.0,
			0.01,
			70.0,
			(info: CtrlInfo): void => {
				if (this.m_mapMaterial) {
					this.m_mapMaterial.setStrength(info.values[0]);
				}
			},
			false,
			true,
			null,
			false
		);
		ui.addValueItem(
			"锐度",
			"sharpness",
			1.0,
			0.01,
			10.0,
			(info: CtrlInfo): void => {
				if (this.m_mapMaterial) {
					this.m_mapMaterial.setSharpness(info.values[0]);
				}
			},
			false,
			true,
			null,
			false
		);
	}
	private initMapApplyCtrlUIItem(): void {
		let ui = this.m_ctrlui2;

		ui.addStatusItem(
			"恢复",
			"reset",
			"默认设置",
			"默认设置",
			true,
			(info: CtrlInfo): void => {
				this.resetMapApplyCtrlValue();
			},
			true,
			false
		);

		ui.addValueItem(
			"UV缩放",
			"uv_scale",
			1.0,
			0.01,
			30.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_uv.setXYZ(info.values[0], info.values[0], 0);
					(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
				}
			},
			false,
			true,
			null,
			false
		);

		ui.addValueItem(
			"UV缩放V",
			"uv_v_scale",
			1.0,
			0.01,
			30.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_uv.y = info.values[0];
					(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
				}
			},
			false,
			true,
			null,
			false
		);
		ui.addValueItem(
			"UV缩放U",
			"uv_u_scale",
			1.0,
			0.01,
			30.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_uv.x = info.values[0];
					(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
				}
			},
			false,
			true,
			null,
			false
		);

		ui.addValueItem(
			"金属度",
			"metallic",
			0.1,
			0.0,
			1.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setMetallic(info.values[0]);
				}
			},
			false,
			true,
			null,
			false
		);

		ui.addValueItem(
			"粗糙度",
			"roughness",
			0.3,
			0.0,
			1.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setRoughness(info.values[0]);
				}
			},
			false,
			true,
			null,
			false
		);

		ui.addStatusItem(
			"切换",
			"change_model",
			"模型",
			"模型",
			true,
			(info: CtrlInfo): void => {
				this.showNextModel();
			},
			true,
			false
		);
	}
	private resetMapApplyCtrlValue(): void {
		console.log("resetMapApplyCtrlValue() ...");
		let ui = this.m_ctrlui;
		ui.setUIItemValue("uv_u_scale", 1.0);
		ui.setUIItemValue("uv_v_scale", 1.0);
		ui.setUIItemValue("uv_scale", 1.0);
		ui.setUIItemValue("metallic", 0.1);
		ui.setUIItemValue("roughness", 0.3);
	}

	private m_currTexture: IRenderTexture = null;

	run(): void {
		this.m_graph.run();
		if (this.m_imgBuilder) {
			this.m_imgBuilder.run();
		}
	}
	// run(): void {
	// 	this.m_graph.run();
	// }
}
export default NormalMapBuilder;

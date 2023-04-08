import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import TextureProxy from "../../vox/texture/TextureProxy";
import TextureConst from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";


import { FogDepthUVMaterial } from "../../advancedDemo/depthFog/material/FogDepthUVMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { PBRParam, PBRMateralBuilder } from "../../demo/material/PBRMateralBuilder";
import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import ScreenFixedAlignPlaneEntity from "../../vox/entity/ScreenFixedAlignPlaneEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import { SphDepthFogRenderNode } from "../../advancedDemo/depthFog/renderer/SphDepthFogRenderNode";
import RendererState from "../../vox/render/RendererState";
import MouseEvent from "../../vox/event/MouseEvent";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";
import IRendererScene from "../../vox/scene/IRendererScene";
import SelectionBarStyle from "../../orthoui/button/SelectionBarStyle";
import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../../orthoui/usage/ParamCtrlUI";
import IRenderEntity from "../../vox/render/IRenderEntity";

export class DemoSphDepthFogRender2 {
	private m_pbr = new PBRMateralBuilder();
	private m_rscene: IRendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_graph = new RendererSceneGraph();
	private m_ctrlui = new ParamCtrlUI(false);
	constructor() { }

	private applyPBRTex(param: PBRParam, texName: string, envMapEnabled: boolean = true): void {
		param.envMap = envMapEnabled ? this.m_pbr.getEnvMap() : null;
		param.diffuseMap = this.getAssetTexByUrl(`pbr/${texName}/albedo.jpg`);
		param.normalMap = this.getAssetTexByUrl(`pbr/${texName}/normal.jpg`);
		param.roughnessMap = this.getAssetTexByUrl(`pbr/${texName}/roughness.jpg`);
		param.metallicMap = this.getAssetTexByUrl(`pbr/${texName}/metallic.jpg`);
		param.aoMap = this.getAssetTexByUrl(`pbr/${texName}/ao.jpg`);
	}

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		let hostUrl = window.location.href;
		if (hostUrl.indexOf(".artvily.") > 0) {
			hostUrl = "http://www.artvily.com:9090/";
			url = hostUrl + url;
		}
		return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	createMaterial2(color: Color4 = null, uvParam: Vector3D = null, ns: string = ""): IRenderMaterial {
		let material = new FogDepthUVMaterial();
		if (color) {
			material.setRGBColor(color);
		}
		return material;
	}
	createMaterial(color: Color4 = null, uvParam: Vector3D = null, ns: string = ""): IRenderMaterial {
		let param = new PBRParam(Math.random() * 0.5, Math.random() * 1.2, 1.2, new Color4(1.0, 1.0, 1.0));
		// let param = new PBRParam(0.1, Math.random() * 1.2, 1.2, new Color4(1.0, 1.0, 1.0));
		param.depthFog = true;
		if (uvParam != null) {
			param.setUVOffset(uvParam.x, uvParam.y);
			param.setUVScale(uvParam.z, uvParam.w);
		}
		ns = ns == "" ? "gold" : ns;
		this.applyPBRTex(param, ns);
		let material = this.m_pbr.createTextureMaterialWrapper(param);
		return material;
	}

	initialize(): void {
		if (this.m_rscene == null) {
			console.log("DemoSphDepthFogRender2::initialize()......");
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

			let rparam = new RendererParam();
			// rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45.0, 1.0, 9000.0);
			rparam.setCamPosition(2500.0, 2500.0, 2500.0);
			rparam.setAttriAntialias(true);
			this.m_rscene = this.m_graph.createScene(rparam);
			this.m_rscene.initialize(rparam, 5);
			this.m_rscene.updateCamera();
			this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			this.buildFogScene();
			this.initUI();
			this.m_graph.setAutoRunning(true);
		}
	}
	private mouseDown(evt: any): void {
		if (this.m_fogRenderNode) {
			// this.m_fogRenderNode.setFactorFBOSizeFactor(0.5);
		}
	}
	private m_fogRenderNode: SphDepthFogRenderNode = null;
	private m_fogPlane: IRenderEntity = null;
	private m_tipsEntities: IRenderEntity[] = [];
	private buildFogScene(): void {

		this.m_pbr.sharedLightColor = false;
		this.m_pbr.initialize(this.m_rscene);

		let tex3 = this.getTexByUrl("static/assets/flare_core_03.jpg");

		// add common 3d display entity ---------------------------------- begin

		let material = this.createMaterial();

		// let planeSph = new Sphere3DEntity();
		// planeSph.meshMode = -1;
		// planeSph.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		// planeSph.setMaterial(material);
		// planeSph.initialize(220.0, 30, 30);
		// planeSph.setXYZ(0, -70, 0);
		// this.m_rscene.addEntity(planeSph);

		let pl0 = new Plane3DEntity();
		pl0.setMaterial(material);
		pl0.initializeXOZSquare(700);
		pl0.setXYZ(0, -170, 0);
		this.m_rscene.addEntity(pl0);

		let sph = new Sphere3DEntity();
		sph.setMaterial(material);
		sph.initialize(150.0, 30, 30);
		this.m_rscene.addEntity(sph);

		let bgBox = new Box3DEntity();
		bgBox.normalScale = -1.0;
		material = this.createMaterial(null, new Vector3D(0.0, 0.0, 5.0, 5.0), "rusted_iron");
		bgBox.setMaterial(material);
		bgBox.showFrontFace();
		bgBox.initializeCube(3600);
		this.m_rscene.addEntity(bgBox, 1);

		let particleProcIndex = 2;
		//*
		let src_particle = new Billboard3DEntity();
		src_particle.initialize(100, 100, [tex3]);
		let pv = new Vector3D();
		for (let i = 0; i < 30; ++i) {
			let particle = new Billboard3DEntity();
			particle.copyMeshFrom(src_particle);
			particle.initialize(100, 100, [tex3]);
			let scale = Math.random() + 0.2;
			particle.setXYZ(Math.random() * 2000 - 1000, Math.random() * 1000, Math.random() * 2000 - 1000);
			particle.setScaleXY(scale, scale);
			particle.setRGB3f(Math.random(), Math.random(), Math.random());
			this.m_rscene.addEntity(particle, particleProcIndex);
		}
		//*/
		// add common 3d display entity ---------------------------------- end

		let fogRenderNode = new SphDepthFogRenderNode();
		// fogRenderNode.texLoader = this.m_texLoader;
		fogRenderNode.cloudTex = this.getAssetTexByUrl("cloud_01.jpg");
		fogRenderNode.initialize(this.m_rscene, [0, 1], [particleProcIndex]);
		this.m_fogRenderNode = fogRenderNode;

		let displayMaterial = fogRenderNode.createDisplayMaterial();
		let dstPlane = new Plane3DEntity();
		dstPlane.setMaterial(displayMaterial);
		dstPlane.initializeXOY(
			-0.5, -0.5, 1.0, 1.0
		);
		this.m_rscene.addEntity(dstPlane, 3);
		this.m_fogPlane = dstPlane;

		const commonFBO = fogRenderNode.getCommonFBO();
		const factorFBO = fogRenderNode.getFactorFBO();
		let tipsProcIndex = 4;
		// display the color rtt rendering content
		let scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.9, -0.9, 0.3, 0.3, [commonFBO.getRTTAt(0)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);
		this.m_tipsEntities.push(scrPlane);

		// display the depth rtt rendering content
		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.55, -0.9, 0.3, 0.3, [commonFBO.getRTTAt(1)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);
		this.m_tipsEntities.push(scrPlane);

		// display the fog factor rtt rendering content
		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(-0.2, -0.9, 0.3, 0.3, [factorFBO.getRTTAt(0)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);
		this.m_tipsEntities.push(scrPlane);

		// display the fog color rendering content
		scrPlane = new ScreenFixedAlignPlaneEntity();
		scrPlane.initialize(0.15, -0.9, 0.3, 0.3, [factorFBO.getRTTAt(1)]);
		this.m_rscene.addEntity(scrPlane, tipsProcIndex);
		this.m_tipsEntities.push(scrPlane);
	}

	private m_initUI = true;
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

		let selectBarStyle: SelectionBarStyle = null;
		selectBarStyle = new SelectionBarStyle();
		selectBarStyle.fontBgColor.setRGBA4f(0.7, 0.8, 0.6, 0.6);

		ui.addStatusItem("渲染优化", "optimize", "是", "否", false, (info: CtrlInfo): void => {
			if (this.m_fogRenderNode) {
				this.m_fogRenderNode.setFactorFBOSizeFactor(info.flag ? 0.5 : 1.0);
			}
		}, true, false, selectBarStyle);

		ui.addStatusItem("全屏展示", "fullscren", "是", "否", false, (info: CtrlInfo): void => {
			this.setFullscreenStatus(info.flag);
		}, true, false, selectBarStyle);

		// ui.addValueItem("UV缩放", "uv_scale", 1.0, 0.01, 30.0, (info: CtrlInfo): void => {
		// 	if(this.m_currMaterial) {
		// 		this.m_uv.setXYZ(info.values[0], info.values[0], 0);
		// 		(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
		// 	}
		// }, false, true, null, false);

		ui.updateLayout(true);

		this.m_graph.addScene(ui.ruisc);

		// this.m_vasScene.initialize(ui.ruisc, this.m_aspParam);
	}
	private setFullscreenStatus(flag: boolean): void {
		let ls = this.m_tipsEntities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setVisible(!flag);
		}
		if (flag) {
			this.m_fogPlane.setScaleXYZ(2.0, 2.0, 1.0);
		} else {
			this.m_fogPlane.setScaleXYZ(1.0, 1.0, 1.0);
		}
	}
	private setUIItemValue(ns: string, value: number, syncEnabled: boolean = true): void {
		let item = this.m_ctrlui.getItemByUUID(ns);
		item.param.value = value;
		item.syncEnabled = syncEnabled;
		item.updateParamToUI();
	}
	// private resetCtrlValue(): void {
	// 	console.log("resetCtrlValue() ...");
	// 	this.setUIItemValue("uv_u_scale", 			1.0);
	// 	this.setUIItemValue("uv_v_scale", 			1.0);
	// 	this.setUIItemValue("uv_scale", 			1.0);
	// 	this.setUIItemValue("metallic", 			0.1);
	// 	this.setUIItemValue("roughness", 			0.3);
	// 	this.setUIItemValue("scatterIntensity", 	64);
	// 	this.setUIItemValue("tone", 				5);
	// }
}
export default DemoSphDepthFogRender2;

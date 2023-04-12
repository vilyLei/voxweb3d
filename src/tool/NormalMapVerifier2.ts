import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import MouseEvent from "../vox/event/MouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";
import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../orthoui/usage/ParamCtrlUI";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "./base/DropFileController";

import { IAwardSceneParam } from "./base/award/IAwardSceneParam";
import { VoxAwardScene } from "./base/award/VoxAwardScene";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import IDisplayEntityContainer from "../vox/entity/IDisplayEntityContainer";
import IRenderEntity from "../vox/render/IRenderEntity";

import PBRMaterial from "../pbr/material/PBRMaterial";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Torus3DEntity from "../vox/entity/Torus3DEntity";
import Vector3D from "../vox/math/Vector3D";
import SelectionBarStyle from "../orthoui/button/SelectionBarStyle";

import PBRDebugScene from "../pbr/base/PBRDebugScene";
import URLFilter from "./base/URLFilter";

export class NormalMapVerifier2 extends PBRDebugScene {

	protected m_ctrlui = new ParamCtrlUI(false);
	protected m_dropController = new DropFileController();

	private m_aspParam = new AwardSceneParam();
	private m_vasScene = new VoxAwardScene();

	constructor() {super()}

	protected materialSystemInited(): void {

		let rscene = this.rscene;
		rscene.setClearRGBAColor4f(0.2, 0.3, 0.2, 0.0);
		rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

		this.initScene(this.rscene);
		this.initUI();
		// this.m_graph.setAutoRunning(true);

		this.m_dropController.initialize(this.rscene.getRenderProxy().getCanvas(), this);
		this.initTextDiv();
	}
	private m_infoDiv: HTMLDivElement = null;
	private initTextDiv(): void {
		let div = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		pdiv.width = 256;
		pdiv.height = 64;
		pdiv.style.left = 10 + "px";
		pdiv.style.top = 80 + "px";
		pdiv.style.zIndex = "99999";
		pdiv.style.position = "absolute";
		document.body.appendChild(pdiv);
		this.m_infoDiv = pdiv;
		this.m_infoDiv.innerHTML = "<font color='#eeee00'>将Normal图拖入当前区域</font>";
	}

	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		console.log("initFileLoad(), files.length: ", files.length);
		for(let i = 0; i < files.length; ++i) {
			this.loadedRes(files[i].url, files[i].name);
		}
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}
	private m_name = "";
	private loadedRes(url: string, name: string): void {
		// console.log("loadedRes A, url: ", url,", name: ", name);
		let rscene = this.rscene;
		let st = this.rscene.getStage3D();
		console.log("loadedRes A, url: ", url,", mouse x,y: ", st.mouseX, st.mouseY);
		if(name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadedRes, url: ", url,", name: ", name);
		console.log("loadedRes, this.m_loadNormalMap: ", this.m_loadNormalMap);
		this.m_name = name;
		if(this.m_loadNormalMap) {
			this.createAEntityByTexUrl(url);
		}else {
			this.createAEntityByTexUrl("", url);
		}
	}
	private mouseDown(evt: any): void {
		console.log("mouseDown() ...");
	}
	private initScene(rscene: IRendererScene): void {
		this.createAEntityByTexUrl("static/assets/rock_a_n.jpg");
	}

	private m_currMaterial: PBRMaterial = null;
	private m_baseEntities: DisplayEntity[] = new Array(5);
	private m_entityIndex = 0;

	private createBaseEntities(): void {

		if(this.m_baseEntities[0] == null) {

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
			entity4.initialize(250, 80, 30, 30, [tex]);
			this.m_baseEntities[4] = entity4;
		}
	}
	private createAEntityByTexUrl(normalTexUrl: string, diffuseTexUrl: string = ""): void {

		this.createBaseEntities();

		let material = this.m_currMaterial;
		material = this.createPBREntityMaterial(normalTexUrl, diffuseTexUrl);
		if(this.m_currMaterial) {
			material.copyFrom(this.m_currMaterial);
		}
		this.m_currMaterial = material;

		let ls = this.m_baseEntities;

		for(let i = 0; i < ls.length; ++i) {
			this.rscene.removeEntity( ls[i] );
		}
		for(let i = 0; i < ls.length; ++i) {
			ls[i].setMaterial(material);
		}
		for(let i = 0; i < ls.length; ++i) {
			ls[i].setVisible(false);
			this.rscene.addEntity( ls[i] );
		}

		(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
		ls[this.m_entityIndex].setVisible(true);

	}
	private showNextModel(): void {
		let ls = this.m_baseEntities;
		ls[this.m_entityIndex].setVisible(false);
		this.m_entityIndex++;
		this.m_entityIndex %= ls.length;
		ls[this.m_entityIndex].setVisible(true);
	}
	private m_diffuseTexUrl = "static/assets/white.jpg";
	private m_normalTexUrl = "static/assets/rock_a_n.jpg";
	private createPBREntityMaterial(normalTexUrl: string, diffuseTexUrl: string = ""): PBRMaterial {

		if(diffuseTexUrl != "") {
			this.m_diffuseTexUrl = diffuseTexUrl;
		}
		if(normalTexUrl != "") {
			this.m_normalTexUrl = normalTexUrl;
		}

		let normalMap = this.getTexByUrl(this.m_normalTexUrl);
		let diffMap = this.getTexByUrl(this.m_diffuseTexUrl);
		let param = this.createPBRDecoratorParam();
		param.diffuseMapEnabled = true;
		param.aoMapEnabled = false;
		param.scatterEnabled = true;
		param.diffuseMap = diffMap;
		param.normalMap = normalMap;
		return this.createPBRMaterial( param );
	}

	private m_uv = new Vector3D(1.0, 1.0);
	private m_loadNormalMap = true;

	private m_initUI = true;
	private initUI(): void {
		if (!this.m_initUI) {
			return;
		}
		this.m_initUI = false;

		let ui = this.m_ctrlui;
		ui.syncStageSize = false;
		ui.fontBgColor.setRGBA4f(0.7,0.8,0.6, 0.6);
		ui.proBarBGBarAlpha = 0.9;
		ui.proBarBGPlaneAlpha = 0.7;
		ui.initialize(this.rscene, true);

		let selectBarStyle: SelectionBarStyle = null;
		// selectBarStyle = new SelectionBarStyle();
		// selectBarStyle.headFontBgColor.setRGBA4f(0.7,0.8,0.6, 0.6);

		ui.addStatusItem("恢复", "reset", "默认设置", "默认设置", true, (info: CtrlInfo): void => {
			this.resetCtrlValue();
		}, true, false, selectBarStyle);

		ui.addValueItem("UV缩放", "uv_scale", 1.0, 0.01, 30.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_uv.setXYZ(info.values[0], info.values[0], 0);
				(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
			}
		}, false, true, null, false);

		ui.addValueItem("缩放V", "uv_v_scale", 1.0, 0.01, 30.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_uv.y = info.values[0];
				(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
			}
		}, false, true, null, false);
		ui.addValueItem("缩放U", "uv_u_scale", 1.0, 0.01, 30.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_uv.x = info.values[0];
				(this.m_currMaterial.vertUniform as VertUniformComp).setUVScale(this.m_uv.x, this.m_uv.y);
			}
		}, false, true, null, false);

		ui.addValueItem("金属度", "metallic", 0.1, 0.0, 1.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setMetallic(info.values[0]);
			}
		}, false, true, null, false);

		ui.addValueItem("粗糙度", "roughness", 0.3, 0.0, 1.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				console.log("roughness, info.values[0]: ", info.values[0]);
				this.m_currMaterial.setRoughness(info.values[0]);
			}
		}, false, true, null, false);

		ui.addValueItem("散射强度", "scatterIntensity", 64, 0.0, 128.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				console.log("scatterIntensity, info.values[0]: ", info.values[0]);
				this.m_currMaterial.setScatterIntensity(info.values[0]);
			}
		}, false, true, null, false);

		ui.addValueItem("色调映射强度", "tone", 5.0, 0.0, 10.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setToneMapingExposure(info.values[0]);
			}
		}, false, true, null, false);

		ui.addStatusItem("切换", "change_model", "模型", "模型", true, (info: CtrlInfo): void => {
			this.showNextModel();
		}, true, false, selectBarStyle);
		ui.addStatusItem("加载", "load_tex", "Normal纹理", "Albedo纹理", true, (info: CtrlInfo): void => {
			this.m_loadNormalMap = info.flag;
			if(info.flag) {
				this.m_infoDiv.innerHTML = "<font color='#eeee00'>将Normal图拖入当前区域</font>";
			}else {
				this.m_infoDiv.innerHTML = "<font color='#eeee00'>将Albedo图拖入当前区域</font>";
			}
		}, true, false, selectBarStyle);

		ui.updateLayout(true);

		this.graph.addScene(ui.ruisc);

		// this.m_vasScene.initialize(ui.ruisc, this.m_aspParam);
	}
	private setUIItemValue(ns: string, value: number, syncEnabled: boolean = true): void {
		let item = this.m_ctrlui.getItemByUUID(ns);
		item.param.value = value;
		item.syncEnabled = syncEnabled;
		item.updateParamToUI();
	}
	private resetCtrlValue(): void {
		console.log("resetCtrlValue() ...");
		this.setUIItemValue("uv_u_scale", 			1.0);
		this.setUIItemValue("uv_v_scale", 			1.0);
		this.setUIItemValue("uv_scale", 			1.0);
		this.setUIItemValue("metallic", 			0.1);
		this.setUIItemValue("roughness", 			0.3);
		this.setUIItemValue("scatterIntensity", 	64);
		this.setUIItemValue("tone", 				5);
	}
	run(): void {
		if(this.graph) {
			this.graph.run();
		}
	}
}
export default NormalMapVerifier2;

class AwardSceneParam implements IAwardSceneParam {
	texLoader: TextureResLoader = null;
	constructor(){}
	getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		url = URLFilter.filterUrl(url);
		return this.texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}
	createContainer(): IDisplayEntityContainer {
		return new DisplayEntityContainer(true, true);
	}
	createXOYPlane(x: number, y: number, w: number, h: number, tex: IRenderTexture): IRenderEntity {
		let pl = new Plane3DEntity();
		pl.initializeXOY(x,y,w,h, [tex]);
		return pl;
	}
	pid = 1;
}


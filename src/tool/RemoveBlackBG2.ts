import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import RendererScene from "../vox/scene/RendererScene";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import RemoveBlackBGMaterial from "./material/RemoveBlackBGMaterial";
import MouseEvent from "../vox/event/MouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";

import SelectionBarStyle from "../orthoui/button/SelectionBarStyle";
import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../orthoui/usage/ParamCtrlUI";

import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import { IDropFileListerner, DropFileController } from "./base/DropFileController";
import Color4 from "../vox/material/Color4";

import { IAwardSceneParam } from "./base/award/IAwardSceneParam";
import { VoxAwardScene } from "./base/award/VoxAwardScene";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import IDisplayEntityContainer from "../vox/entity/IDisplayEntityContainer";
import IRenderEntity from "../vox/render/IRenderEntity";
import RendererState from "../vox/render/RendererState";

class AwardSceneParam implements IAwardSceneParam {
	texLoader: TextureResLoader = null;
	constructor(){}
	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		if(url.indexOf("blob:") < 0) {
			console.log("use common tex url");
			let hostUrl = window.location.href;
			if (hostUrl.indexOf(".artvily.") > 0) {
				hostUrl = "http://www.artvily.com:9090/";
				url = hostUrl + url;
			}
		}
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
	pid: number = 1;
}

export class RemoveBlackBG2 {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_ctrlui = new ParamCtrlUI(false);
	private m_div: HTMLDivElement = null;
	private m_dropController = new DropFileController();
	private m_aspParam = new AwardSceneParam();
	private m_vasScene = new VoxAwardScene();
	constructor() {}

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_aspParam.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	private createDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {
		let div = document.createElement("div");
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		document.body.appendChild(div);
		div.style.display = "bolck";
		div.style.left = px + "px";
		div.style.top = py + "px";
		div.style.position = "absolute";
		div.style.display = "bolck";
		div.style.position = "absolute";
		this.m_div = div;
		return div;
	}
	initialize(): void {
		console.log("RemoveBlackBG2::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam(this.createDiv(0,0, 512, 512));
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			rparam.setAttriAlpha(true);
			rparam.autoSyncRenderBufferAndWindowSize = false;
			// 保持 html body color 和 renderer clear color 同步，以便正确表现alpha混合
			// rparam.syncBgColor = false;

			let rscene = this.m_graph.createScene(rparam);
			// rscene.initialize(rparam).setAutoRunning(true);
			rscene.setClearRGBAColor4f(0.2, 0.3, 0.2, 0.0);
			rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);
			this.m_aspParam.texLoader = this.m_texLoader;
			// new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			// new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
			this.initUI();
			// this.m_graph.setAutoRunning(true);

			// this.m_dropController.initialize((this.m_rscene as RendererScene).getCanvas(), this);
			this.m_dropController.initialize(document.body as any, this);
			this.initTextDiv();

		}
	}
	private initTextDiv(): void {
		let div: HTMLDivElement = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		pdiv.width = 256;
		pdiv.height = 64;
		pdiv.style.backgroundColor = "#112211";
		pdiv.style.left = 10 + "px";
		pdiv.style.top = 10 + "px";
		pdiv.style.zIndex = "99999";
		pdiv.style.position = "absolute";
		document.body.appendChild(pdiv);
		pdiv.innerHTML = "<font color='#eeee00'>将图片拖入任意区域, 去除黑色背景生成透明PNG</font>";
	}
	private m_dropEnabled = true;
	initFileLoad(files: any[]): void {
		// this.m_dropEnabled = false;
		console.log("initFileLoad(), files.length: ", files.length);
		let flag = 1;
		if (files.length > 0) {
			let name = "";
			let urls: string[] = [];
			for (let i = 0; i < files.length; i++) {
				if (i == 0) name = files[i].name;
				const urlObj = window.URL.createObjectURL(files[i]);
				urls.push(urlObj);
			}

			if (name != "") {
				name.toLocaleLowerCase();
				if (name.indexOf(".jpg") > 1) {
				} else if (name.indexOf(".jpeg") > 1) {
				} else if (name.indexOf(".png") > 1) {
				} else if (name.indexOf(".gif") > 1) {
				} else if (name.indexOf(".bmp") > 1) {
				} else {
					flag = 31;
				}
				if(flag != 31) {
					this.loadAImg(urls[0], files[0].name);
				}
			} else {
				flag = 31;
			}
		} else {
			flag = 31;
		}
		this.m_dropController.alertShow(flag);
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}
	private m_name = "";
	private loadAImg(url: string, name: string): void {
		// console.log("loadAImg A, url: ", url,", name: ", name);
		if(name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadAImg, url: ", url,", name: ", name);
		this.m_name = name;
		this.createAEntityByTexUrl(url);
	}
	private mouseDown(evt: any): void {
		console.log("mouseDown() ...");
	}
	private m_currMaterial: RemoveBlackBGMaterial = null;
	private m_currEntity: Plane3DEntity = null;
	private m_currTexture: IRenderTexture = null;
	private initScene(rscene: IRendererScene): void {
		this.createAEntityByTexUrl("static/assets/guangyun_40.jpg");
	}
	private m_loadingTex: IRenderTexture = null;
	private createAEntityByTexUrl(url: string): void {
		if(this.m_currEntity != null) {
			this.m_rscene.removeEntity(this.m_currEntity);
		}
		let tex = this.getTexByUrl(url);
		let material = new RemoveBlackBGMaterial();
		material.setTextureList([tex]);
		if(this.m_currMaterial) {
			material.paramCopyFrom( this.m_currMaterial );
		}
		tex.flipY = true;
		// let plane = new ScreenAlignPlaneEntity();
		let plane = new Plane3DEntity();
		plane.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
		plane.setMaterial( material );
		// plane.initialize(-1.0,-1.0, 2.0, 2.0);
		plane.initializeXOY(-1.0, -1.0, 2.0, 2.0);
		plane.setScaleXYZ(0.5,0.5,1.0);
		this.m_rscene.addEntity(plane, 1);

		this.m_currEntity = plane;
		this.m_currMaterial = material;
		this.m_currTexture = tex;
		this.m_loadingTex = tex;
	}
	private m_savingImg = false;
	private m_initUI = true;
	private m_bgColor = new Color4();
	private initUI(): void {
		if (!this.m_initUI) {
			return;
		}
		this.m_initUI = false;

		let ui = this.m_ctrlui;
		ui.fontBgColor.setRGBA4f(0.7,0.8,0.6, 0.6);
		ui.proBarBGBarAlpha = 0.9;
		ui.proBarBGPlaneAlpha = 0.7;
		ui.initialize(this.m_rscene, true);
		
		
		let selectBarStyle: SelectionBarStyle = null;
		selectBarStyle = new SelectionBarStyle();
		selectBarStyle.fontBgColor.setRGBA4f(0.7,0.8,0.6, 0.6);

		ui.addStatusItem("保存", "save", "图片", "图片", true, (info: CtrlInfo): void => {
			this.m_savingImg = true;
		}, true, false, selectBarStyle);
		ui.addStatusItem("切换", "change_bg_color", "背景色", "背景色", false, (info: CtrlInfo): void => {
			this.m_bgColor.randomRGB(0.15);
			this.m_rscene.setClearRGBAColor4f(this.m_bgColor.r,this.m_bgColor.g, this.m_bgColor.b, 0.0);
		}, true, false);
		ui.addStatusItem("原图显示", "reset_init_img", "Yes", "No", false, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setParam3(info.flag?0.0:1.0);
			}
		}, true, false);
		ui.addStatusItem("恢复", "reset", "默认设置", "默认设置", true, (info: CtrlInfo): void => {
			this.resetCtrlValue();
		}, true, false);
		ui.addValueItem("透明度比例", "alpha_factor", 1.0, 0.0, 3.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setParam0(info.values[0]);
			}
		}, false, true, null, false);

		ui.addValueItem("颜色强度", "color_factor", 1.0, 0.0, 5.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setParam1(info.values[0]);
			}
		}, false, true, null, false);

		ui.addValueItem("透明度剔除比例", "alpha_discard_factor", 0.02, 0.0, 0.96, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setParam2(info.values[0]);
			}
		}, false, true, null, false);
		// 还可以设置: 更红，更绿，更蓝

		ui.updateLayout(true);

		this.m_graph.addScene(ui.ruisc);

		this.m_vasScene.initialize(ui.ruisc, this.m_aspParam);
	}

	private resetCtrlValue(): void {
		console.log("resetCtrlValue() ...");
		let item = this.m_ctrlui.getItemByUUID("alpha_factor");
		item.param.value = 1.0;
		item.syncEnabled = true;
		item.updateParamToUI();
		item = this.m_ctrlui.getItemByUUID("color_factor");
		item.param.value = 1.0;
		item.syncEnabled = true;
		item.updateParamToUI();
		item = this.m_ctrlui.getItemByUUID("alpha_discard_factor");
		item.param.value = 0.02;
		item.syncEnabled = true;
		item.updateParamToUI();
	}


	private m_rflag = false;
	private saveBegin(): void {
		
		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();
		let div = this.m_div;
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		(this.m_rscene as RendererScene).updateRenderBufferSize(false);
		if(this.m_currEntity) {
			this.m_currEntity.setXYZ(0,0,0);
			this.m_currEntity.setScaleXYZ(1.0, 1.0, 1.0);
			this.m_currEntity.update();
		}
	}
	private saveEnd(): void {
		let pw = 512;
		let ph = 512;
		let div = this.m_div;
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		(this.m_rscene as RendererScene).updateRenderBufferSize(true);
		this.layoutEntity();
	}
	private createCanvasData(): string {

		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();

		const srcCanvas = this.m_rscene.getRenderProxy().getCanvas();
		const canvas = document.createElement('canvas');
		canvas.width = pw;
		canvas.height = ph;
		canvas.style.display = 'bolck';

		const ctx2d = canvas.getContext('2d')!;
		ctx2d.drawImage(
			srcCanvas,
			0,
			0,
			srcCanvas.width,
			srcCanvas.height,
			0,
			0,
			canvas.width,
			canvas.height,
		);

		return canvas.toDataURL('image/png');
	}
	private saveImage(): void {
		const a = document.createElement('a');
		a.href = this.createCanvasData();
		a.download = this.m_name != "" ? this.m_name + "_new.png": "pngfile.png";
		document.body.appendChild(a);
		(a as any).style = 'display: none';
		a.click();
		a.remove();
	}
	private layoutEntity(): void {
		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();
		if(this.m_currEntity) {
			let k = pw / ph;
			ph = 0.5;
			pw = k * ph;
			if(pw > 0.8) {
				k = 0.8 / pw;
				pw *= k;
				ph *= k;
			}
			// this.m_currEntity.setXYZ(0.0, 0.1, 0.5);
			this.m_currEntity.setXYZ(0.0, 0.1, 0.0);
			this.m_currEntity.setScaleXYZ(pw, ph, 1.0);
			this.m_currEntity.update();
		}
	}
	run(): void {
		if(this.m_loadingTex && this.m_loadingTex.isDataEnough()) {
			this.layoutEntity();
			this.m_loadingTex = null;
		}
		if(this.m_savingImg) {
			this.m_ctrlui.ruisc.disable();
			this.m_rflag = true;
			this.saveBegin();
		}
		this.m_graph.run();
		if(this.m_rflag && this.m_savingImg) {
			this.saveImage();
			this.m_savingImg = false;
			this.m_ctrlui.ruisc.enable();
			this.m_rflag = false;
			this.saveEnd();
		}
	}
}
export default RemoveBlackBG2;

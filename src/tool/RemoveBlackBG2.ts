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
import { IFileUrlObj, IDropFileListerner, DropFileController } from "./base/DropFileController";
import Color4 from "../vox/material/Color4";

import { IAwardSceneParam } from "./base/award/IAwardSceneParam";
import { VoxAwardScene } from "./base/award/VoxAwardScene";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import IDisplayEntityContainer from "../vox/entity/IDisplayEntityContainer";
import IRenderEntity from "../vox/render/IRenderEntity";
import RendererState from "../vox/render/RendererState";
import { UISystem } from "./bgtoy/ui/UISystem";
import { ImageFileSystem } from "./bgtoy/fio/ImageFileSystem";
import URLFilter from "./base/URLFilter";
import AABB2D from "../vox/geom/AABB2D";
import EventBase from "../vox/event/EventBase";
import ColorRectImgButton from "../orthoui/button/ColorRectImgButton";
import IFBOInstance from "../vox/scene/IFBOInstance";
import ScreenAlignPlaneEntity from "../vox/entity/ScreenAlignPlaneEntity";
import Cloud01Material from "../pixelToy/cloud/material/Cloud01Material";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { UIBuilder } from "./bgtoy/ui/UIBuilder";

export class RemoveBlackBG2 {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_div: HTMLDivElement = null;
	private m_dropController = new DropFileController();
	private m_aspParam = new AwardSceneParam();
	private m_vasScene = new VoxAwardScene();
	private m_uiSys = new UISystem();
	private m_fileSys = new ImageFileSystem();

	constructor() {}

	getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		url = URLFilter.filterUrl(url);
		return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {
		console.log("RemoveBlackBG2::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			// let rparam = new RendererParam(this.m_uiSys.createDiv(0,0, 1024, 512));
			let rparam = new RendererParam();
			rparam.setCamProject(45, 0.1, 3000.0);
			rparam.setCamPosition(0.0, 0.0, 1500.0);
			rparam.setAttriAlpha(true);
			rparam.cameraPerspectiveEnabled = false;
			// rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.syncBgColor = true;

			let rscene = this.m_graph.createScene(rparam);
			// rscene.initialize(rparam).setAutoRunning(true);
			rscene.setClearRGBAColor4f(0.1, 0.22, 0.2, 0.0);
			rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			rscene.addEventListener(EventBase.RESIZE, this, this.resize);
			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);
			// new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			// new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
			this.initFBO();
			this.m_uiSys.processTotal = 6;
			this.m_uiSys.initialize(this.m_graph, this.m_fboIns.getRTTAt(0));
			this.m_uiSys.setOpeningListener((): void => {
				this.openDir();
			});
			this.m_fileSys.initialize(rscene, this.m_uiSys);

			this.m_dropController.initialize(document.body as any, this);

			this.m_aspParam.texLoader = this.m_texLoader;
			this.m_aspParam.uiBuilder = this.m_uiSys.uiBuilder;
			this.m_aspParam.uiSys = this.m_uiSys;
			this.m_aspParam.sc = this.m_rscene;
			this.m_vasScene.initialize(this.m_uiSys.ctrlui.ruisc, this.m_aspParam);

			this.resize(null);
		}
	}
	private m_fboIns: IFBOInstance = null;
	private m_fixPlane = new ScreenAlignPlaneEntity();
	private m_currFboEntity: IRenderEntity = null;
	private initFBO(): void {
		let rscene = this.m_rscene;
		let pw = 256;
		let ph = 256;
		let fboIns = rscene.createFBOInstance();
		fboIns.setClearRGBAColor4f(0.3, 0.0, 0.0, 1.0); // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
		fboIns.createFBOAt(0, pw, ph, false, false);
		fboIns.setRenderToRTTTextureAt(0); // apply the first rtt texture, and apply the fbo framebuffer color attachment 0
		fboIns.asynFBOSizeWithViewport();
		fboIns.setRProcessIDList([0], false);
		fboIns.setAutoRunning(true);
		this.m_fboIns = fboIns;

		let whiteTex = rscene.textureBlock.createRGBATex2D(pw, ph, new Color4());
		let material_cloud01 = new Cloud01Material();
		material_cloud01.fixScreen = true;
		material_cloud01.setSize(pw, ph);
		material_cloud01.setTextureList([whiteTex]);
		material_cloud01.setTime(Math.random() * 200);
		material_cloud01.setFactor(1.7 + Math.random() * 0.5);
		this.m_fixPlane.setMaterial(material_cloud01);
		this.m_fixPlane.initialize(-1, -1, 2, 2);
		// this.m_fboIns.drawEntity(this.m_fixPlane);
		this.m_fixPlane.intoRendererListener = (): void => {
			this.m_currFboEntity = this.m_fixPlane;
		};
		rscene.addEntity(this.m_fixPlane, 0);

		// let viewPlane = new Plane3DEntity();
		// viewPlane.initializeXOY(0, 0, pw, ph, [fboIns.getRTTAt(0)]);
		// viewPlane.setXYZ(200, 200, 0);
		// this.rscene.addEntity(viewPlane, 1);

		// let viewPlane = new ScreenAlignPlaneEntity();
		// viewPlane.initialize(-1, -1, 2, 2, [fboIns.getRTTAt(0)]);
		// viewPlane.setRGB3f(0.3, 0.3, 0.3);
		// rscene.addEntity(viewPlane, 1);
	}
	private m_areaRect = new AABB2D(0, 0, 1024, 512);
	private resize(evt: any): void {
		let st = this.m_rscene.getStage3D();
		let r = this.m_areaRect;
		r.setTo(0, 0, 1024, 512);
		// r.scaleBy(this.m_rscene.getDevicePixelRatio());
		r.moveCenterTo(st.stageHalfWidth, st.stageHalfHeight);

		this.m_vasScene.updateLayout(r);
		this.m_uiSys.updateLayout(r);
	}
	private openDir(): void {
		const input = document.createElement("input");
		input.type = "file";
		// input.accept = "image/png, image/jpeg";
		input.addEventListener("change", () => {
			this.m_uiSys.hideBtns();
			let files = Array.from(input.files);
			this.m_dropController.initFilesLoad(files);
		});
		input.click();
	}
	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		console.log("initFileLoad(), files: ", files);
		for (let i = 0; i < files.length; ++i) {
			if (files[i].resType == "image") {
				this.loadedRes(files[i].url, files[i].name);
				break;
			}
		}
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}
	private m_name = "";
	private loadedRes(url: string, name: string): void {
		// console.log("loadedRes A, url: ", url,", name: ", name);
		if (name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadedRes, url: ", url, ", name: ", name);
		this.m_name = name;
		this.createAEntityByTexUrl(url);
	}
	private mouseDown(evt: any): void {
		// console.log("mouseDown() ...");
	}
	private m_currMaterial: RemoveBlackBGMaterial = null;
	private m_currEntity: Plane3DEntity = null;
	private initScene(rscene: IRendererScene): void {
		this.createAEntityByTexUrl("static/assets/guangyun_40.jpg");
	}
	private createAEntityByTexUrl(url: string): void {
		if (this.m_currEntity != null) {
			this.m_rscene.removeEntity(this.m_currEntity);
		}
		let tex = this.getTexByUrl(url);
		let material = new RemoveBlackBGMaterial();
		material.fixScreen = false;
		material.setTextureList([tex]);
		if (this.m_currMaterial) {
			material.paramCopyFrom(this.m_currMaterial);
		}
		tex.flipY = true;
		// let plane = new ScreenAlignPlaneEntity();
		let plane = new Plane3DEntity();
		plane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		plane.setMaterial(material);
		// plane.initialize(-1.0,-1.0, 2.0, 2.0);
		plane.initializeXOY(-0.5, -0.5, 1.0, 1.0);
		this.m_rscene.addEntity(plane, 2);
		this.m_uiSys.setCurrMaterial(material);
		this.m_fileSys.setParams(this.m_name, plane, tex);

		this.m_currEntity = plane;
		this.m_currMaterial = material;
	}
	private m_times = 4;
	run(): void {
		// this.m_fileSys.savingBegin();

		this.m_graph.run();
		this.m_vasScene.run();
		if (this.m_currFboEntity) {
			if (this.m_times > 0) {
				this.m_times--;
				if (this.m_times == 1) {
					this.m_currFboEntity = null;
					this.m_fboIns.setAutoRunning(false);
					this.m_rscene.removeRenderNode(this.m_fboIns);
				}
			}
		}
		// this.m_fileSys.savingEnd();
		this.m_fileSys.run();
	}
}
class AwardSceneParam implements IAwardSceneParam {
	texLoader: TextureResLoader = null;
	uiBuilder: UIBuilder = null;
	uiSys: UISystem = null;
	sc: IRendererScene = null;
	constructor() {}
	// private getAssetTexByUrl(pns: string): IRenderTexture {
	// 	return this.getTexByUrl("static/assets/" + pns);
	// }

	createCharsTexFixSize?(width: number, height: number, str: string, fontSize: number): IRenderTexture {

		let fontColor = new Color4(1.0,1.0,1.0, 1.0);
		let bgColor = new Color4(1.0,1.0,1.0, 0.1);
		let img = this.uiBuilder.createCharsCanvasFixSize(width, height, str, fontSize, null, fontColor, bgColor);
		let tex = this.sc.textureBlock.createImageTex2D();
		tex.setDataFromImage(img);
		return tex;
	}
	applyFunction(key: string): void {
		this.uiSys.applyFunction(key);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		// url = URLFilter.filterUrl(url);
		return this.texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}
	createContainer(): IDisplayEntityContainer {
		return new DisplayEntityContainer(true, true);
	}
	createXOYPlane(x: number, y: number, w: number, h: number, tex: IRenderTexture = null, alignScreen: boolean = false): IRenderEntity {
		if (alignScreen) {
			let pl = new ScreenAlignPlaneEntity();
			// pl.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
			pl.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
			pl.initialize(x, y, w, h, tex ? [tex] : null);
			return pl;
		} else {
			let pl = new Plane3DEntity();
			// pl.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
			// pl.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
			pl.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
			pl.initializeXOY(x, y, w, h, tex ? [tex] : null);
			return pl;
		}
	}

	createBtnEntity(tex: IRenderTexture, downListener: (evt: any) => void): IRenderEntity {
		let btn = new ColorRectImgButton();
		btn.overColor.setRGBA4f(1.2, 1.2, 1.2, 1.0);
		btn.outColor.setRGBA4f(0.75, 0.75, 0.75, 1.0);
		btn.downColor.setRGBA4f(0.95, 0.8, 0.95, 1.0);
		btn.initialize(0, 0, tex.getWidth(), tex.getHeight(), [tex]);
		btn.setSize(tex.getWidth(), tex.getHeight());
		btn.addEventListener(MouseEvent.MOUSE_DOWN, this, downListener);
		btn.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		// pl.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
		return btn;
	}
	createTextBtnEntity(btn_name: string, width: number, height: number, fontSize: number, downListener: (evt: any) => void): IRenderEntity {

		let fontColor = new Color4(1.0,1.0,1.0, 1.0);
		let bgColor = new Color4(1.0,1.0,1.0, 0.6);
		let btn: ColorRectImgButton = null;
		if(btn_name != "") {
			btn = this.uiBuilder.createBtnWithIcon(btn_name+"awardTextBgKStr"+width +"_"+height, null, width, height, btn_name, fontSize, null, null, fontColor, bgColor);
			btn.overColor.setRGBA4f(1.0, 1.0, 1.0, 1.0);
			btn.outColor.setRGBA4f(0.75, 0.75, 0.75, 1.0);
			btn.downColor.setRGBA4f(0.95, 0.5, 0.95, 1.0);
		}else {
			btn = new ColorRectImgButton();
			btn.initialize(0,0, width, height);
			btn.overColor.setRGBA4f(0.0, 0.0, 0.0, 0.9);
			btn.outColor.copyFrom(btn.overColor);
			btn.downColor.copyFrom(btn.overColor);
		}
		btn.setSize(width, height);
		btn.addEventListener(MouseEvent.MOUSE_DOWN, this, downListener);
		btn.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		// pl.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
		return btn;
	}
	pid = 3;
}

export default RemoveBlackBG2;

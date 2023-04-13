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

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_aspParam.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
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
			this.m_aspParam.texLoader = this.m_texLoader;
			// new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			// new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
			this.m_uiSys.initialize( this.m_graph );
			this.m_fileSys.initialize(rscene, this.m_uiSys);
			this.m_uiSys.setOpeningListener((): void => {
				this.openDir();
			});

			this.m_vasScene.initialize(this.m_uiSys.ctrlui.ruisc, this.m_aspParam);
			this.m_dropController.initialize(document.body as any, this);

			this.resize( null );
		}
	}

	private m_areaRect = new AABB2D(0, 0, 1024, 512);
	private resize(evt: any): void {
		let st = this.m_rscene.getStage3D();
		let r = this.m_areaRect;
		r.setTo(0,0, 1024, 512);
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
		for(let i = 0; i < files.length; ++i) {
			if(files[i].resType == "image") {
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
		if(name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadedRes, url: ", url,", name: ", name);
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
		if(this.m_currEntity != null) {
			this.m_rscene.removeEntity(this.m_currEntity);
		}
		let tex = this.getTexByUrl(url);
		let material = new RemoveBlackBGMaterial();
		material.fixScreen = false;
		material.setTextureList([tex]);
		if(this.m_currMaterial) {
			material.paramCopyFrom( this.m_currMaterial );
		}
		tex.flipY = true;
		// let plane = new ScreenAlignPlaneEntity();
		let plane = new Plane3DEntity();
		plane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		plane.setMaterial( material );
		// plane.initialize(-1.0,-1.0, 2.0, 2.0);
		plane.initializeXOY(-0.5, -0.5, 1.0, 1.0);
		this.m_rscene.addEntity(plane, 1);
		this.m_uiSys.setCurrMaterial( material );
		this.m_fileSys.setParams(this.m_name, plane, tex);

		this.m_currEntity = plane;
		this.m_currMaterial = material;
	}
	run(): void {

		// this.m_fileSys.savingBegin();

		this.m_graph.run();

		// this.m_fileSys.savingEnd();
		this.m_fileSys.run();

	}
}
class AwardSceneParam implements IAwardSceneParam {
	texLoader: TextureResLoader = null;
	constructor(){}
	private getAssetTexByUrl(pns: string): IRenderTexture {
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
		pl.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		// pl.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
		pl.initializeXOY(x,y,w,h, [tex]);
		return pl;
	}
	createBtnEntity(tex: IRenderTexture, downListener: (evt: any) => void): IRenderEntity {
		let pl = new ColorRectImgButton();
		pl.initialize(0, 0, tex.getWidth(), tex.getHeight());
		pl.setSize(tex.getWidth(), tex.getHeight());
		pl.addEventListener(MouseEvent.MOUSE_DOWN, this, downListener);
		// pl.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		// pl.setRenderState(RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE);
		// pl.initializeXOY(x,y,w,h, [tex]);
		return pl;
	}
	pid: number = 1;
}

export default RemoveBlackBG2;

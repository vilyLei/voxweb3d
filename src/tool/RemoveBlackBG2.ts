import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import MouseEvent from "../vox/event/MouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";

import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "./base/DropFileController";
import Color4 from "../vox/material/Color4";

import { VoxAwardScene } from "./base/award/VoxAwardScene";
import IRenderEntity from "../vox/render/IRenderEntity";
import { UISystem } from "./bgtoy/ui/UISystem";
import { BGToyAwardSceneParam } from "./bgtoy/ui/BGToyAwardSceneParam";
import { ImageFileSystem } from "./bgtoy/fio/ImageFileSystem";
import URLFilter from "./base/URLFilter";
import AABB2D from "../vox/geom/AABB2D";
import EventBase from "../vox/event/EventBase";
import IFBOInstance from "../vox/scene/IFBOInstance";
import ScreenAlignPlaneEntity from "../vox/entity/ScreenAlignPlaneEntity";
import Cloud01Material from "../pixelToy/cloud/material/Cloud01Material";
import RemoveBlackBGMaterial2 from "./material/RemoveBlackBGMaterial2";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";

export class RemoveBlackBG2 {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_div: HTMLDivElement = null;
	private m_dropController = new DropFileController();
	private m_aspParam = new BGToyAwardSceneParam();
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
	private cutAlpha(value: number, s: number): void {
		s *= s;
		let atv = value - 0.5;
		let btv = 0.5 - value;
		// atv = Math.pow((value - 0.5), 1.0);
		// btv = Math.pow((0.5 - value), 1.0);
		let v = value >= 0.5 ? Math.min(atv * s + 0.5, 1.0) : Math.max(0.5 - btv * s, 0.0);
		console.log("### calc to cutAlpha(), v: ", v);
		// let max = 0;
		// console.log("### calc to less: ", Math.pow(0.98, 13));
		// console.log("### calc to greate: ", Math.pow(1.02, 13));
	}
	initialize(): void {
		let s = 2.1;
		this.cutAlpha(0.25, s);
		this.cutAlpha(0.75, s);
		console.log("RemoveBlackBG2::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");
			let rparam = this.m_graph.createRendererSceneParam();
            rparam.setCamProject(45, 0.1, 6000.0);
            rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			rparam.setAttriAlpha(true);
			// rparam.cameraPerspectiveEnabled = false;
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

			// this.initFBO();
			let tex = this.getTexByUrl("static/assets/guangyun_40.jpg");
			document.body.style.overflow = "hidden";
		}
	}
	private m_uiInited = false;
	private uiInited(): void {
		this.m_uiInited = true;
		this.m_currEntity.setVisible(this.m_uiInited);
	}
	private initSystem(): void {
		let rscene = this.m_rscene;
		const uiSys = this.m_uiSys;
		uiSys.processTotal = 6;
		// uiSys.initialize(this.m_graph, this.m_fboIns.getRTTAt(0));
		uiSys.initialize(this.m_graph, null);
		uiSys.setOpeningListener((): void => {
			this.openDir();
		});
		uiSys.setInitListener((): void => {
			this.uiInited();
		});
		this.m_fileSys.initialize(rscene, uiSys);
		uiSys.imageSelector.fileSys = this.m_fileSys;

		this.m_dropController.initialize(document.body as any, this);

		this.m_aspParam.texLoader = this.m_texLoader;
		this.m_aspParam.uiBuilder = uiSys.uiBuilder;
		this.m_aspParam.uiSys = uiSys;
		this.m_aspParam.sc = this.m_rscene;

		this.m_vasScene.initialize(uiSys.ctrlui.ruisc, this.m_aspParam);

		this.initScene();
		this.resize(null);
	}
	/*
	private m_fboIns: IFBOInstance = null;
	private m_fixPlane = new ScreenAlignPlaneEntity();
	private m_currFboEntity: IRenderEntity = null;
	private initFBO(): void {
		let rscene = this.m_rscene;
		let pw = 256;
		let ph = 256;
		if(RendererDevice.IsMobileWeb()) {
			pw = 128;
		}
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
	//*/
	private m_areaRect = new AABB2D(0, 0, 1024, 512);
	private resize(evt: any): void {
		let st = this.m_rscene.getStage3D();
		console.log("st.stageWidth, st.stageHeight: ", st.stageWidth, st.stageHeight);
		if (this.isSystemEnabled()) {
			if (this.m_uiSys) {
				let r = this.m_areaRect;
				r.setTo(0, 0, 1024, 512);
				// // r.scaleBy(this.m_rscene.getDevicePixelRatio());
				r.moveCenterTo(st.stageHalfWidth, st.stageHalfHeight);
				// r.setTo(st.stageHalfWidth - 512, st.stageHalfHeight - 256, 1024, 512);

				this.m_vasScene.updateLayout(r);
				this.m_uiSys.updateLayout(r);
			}
		}
	}
	private openDir(): void {
		const input = document.createElement("input");
		input.type = "file";
		// input.accept = "image/png, image/jpeg";
		input.addEventListener("change", () => {
			this.m_uiSys.hideSpecBtns();
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
		if (this.m_uiSys.isInited()) {
			this.m_name = name;
			this.m_uiSys.background.enable();
			this.createAEntityByTexUrl(url);
		}
	}
	private mouseDown(evt: any): void {
		// console.log("mouseDown() ...");
	}
	private m_currMaterial: RemoveBlackBGMaterial2 = null;
	private m_currEntity: Plane3DEntity = null;
	private initScene(): void {
		this.createAEntityByTexUrl("static/assets/guangyun_40.jpg");
	}
	private createAEntityByTexUrl(url: string): void {
		let sc = this.m_uiSys.background.getRScene();
		if (this.m_currEntity != null) {
			sc.removeEntity(this.m_currEntity);
		}
		let tex = this.getTexByUrl(url);
		let material = new RemoveBlackBGMaterial2();
		material.fixScreen = false;
		material.setTextureList([tex]);
		if (this.m_currMaterial) {
			material.paramCopyFrom(this.m_currMaterial);
		}
		tex.flipY = true;
		let plane = new Plane3DEntity();
		plane.transparentBlend = true;
		plane.depthAlwaysFalse = true;
		plane.setMaterial(material);
		plane.initializeXOY(-0.5, -0.5, 1.0, 1.0);
		plane.intoRendererListener = (): void => {
			let img = (tex as ImageTextureProxy).getTexData().data;
			this.m_fileSys.imageMaxSize = Math.max(img.width, img.height);
		};
		sc.addEntity(plane, 2);
		this.m_uiSys.setCurrMaterial(material);
		this.m_fileSys.setParams(this.m_name, plane, tex);

		this.m_currEntity = plane;
		this.m_currEntity.setVisible(this.m_uiInited);
		this.m_currMaterial = material;
	}
	private m_times = 4;
	private m_delay = 6;
	private isSystemEnabled(): boolean {
		return this.m_delay < 1;
	}
	private systemRun(): void {
		if (this.m_delay > 0) {
			this.m_delay--;
			if (this.m_delay == 0) {
				this.initSystem();
				document.title = "PNG Toy";
			}
		}
	}
	run(): void {
		this.m_graph.run();
		this.systemRun();
		if (this.isSystemEnabled()) {
			this.m_vasScene.run();
			this.m_fileSys.run();
		}

		// if (this.m_currFboEntity) {
		// 	if (this.m_times > 0) {
		// 		this.m_times--;
		// 		if (this.m_times == 1) {
		// 			this.m_currFboEntity = null;
		// 			this.m_fboIns.setAutoRunning(false);
		// 			this.m_rscene.removeRenderNode(this.m_fboIns);
		// 		}
		// 	}
		// }
		this.m_uiSys.background.run();
	}
}
export default RemoveBlackBG2;

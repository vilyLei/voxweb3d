import RendererDevice from "../vox/render/RendererDevice";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import MouseEvent from "../vox/event/MouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";

import RendererSceneGraph from "../vox/scene/RendererSceneGraph";

import { VoxAwardScene } from "./base/award/VoxAwardScene";
import { UISystem } from "./bgtoy/ui/UISystem";
import { BGToyAwardSceneParam } from "./bgtoy/ui/BGToyAwardSceneParam";
import { ImageFileSystem } from "./bgtoy/fio/ImageFileSystem";
import URLFilter from "../cospace/app/utils/URLFilter";
import AABB2D from "../vox/geom/AABB2D";
import EventBase from "../vox/event/EventBase";
import { Background3D } from "./bgtoy/ui/Background3D";
import { ImageFileReader } from "./bgtoy/fio/ImageFileReader";

export class RemoveBlackBG2 {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_aspParam = new BGToyAwardSceneParam();
	private m_vasScene = new VoxAwardScene();
	private m_uiSys = new UISystem();
	private m_fileSys = new ImageFileSystem();
	private m_background = new Background3D();
	private m_fileReader = new ImageFileReader();
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

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");
			let rparam = this.m_graph.createRendererSceneParam();
            rparam.setCamProject(45, 0.1, 6000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
			rparam.setAttriAlpha(true);
			// rparam.cameraPerspectiveEnabled = false;
			// rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.syncBgColor = true;

			let rscene = this.m_graph.createScene(rparam);
			rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			rscene.addEventListener(EventBase.RESIZE, this, this.resize);
			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);
			// new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			// new RenderStatusDisplay(rscene, true);

			let tex = this.getTexByUrl("static/assets/guangyun_40.jpg");
			// document.body.style.overflow = "hidden";
			this.m_background.initialize(rscene);
		}
	}
	private initSystem(): void {

		let rscene = this.m_rscene;
		const uiSys = this.m_uiSys;
		uiSys.background.bg3d = this.m_background;
		uiSys.processTotal = 6;
		uiSys.initialize(this.m_graph);

		this.m_fileSys.initialize(rscene, uiSys);
		uiSys.imageSelector.fileSys = this.m_fileSys;

		this.m_aspParam.texLoader = this.m_texLoader;
		this.m_aspParam.uiBuilder = uiSys.uiBuilder;
		this.m_aspParam.uiSys = uiSys;
		this.m_aspParam.sc = this.m_rscene;

		this.m_vasScene.initialize(uiSys.ctrlui.ruisc, this.m_aspParam);
		const fReader = this.m_fileReader;
		fReader.texLoader = this.m_texLoader;
		fReader.fileSys = this.m_fileSys;
		fReader.uiSys = this.m_uiSys;
		fReader.initialize(this.m_uiSys.background.getRScene());
		this.initScene();
		this.resize(null);


		let platform = navigator.platform as any;
		window.addEventListener("keydown", (e: any): void => {
			if ((platform && platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
				let prevent = false;
				switch(e.keyCode) {
					case 83:
						prevent = true;
						uiSys.saveImage();
						break;
					case 17:
						// ctrl + N
						prevent = true;
						break;
					case 79:
						// ctrl + O
						this.m_fileReader.openDir();
						prevent = true;
						break;
					default:
						break;
				}
				if(prevent) {
					e.preventDefault();
				}
			}
		}, false);
	}
	private initScene(): void {
	}
	private m_areaRect = new AABB2D(0, 0, 1024, 512);
	private resize(evt: any): void {

		let st = this.m_rscene.getStage3D();

		if (this.isSystemEnabled()) {
			if (this.m_uiSys) {

				let r = this.m_areaRect;
				r.setTo(0, 0, 1024, 512);
				r.moveCenterTo(st.stageHalfWidth, st.stageHalfHeight);

				this.m_vasScene.updateLayout(r);
				this.m_uiSys.updateLayout(r);
			}
		}
	}
	private mouseDown(evt: any): void {
		// console.log("mouseDown() ...");
	}
	private m_delay = 2;
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
	private m_recordeVersion = -1;
	run(): void {
		this.m_graph.run();
		this.systemRun();
		if (this.isSystemEnabled()) {
			this.m_vasScene.run();
			this.m_fileSys.run();
			let brushRec = this.m_uiSys.alphaOpUI.transparentBrush.brushRecorder;
			if(this.m_recordeVersion != brushRec.version) {
				console.log("brushRecorder changed now !!!");
				this.m_recordeVersion = brushRec.version;
			}
		}
	}
}
export default RemoveBlackBG2;

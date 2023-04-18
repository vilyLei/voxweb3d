import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import MouseEvent from "../vox/event/MouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";
import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "./base/DropFileController";

import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { CookieSystem } from "./bgtoy/fio/CookieSystem";

export class DemoCookie {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_dropController = new DropFileController();
	constructor() {}

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {
		console.log("RemoveBlackBG::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam();
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

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			// this.m_graph.setAutoRunning(true);

			this.m_dropController.initialize(document.body as any, this);

		}
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
		if(name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadedRes, url: ", url,", name: ", name);
		this.m_name = name;

	}
	private testDueTime(): boolean {
		let key = "toyCurrUserKey"
		let ck = CookieSystem.cookie;
		// ck.setItem("ck_01", "Hello world!");
		console.log('ck.hasItem("'+key+'"): ', ck.hasItem(key));
		if(ck.hasItem(key)) {
			let obj = JSON.parse( ck.getItem(key) ) as any;
			console.log("obj.user: ", obj.user);
			console.log("obj.btime: ", obj.btime);
			let dtime = Date.now() - obj.btime;
			let dayTime = 24 * 60 * 60 * 1000;
			console.log("dtime: ", dtime);
			if(dayTime < dtime) {
				console.log("大于一天");
			}else {
				console.log("小于一天");
			}
		}else {
			let jsonObj = {
				"user": "common",
				"btime": Date.now(),
			};
			let str = JSON.stringify( jsonObj );
			ck.setItem(key, str);
		}
		return false;
	}
	private mouseDown(evt: any): void {
		console.log("mouseDown() ...");
		this.testDueTime();
		// let ck = CookieSystem.cookie;
		// // ck.setItem("ck_01", "Hello world!");
		// console.log('ck.hasItem("ck_02"): ', ck.hasItem("ck_02"));
		// if(ck.hasItem("ck_02")) {
		// 	let obj = JSON.parse( ck.getItem("ck_02") ) as any;
		// 	console.log("obj.user: ", obj.user);
		// 	console.log("obj.btime: ", obj.btime);
		// 	let dtime = Date.now() - obj.btime;
		// 	let dayTime = 24 * 60 * 60 * 1000;
		// 	console.log("dtime: ", dtime);
		// 	if(dayTime < dtime) {
		// 		console.log("大于一天");
		// 	}else {
		// 		console.log("小于一天");
		// 	}
		// }else {
		// 	let jsonObj = {
		// 		"user": "lyl",
		// 		"btime": Date.now(),
		// 	};
		// 	let str = JSON.stringify( jsonObj );
		// 	ck.setItem("ck_02", str);
		// }
	}
	run(): void {
		this.m_graph.run();
	}
}
export default DemoCookie;

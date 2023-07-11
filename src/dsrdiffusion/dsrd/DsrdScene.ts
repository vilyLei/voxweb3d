// declare var SceneViewer: any;
declare var DsrdViewer: any;
import { DsrdUI } from "../dsrd/DsrdUI";
import { ModelScene } from "./rscene/ModelScene";
import { RTaskSystem } from "./task/RTaskSystem";
class DsrdScene {
	private m_viewerLayer: HTMLDivElement = null;
	// ui: DsrdUI = null;
	// taskSys: RTaskSystem = null;
	readonly rscViewer: any = null;
	readonly modelScene = new ModelScene();
	onaction: (idns: string, type: string) => void = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement): void {
		console.log("DsrdScene::initialize()......");
		this.m_viewerLayer = viewerLayer;

		// let url = "static/cospace/dsrdiffusion/scViewer/SceneViewer.umd.js";
		let url = "static/cospace/dsrdiffusion/dsrdViewer/DsrdViewer.umd.js";
		this.loadModule(url);
	}
	private init3DScene(): void {
		// let rscViewer = new SceneViewer.SceneViewer();
		let rscViewer = new DsrdViewer.DsrdViewer();

		let selfT: any = this;
		selfT.rscViewer = rscViewer;
		console.log("rscViewer: ", rscViewer);
		let debugDev = true;
		let host = location.href;
		host = host.toLowerCase();
		if (host.indexOf("diffusion") > 0) {
			debugDev = false;
		}
		rscViewer.initialize(this.m_viewerLayer, () => {}, true, debugDev, true);
		// 增加三角面数量的信息显示
		rscViewer.setForceRotate90(true);
		this.modelScene.setRSCViewer(rscViewer);
		rscViewer.setMouseUpListener((evt: any): void => {
			console.log("upupup XXX, evt: ", evt);
			if (evt.uuid == "") {
				console.log("clear model ops !!!");
			} else {
				console.log("select model ops !!!");
			}

			if (this.onaction) {
				this.onaction("select_a_model", evt.uuid);
			}
		});
		if (this.onaction) {
			this.onaction("rsc_viewer_loaded", "finish");
		}
	}
	private loadModule(purl: string): void {
		let codeLoader = new XMLHttpRequest();
		codeLoader.open("GET", purl, true);
		codeLoader.onerror = function(err) {
			console.error("loadModule error: ", err);
		};
		codeLoader.onprogress = e => {
			// this.showLoadInfo(e, codeLoader);
		};
		codeLoader.onload = () => {
			let scriptEle = document.createElement("script");
			scriptEle.onerror = e => {
				console.error("module script onerror, e: ", e);
			};
			scriptEle.innerHTML = codeLoader.response;
			document.head.appendChild(scriptEle);
			// this.loadFinish();
			this.init3DScene();
		};
		codeLoader.send(null);
	}
	run(): void {
		if (this.rscViewer) {
			this.rscViewer.run();
		}
	}
}
export { DsrdScene };

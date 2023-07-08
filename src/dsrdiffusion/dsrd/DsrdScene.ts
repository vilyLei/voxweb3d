declare var SceneViewer: any;
import { DsrdUI } from "../dsrd/DsrdUI";
import { RTaskSystem } from "./task/RTaskSystem";
class DsrdScene {
	private m_viewerLayer: HTMLDivElement = null;
	ui: DsrdUI = null;
	taskSys: RTaskSystem = null;
	rscViewer: any = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement): void {
		console.log("DsrdScene::initialize()......");
		this.m_viewerLayer = viewerLayer;

		let url = "static/cospace/dsrdiffusion/scViewer/SceneViewer.umd.js";
		this.loadModule(url);
	}
	private init3DScene(): void {
		let rscViewer = new SceneViewer.SceneViewer();
		this.rscViewer = rscViewer;
		console.log("rscViewer: ", rscViewer);
		let debugDev = true;
		let host = location.href;
		host = host.toLowerCase();
		if (host.indexOf("diffusion") > 0) {
			debugDev = false;
		}
		rscViewer.initialize(this.m_viewerLayer, () => {}, true, debugDev);
		// 增加三角面数量的信息显示
		rscViewer.setForceRotate90(true);
		this.ui.setRSCViewer(rscViewer);
		this.taskSys.setRSCViewer(rscViewer);
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
}
export { DsrdScene };

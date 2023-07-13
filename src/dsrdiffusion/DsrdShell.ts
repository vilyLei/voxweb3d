import URLFilter from "../cospace/app/utils/URLFilter";
import { DsrdScene } from "./dsrd/DsrdScene";
import { DsrdUI } from "./dsrd/DsrdUI";
import { RTaskBeginUI } from "./dsrd/RTaskBeginUI";
import { ModelScene } from "./dsrd/rscene/ModelScene";
import { RTaskSystem } from "./dsrd/task/RTaskSystem";
import { DivTool } from "./dsrd/utils/HtmlDivUtils";
import RendererDevice from "../vox/render/RendererDevice";
import DivLog from "../vox/utils/DivLog";
// declare var CURR_PAGE_ST_INFO_LIST: any;
class DsrdShell {
	private m_init = true;
	private m_rscene = new DsrdScene();
	private m_ui = new DsrdUI();
	private m_rtaskBeginUI = new RTaskBeginUI();
	private m_rtaskSys = new RTaskSystem();
	private m_modelScene: ModelScene = null;
	private m_isMobileWeb = false;
	constructor() {}
	initialize(): void {
		document.body.onload = evt => {
			this.init();
		}
	}
	private init(): void {

		console.log("DsrdShell::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			this.m_isMobileWeb = RendererDevice.IsMobileWeb();
			const rsc = this.m_rscene;
			this.m_modelScene = rsc.modelScene;
			const rtsys = this.m_rtaskSys;
			rsc.data = rtsys.data;
			const modelsc = this.m_modelScene;
			rtsys.modelScene = modelsc;

			modelsc.data = rtsys.data;
			modelsc.request = rtsys.request;
			modelsc.infoViewer = rtsys.infoViewer;
			modelsc.process = rtsys.process;
			let actioncall = (idns: string, type: string): void => {
				switch (idns) {
					case "rsc_viewer_loaded":
						let rviewer = rsc.rscViewer;
						this.m_ui.setRSCViewer(rviewer);
						// this.m_rtaskSys.setRSCViewer(rviewer);
						break;
					case "select_a_model":
						// let uuidStr = type;
						// console.log("DsrdShell::initialize() select uuidStr: ", uuidStr);
						// let rviewer = this.m_rscene.rscViewer;
						// this.m_ui.setRSCViewer(rviewer);
						// this.m_rtaskSys.setRSCViewer(rviewer);
						let panel = this.m_ui.getMaterialPanel();
						panel.setModelNamesWithUrls(this.m_rscene.selectedModelUrls);
						break;
					default:
						break;
				}
			};
			this.m_rscene.onaction = actioncall;
			this.initWorkSpace();

			let mainLoop = (now: any): void => {
				this.m_rscene.run();
				window.requestAnimationFrame(mainLoop);
			};
			window.requestAnimationFrame(mainLoop);
		}
	}
	private m_viewerLayer: HTMLDivElement = null;
	// private m_infoLayer: HTMLDivElement = null;
	private mIDV: HTMLDivElement = null;
	private initViewLayer(): void {
		let body = document.body;
		body.style.background = "#121212";
		// <link rel="prefetch" href="./page_data/data.json">
		// <link rel="preload" href="./important_data/data.json">
		let b = this.m_viewerLayer;
		b = document.createElement("div");
		let style = b.style;
		style.width = "100vw";
		style.height = "100vh";
		// style.backgroundImage = `linear-gradient(to right,#85e085 50%,#ff9999 50%)`;
		// style.backgroundImage = `linear-gradient(to right, #e66465, #9198e0)`;
		// style.backgroundImage = `linear-gradient(to bottom right, #555555, #122233)`;
		// style.backgroundImage = `linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)`;
		style.backgroundImage = `linear-gradient(to right bottom, #159957, #155799)`;
		this.elementCenter(b);
		body.appendChild(b);
		body.style.margin = "0";
		this.m_viewerLayer = b;
	}
	private initWorkSpace(): void {
		this.initViewLayer();

		// this.showInfo("init...");
		this.initDSRDUI();
	}
	private m_areaWidth = 512;
	private m_areaHeight = 512;
	private m_layoutHorizon = true;
	private createLayers(width: number, height: number): HTMLDivElement[] {
		let divs: HTMLDivElement[] = [];
		let borderWidth = 2;
		let borderHeight = 2;

		let container: HTMLDivElement;
		let layerLeft: HTMLDivElement;
		let layerRight: HTMLDivElement;
		let beginUILayer: HTMLDivElement;

		if (this.m_layoutHorizon) {
			console.log("horizon layout ...");
			this.m_areaWidth = width * 2;
			this.m_areaHeight = height;
			container = DivTool.createDivT1(0, 0, this.m_areaWidth + borderWidth * 2, this.m_areaHeight + borderHeight * 2, "block");
			layerLeft = DivTool.createDivT1(borderWidth, borderHeight, width, height, "block");
			layerRight = DivTool.createDivT1(width + borderWidth, borderHeight, width, height, "block", "absolute");
			beginUILayer = DivTool.createDivT1(borderWidth, borderHeight, this.m_areaWidth, this.m_areaHeight, "block", "absolute");
		} else {
			this.m_areaWidth = width;
			this.m_areaHeight = height * 2;
			console.log("vertical layout ...");
			container = DivTool.createDivT1(0, 0, this.m_areaWidth + borderWidth * 2, this.m_areaHeight + borderHeight * 2, "block");
			layerLeft = DivTool.createDivT1(borderWidth, borderHeight, width, height, "block");
			layerRight = DivTool.createDivT1(borderWidth, borderHeight + height, width, height, "block", "absolute");
			beginUILayer = DivTool.createDivT1(borderWidth, borderHeight, this.m_areaWidth, this.m_areaHeight, "block", "absolute");
		}

		divs.push(container);
		divs.push(layerLeft);
		divs.push(layerRight);
		divs.push(beginUILayer);

		container.appendChild(layerLeft);
		container.appendChild(layerRight);
		container.appendChild(beginUILayer);
		this.m_viewerLayer.appendChild(container);

		return divs;
	}
	private initDSRDUI(): void {
		// this.m_isMobileWeb = true;
		let width = 512;
		let height = 512;
		let divs: HTMLDivElement[] = null;
		let areaRect = this.m_viewerLayer.getBoundingClientRect();
		if (this.m_isMobileWeb) {
			let pw = Math.floor(areaRect.width);
			let ph = Math.floor(areaRect.height);
			this.m_layoutHorizon = pw > ph;
			let size = 0;
			if(pw > ph) {
				size = Math.floor(0.5 * pw);
				size = Math.min(size, ph);
			}else {
				size = Math.floor(0.5 * ph);
				size = Math.min(size, pw);
			}
			width = height = size - 4;
		}
		divs = this.createLayers(width, height);

		this.m_ui.layoutHorizon = this.m_layoutHorizon;
		// DivLog.SetDebugEnabled( true );
		// // DivLog.ShowAtTop();
		// DivLog.ShowLog("win,width: " + areaRect.width);
		// DivLog.ShowLog("work,width: " + width);
		// DivLog.ShowLog("work,height: " + height);

		let container = divs[0];
		let layerLeft = divs[1];
		let layerRight = divs[2];
		let beginUILayer = divs[3];

		let style = container.style;
		style.backgroundImage = `linear-gradient(to right bottom, #5b6f93, #1d91a5, #375283)`;

		style = layerLeft.style;
		style.backgroundColor = "#335533";
		style = layerRight.style;
		style.backgroundColor = "#5b9bd5";
		style = beginUILayer.style;
		style.backgroundImage = `linear-gradient(to right bottom, #c0e1d1, #aec7dd)`;
		style.visibility = "hidden";

		const data = this.m_rtaskSys.data;
		let actioncall = (idns: string, type: string): void => {
			switch (idns) {
				case "toWorkSpace":
					this.toWorkSpace();
					break;
				case "curr-rendering":
					console.log("actioncall(), type: ", type);
					if (type == "new") {
						this.m_rtaskBeginUI.open();
					} else if (type == "finish") {
						this.m_rtaskBeginUI.close();
					}
					break;
				case "update-rnode":
					// let rnode = data.rnode;
					// console.log("xxxx shell, rnode: ", rnode);
					// if (rnode) {
					// 	const cam = rnode.camera;
					// 	if (cam !== undefined) {
					// 		if (cam.viewAngle !== undefined && cam.near !== undefined && cam.far !== undefined) {
					// 			this.m_rscene.setCamProjectParam(cam.viewAngle, cam.near, cam.far);
					// 		}
					// 		let camMatrix = cam.matrix;
					// 		console.log("camMatrix: ", camMatrix);
					// 		if (camMatrix !== undefined) {
					// 			this.m_rscene.setCameraWithF32Arr16(camMatrix);
					// 		}
					// 	}
					// }
					this.m_rscene.updateDataWithCurrRNode();
					break;
				// case "current_rendering_begin":
				// 	this.m_rtaskBeginUI.open();
				// 	break;
				default:
					break;
			}
		};

		this.initDSRDSys(layerLeft, layerRight, width, height);

		this.m_ui.rtaskSys = this.m_rtaskSys;

		this.m_rtaskSys.initialize();
		this.m_rtaskSys.onaction = actioncall;
		this.m_rtaskSys.data.rtJsonData = this.m_ui;

		this.m_rtaskBeginUI.rtaskSys = this.m_rtaskSys;
		this.m_rtaskBeginUI.onaction = actioncall;
		if (this.m_layoutHorizon) {
			this.m_rtaskBeginUI.initialize(beginUILayer, width * 2, height);
		} else {
			this.m_rtaskBeginUI.initialize(beginUILayer, width, height * 2);
		}


		this.m_rtaskBeginUI.open();

		let win = window as any;
		let flagInfo = win["CURR_PAGE_ST_INFO_LIST"];
		// console.log("xxxxxxx flagInfo: ", flagInfo);
		if(flagInfo !== undefined) {
			this.m_rtaskBeginUI.open();
		}

		// let info = ``;
		// info += `<br/>layer.width:${Math.floor(areaRect.width)}`;
		// info += `<br/>layer.height:${Math.floor(areaRect.height)}`;
		// info += `<br/>area.width:${this.m_areaWidth}`;
		// info += `<br/>area.height:${this.m_areaHeight}`;
		// this.m_rtaskBeginUI.setInnerHTML("Welcome You" + info);
	}
	private m_workSpaceStatus = 0;
	private toWorkSpace(): void {
		this.m_ui.setTaskName(this.m_rtaskSys.data.taskname);
		if (this.m_workSpaceStatus == 0) {
			this.m_workSpaceStatus = 1;
			console.log("DsrdShell::toWorkSpace().");
			this.m_rtaskBeginUI.close();
		}
	}
	private initDSRDSys(layerLeft: HTMLDivElement, layerRight: HTMLDivElement, width: number, height: number): void {
		this.m_rscene.initialize(layerLeft);
		this.m_ui.initialize(layerRight, width, height);
		this.m_ui.setTaskName("rendering...");
	}
	private elementCenter(ele: HTMLElement, top: string = "50%", left: string = "50%", position: string = "absolute"): void {
		const s = ele.style;
		s.textAlign = "center";
		s.display = "flex";
		s.flexDirection = "column";
		s.justifyContent = "center";
		s.alignItems = "center";
	}
}
export { DsrdShell };

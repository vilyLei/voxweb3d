import URLFilter from "../cospace/app/utils/URLFilter";
import { DsrdScene } from "./dsrd/DsrdScene";
import { DsrdUI } from "./dsrd/DsrdUI";
import { RTaskBeginUI } from "./dsrd/RTaskBeginUI";
import { ModelScene } from "./dsrd/rscene/ModelScene";
import { RTaskSystem } from "./dsrd/task/RTaskSystem";
import { DivTool } from "./dsrd/utils/HtmlDivUtils";
class DsrdShell {
	private m_init = true;
	private m_rscene = new DsrdScene();
	private m_ui = new DsrdUI();
	private m_rtaskBeginUI = new RTaskBeginUI();
	private m_rtaskSys = new RTaskSystem();
	private m_modelScene: ModelScene = null;
	constructor() {}
	initialize(): void {
		console.log("DsrdShell::initialize()......");
		if (this.m_init) {
			this.m_init = false;
			this.m_modelScene = this.m_rscene.modelScene;
			const rtsys = this.m_rtaskSys;
			const modelsc = this.m_modelScene;
			rtsys.modelScene = modelsc;

			modelsc.data = rtsys.data;
			modelsc.request = rtsys.request;
			modelsc.infoViewer = rtsys.infoViewer;
			modelsc.process = rtsys.process;
			let actioncall = (idns: string, type: string): void => {
				switch (idns) {
					case "rsc_viewer_loaded":
						let rviewer = this.m_rscene.rscViewer;
						this.m_ui.setRSCViewer(rviewer);
						this.m_rtaskSys.setRSCViewer(rviewer);
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

	private initDSRDUI(): void {
		let width = 512;
		let height = 512;
		let borderWidth = 2;
		let borderHeight = 2;

		let container = DivTool.createDivT1(0, 0, width * 2 + borderWidth * 2, height + borderHeight * 2, "block");
		let style = container.style;
		// style.backgroundColor = "#2b65cb";
		// style.backgroundImage = `linear-gradient(to right bottom, #8ba6d5, #12d8fa, #79a3ef)`;
		style.backgroundImage = `linear-gradient(to right bottom, #5b6f93, #1d91a5, #375283)`;

		let layerLeft = DivTool.createDivT1(borderWidth, borderHeight, width, height, "block");
		style = layerLeft.style;
		style.backgroundColor = "#335533";
		container.appendChild(layerLeft);

		let layerRight = DivTool.createDivT1(width + borderWidth, borderHeight, width, height, "block", "absolute");
		style = layerRight.style;
		style.backgroundColor = "#5b9bd5";
		container.appendChild(layerRight);

		let beginUILayer = DivTool.createDivT1(borderWidth, borderHeight, width * 2, height, "block", "absolute");
		style = beginUILayer.style;
		style.backgroundImage = `linear-gradient(to right bottom, #c0e1d1, #aec7dd)`;
		style.visibility = "hidden";
		container.appendChild(beginUILayer);
		this.m_viewerLayer.appendChild(container);

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
					let rnode = data.rnode;
					console.log("xxxx shell, rnode: ", rnode);
					if(rnode) {
						if(rnode.camera !== undefined) {
							let camMatrix = rnode.camera.matrix;
							console.log("camMatrix: ", camMatrix);
							if(camMatrix !== undefined) {
								this.m_rscene.setCameraWithF32Arr16(camMatrix);
							}
						}
					}
					break;
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
		// this.m_rtaskBeginUI.rscene = this.m_rscene;
		this.m_rtaskBeginUI.onaction = actioncall;
		this.m_rtaskBeginUI.initialize(beginUILayer, width * 2, height);
		this.m_rtaskBeginUI.open();
	}
	private m_workSpaceStatus = 0;
	private toWorkSpace(): void {
		if (this.m_workSpaceStatus == 0) {
			this.m_workSpaceStatus = 1;
			console.log("DsrdShell::toWorkSpace().");
			this.m_rtaskBeginUI.close();
		}
	}
	private initDSRDSys(layerLeft: HTMLDivElement, layerRight: HTMLDivElement, width: number, height: number): void {
		this.m_rscene.initialize(layerLeft);
		this.m_ui.initialize(layerRight, width, height);
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

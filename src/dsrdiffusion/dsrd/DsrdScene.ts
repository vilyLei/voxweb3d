// declare var SceneViewer: any;
declare var DsrdViewer: any;
import { IDsrdSceneCtrl } from "./rscene/IDsrdSceneCtrl";
import { ModelScene } from "./rscene/ModelScene";
import { RTaskData, RTaskSystem } from "./task/RTaskSystem";
class DsrdScene implements IDsrdSceneCtrl{
	private m_viewerLayer: HTMLDivElement = null;
	private m_rscViewerInited = false;
	// ui: DsrdUI = null;
	// taskSys: RTaskSystem = null;
	readonly rscViewer: any = null;
	readonly modelScene = new ModelScene();
	data:RTaskData = null;
	onaction: (idns: string, type: string) => void = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement): void {
		console.log("DsrdScene::initialize()......");
		this.m_viewerLayer = viewerLayer;
		this.modelScene.scene = this;

		// let url = "static/cospace/dsrdiffusion/scViewer/SceneViewer.umd.js";
		let url = "static/cospace/dsrdiffusion/dsrdViewer/DsrdViewer.umd.js";
		this.loadModule(url);
	}
	private m_camParams: number[] = null;
	updateDataWithCurrRNode(): void {
		let rnode = this.data.rnode;
		console.log("xxxx shell, rnode: ", rnode);
		if (rnode) {
			const cam = rnode.camera;
			if (cam !== undefined) {
				if (cam.viewAngle !== undefined && cam.near !== undefined && cam.far !== undefined) {
					this.setCamProjectParam(cam.viewAngle, cam.near, cam.far);
				}
				let camMatrix = cam.matrix;
				console.log("camMatrix: ", camMatrix);
				if (camMatrix !== undefined) {
					this.setCameraWithF32Arr16(camMatrix);
				}
			}
		}
	}
	/**
	 * @param fov_angle_degree the default value is 45.0
	 * @param near the default value is 10.0
	 * @param far the default value is 5000.0
	 */
	setCamProjectParam(fov_angle_degree: number, near: number, far: number): void {
		if (this.m_camParams == null) {
			this.m_camParams = new Array(4);
		}
		const params = this.m_camParams;
		params[0] = fov_angle_degree;
		params[1] = near * 100.0;
		params[2] = far * 100.0;

		//const params = this.m_camParams;
		if (this.m_rscViewerInited) {
			this.rscViewer.setCamProjectParam(params[0], params[1], params[2]);
		}
	}
	private m_camvs16: number[] = null;
	setCameraWithF32Arr16(camvs16: number[]): void {
		this.m_camvs16 = camvs16;
		if (this.m_rscViewerInited && this.m_camvs16) {
			this.rscViewer.updateCameraWithF32Arr16(this.m_camvs16);
		}
	}
	private m_viewImgUrls: string[] = null;
	setViewImageUrls(urls: string[]): void {
		this.m_viewImgUrls = urls;
		if (this.m_rscViewerInited && this.m_viewImgUrls) {
			this.rscViewer.imgViewer.setViewImageUrls(this.m_viewImgUrls);
		}
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
		let releaseModule = !debugDev;
		rscViewer.initialize(
			this.m_viewerLayer,
			() => {
				this.m_rscViewerInited = true;
				if (this.m_viewImgUrls) {
					this.rscViewer.imgViewer.setViewImageUrls(this.m_viewImgUrls);
				}
				const params = this.m_camParams;
				if(params) {
					this.rscViewer.setCamProjectParam(params[0], params[1], params[2]);
				}
				if (this.m_camvs16) {
					rscViewer.updateCameraWithF32Arr16(this.m_camvs16);
				}
			},
			true,
			debugDev,
			releaseModule
		);
		// 增加三角面数量的信息显示
		rscViewer.setForceRotate90(true);
		this.modelScene.setRSCViewer(rscViewer);
		// rscViewer.setMouseUpListener((evt: any): void => {
		// 	console.log("upupup XXX, evt: ", evt);
		// 	if (evt.uuid == "") {
		// 		console.log("clear model ops !!!");
		// 	} else {
		// 		console.log("select model ops !!!");
		// 	}

		// 	if (this.onaction) {
		// 		this.onaction("select_a_model", evt.uuid);
		// 	}
		// });
		rscViewer.setModelSelectListener((urls: string[]): void => {
			console.log("setModelSelectListener(), urls: ", urls);
			this.selectedModelUrls = urls;
			if (this.onaction) {
				this.onaction("select_a_model", "finish");
			}
		});
		if (this.onaction) {
			this.onaction("rsc_viewer_loaded", "finish");
		}
	}
	selectedModelUrls: string[] = [];
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

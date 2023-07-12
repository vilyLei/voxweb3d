import { RTaskData } from "../task/RTaskData";
import { RTaskInfoViewer } from "../task/RTaskInfoViewer";
import { RTaskProcess } from "../task/RTaskProcess";
import { RTaskRquest } from "../task/RTaskRequest";
import { IDsrdSceneCtrl } from "../rscene/IDsrdSceneCtrl";

class ModelScene {
	private m_rscViewer: any = null;
	request: RTaskRquest = null;
	process: RTaskProcess = null;
	data: RTaskData = null;
	infoViewer: RTaskInfoViewer = null;
	scene: IDsrdSceneCtrl = null;
	constructor() {}
	setRSCViewer(rscViewer: any): void {
		this.m_rscViewer = rscViewer;
		console.log("ModelScene::setRSCViewer(), rscViewer: ", rscViewer);
	}
	isModelDataLoaded(): boolean {
		return this.data.modelLoadStatus == 2;
	}
	rerendering(): void {
		console.log("XXXXXXX rscViewer.imgViewer.setViewImageAlpha(0.1)");
		this.m_rscViewer.imgViewer.setViewImageAlpha(0.1);
	}
	loadModel(): boolean {

		const data = this.data;
		const process = this.process;

		if (data.modelLoadStatus == 0 && process.isModelFinish()) {
			if(process.isAllFinish() || process.isSyncModelStatus()) {
				this.infoViewer.showSpecInfo("正在载入模型数据");
			}
			data.modelLoadStatus = 1;
			let req = this.request;
			let params = "";
			let url = req.createReqUrlStr(req.taskInfoGettingUrl, "modelToDrc", 0, data.taskid, data.taskname, params);
			console.log("### ######02 loadModel(), url: ", url);
			req.sendACommonGetReq(url, (purl, content) => {
				console.log("### ###### loadDrcModels() loaded, content: ", content);
				var infoObj = JSON.parse(content);
				console.log("loadDrcModels() loaded, infoObj: ", infoObj);
				let resBaseUrl = req.getHostUrl(9090) + infoObj.filepath.slice(2);
				let statusUrl = resBaseUrl + "status.json";
				req.sendACommonGetReq(statusUrl, (pstatusUrl, content) => {
					let statusObj = JSON.parse(content);
					console.log("statusObj: ", statusObj);

					let list = statusObj.list;
					let drcsTotal = list.length;
					let drcUrls = [];
					let types = [];
					for (let i = 0; i < drcsTotal; i++) {
						let drcUrl = resBaseUrl + list[i];
						drcUrls.push(drcUrl);
						types.push("drc");
					}
					console.log("drcs list: ", list);
					console.log("drcUrls: ", drcUrls);
					data.drcNames = list.slice(0);
					const rviewer = this.m_rscViewer;
					if (rviewer != null) {
						rviewer.initSceneByUrls(
							drcUrls,
							types,
							(prog: any) => {
								console.log("3d viewer drc model loading prog: ", prog);
								if (prog >= 1.0) {
								}
							},
							200
						);
						rviewer.imgViewer.setViewImageFakeAlpha(0.1);
					}
					data.modelLoadStatus = 2;
					this.testTaskFinish();
				});
			});
			return true;
		}
		if(process.isSyncModelStatus()) {
			process.running = false;
			this.request.notifyModelInfoToSvr();
		}else if(process.isFirstRendering()) {
			this.testTaskFinish();
		}
		return false;
	}
	private testTaskFinish(): void {
		const data = this.data;
		const process = this.process;
		if (process.isAllFinish()) {
			if (!data.currentTaskAlive && this.isModelDataLoaded()) {
				data.currentTaskAlive = true;
				console.log("XXXXXXX ModelScene::testTaskFinish(), scene.setViewImageUrls(), urls: ", data.miniImgUrls);
				// this.m_rscViewer.imgViewer.setViewImageUrls(data.miniImgUrls);
				this.scene.setViewImageUrls(data.miniImgUrls);
				process.toSyncRStatus();
			}
		}
	}
}

export { ModelScene }

import { IRTaskDataParam, RTaskData } from "./RTaskData";
import { RTaskInfoViewer } from "./RTaskInfoViewer";
import { RTaskRquest } from "./RTaskRequest";
import { RTPType, RTaskProcess } from "./RTaskProcess";

class RTaskSystem {
	private m_startup = true;
	readonly process = new RTaskProcess();
	readonly data = new RTaskData();
	readonly request = new RTaskRquest();
	readonly infoViewer = new RTaskInfoViewer();

	onaction: (idns: string, type: string) => void = null;
	constructor() {}
	initialize(): void {
		this.infoViewer.data = this.data;
		this.infoViewer.process = this.process;
		this.infoViewer.initialize();
		this.request.taskInfoViewer = this.infoViewer;
		this.request.initialize();
	}
	startup(): void {
		if (this.m_startup) {
			this.m_startup = false;
			this.timerUpdate();
		}
	}
	setProcess(p: string): void {}
	setTimerDelay(delay: number): void {
		this.process.timerDelay = delay;
	}
	private m_timerId: any = -1;
	private timerUpdate(): void {
		if (this.m_timerId > -1) {
			clearTimeout(this.m_timerId);
		}
		this.m_timerId = setTimeout(this.timerUpdate.bind(this), this.process.timerDelay);
		const data = this.data;
		const process = this.process;
		if (process.running && !process.isError()) {
			switch (this.process.type) {
				case RTPType.SyncRStatus:
					this.request.notifySyncRStatusToSvr(data.taskid, data.taskname);
					break;
				case RTPType.CurrRendering:
					if (process.isAllFinish()) {
						console.log("CurrRendering, all finish.");
						process.toSyncRStatus();
					} else {
						process.running = false;
						this.request.notifyRenderingInfoToSvr(data.taskid, data.taskname);
					}
					break;
				case RTPType.FirstRendering:
					if (process.isRunning()) {
						if (process.isModelFinish()) {
							this.loadModel();
						}
						if (process.isRenderingFinish()) {
							if (!process.isModelFinish()) {
								process.toSyncModelStatus();
							}
						} else {
							process.running = false;
							this.request.notifyRenderingInfoToSvr(data.taskid, data.taskname);
						}
					} else if (process.isAllFinish()) {
						console.log("FirstRendering, all finish.");
						process.toSyncRStatus();
					}
					break;
				case RTPType.SyncModelStatus:
					if (process.isModelFinish()) {
						this.loadModel();
					} else {
						process.running = false;
						this.request.notifyModelInfoToSvr(data.taskid, data.taskname);
					}
					break;
				default:
					break;
			}

			if(this.isRTDataFinish()) {
				this.toWorkSpace();
			}
		}
	}
	private m_workSpaceStatus = 0;
	private toWorkSpace():void {
		if(this.m_workSpaceStatus == 0) {
			this.m_workSpaceStatus = 1;
			if(this.onaction) {
				this.onaction("toWorkSpace", "finish");
			}
		}
	}
	private m_rscViewer: any = null;
	setRSCViewer(rscViewer: any): void {
		this.m_rscViewer = rscViewer;
	}
	isRTDataFinish(): boolean {
		return this.data.isModelDataLoaded() &&this.process.isAllFinish();
	}
	private loadModel(): void {
		let data = this.data;
		if (data.modelLoadStatus == 0) {
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
					console.log("drcUrls: ", drcUrls);
					if(this.m_rscViewer != null) {
						this.m_rscViewer.initSceneByUrls(
							drcUrls,
							types,
							(prog: any) => {
								console.log("3d viewer drc model loading prog: ", prog);
								if (prog >= 1.0) {
									// viewerInfoDiv.innerHTML = "";
									// loadedModel = true;
								}
							},
							200
						);
						this.m_rscViewer.setViewImageUrl(data.miniImgUrl);
					}
					data.modelLoadStatus = 2;
				});
			});
		}
	}
}
export { IRTaskDataParam, RTaskData, RTaskSystem };

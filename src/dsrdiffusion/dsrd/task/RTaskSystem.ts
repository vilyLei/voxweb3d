import { IRTaskDataParam, RTaskData } from "./RTaskData";
import { RTaskInfoViewer } from "./RTaskInfoViewer";
import { RTaskRquest } from "./RTaskRequest";
import { RTPType, RTaskProcess } from "./RTaskProcess";
import { ModelScene } from "../rscene/ModelScene";

class RTaskSystem {
	private m_startup = true;
	readonly process = new RTaskProcess();
	readonly data = new RTaskData();
	readonly request = new RTaskRquest();
	readonly infoViewer = new RTaskInfoViewer();
	modelScene: ModelScene = null;
	onaction: (idns: string, type: string) => void = null;
	constructor() {}
	initialize(): void {
		this.infoViewer.data = this.data;
		this.infoViewer.process = this.process;
		this.infoViewer.initialize();
		this.request.data = this.data;
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
	updateRNode(): void {
		if (this.onaction) {
			console.log("RTaskSystem::updateRNode() ...");
			this.onaction("update-rnode", "new");
		}
	}
	private m_timerId: any = -1;
	syncRendering = false;
	private timerUpdate(): void {
		if (this.m_timerId > -1) {
			clearTimeout(this.m_timerId);
		}
		this.m_timerId = setTimeout(this.timerUpdate.bind(this), this.process.timerDelay);
		const data = this.data;
		const process = this.process;
		const modelsc = this.modelScene;
		let rtFinish = this.isRTDataFinish();

		if (process.running && !process.isError()) {
			switch (this.process.type) {
				case RTPType.SyncRStatus:
					process.running = false;
					this.request.notifySyncRStatusToSvr("", (type: string): void => {
						if (type == "current_rendering_begin") {
							this.syncRendering = true;
							if (this.onaction) {
								this.onaction("curr-rendering", "new");
							}
						}
					});
					break;
				case RTPType.CurrRendering:
					if (process.isAllFinish()) {
						console.log("CurrRendering, all finish.");
						console.log("XXXXXXX RTaskSystem::timerUpdate(), scene.setViewImageUrls(), urls: ", data.miniImgUrls);
						// this.m_rscViewer.imgViewer.setViewImageUrls(data.miniImgUrls);
						this.modelScene.scene.setViewImageUrls(data.miniImgUrls);
						if (this.onaction) {
							this.onaction("curr-rendering", "finish");
						}
						const sys = this;
						if (this.syncRendering) {
							sys.request.syncRTaskInfoFromSvr("", (jsonObj: any): void => {
								console.log("tasksys, sys.request.syncRTaskInfoFromSvr, jsonObj: ", jsonObj);
								// console.log("sys.request.syncRTaskInfoFromSvr, jsonObj.task: ", jsonObj.task);
								if (jsonObj.task !== undefined) {
									sys.data.rnode = jsonObj.task.rnode;
									sys.updateRNode();
								}
							});
						} else {
							sys.updateRNode();
						}
						process.toSyncRStatus();
					} else {
						process.running = false;
						this.request.notifyRenderingInfoToSvr();
					}
					break;
				case RTPType.FirstRendering:
					if (process.isRunning()) {
						modelsc.loadModel();
						if (process.isRenderingFinish()) {
							if (!process.isModelFinish()) {
								process.toSyncModelStatus();
							}
						} else {
							process.running = false;
							this.request.notifyRenderingInfoToSvr();
						}
					} else if (process.isAllFinish()) {
						console.log("FirstRendering, all finish.");
						modelsc.loadModel();
					}
					break;
				case RTPType.SyncModelStatus:
					modelsc.loadModel();
					break;
				default:
					break;
			}

			if (this.isRTDataFinish()) {
				// let t = this.isRTDataFinish();
				// if (rtFinish != t || this.m_preRTDataFinish != t) {
				// 	const sys = this;
				// 	if (this.syncRendering) {
				// 		sys.request.syncRTaskInfoFromSvr("", (jsonObj: any): void => {
				// 			console.log("tasksys, sys.request.syncRTaskInfoFromSvr, jsonObj: ", jsonObj);
				// 			// console.log("sys.request.syncRTaskInfoFromSvr, jsonObj.task: ", jsonObj.task);
				// 			if (jsonObj.task !== undefined) {
				// 				sys.data.rnode = jsonObj.task.rnode;
				// 				sys.updateRNode();
				// 			}
				// 		});
				// 	} else {
				// 		sys.updateRNode();
				// 	}
				// }

				this.toWorkSpace();
			}
		}
		this.m_preRTDataFinish = this.isRTDataFinish();
	}
	private m_rerenderingTimes = 0;
	rerendering(): boolean {
		console.log("RTaskSystem::rerendering(), this.isTaskAlive(): ", this.isTaskAlive());
		if (this.isTaskAlive()) {
			this.m_rerenderingTimes++;
			this.infoViewer.reset();
			this.process.toCurrRendering();
			this.request.sendRerenderingReq();
			if (this.onaction) {
				this.onaction("curr-rendering", "new");
			}
			this.modelScene.rerendering();
			return true;
		}
		return false;
	}
	private m_workSpaceStatus = 0;
	private toWorkSpace(): void {
		if (this.m_workSpaceStatus == 0) {
			this.m_workSpaceStatus = 1;
			if (this.onaction) {
				this.onaction("toWorkSpace", "finish");
			}
		}
	}
	// private m_rscViewer: any = null;
	// setRSCViewer(rscViewer: any): void {
	// 	this.m_rscViewer = rscViewer;
	// }
	private m_preRTDataFinish = false;
	isRTDataFinish(): boolean {
		return this.data.isModelDataLoaded() && this.process.isAllFinish();
	}
	isTaskAlive(): boolean {
		return this.data.isCurrTaskAlive();
	}
}
export { IRTaskDataParam, RTaskData, RTaskSystem };

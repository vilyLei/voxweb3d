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
	private m_timerId: any = -1;
	private timerUpdate(): void {
		if (this.m_timerId > -1) {
			clearTimeout(this.m_timerId);
		}
		this.m_timerId = setTimeout(this.timerUpdate.bind(this), this.process.timerDelay);
		const data = this.data;
		const process = this.process;
		const modelsc = this.modelScene;
		if (process.running && !process.isError()) {
			switch (this.process.type) {
				case RTPType.SyncRStatus:
					this.request.notifySyncRStatusToSvr();
					break;
				case RTPType.CurrRendering:
					if (process.isAllFinish()) {
						console.log("CurrRendering, all finish.");
						this.m_rscViewer.imgViewer.setViewImageUrls(data.miniImgUrls);
						process.toSyncRStatus();
						if (this.onaction) {
							this.onaction("curr-rendering", "finish");
						}
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
				this.toWorkSpace();
			}
		}
	}
	private m_rerenderingTimes = 0;
	rerendering(): void {
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
		}
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
	private m_rscViewer: any = null;
	setRSCViewer(rscViewer: any): void {
		this.m_rscViewer = rscViewer;
	}
	isRTDataFinish(): boolean {
		return this.data.isModelDataLoaded() && this.process.isAllFinish();
	}
	isTaskAlive(): boolean {
		return this.data.isCurrTaskAlive();
	}
}
export { IRTaskDataParam, RTaskData, RTaskSystem };

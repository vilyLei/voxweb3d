enum RTPType {
	None,
	FirstRendering,
	CurrRendering,
	SyncRStatus,
	SyncModelStatus,
}
class RTaskProcess {

	timerDelay = 800;
	type: RTPType = RTPType.FirstRendering;
	renderingPhase = "new";
	modelPhase = "new";
	running = true;
	constructor(){}
	updateModel(total: number): void {
		if(total > 0) {
			if(this.modelPhase != "finish") {
				this.modelPhase = "finish";
			}
		}
	}
	isAllFinish(): boolean {
		return this.isModelFinish() && this.isRenderingFinish();
	}
	isRenderingFinish(): boolean {
		let flag = this.renderingPhase == "finish";
		return flag;
	}
	isModelFinish(): boolean {
		let flag = this.modelPhase == "finish";
		return flag;
	}
	isRunning(): boolean {
		let flag = !this.isModelFinish() || !this.isRenderingFinish();
		return flag;
	}
	isError(): boolean {
		let flag = this.renderingPhase == "error" || this.renderingPhase == "rtaskerror";
		flag = flag || this.modelPhase == "error" || this.modelPhase == "rtaskerror";
		return flag;
	}
	toFirstRendering(): void {
		this.renderingPhase = "new";
		this.modelPhase = "new";
		this.type = RTPType.FirstRendering;
		console.log("RTaskProcess::toFirstRendering() ...");
	}
	isFirstRendering(): boolean {
		return this.type == RTPType.FirstRendering;
	}
	toCurrRendering(): void {
		this.renderingPhase = "new";
		this.timerDelay = 800;
		this.type = RTPType.CurrRendering;
		console.log("RTaskProcess::toCurrRendering() ...");
	}
	isCurrRendering(): boolean {
		return this.type == RTPType.CurrRendering;
	}
	toSyncRStatus(): void {
		this.timerDelay = 2500;
		this.type = RTPType.SyncRStatus;
		console.log("RTaskProcess::toSyncRStatus() ...");
	}
	isSyncRStatus(): boolean {
		return this.type == RTPType.SyncRStatus;
	}
	toSyncModelStatus(): void {
		this.modelPhase = "new";
		this.timerDelay = 1500;
		this.type = RTPType.SyncModelStatus;
		console.log("RTaskProcess::toSyncModelStatus() ...");
	}
	isSyncModelStatus(): boolean {
		return this.type == RTPType.SyncModelStatus;
	}

}
export { RTPType, RTaskProcess };

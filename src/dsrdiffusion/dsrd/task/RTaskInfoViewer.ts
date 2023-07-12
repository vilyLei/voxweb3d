import { HTTPUrl } from "../utils/HTTPUtils";
import { RTaskData } from "./RTaskData";
import { RTaskProcess } from "./RTaskProcess";

class RTaskInfoViewer {
	data: RTaskData;
	process: RTaskProcess;
	infoDiv: HTMLDivElement;
	taskStatus = 0;
	startTime = 0;
	rt_phase_times = 0;
	rt_phase = "";
	constructor() {}
	initialize(): void {}
	reset(): void {
		this.rt_phase = "";
		this.rt_phase_times = 0;
		this.taskStatus = 0;
		this.startTime = Date.now();
		this.showSpecInfo("waiting...");
	}
	private taskSuccess(): void {

	}
	private taskFailure(): void {}
	showSpecInfo(keyStr: string, times: number = -1): void {
		var div = this.infoDiv;
		// console.log("this.infoDiv: ", this.infoDiv);
		if (div != null) {
			if (times >= 0) {
				let flag = times % 3;
				switch (flag) {
					case 0:
						div.innerHTML = keyStr + "&nbsp;.&nbsp;&nbsp;";
						break;
					case 1:
						div.innerHTML = keyStr + "&nbsp;..&nbsp;";
						break;
					default:
						div.innerHTML = keyStr + "&nbsp;...";
						break;
				}
			} else {
				div.innerHTML = keyStr;
			}
		}
	}

	parseSyncRStatuReqInfo(sdo: any, callback: (type: string)=>void = null) {
		if(sdo != null) {
			const data = this.data;
			if(data.version != sdo.version) {
				console.log("$$$$$$$$$$ parseSyncRStatuReqInfo(), this.process.toCurrRendering() ...");
				data.version = sdo.version;
				data.phase = sdo.phase;
				this.process.toCurrRendering();
				this.reset();
				if(callback) {
					callback("current_rendering_begin");
				}
			}
		}
		this.process.running = true;

	}
	parseModelReqInfo(sdo: any) {
		if(sdo.drcsTotal !== undefined) {
			this.data.drcsTotal = sdo.drcsTotal;
			this.process.updateModel(this.data.drcsTotal);
		}
		this.showSpecInfo("正在载入模型数据", this.rt_phase_times++);
		this.process.running = true;
	}
	parseRenderingReqInfo(sdo: any) {
		console.log("parseRenderingReqInfo(), sdo: ", sdo);
		let status = sdo.status;

		let phase = sdo.phase;
		if (this.rt_phase != phase) {
			this.rt_phase = phase;
			this.rt_phase_times = 0;
		}
		let keyStr = "";
		let flag = false;
		if(sdo.drcsTotal !== undefined) {
			if(!this.process.isModelFinish()) {
				this.data.drcsTotal = sdo.drcsTotal;
				this.process.updateModel(this.data.drcsTotal);
			}
		}
		this.data.phase = phase;
		this.process.renderingPhase = phase;

		// very important code sentence
		this.process.running = true;
		///*
		switch (phase) {
			case "running":
				if (sdo.progress < 6) {
					this.showSpecInfo("正在解析模型数据", this.rt_phase_times);
				} else {
					this.showSpecInfo(`正在进行渲染: <b><font color="#008800">` + sdo.progress + `%</font></b>`);
				}
				flag = true;
				break;
			case "new":
				keyStr = `排队<b><font color="#880000">(` + sdo.teamIndex + "/" + sdo.teamLength + `)</font></b>等待可用的空闲渲染器`;
				this.showSpecInfo(keyStr, this.rt_phase_times);
				break;
			case "task_rendering_enter":
				if (this.rt_phase_times > 2) {
					this.showSpecInfo("配置渲染任务", this.rt_phase_times);
				} else {
					this.showSpecInfo("启动渲染任务", this.rt_phase_times);
				}
				break;
			case "task_rendering_load_res":
				// showSpecInfo("同步模型资源", rt_phase_times)
				this.showSpecInfo(`同步模型资源: <b><font color="#008800">` + sdo.progress + `%</font></b>`);
				break;
			case "task_rendering_begin":
				this.showSpecInfo("准备渲染数据", this.rt_phase_times);
				break;
			case "finish":
				if (this.taskStatus < 1) {
					this.data.version = sdo.version;
					this.taskStatus = 1;
					let sizes = sdo.sizes;
					let time_ms = Date.now() - this.startTime;
					let time_s = Math.round(time_ms / 1000.0);
					console.log("task finish, loss time: ", time_s + "s(" + time_ms + "ms), sdo.version: ", sdo.version);
					this.showSpecInfo(
						`<b><font color="#008800">` + sizes[0] + "x" + sizes[1] + `</font></b>效果图渲染完成<br/><b>(总耗时` + time_s + `s)</b>`
					);
					this.data.bgTransparent = sdo.bgTransparent == 1;
					this.data.copyFromJson(sdo);
					this.taskSuccess();
				}
				break;
			case "rtaskerror":
				if (this.taskStatus < 2) {
					this.taskStatus = 2;
					this.showSpecInfo("渲染失败(模型数据不能正确解析)");
					this.taskFailure();
					return;
				}

			case "query-re-rendering-task":
				console.log("query-re-rendering-task, status: ", status);
				if (status == 22) {
				}
				break;
			default:
				break;
		}
		// loadDrcModels(sdo.drcsTotal);
		this.rt_phase_times++;
		//*/
	}
}
export { RTaskInfoViewer };

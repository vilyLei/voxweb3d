import { HTTPUrl } from "../utils/HTTPUtils";
import { RTaskInfoViewer } from "./RTaskInfoViewer";

class RTaskRquest {
	taskReqSvrUrl = "";
	taskInfoGettingUrl = "";

	taskInfoViewer: RTaskInfoViewer;
	constructor() {}
	getDomain(url: string):string {
		var urlReg = /http:\/\/([^\/]+)/i;
		let domain = url.match(urlReg);
		return ((domain != null && domain.length > 0) ? domain[0] : "");
	}
	getHostUrl(port: number): string {
		let host = location.href;
		let domain = this.getDomain(host);
		let nsList = domain.split(":");
		host = nsList[0] + ":" + nsList[1];
		return port ? host + ":" + port + "/" : domain + "/";
	}
	initialize(): void {
		this.taskReqSvrUrl = HTTPUrl.host + "renderingTask";
		this.taskInfoGettingUrl = HTTPUrl.host + "getRTInfo";
	}
	reset(): void {}
	createReqUrlStr(svrUrl: string, phase: string, progress: number, taskId: number, taskName: string, otherInfo = ""): string {
		let url = svrUrl + "?srcType=viewer&&phase=" + phase + "&progress=" + progress + otherInfo;
		if (taskId > 0) {
			url += "&taskid=" + taskId + "&taskname=" + taskName;
		}
		return url;
	}

	sendACommonGetReq(purl: string, onload: (rurl: string, content: string) => void): void {
		let req = new XMLHttpRequest();
		req.open("GET", purl, true);
		req.onerror = function(err) {
			console.error("sendACommonGetReq(), load error: ", err);
		};
		// req.onprogress = e => { };
		req.onload = evt => {
			if (onload) {
				onload(purl, req.response);
			}
		};
		req.send(null);
	}
	notifyRenderingInfoToSvr(taskId: number, taskName: string, otherInfo = ""): void {
		let url = this.createReqUrlStr(this.taskReqSvrUrl, "queryataskrst", 0, taskId, taskName, otherInfo);
		this.sendnotifyTaskInfoReq(url);
	}
	notifyModelInfoToSvr(taskId: number, taskName: string, otherInfo = ""): void {
		let url = this.createReqUrlStr(this.taskReqSvrUrl, "queryataskrst", 0, taskId, taskName, otherInfo);
		this.sendACommonGetReq(url, (purl, content) => {
			console.log("### ###### notifyModelInfoToSvr() loaded, content: ", content);
			let sdo = JSON.parse(content);
			this.taskInfoViewer.parseRenderingReqInfo(sdo);
		})
	}
	notifySyncRStatusToSvr(taskId: number, taskName: string, otherInfo = ""): void {
		let url = this.createReqUrlStr(this.taskInfoGettingUrl, "syncAnAliveTask", 0, taskId, taskName, otherInfo);
		this.sendACommonGetReq(url, (purl, content) => {
			console.log("### ###### notifySyncRStatusToSvr() loaded, content: ", content);
			let sdo = JSON.parse(content);
			this.taskInfoViewer.parseSyncRStatuReqInfo(sdo);
		})
	}
	private sendnotifyTaskInfoReq(purl: string): void {
		let req = new XMLHttpRequest();
		req.open("GET", purl, true);
		req.onerror = function(err) {
			console.error("load error: ", err);
			console.error("服务器无法正常访问 !!!");
			return;
		};
		req.onprogress = e => {};
		req.onload = evt => {
			let sdo = JSON.parse(req.response);
			this.taskInfoViewer.parseRenderingReqInfo(sdo);
		};
		req.send(null);
	}
}
export { RTaskRquest };

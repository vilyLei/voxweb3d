import { HTTPTool, HTTPUrl } from "../utils/HTTPUtils";
import { RTaskData } from "./RTaskData";
import { RTaskInfoViewer } from "./RTaskInfoViewer";

class RTaskRquest {
	taskReqSvrUrl = "";
	taskInfoGettingUrl = "";
	uploadModelUrl = "";

	taskInfoViewer: RTaskInfoViewer;
	data: RTaskData;
	constructor() { }
	getDomain(url: string): string {
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
		this.uploadModelUrl = HTTPUrl.host + "uploadRTData";
	}
	reset(): void { }

	updatePage(): void {
		HTTPTool.updatePage();
	}
	// getRenderingParams(otherParams: string): string {
	// 	let rimgSizes = [512, 512];
	// 	let params = "&sizes=" + rimgSizes;
	// 	// params += getCameraDataParam();
	// 	params += "&rtBGTransparent=" + (this.data.bgTransparent ? "1" : "0");
	// 	if (otherParams != "") {
	// 		params += otherParams;
	// 	}
	// 	return params;
	// }
	createReqUrlStr(svrUrl: string, phase: string, progress: number, taskId: number, taskName: string, otherInfo = ""): string {
		let url = svrUrl + "?srcType=viewer&&phase=" + phase + "&progress=" + progress + otherInfo;
		if (taskId > 0) {
			url += "&taskid=" + taskId + "&taskname=" + taskName;
		}
		return url;
	}
	/**
	 * 对当前的任务重新发起渲染
	 * @param otherInfo
	 */
	sendRerenderingReq(otherInfo = "", forceMaterial = false): void {
		console.log("sendRerenderingReq(), re-rendering req send !!!");
		const data = this.data;
		let keyNames = ["output", "env", "camera"];
		let rtdj = this.data.rtJsonData;
		let keyName = "material";
		console.log("rtdj.isRTJsonActiveByKeyName(", keyName, "): ", rtdj.isRTJsonActiveByKeyName(keyName));
		if (rtdj.isRTJsonActiveByKeyName(keyName) || forceMaterial) {
			keyNames.push(keyName);
		}
		let rnodeJson = rtdj.getRTJsonStrByKeyNames(keyNames, true);
		let rnodeJsonObj = JSON.parse(rnodeJson);
		this.data.rnode = rnodeJsonObj;
		console.log("rnodeJson: \n", rnodeJson);
		otherInfo += "&rnode=" + rnodeJson;
		let url = this.createReqUrlStr(this.taskReqSvrUrl, "query-re-rendering-task", 0, data.taskid, data.taskname, otherInfo);
		this.sendnotifyTaskInfoReq(url);
	}
	sendUploadReq(fileObj: any, completeCall: (evt: any) => void, toUploadFailure: (evt: any, type: string) => void, progressCall: (evt: any) => void, onloadstart: (evt: any) => void): void {

		// let rnodeJson = this.data.rtJsonData.getRTJsonStrByKeyName("camera");
		let rnodeJson = this.data.rtJsonData.getRTJsonStrByKeyNames(["output", "env", "camera"], true);
		// console.log("rnodeJson: \n", rnodeJson);
		// let url = this.uploadModelUrl + "?srcType=viewer&phase=newrtask" + this.getRenderingParams("");
		let url = this.uploadModelUrl + "?srcType=viewer&phase=newrtask&rnode=" + rnodeJson;
		let form = new FormData();
		form.append("file", fileObj);

		let xhr = new XMLHttpRequest();
		xhr.open("post", url, true);
		console.log("uploadAndSendRendering(), form url: ", url);
		console.log("uploadAndSendRendering(), form fileObj: ", fileObj);
		xhr.onload = evt => {
			completeCall(evt);
		};
		xhr.onerror = evt => {
			toUploadFailure(evt, "upload_net_failed");
		};

		xhr.upload.onprogress = evt => {
			progressCall(evt);
		};
		xhr.upload.onloadstart = evt => {
			onloadstart(evt);
		};

		xhr.send(form);
	}
	sendACommonGetReq(purl: string, onload: (rurl: string, content: string) => void): void {
		let req = new XMLHttpRequest();
		req.open("GET", purl, true);
		req.onerror = function (err) {
			console.error("sendACommonGetReq(), load error: ", err);
		};
		// req.onprogress = e => { };
		req.onload = evt => {
			if (onload) {
				onload(purl, req.response);
			}
		};
		req.onerror = evt => {
			console.error("sendACommonGetReq(), error: ", evt);
		}
		req.send(null);
	}
	notifyRenderingInfoToSvr(otherInfo = ""): void {
		const data = this.data;
		let url = this.createReqUrlStr(this.taskReqSvrUrl, "queryataskrst", 0, data.taskid, data.taskname, otherInfo);
		this.sendnotifyTaskInfoReq(url);
	}
	notifyModelInfoToSvr(otherInfo = ""): void {
		const data = this.data;
		let url = this.createReqUrlStr(this.taskReqSvrUrl, "queryataskrst", 0, data.taskid, data.taskname, otherInfo);
		this.sendACommonGetReq(url, (purl, content) => {
			console.log("### ###### notifyModelInfoToSvr() loaded, content: ", content);
			let sdo = JSON.parse(content);
			this.taskInfoViewer.parseModelReqInfo(sdo);
		})
	}
	notifySyncRStatusToSvr(otherInfo = "", callback: (type: string)=>void = null): void {
		const data = this.data;
		let url = this.createReqUrlStr(this.taskInfoGettingUrl, "syncAnAliveTask", 0, data.taskid, data.taskname, otherInfo);
		this.sendACommonGetReq(url, (purl, content) => {
			// console.log("### ###### notifySyncRStatusToSvr() loaded, content: ", content);
			let sdo = JSON.parse(content);
			this.taskInfoViewer.parseSyncRStatuReqInfo(sdo, callback);
		});
	}
	syncRTaskInfoFromSvr(otherInfo = "", call: (jsonObj: any) => void): void {
		const data = this.data;
		let url = this.createReqUrlStr(this.taskInfoGettingUrl, "syncAnAliveTaskInfo", 0, data.taskid, data.taskname, otherInfo);
		this.sendACommonGetReq(url, (purl, content) => {
			console.log("### ###### syncRTaskInfoFromSvr() loaded, content: ", content);
			let sdo = JSON.parse(content);
			if(call) {
				call(sdo);
			}
		});
	}
	private sendnotifyTaskInfoReq(purl: string): void {
		let req = new XMLHttpRequest();
		req.open("GET", purl, true);
		req.onerror = function (err) {
			console.error("load error: ", err);
			console.error("服务器无法正常访问 !!!");
			return;
		};
		req.onprogress = e => { };
		req.onload = evt => {
			let sdo = JSON.parse(req.response);
			this.taskInfoViewer.parseRenderingReqInfo(sdo);
		};
		req.send(null);
	}

	syncAliveTasks(callback: (aliveTasks: any[]) => void): void {
		let url = this.createReqUrlStr(this.taskInfoGettingUrl, "syncAliveTasks", 0, 0, "none");
		console.log("### ###### 01 syncAliveTasks(), url: ", url);
		this.sendACommonGetReq(url, (purl, content) => {
			console.log("### ###### 02 syncAliveTasks(), content: ", content);
			var infoObj = JSON.parse(content);
			let aliveTasks = infoObj.tasks;
			callback(aliveTasks);
			console.log("### ###### 03 syncAliveTasks(), infoObj: ", infoObj);
		}
		);
	}
}
export { RTaskRquest };

import { IItemData } from "./ui/IItemData";
import { ButtonDivItem } from "./ui/ButtonDivItem";

class RModelUploadingUI {
	private m_viewerLayer: HTMLDivElement = null;
	private m_areaWidth = 512;
	private m_areaHeight = 512;
	private m_time = 0;
	private m_resLoaded = 0;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number): void {
		console.log("RModelUploadingUI::initialize()......");
		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;
	}
	uploadFile(file: any): void {
		this.initUI();
		this.uploadAndSendRendering(file);
	}
	private initUI(): void {
		let pw = 320;
		let ph = 300;
		let px = (this.m_areaWidth - pw) * 0.5;
		let py = 150;
		let div = this.createDiv(px, py, pw, 300, "absolute", false);
		let style = div.style;
		style.textAlign = "center";
		style.display = "block";
		this.m_viewerLayer.appendChild(div);
		div.innerHTML = "uploading...";
	}
	private getRenderingParams(otherParams: string): string {
		let rtBGTransparent = false;
		let rimgSizes = [512, 512];
		let params = "&sizes=" + rimgSizes;
		// params += getCameraDataParam();
		params += "&rtBGTransparent=" + (rtBGTransparent ? "1" : "0");
		if (otherParams != "") {
			params += otherParams;
		}
		return params;
	}
	private uploadComplete(evt: any): void {
		let str = evt.target.responseText + "";
		console.log("evt.target.responseText: ", str);
		var data = JSON.parse(str);
		console.log("josn obj data: ", data);
		if (data.success) {
			// setTaskJsonData(data);
			console.log("上传成功！");
			// 立即发起一次渲染，获取缩略图和模型数据
			// alert("上传成功！");
			// this.reqstUpdate();
		} else {
			alert("上传失败！");
		}
	}

	private uploadFailed(evt: any): void {
		alert("上传失败！");
	}

	private progressFunction(evt: any): void {
		// var progressBar = document.getElementById("progressBar");
		// var percentageDiv = document.getElementById("percentage");

		if (evt.lengthComputable) {
			// progressBar.max = evt.total;
			// progressBar.value = evt.loaded;
			// percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
			let proStr = Math.round((evt.loaded / evt.total) * 100) + "%";
		}
		var time = document.getElementById("time");
		var nt = new Date().getTime();
		var pertime = (nt - this.m_time) / 1000;
		this.m_time = new Date().getTime();
		var perload = evt.loaded - this.m_resLoaded;
		this.m_resLoaded = evt.loaded;

		var speed = perload / pertime;
		var bspeed = speed;
		var units = "B/s";
		if (speed / 1024 > 1) {
			speed = speed / 1024;
			units = "K/s";
		}
		if (speed / 1024 > 1) {
			speed = speed / 1024;
			units = "M/s";
		}
		let speedStr = speed.toFixed(1);
		var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
		// time.innerHTML = '上传速度：' + speedStr + units + '，剩余时间：' + resttime + 's';
		// if (bspeed == 0) time.innerHTML = '上传已取消';
	}
	private uploadAndSendRendering(fileObj: any): void {
		if (fileObj == null) {
			return;
		}
		let hostUrl = "/";
		// let startTime = Date.now();
		let camdvs: number[] = [];
		let camParam = "&camdvs=[" + camdvs + "]";
		console.log("camParam: ", camParam);
		var url = hostUrl + "uploadRTData?srcType=viewer&phase=newrtask" + this.getRenderingParams(camParam);
		if (!fileObj) {
			alert("the file dosen't exist !!!");
			this.updatePage();
			return;
		}
		let fileSize = Math.floor(fileObj.size / (1024 * 1024));
		let maxSize = 30;
		if (fileSize > maxSize) {
			alert("模型文件超过" + maxSize + "M, 带宽太小暂时不支持 !!!");
			this.updatePage();
			return;
		}
		var form = new FormData();
		form.append("file", fileObj);

		let xhr = new XMLHttpRequest();
		xhr.open("post", url, true);
		xhr.onload = evt => {
			this.uploadComplete(evt);
		};
		xhr.onerror = evt => {
			this.uploadFailed(evt);
		};

		xhr.upload.onprogress = evt => {
			this.progressFunction(evt);
		};
		xhr.upload.onloadstart = evt => {
			this.m_time = new Date().getTime();
			this.m_resLoaded = 0;
		};

		xhr.send(form);
		fileObj = null;
	}
	private updatePage(): void {
		location.reload();
	}
	private clearDivAllEles(div: HTMLDivElement): void {
		(div as any).replaceChildren();
	}
	private createDiv(px: number, py: number, pw: number, ph: number, position = "", center: boolean = true, display = ""): HTMLDivElement {
		const div = document.createElement("div");
		let style = div.style;
		style.left = px + "px";
		style.top = py + "px";
		style.width = pw + "px";
		style.height = ph + "px";
		if (display != "") {
			style.display = "flex";
		}
		if (center) {
			style.alignItems = "center";
			style.justifyContent = "center";
		}
		style.position = "relative";
		if (position != "") {
			style.position = position;
		}
		return div;
	}
}
export { RModelUploadingUI };

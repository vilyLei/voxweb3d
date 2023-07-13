import { HTMLViewerLayer } from "./base/HTMLViewerLayer";
import { IRTaskDataParam, RTaskSystem } from "./task/RTaskSystem";
import { IItemData } from "./ui/IItemData";
import { ButtonDivItem } from "./ui/button/ButtonDivItem";
import { HTTPTool, HTTPUrl } from "./utils/HTTPUtils";
import { DivTool } from "./utils/HtmlDivUtils";

class RModelUploadingUI {
	private m_viewerLayer: HTMLDivElement = null;
	private m_areaWidth = 512;
	private m_areaHeight = 512;
	private m_time = 0;
	private m_resLoaded = 0;
	// private m_infoDiv: HTMLDivElement = null;
	private m_textViewer: HTMLViewerLayer = null;
	onaction: (idns: string, type: string) => void = null;
	rtaskSys: RTaskSystem = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number): void {
		console.log("RModelUploadingUI::initialize()......");
		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;
	}
	uploadFile(file: any): void {
		this.m_time = new Date().getTime() - 100;
		this.m_resLoaded = 0;
		this.initUI();
		this.uploadAndSendRendering(file);
	}
	open(): void {}
	close(): void {}
	initUI(): void {
		this.open();

		if (this.m_textViewer == null) {
			let div = DivTool.createDiv(320, 300);
			this.m_viewerLayer.appendChild(div);
			let v = new HTMLViewerLayer(div);
			v.setTextAlign("center");
			v.layoutToCenter();
			this.m_textViewer = v;
		} else {
			this.m_textViewer.show();
		}
		this.m_textViewer.setInnerHTML("uploading...");
		// this.progressCall({ lengthComputable: true, loaded: 100, total: 50000 });
		// this.toUploadFailure("...");
	}
	setInnerHTML(htmlStr: string): void {
		if (this.m_textViewer == null) {
			this.initUI();
		}
		this.m_textViewer.setInnerHTML( htmlStr );
	}
	getTextDiv(): HTMLDivElement {
		return this.m_textViewer.getDiv();
	}
	private completeCall(evt: any): void {
		let str = evt.target.responseText + "";
		console.log("evt.target.responseText: ", str);
		let data: IRTaskDataParam = null;
		try {
			data = JSON.parse(str);
			console.log("josn obj data: ", data);
		}catch(e) {
			data = {success:false} as any;
			console.error("josn parsing error: ", e);
		}
		let type = "upload_success";
		if (data.success) {
			// setTaskJsonData(data);
			console.log("上传成功！");
			const sys = this.rtaskSys;
			sys.process.toFirstRendering();
			sys.data.copyFromJson( data );
			sys.infoViewer.reset();
			sys.infoViewer.infoDiv = this.getTextDiv();
			sys.startup();
			// if (this.onaction) {
			// 	this.onaction("uploading_success", type);
			// }
		} else {
			// alert("上传失败！");
			console.log("上传失败！");
			type = "upload_svr_failed";
			this.toUploadFailure(type);
		}
	}
	private m_backBtn: ButtonDivItem = null;
	private toUploadFailure(type: string): void {
		// alert("上传失败！");
		this.m_textViewer.setInnerHTML("上传失败...");

		let pw = 80;
		let ph = 50;
		let px = (this.m_areaWidth - pw) * 0.5;
		let py = (this.m_areaHeight - ph) * 0.5 + 20;

		let btn = this.m_backBtn;
		if (btn == null) {
			let btnDiv = DivTool.createDivT1(px, py, pw, ph, "flex", "absolute", true);
			let colors = [0x157c73, 0x156a85, 0x15648b];
			this.m_viewerLayer.appendChild(btnDiv);
			btn = new ButtonDivItem();
			btn.setDeselectColors(colors);
			btn.initialize(btnDiv, "返回", "upload_back");
			btn.onmouseup = evt => {
				let currEvt = evt as any;
				console.log("button_idns: ", currEvt.button_idns);
				btn.hide();
				this.m_textViewer.clearInnerHTML();
				this.m_textViewer.hide();
				if (this.onaction) {
					this.onaction(currEvt.button_idns, type);
				}
			};
			btn.setTextColor(0xeeeeee);
			this.m_backBtn = btn;
		}
		btn.show();

		// if (this.onaction) {
		// 	this.onaction("uploading_failed", type);
		// }
	}

	private progressCall(evt: any): void {
		let proStr = "0%";
		if (evt.lengthComputable) {
			console.log("evt.loaded / evt.total: ", evt.loaded / evt.total);
			proStr = Math.round((evt.loaded / evt.total) * 100) + "%";
		}
		var t = new Date().getTime();
		var pertime = (t - this.m_time) / 1000;
		this.m_time = new Date().getTime();
		var perload = evt.loaded - this.m_resLoaded;
		this.m_resLoaded = evt.loaded;

		var speed = perload / pertime;
		var bspeed = speed;
		var unit = "B/s";
		if (speed / 1024 > 1) {
			speed = speed / 1024;
			unit = "K/s";
		}
		if (speed / 1024 > 1) {
			speed = speed / 1024;
			unit = "M/s";
		}
		let speedStr = speed.toFixed(1) + unit;
		let restTime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
		// this.m_infoDiv.innerHTML = "uploading " + proStr + "<br/>" + speedStr + "<br/>rest time: " + restTime + "s";
		let html = "uploading " + proStr + "<br/>" + speedStr + "<br/>rest time: " + restTime + "s";
		this.m_textViewer.setInnerHTML(html);
	}
	private uploadAndSendRendering(fileObj: any): void {

		if (fileObj == null) {
			return;
		}

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
		let req = this.rtaskSys.request;
		//sendUploadReq(fileObj: any, completeCall: (evt: any) => void, toUploadFailure: (evt: any, type: string) => void, progressCall: (evt: any) => void, onloadstart: (evt: any) => void): void {
		req.sendUploadReq(
			fileObj,
			(evt: any): void => {
				this.completeCall(evt);
			},
			(evt: any, type): void => {
				this.toUploadFailure("upload_net_failed");
			},
			(evt: any): void => {
				this.progressCall(evt);
			},
			(evt: any): void => {
				this.m_time = new Date().getTime();
				this.m_resLoaded = 0;
			}
		)
		fileObj = null;
	}
	private updatePage(): void {
		HTTPTool.updatePage();
	}
}
export { RModelUploadingUI };

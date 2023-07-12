import { IItemData } from "./ui/IItemData";
import { ButtonDivItem } from "./ui/button/ButtonDivItem";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "../../tool/base/DropFileController";
import { RModelUploadingUI } from "./RModelUploadingUI";
import { DivTool } from "./utils/HtmlDivUtils";
import { RTaskSystem } from "./task/RTaskSystem";
import { DsrdScene } from "../dsrd/DsrdScene";

class RTaskBeginUI {
	private m_viewerLayer: HTMLDivElement = null;
	private m_areaWidth = 512;
	private m_areaHeight = 512;

	private m_uploadModelBtn: ButtonDivItem = null;
	private m_openTasksListBtn: ButtonDivItem = null;
	private m_dropController = new DropFileController();
	private m_uploadUI = new RModelUploadingUI();
	onaction: (idns: string, type: string) => void = null;
	rtaskSys: RTaskSystem = null;
	// rscene: DsrdScene = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number): void {
		console.log("RTaskBeginUI::initialize()......");
		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;
		this.buildBtns(this.m_viewerLayer);

		this.m_dropController.geomModelKeys.push("glb", "usdz", "usdc", "blend", "bld");
		this.m_dropController.createObjectURLEnabled = false;
		this.m_dropController.initialize(viewerLayer, this);
		this.m_uploadUI.rtaskSys = this.rtaskSys;
		this.m_uploadUI.initialize(this.m_viewerLayer, areaWidth, areaHeight);
		// this.m_uploadUI.onaction = this.onaction;
		this.m_uploadUI.onaction = (idns: string, type: string): void => {
			switch (idns) {
				case "upload_back":
					this.m_uploadModelBtn.setVisible(true);
					this.m_openTasksListBtn.setVisible(true);
					break;
			}
		};
	}

	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		console.log("initFileLoad(), files: ", files);
		this.m_uploadModelBtn.setVisible(false);
		this.m_openTasksListBtn.setVisible(false);
		this.m_uploadUI.uploadFile(files[0].file);
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}
	openDir(): void {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".glb,.fbx,.obj,.usdz,.usdc,.blend,.bld";
		input.addEventListener("change", () => {
			let files = Array.from(input.files);
			this.m_dropController.initFilesLoad(files);
		});
		input.click();
	}

	showTasksList(aliveTasks: any[]): void {
		this.m_uploadModelBtn.setVisible(false);
		this.m_openTasksListBtn.setVisible(false);
		this.buildTasksList(aliveTasks);
	}
	private m_tasksListDiv: HTMLDivElement = null;
	private m_backFromTaskListBtn: ButtonDivItem = null;
	private gotoAliveTask(data: any): void {
		console.log("gotoAliveTask(), data: ", data);
		const sys = this.rtaskSys;
		sys.data.copyFromJson(data);
		// if (sys.data.isFinish()) {
		// 	sys.process.toSyncRStatus();
		// }else {
		// 	sys.process.toFirstRendering();
		// }
		sys.process.toFirstRendering();

		sys.infoViewer.reset();
		this.m_uploadUI.initUI();
		sys.infoViewer.infoDiv = this.m_uploadUI.getTextDiv();
		sys.startup();
		sys.request.syncRTaskInfoFromSvr("", (jsonObj: any): void => {
			console.log("sys.request.syncRTaskInfoFromSvr, jsonObj: ", jsonObj);
			console.log("sys.request.syncRTaskInfoFromSvr, jsonObj.task: ", jsonObj.task);
			if(jsonObj.task !== undefined) {
				sys.data.rnode = jsonObj.task.rnode;
				console.log("sys.request.syncRTaskInfoFromSvr, sys.data.rnode: ", sys.data.rnode);
				sys.updateRNode();
			}
		});
		// if (this.onaction) {
		// 	this.onaction("uploading_success", type);
		// }

		this.m_tasksListDiv.style.visibility = "hidden";
		this.m_backFromTaskListBtn.setVisible(false);
	}
	private backFromTasksList(): void {
		this.m_tasksListDiv.style.visibility = "hidden";
		this.m_backFromTaskListBtn.setVisible(false);

		this.m_uploadModelBtn.setVisible(true);
		this.m_openTasksListBtn.setVisible(true);
	}
	buildTasksList(aliveTasks: any[]): void {
		let div = this.m_tasksListDiv;
		if (div == null) {
			let pw = 320;
			let ph = 300;
			let px = (this.m_areaWidth - pw) * 0.5;
			let py = 50;

			this.m_tasksListDiv = DivTool.createDivT1(px, py, pw, 300, "flex", "absolute", false);
			div = this.m_tasksListDiv;
			let style = div.style;
			style.textAlign = "center";
			style.display = "block";
			this.m_viewerLayer.appendChild(div);

			pw = 80;
			ph = 50;
			px = (this.m_areaWidth - pw) * 0.5;
			py = this.m_areaHeight - ph - 20;

			let btnDiv = DivTool.createDivT1(px, py, pw, ph, "flex", "absolute", true);
			let colors = [0x157c73, 0x156a85, 0x15648b];
			this.m_viewerLayer.appendChild(btnDiv);
			let btn = new ButtonDivItem();
			btn.setDeselectColors(colors);
			btn.initialize(btnDiv, "返回", "back_from_tasks_list");
			btn.onmouseup = evt => {
				let currEvt = evt as any;
				console.log("button_idns: ", currEvt.button_idns);
				this.backFromTasksList();
			};
			this.m_backFromTaskListBtn = btn;
			btn.setTextColor(0xeeeeee);
		}
		this.m_tasksListDiv.style.visibility = "visible";
		this.m_backFromTaskListBtn.setVisible(true);
		DivTool.clearDivAllEles(div);
		let total = aliveTasks.length;
		for (let i = 0; i < total; ++i) {
			let br = document.createElement("br");
			div.appendChild(br);

			let link = document.createElement("a");
			link.innerHTML = `渲染任务<<b><font color="#008800">${aliveTasks[i].taskname}</font></b>>`;
			link.href = "#";
			link.addEventListener("click", () => {
				this.gotoAliveTask(aliveTasks[i]);
			});
			div.appendChild(link);
			br = document.createElement("br");
			div.appendChild(br);
		}
		let br = document.createElement("br");
		div.appendChild(br);
		br = document.createElement("br");
		div.appendChild(br);
	}
	private buildBtns(container: HTMLDivElement): void {
		let colors = [0x157c73, 0x156a85, 0x15648b];
		let pw = 150;
		let ph = 60;
		let disX = 50;
		let px = (this.m_areaWidth - (2 * pw + disX)) * 0.5;
		let py = (this.m_areaHeight - 2 * ph) * 0.5 + 30;
		let div = DivTool.createDivT1(px, py, pw, ph, "flex", "absolute", true);
		container.appendChild(div);
		let btn = new ButtonDivItem();
		btn.setDeselectColors(colors);
		btn.initialize(div, "新建渲染任务", "upload_model");
		btn.applyColorAt(0);
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
			this.openDir();
		};
		btn.setTextColor(0xeeeeee);
		this.m_uploadModelBtn = btn;

		div = DivTool.createDivT1(px + disX + pw, py, pw, ph, "flex", "absolute", true);
		container.appendChild(div);
		btn = new ButtonDivItem();
		btn.setDeselectColors(colors);
		btn.initialize(div, "打开任务列表", "open_task_list");
		btn.applyColorAt(0);
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
			let req = this.rtaskSys.request;
			req.syncAliveTasks((aliveTasks: any[]): void => {
				console.log("aliveTasks: ", aliveTasks);
				if (aliveTasks && aliveTasks.length > 0) {
					this.showTasksList(aliveTasks);
				} else {
					alert("没有可操作的其他渲染任务");
				}
			});
		};
		btn.setTextColor(0xeeeeee);
		this.m_openTasksListBtn = btn;
	}

	open(): void {
		this.m_viewerLayer.style.visibility = "visible";
	}
	close(): void {
		this.m_viewerLayer.style.visibility = "hidden";
	}
}
export { RTaskBeginUI };

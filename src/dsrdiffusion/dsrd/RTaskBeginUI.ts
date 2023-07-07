import { IItemData } from "./ui/IItemData";
import { ButtonDivItem } from "./ui/ButtonDivItem";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "../../tool/base/DropFileController";
import { RModelUploadingUI } from "./RModelUploadingUI";

class RTaskBeginUI {
	private m_viewerLayer: HTMLDivElement = null;
	private m_areaWidth = 512;
	private m_areaHeight = 512;

	private m_uploadModelBtn: ButtonDivItem = null;
	private m_openTasksListBtn: ButtonDivItem = null;
	private m_dropController = new DropFileController();
	private m_uploadUI = new RModelUploadingUI();
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number): void {
		console.log("RTaskBeginUI::initialize()......");
		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;
		this.buildBtns(this.m_viewerLayer);

		this.m_dropController.geomModelKeys.push("glb", "usdz", "usdc", "blend", "bld");
		this.m_dropController.initialize(viewerLayer, this);
		this.m_uploadUI.initialize(this.m_viewerLayer, areaWidth, areaHeight);
	}

	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
		console.log("initFileLoad(), files: ", files);
		this.m_uploadModelBtn.setVisible(false);
		this.m_openTasksListBtn.setVisible(false);
		this.m_uploadUI.uploadFile(files[0]);
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
	private updatePage(): void {
		location.reload();
	}

	private clearDivAllEles(div: HTMLDivElement): void {
		(div as any).replaceChildren();
	}
	showTasksList(): void {
		this.m_uploadModelBtn.setVisible(false);
		this.m_openTasksListBtn.setVisible(false);
		this.buildTasksList();
	}
	private m_tasksListDiv: HTMLDivElement = null;
	private m_backFromTaskListBtn: ButtonDivItem = null;
	private gotoAliveTaskAt(index: number): void {}
	private backFromTasksList(): void {

		this.m_tasksListDiv.style.visibility = "hidden";
		this.m_backFromTaskListBtn.setVisible(false);

		this.m_uploadModelBtn.setVisible(true);
		this.m_openTasksListBtn.setVisible(true);
	}
	buildTasksList(): void {
		let div = this.m_tasksListDiv;
		if (div == null) {
			let pw = 320;
			let ph = 300;
			let px = (this.m_areaWidth - pw) * 0.5;
			let py = 50;

			this.m_tasksListDiv = this.createDiv(px, py, pw, 300, "absolute", false);
			div = this.m_tasksListDiv;
			let style = div.style;
			style.textAlign = "center";
			style.display = "block";
			this.m_viewerLayer.appendChild(div);

			pw = 80;
			ph = 50;
			px = (this.m_areaWidth - pw) * 0.5;
			py = this.m_areaHeight - ph - 20;
			let btnDiv = this.createDiv(px, py, pw, ph, "absolute", true);

			let colors = [0x157c73, 0x156a85, 0x15648b];
			this.m_viewerLayer.appendChild(btnDiv);
			let btn = new ButtonDivItem();
			btn.setDeselectColors(colors);
			btn.initialize(btnDiv, pw, ph, "返回", "back_from_tasks_list");
			btn.applyColorAt(0);
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
		this.clearDivAllEles(div);
		let total = 8;
		for (let i = 0; i < total; ++i) {
			let br = document.createElement("br");
			div.appendChild(br);

			let link = document.createElement("a");
			link.innerHTML = "选择第<" + (i + 1) + ">个渲染任务: " + "vkTask-" + i;
			link.href = "#";
			link.addEventListener("click", () => {
				this.gotoAliveTaskAt(i);
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
		let div = this.createDiv(px, py, pw, ph, "absolute", true);
		container.appendChild(div);
		let btn = new ButtonDivItem();
		btn.setDeselectColors(colors);
		btn.initialize(div, pw, ph, "上传渲染模型", "upload_model");
		btn.applyColorAt(0);
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
			this.openDir();
		};
		btn.setTextColor(0xeeeeee);
		this.m_uploadModelBtn = btn;

		div = this.createDiv(px + disX + pw, py, pw, ph, "absolute", true);
		container.appendChild(div);
		btn = new ButtonDivItem();
		btn.setDeselectColors(colors);
		btn.initialize(div, pw, ph, "打开任务列表", "open_task_list");
		btn.applyColorAt(0);
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
			this.showTasksList();
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
	private createDiv(px: number, py: number, pw: number, ph: number, position = "", center: boolean = true): HTMLDivElement {
		const div = document.createElement("div");
		let style = div.style;
		style.left = px + "px";
		style.top = py + "px";
		style.width = pw + "px";
		style.height = ph + "px";
		style.display = "flex";
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
export { RTaskBeginUI };

import { IItemData } from "./ui/IItemData";
import { IRTJsonData } from "./data/IRTJsonData";
import { SettingDataPanel } from "./ui/SettingDataPanel";
import { OutputDataPanel } from "./ui/OutputDataPanel";
import { EnvDataPanel } from "./ui/EnvDataPanel";
import { CameraDataPanel } from "./ui/CameraDataPanel";
import { MaterialDataPanel } from "./ui/MaterialDataPanel";
import { RenderingSettingItem } from "./ui/RenderingSettingItem";
import { LightDataPanel } from "./ui/LightDataPanel";
import { ButtonDivItem } from "./ui/button/ButtonDivItem";
import { RTaskSystem } from "./task/RTaskSystem";
import { DivTool } from "./utils/HtmlDivUtils";

declare var SceneViewer: any;
const menuDataList: IItemData[] = [
	{ name: "出图设置", id: 0, type: "output" },
	{ name: "环境设置", id: 1, type: "env" },
	{ name: "摄像机", id: 2, type: "camera" },
	{ name: "材质", id: 3, type: "material" },
	{ name: "灯光", id: 4, type: "light" }
];
class DsrdUI implements IRTJsonData {
	private m_viewerLayer: HTMLDivElement = null;
	private m_areaWidth = 512;
	private m_areaHeight = 512;
	private m_items: RenderingSettingItem[] = [];
	private m_itemMap: Map<string, RenderingSettingItem> = new Map();

	rtaskSys: RTaskSystem = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number): void {
		console.log("DsrdUI::initialize()......");
		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;
		// let url = "static/cospace/dsrdiffusion/scViewer/SceneViewer.umd.js";
		// this.loadModule(url);
		this.initUIScene(viewerLayer, areaWidth, areaHeight);
	}
	private m_rscViewer: any = null;
	setRSCViewer(rscViewer: any): void {
		this.m_rscViewer = rscViewer;
		for (let i = 0; i < this.m_items.length; i++) {
			this.m_items[i].getPanel().rscViewer = rscViewer;
		}
		console.log("DsrdUI::setRSCViewer(), rscViewer: ", rscViewer);
	}
	private initUIScene(layer: HTMLDivElement, areaWidth: number, areaHeight: number): void {
		let total = 5;
		let height = 400;
		let subH = height / total;
		let subW = 110;
		let startY = 0;
		let colors = [0x334455, 0x335555, 0x335566, 0x445555, 0x445566, 0x446666];
		let menuBtnBGDiv = this.createDiv(0, 0, subW, height, "absolute");
		let style = menuBtnBGDiv.style;
		style.backgroundColor = "#668fb6";
		layer.appendChild(menuBtnBGDiv);

		let bottomBtnBGDiv = this.createDiv(0, height, areaWidth, areaHeight - height, "absolute", false);
		style = bottomBtnBGDiv.style;
		style.backgroundColor = "#bdd9e1";
		layer.appendChild(bottomBtnBGDiv);
		this.buildBtns( bottomBtnBGDiv );

		let ctrlAreaDiv = this.createDiv(subW, 0, areaWidth - subW, height, "absolute", false);
		style = ctrlAreaDiv.style;
		// style.backgroundColor = "#555555";
		layer.appendChild(ctrlAreaDiv);
		// 2c71b0
		let dls = menuDataList;
		let items = this.m_items;
		let pw = subW;
		let ph = subH - 2;
		for (let i = 0; i < total; ++i) {
			// let data = dls[i];
			// let colorStr = "#" + colors[i].toString(16);
			let colorStr = "#bdd9e1";
			// console.log("colorStr: ", colorStr);
			let div = this.createDiv(0, startY + i * subH, pw, ph, "absolute");
			style = div.style;
			style.backgroundColor = colorStr;
			style.cursor = "pointer";
			style.userSelect = "none";
			layer.appendChild(div);

			// let settingPanel = new SettingDataPanel();
			let settingPanel = this.createSettingPanel(ctrlAreaDiv, areaWidth - subW, height, dls[i]);
			// settingPanel.initialize(ctrlAreaDiv, areaWidth - subW, height, dls[i])
			const item = new RenderingSettingItem();
			item.group = items;
			item.initialize(div, pw, ph, settingPanel);
			items.push(item);
			this.m_itemMap.set(item.getType(), item);
		}
		items[0].select();


	}
	getItemByKeyName(keyName: string):RenderingSettingItem {
		return this.m_itemMap.get(keyName);
	}
	getPanelByKeyName(keyName: string):SettingDataPanel {
		return this.m_itemMap.get(keyName).getPanel();
	}
	private buildBtns(container: HTMLDivElement): void {

		let pw = 130;
		let ph = 60;
		let div = this.createDiv(90, 30, pw, ph, "absolute", true);
		let style = div.style;
		container.appendChild(div);
		let divs = [div];
		let btn = new ButtonDivItem();
		btn.initialize(div, "获取渲染任务", "new_rendering");
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
			this.rtaskSys.request.updatePage();
		}
		pw = 100;
		div = this.createDiv(230, 30, pw, ph, "absolute", true);
		style = div.style;
		container.appendChild(div);
		divs.push(div);
		btn = new ButtonDivItem();
		btn.initialize(div, "发起渲染", "send_rendering");
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns, ", this.rtaskSys.isTaskAlive(): ", this.rtaskSys.isTaskAlive());
			this.rtaskSys.rerendering();
		}
		pw = 130;
		div = this.createDiv(370, 30, pw, ph, "absolute", true);
		style = div.style;
		container.appendChild(div);
		divs.push(div);
		btn = new ButtonDivItem();
		btn.initialize(div, "查看渲染原图", "view_rendering_img");
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns, ", this.rtaskSys.isTaskAlive(): ", this.rtaskSys.isTaskAlive());
			window.open(this.rtaskSys.data.bigImgUrl,"_blank");
		}
		DivTool.hArrangementDivs(divs);
	}
	isRTJsonActiveByKeyName(keyName: string): boolean {
		let panel = this.getPanelByKeyName(keyName);
		if(panel) {
			return panel.isActive();
		}
		return false;
	}
	getRTJsonStrByKeyName(keyName: string, parentEnabled = true): string {
		let jsonStr = "";
		switch(keyName) {
			case "rnode":
				jsonStr = this.getRSettingJsonStr();
				jsonStr = `{"name":"rnode","unit":"m","version":0,${jsonStr}}`;
				// jsonStr = `"rnode":{"name":"rnode","unit":"m","version:0,${jsonStr}}`;
				return jsonStr;
				break;
			default:
				let panel = this.getPanelByKeyName(keyName);
				jsonStr = panel.getJsonStr();
				if(parentEnabled) {
					// jsonStr = `"rnode":{"name":"rnode","unit":"m","version:0,${jsonStr}}`;
					jsonStr = `{"name":"rnode","unit":"m","version":0,${jsonStr}}`;
				}
				return jsonStr;
				break;
		}
	}
	getRTJsonStrByKeyNames(keyNames: string[], parentEnabled = true): string {

		let total = keyNames.length;
		let jsonStr = "";
		for(let i = 0; i < total; i++) {
			let keyName = keyNames[i];
			switch(keyName) {
				case "rnode":
					jsonStr = this.getRSettingJsonStr();
					jsonStr = `{"name":"rnode","unit":"m","version":0,${jsonStr}}`;
					// jsonStr = `"rnode":{"name":"rnode","unit":"m","version:0,${jsonStr}}`;
					return jsonStr;
					break;
				default:
					let panel = this.getPanelByKeyName(keyName);
					if(jsonStr != "") {
						jsonStr += "," + panel.getJsonStr();
					}else {
						jsonStr = panel.getJsonStr();
					}

					// return jsonStr;
					break;
			}
		}
		if(parentEnabled) {
			// jsonStr = `"rnode":{"name":"rnode","unit":"m","version:0,${jsonStr}}`;
			jsonStr = `{"name":"rnode","unit":"m","version":0,${jsonStr}}`;
		}
		return jsonStr;
	}
	private getRSettingJsonStr(): string {
		// let items = this.m_items;
		let panel = this.getPanelByKeyName("output");
		console.log("panel: ", panel);
		let jsonBody = "";
		let jsonStr = panel.getJsonStr();
		jsonBody = jsonStr;
		// console.log("output jsonStr: ", jsonStr);
		panel = this.getPanelByKeyName("env");
		jsonStr = panel.getJsonStr();
		jsonBody += ","+ jsonStr;
		// console.log("env jsonStr: ", jsonStr);
		panel = this.getPanelByKeyName("camera");
		jsonStr = panel.getJsonStr();
		jsonBody += ","+ jsonStr;
		// console.log("camera jsonStr: ", jsonStr);
		panel = this.getPanelByKeyName("material");
		jsonStr = panel.getJsonStr();
		jsonBody += ","+ jsonStr;
		// console.log("material jsonStr: ", jsonStr);
		panel = this.getPanelByKeyName("light");
		jsonStr = panel.getJsonStr();
		jsonBody += ","+ jsonStr;
		// console.log("light jsonStr: ", jsonStr);
		console.log("-----------------------	----------------------------	-------------------");

		// jsonStr = `"rnode":{"name":"rnode","unit":"m","version:0,${jsonBody}}`;
		// console.log(jsonStr);
		return jsonBody;
	}
	private m_materialPanel: MaterialDataPanel = null;
	getMaterialPanel(): MaterialDataPanel {
		return this.m_materialPanel;
	}
	protected createSettingPanel(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number, data: IItemData): SettingDataPanel {
		let settingPanel: SettingDataPanel = null;
		switch (data.type) {
			case "output":
				settingPanel = new OutputDataPanel();
				break;
			case "env":
				settingPanel = new EnvDataPanel();
				break;
			case "camera":
				settingPanel = new CameraDataPanel();
				break;
			case "material":
				this.m_materialPanel = new MaterialDataPanel();
				settingPanel = this.m_materialPanel;
				break;
			case "light":
				settingPanel = new LightDataPanel();
				break;
			default:
				settingPanel = new SettingDataPanel();
		}
		settingPanel.initialize(viewerLayer, areaWidth, areaHeight, data);
		return settingPanel;
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
export { DsrdUI };

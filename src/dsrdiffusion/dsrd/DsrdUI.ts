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
import { ParamInputPanel } from "./ui/ParamInputPanel";

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
	private m_planeAreaWidth = 512;
	private m_planeAreaHeight = 512;
	private m_bottomAreaHeight = 512;
	private m_items: RenderingSettingItem[] = [];
	private m_itemMap: Map<string, RenderingSettingItem> = new Map();
	private m_paramInputPanel = new ParamInputPanel();
	taskNameDiv: HTMLDivElement = null;
	rtaskSys: RTaskSystem = null;
	layoutHorizon = true;
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
	setTaskName(taskName: string): void {
		this.taskNameDiv.innerHTML = `<u>${taskName}</u>`;
	}
	private initUIScene(layer: HTMLDivElement, areaWidth: number, areaHeight: number): void {

		let total = 5;
		this.m_planeAreaWidth =  Math.floor(0.8 * areaWidth);
		this.m_planeAreaHeight =  Math.floor(0.8 * areaHeight);
		this.m_bottomAreaHeight = areaHeight - this.m_planeAreaHeight;

		let height = this.m_planeAreaHeight;
		let subW = areaWidth - this.m_planeAreaWidth;
		let subH = height / total;
		let startY = 0;
		// let menuBtnBGDiv = this.createDiv(0, 0, subW, height, "absolute");
		let menuBtnBGDiv = DivTool.createDivT1(0, 0, subW, height, "flex","absolute", false);
		let style = menuBtnBGDiv.style;
		style.backgroundColor = "#668fb6";
		layer.appendChild(menuBtnBGDiv);

		// let bottomBtnBGDiv = this.createDiv(0, height, areaWidth, areaHeight - height, "absolute", false);
		let bottomBtnBGDiv = DivTool.createDivT1(0, height, areaWidth, areaHeight - height, "flex","absolute", false);
		style = bottomBtnBGDiv.style;
		style.backgroundColor = "#bdd9e1";
		layer.appendChild(bottomBtnBGDiv);
		this.buildBtns( bottomBtnBGDiv );

		// let planeAreaDiv = this.createDiv(subW, 0, areaWidth - subW, height, "absolute", false);
		let planeAreaDiv = DivTool.createDivT1(subW, 0, areaWidth - subW, height, "flex", "absolute", false);

		// this.taskNameDiv = this.createDiv(subW + 10, 5, areaWidth - subW - 20, 35, "absolute", false);
		this.taskNameDiv = DivTool.createDivT1(subW + 10, 5, areaWidth - subW - 20, 35, "flex", "absolute", false);
		style = this.taskNameDiv.style;
		style.color = "#101033";
		// style.userSelect = true
		// style.backgroundColor = "#556677"
		style.textAlign = "center";
		style.alignItems = "center";
		style.justifyContent = "center";
		layer.appendChild(this.taskNameDiv);

		style = planeAreaDiv.style;
		// style.backgroundColor = "#555555";
		layer.appendChild(planeAreaDiv);

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
			// let div = this.createDiv(0, startY + i * subH, pw, ph, "absolute");
			let div = DivTool.createDivT1(0, startY + i * subH, pw, ph, "flex","absolute", true);
			style = div.style;
			style.backgroundColor = colorStr;
			style.cursor = "pointer";
			style.userSelect = "none";
			layer.appendChild(div);

			// let settingPanel = new SettingDataPanel();
			let settingPanel = this.createSettingPanel(planeAreaDiv, this.m_planeAreaWidth, height, dls[i]);
			const item = new RenderingSettingItem();
			item.group = items;
			item.initialize(div, pw, ph, settingPanel);
			items.push(item);
			this.m_itemMap.set(item.getType(), item);
		}
		items[0].select();

		console.log("uuuuuuuu areaWidth, areaHeight: ", areaWidth, areaHeight);
		let paramInputDiv = DivTool.createDivT1(0, 0, areaWidth, areaHeight, "flex", "absolute", false);
		layer.appendChild(paramInputDiv);
		// style = paramInputDiv.style;
		// style.color = "#101033";
		let piPanel = this.m_paramInputPanel;
		piPanel.initialize(paramInputDiv,areaWidth, areaHeight, this.layoutHorizon);
		piPanel.viewLayer.setBackgroundColor(0xbdd9e1);
		piPanel.close();
	}
	getItemByKeyName(keyName: string):RenderingSettingItem {
		return this.m_itemMap.get(keyName);
	}
	getPanelByKeyName(keyName: string):SettingDataPanel {
		return this.m_itemMap.get(keyName).getPanel();
	}

	private buildBtns(container: HTMLDivElement): void {

		let pw = Math.floor(0.28 * this.m_areaWidth);
		let ph = Math.floor(0.6 * this.m_bottomAreaHeight);
		let py = Math.floor((this.m_bottomAreaHeight - ph) * 0.5);
		let div = DivTool.createDivT1(1, py, pw, ph,"flex", "absolute", true);
		container.appendChild(div);
		let divs = [div];
		let btn = new ButtonDivItem();
		btn.initialize(div, "获取渲染任务", "new_rendering");
		btn.toRoundedRectangleStyle();
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
			this.rtaskSys.request.updatePage();
		}
		div = DivTool.createDivT1(1, py, pw, ph,"flex", "absolute", true);


		container.appendChild(div);
		divs.push(div);
		btn = new ButtonDivItem();
		btn.initialize(div, "渲染图像", "send_rendering");
		btn.toRoundedRectangleStyle();
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns, ", this.rtaskSys.isTaskAlive(): ", this.rtaskSys.isTaskAlive());
			this.rtaskSys.rerendering();
			// for test
			// this.rtaskSys.request.sendRerenderingReq("", true);
		}
		div = DivTool.createDivT1(1, py, pw, ph, "flex", "absolute", true);
		container.appendChild(div);
		divs.push(div);
		btn = new ButtonDivItem();
		btn.initialize(div, "查看渲染原图", "view_rendering_img");
		btn.toRoundedRectangleStyle();
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

		settingPanel.paramInputPanel = this.m_paramInputPanel;
		settingPanel.initialize(viewerLayer, areaWidth, areaHeight, data);
		return settingPanel;
	}
}
export { DsrdUI };

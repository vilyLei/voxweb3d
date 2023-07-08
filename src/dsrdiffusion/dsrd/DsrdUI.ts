import { IItemData } from "./ui/IItemData";
import { SettingDataPanel } from "./ui/SettingDataPanel";
import { OutputDataPanel } from "./ui/OutputDataPanel";
import { EnvDataPanel } from "./ui/EnvDataPanel";
import { CameraDataPanel } from "./ui/CameraDataPanel";
import { MaterialDataPanel } from "./ui/MaterialDataPanel";
import { RenderingSettingItem } from "./ui/RenderingSettingItem";
import { LightDataPanel } from "./ui/LightDataPanel";
import { ButtonDivItem } from "./ui/button/ButtonDivItem";

declare var SceneViewer: any;
const menuDataList: IItemData[] = [
	{ name: "出图设置", id: 0, type: "output" },
	{ name: "环境设置", id: 1, type: "env" },
	{ name: "摄像机", id: 2, type: "camera" },
	{ name: "材质", id: 3, type: "material" },
	{ name: "灯光", id: 4, type: "light" }
];
class DsrdUI {
	private m_viewerLayer: HTMLDivElement = null;
	private m_areaWidth = 512;
	private m_areaHeight = 512;
	private m_items: RenderingSettingItem[] = [];
	private m_itemMap: Map<string, RenderingSettingItem> = new Map();
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

		let pw = 100;
		let ph = 60;
		let div = this.createDiv(130, 30, pw, ph, "absolute", true);
		let style = div.style;
		container.appendChild(div);
		let btn_rendering = new ButtonDivItem();
		btn_rendering.initialize(div, "新建渲染", "new_rendering");
		btn_rendering.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
		}

		div = this.createDiv(270, 30, pw, ph, "absolute", true);
		style = div.style;
		// style.cursor = "pointer";
		// style.userSelect = "none";
		container.appendChild(div);
		btn_rendering = new ButtonDivItem();
		btn_rendering.initialize(div, "发起渲染", "send_rendering");
		btn_rendering.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
			this.getRSettingJsonStr();
		}
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

		jsonStr = `"rnode":{"name":"rnode","unit":"m",${jsonBody}}`;
		console.log(jsonStr);
		return jsonStr;
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
				settingPanel = new MaterialDataPanel();
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

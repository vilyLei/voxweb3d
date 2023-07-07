import { IItemData } from "./IItemData";
import { DataItemComponentParam, DataItemComponent } from "./DataItemComponent";
class SettingDataPanel {
	protected m_viewerLayer: HTMLDivElement = null;
	protected m_container: HTMLDivElement = null;
	protected m_itemData: IItemData = null;
	protected m_areaWidth = 512;
	protected m_areaHeight = 512;
	protected m_itemCompDict: Map<string, DataItemComponent> = new Map();
	protected m_params: DataItemComponentParam[];

	rscViewer: any;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number, data: IItemData): void {
		console.log("SettingDataController::initialize()......");

		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;

		this.m_itemData = data;
		// viewerLayer.innerHTML = data.name;
		this.m_container = this.createDiv(0, 0, areaWidth, areaWidth, "", "", "absolute");
		viewerLayer.appendChild(this.m_container);
		this.init(viewerLayer);
		this.setVisible(false);
	}
	getName(): string {
		return this.m_itemData.name;
	}
	getKeyName(): string {
		return this.m_itemData.type;
	}
	getType(): string {
		return this.m_itemData.type;
	}

	getJsonBodyStr(beginStr = "{", endStr = "}"): string {
		let params = this.m_params;
		let jsonStr = beginStr;
		let symble = beginStr.length > 1 ? ",":"";
		for (let i = 0; i < params.length; i++) {
			const p = params[i];
			if(p.autoEncoding) {
				jsonStr += symble + p.getJsonStr();
				symble = ",";
			}
		}
		jsonStr += endStr;
		return jsonStr;
	}
	getJsonStr(beginStr = "{", endStr = "}"): string {
		// let params = this.m_params;
		// let jsonStr = beginStr;
		// let symble = beginStr.length > 1 ? ",":"";
		// for (let i = 0; i < params.length; i++) {
		// 	const p = params[i];
		// 	if(p.autoEncoding) {
		// 		jsonStr += symble + p.getJsonStr();
		// 		symble = ",";
		// 	}
		// }
		// jsonStr += endStr;
		// return `"${this.getKeyName()}":${jsonStr}`;
		return `"${this.getKeyName()}":${this.getJsonBodyStr(beginStr, endStr)}`;
	}
	protected addItemComp(comp: DataItemComponent): void {
		this.m_itemCompDict.set(comp.getKeyName(), comp);
	}
	getItemCompByKeyName(keyName: string): DataItemComponent {
		return this.m_itemCompDict.get(keyName);
	}
	protected init(viewerLayer: HTMLDivElement): void {}
	setVisible(v: boolean): void {
		let c = this.m_container;
		let style = c.style;
		if (v) {
			style.visibility = "visible";
		} else {
			style.visibility = "hidden";
		}
	}
	isVisible(): boolean {
		return this.m_container.style.visibility == "visible";
	}
	protected createDiv(
		px: number,
		py: number,
		pw: number,
		ph: number,
		display: string = "block",
		align: string = "",
		position: string = ""
	): HTMLDivElement {
		const div = document.createElement("div");
		let style = div.style;
		style.left = px + "px";
		style.top = py + "px";
		style.width = pw + "px";
		style.height = ph + "px";
		if (display != "") {
			style.display = display;
		}
		if (align != "") {
			switch (align) {
				case "center":
					style.alignItems = "center";
					style.justifyContent = "center";
					break;
			}
		}
		// style.userSelect = "none";
		// style.position = "relative";
		if (position != "") {
			style.position = position;
		}
		return div;
	}
}
export { SettingDataPanel };

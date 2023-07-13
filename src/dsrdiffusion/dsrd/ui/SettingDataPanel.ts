import { IItemData } from "./IItemData";
import { DataItemComponentParam, DataItemComponent } from "./DataItemComponent";
import { DivTool } from "../utils/HtmlDivUtils";
import { IParamInputPanel } from "./IParamInputPanel";
class SettingDataPanel {
	protected m_viewerLayer: HTMLDivElement = null;
	protected m_container: HTMLDivElement = null;
	protected m_itemData: IItemData = null;
	protected m_areaWidth = 512;
	protected m_areaHeight = 512;
	protected m_itemCompDict: Map<string, DataItemComponent> = new Map();
	protected m_params: DataItemComponentParam[];
	protected m_isActive = false;
	rscViewer: any;
	paramInputPanel: IParamInputPanel = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number, data: IItemData): void {
		console.log("SettingDataController::initialize()......");

		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;

		this.m_itemData = data;
		// this.m_container = this.createDiv(0, 0, areaWidth, areaWidth, "", "", "absolute");
		this.m_container = DivTool.createDivT1(0, 0, areaWidth, areaWidth, "", "absolute", false);

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
		let symble = beginStr.length > 1 ? "," : "";
		for (let i = 0; i < params.length; i++) {
			const p = params[i];
			if (p.autoEncoding) {
				jsonStr += symble + p.getJsonStr();
				symble = ",";
			}
		}
		jsonStr += endStr;
		return jsonStr;
	}
	getJsonStr(beginStr = "{", endStr = "}"): string {
		return `"${this.getKeyName()}":${this.getJsonBodyStr(beginStr, endStr)}`;
	}
	protected addItemComp(comp: DataItemComponent): void {
		comp.getParam().paramPanel = this.paramInputPanel;
		this.m_itemCompDict.set(comp.getKeyName(), comp);
	}
	getItemCompByKeyName(keyName: string): DataItemComponent {
		return this.m_itemCompDict.get(keyName);
	}
	getItemParamByKeyName(keyName: string): DataItemComponentParam {
		let item = this.m_itemCompDict.get(keyName);
		if(item) {
			return item.getParam();
		}
		return null;
	}
	getItemParams(): DataItemComponentParam[] {
		return this.m_params;
	}
	protected init(viewerLayer: HTMLDivElement): void {}
	setVisible(v: boolean): void {
		let c = this.m_container;
		let style = c.style;
		if (v) {
			style.visibility = "visible";
			this.m_isActive = true;
		} else {
			style.visibility = "hidden";
		}
	}
	isVisible(): boolean {
		return this.m_container.style.visibility == "visible";
	}
	isActive(): boolean {
		return this.m_isActive;
	}
	createItemComponent(py: number, param: DataItemComponentParam): DataItemComponent {
		let itemComp = new DataItemComponent();
		itemComp.y = py;
		itemComp.initialize(this.m_areaWidth, this.m_areaHeight, this.m_container, param);
		this.addItemComp(itemComp);
		return itemComp;
	}
}
export { SettingDataPanel };

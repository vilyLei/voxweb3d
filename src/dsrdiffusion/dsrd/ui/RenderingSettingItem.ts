import {IItemData} from "./IItemData"
import {SettingDataPanel} from "./SettingDataPanel"
class RenderingSettingItem {
	private m_viewerLayer: HTMLDivElement = null;
	private m_panel: SettingDataPanel = null;
	private m_areaWidth = 512;
	private m_areaHeight = 512;
	private m_selected = false;
	private m_deselectColors = [0xbdd9e1, 0xaed4df, 0x83c4d7];
	private m_selectColors = [0x7aacda, 0x4a93d5, 0x3b7bb5];
	group: RenderingSettingItem[] = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number, panel: SettingDataPanel): void {

		console.log("RenderingSettingItem::initialize()......");

		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;

		this.m_panel = panel;
		viewerLayer.innerHTML = panel.getName();
		this.initEvent(viewerLayer);
	}
	getPanel(): SettingDataPanel {
		return this.m_panel;
	}
	getName(): string {
		return this.m_panel.getName();
	}
	getKeyName(): string {
		return this.m_panel.getKeyName();
	}
	getType(): string {
		return this.m_panel.getType();
	}
	private applyColorAt(i: number): void {
		// console.log("applyColorAt(), this.m_selected: ", this.m_selected);
		let colors = this.m_selected ? this.m_selectColors : this.m_deselectColors;
		this.m_viewerLayer.style.backgroundColor = "#" + colors[i].toString(16);
	}
	private initEvent(viewerLayer: HTMLDivElement): void {

		viewerLayer.onmouseover = evt => {
			// console.log("mouse over, name: ", this.m_itemData.name);
			this.applyColorAt(1);
		}
		viewerLayer.onmouseout = evt => {
			// console.log("mouse out, name: ", this.m_itemData.name);
			this.applyColorAt(0);
		}
		viewerLayer.onmouseup = evt => {
			// console.log("mouse up, name: ", this.m_itemData.name);
			this.select();
			this.applyColorAt(1);
		}
		viewerLayer.onmousedown = evt => {
			// console.log("mouse down, name: ", this.m_itemData.name);
			this.applyColorAt(2);
		}
	}
	isSelected(): boolean {
		return this.m_selected;
	}
	select(): void {
		let ls = this.group;
		let len = ls.length;
		for(let i = 0; i < len; ++i) {
			if(ls[i].isSelected()) {
				ls[i].deselect();
				break;
			}
		}
		this.m_selected = true;
		this.applyColorAt(0);
		this.m_panel.setVisible(true);
	}
	deselect(): void {
		this.m_selected = false;
		this.applyColorAt(0);
		this.m_panel.setVisible(false);
	}
}
export {RenderingSettingItem}

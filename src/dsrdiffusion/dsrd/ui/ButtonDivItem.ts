import { IItemData } from "./IItemData";
// import { SettingDataPanel } from "./SettingDataPanel";
class ButtonDivItem {
	private m_viewerLayer: HTMLDivElement = null;
	private m_btn_name = "";
	private m_btn_idns = "";
	private m_areaWidth = 512;
	private m_areaHeight = 512;
	private m_selected = false;
	private m_selectColors = [0xbdd9e1, 0xaed4df, 0x83c4d7];
	private m_deselectColors = [0x7aacda, 0x4a93d5, 0x3b7bb5];
	group: ButtonDivItem[] = null;
	onmousedown: (evt: any) => void = null;
	onmouseup: (evt: any) => void = null;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number, btn_name: string, btn_idns: string): void {

		console.log("ButtonDivItem::initialize()......");
		let style = viewerLayer.style;
		style.cursor = "pointer";
		style.userSelect = "none";
		// style.color = "#eeeeee";

		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;
		this.m_btn_name = btn_name;
		this.m_btn_idns = btn_idns;
		viewerLayer.innerHTML = btn_name;
		this.initEvent(viewerLayer);
	}
	setTextColor(uint24: number): void {
		this.m_viewerLayer.style.color = "#" + uint24.toString(16);
	}
	setVisible(v: boolean): void {
		let c = this.m_viewerLayer;
		let style = c.style;
		if (v) {
			style.visibility = "visible";
		} else {
			style.visibility = "hidden";
		}
	}
	isVisible(): boolean {
		return this.m_viewerLayer.style.visibility == "visible";
	}
	setSelectColors(colors: number[]): void {
		this.m_selectColors = colors;
	}
	setDeselectColors(colors: number[]): void {
		this.m_deselectColors = colors;
	}
	getName(): string {
		return this.m_btn_name;
	}
	getIdns(): string {
		return this.m_btn_idns;
	}
	applyColorAt(i: number): void {
		// console.log("applyColorAt(), this.m_selected: ", this.m_selected);
		let colors = this.m_selected ? this.m_selectColors : this.m_deselectColors;
		this.m_viewerLayer.style.backgroundColor = "#" + colors[i].toString(16);
	}
	private initEvent(viewerLayer: HTMLDivElement): void {
		viewerLayer.onmouseover = evt => {
			// console.log("mouse over, name: ", this.m_itemData.name);
			this.applyColorAt(1);
		};
		viewerLayer.onmouseout = evt => {
			// console.log("mouse out, name: ", this.m_itemData.name);
			this.applyColorAt(0);
		};
		viewerLayer.onmouseup = evt => {
			// console.log("mouse up, name: ", this.m_itemData.name);
			this.select();
			this.applyColorAt(1);
			if (this.onmouseup) {
				(evt as any).buttonTarget = this;
				(evt as any).button_idns = this.m_btn_idns;
				this.onmouseup(evt);
			}
		};
		viewerLayer.onmousedown = evt => {
			// console.log("mouse down, name: ", this.m_itemData.name);
			this.applyColorAt(2);
			if (this.onmousedown) {
				(evt as any).buttonTarget = this;
				(evt as any).button_idns = this.m_btn_idns;
				this.onmousedown(evt);
			}
		};
	}
	isSelected(): boolean {
		return this.m_selected;
	}
	select(): void {
		if (this.group != null) {
			let ls = this.group;
			let len = ls.length;
			for (let i = 0; i < len; ++i) {
				if (ls[i].isSelected()) {
					ls[i].deselect();
					break;
				}
			}
			this.m_selected = true;
			this.applyColorAt(0);
		} else {
			// this.m_selected = true;
		}
	}
	deselect(): void {
		if (this.group != null) {
			this.m_selected = false;
			this.applyColorAt(0);
		} else {
			// this.m_selected = false;
		}
	}
}
export { ButtonDivItem };

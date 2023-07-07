import {IItemData} from "./IItemData"
class SettingDataPanel {
	protected m_viewerLayer: HTMLDivElement = null;
	protected m_container: HTMLDivElement = null;
	protected m_itemData: IItemData = null;
	protected m_areaWidth = 512;
	protected m_areaHeight = 512;
	constructor() {}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number, data: IItemData): void {

		console.log("SettingDataController::initialize()......");

		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;

		this.m_itemData = data;
		// viewerLayer.innerHTML = data.name;
		this.m_container = this.createDiv(0,0, areaWidth, areaWidth, "", "", "absolute");
		viewerLayer.appendChild(this.m_container);
		this.init(viewerLayer);
		this.setVisible(false);
	}
	getName(): string {
		return this.m_itemData.name;
	}
	protected init(viewerLayer: HTMLDivElement): void {

	}
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
export {SettingDataPanel}

import {DataItemComponentParam} from "./DataItemComponentParam"
class DataItemComponent {
	protected m_viewerLayer: HTMLDivElement;
	protected m_containerDiv: HTMLDivElement;
	protected m_headDiv: HTMLDivElement;
	protected m_bodyDiv: HTMLDivElement;
	protected m_param: DataItemComponentParam;
	x = 45;
	y = 50;
	constructor() {}

	initialize(viewerLayer: HTMLDivElement, param: DataItemComponentParam): void {
		this.m_viewerLayer = viewerLayer;
		this.m_param = param;
		this.init(viewerLayer, param);
	}
	protected init(viewerLayer: HTMLDivElement, param: DataItemComponentParam): void {
		// 286dab
		let height = 23;
		let container = this.createDiv(this.x, this.y, 320, height, "", "", "absolute");
		let style = container.style;
		let headDiv = this.createDiv(0, 0, 159, height, "", "", "absolute");
		let bodyDiv = this.createDiv(161, 0, 159, height, "", "", "absolute");
		style = headDiv.style;
		style.background = "#286dab";
		style.color = "#eeeeee";
		style = bodyDiv.style;
		style.background = "#286dab";
		style.color = "#eeeeee";
		container.appendChild(headDiv);
		container.appendChild(bodyDiv);
		// let style = container.style;
		// style.background = "#286dab";
		viewerLayer.appendChild(container);

		this.m_containerDiv = container;
		this.m_headDiv = headDiv;
		this.m_bodyDiv = bodyDiv;

		param.displayToViewer(headDiv, bodyDiv);
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
export { DataItemComponent, DataItemComponentParam };

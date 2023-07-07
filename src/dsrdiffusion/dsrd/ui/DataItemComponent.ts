import { DataItemComponentParam } from "./DataItemComponentParam";
class DataItemComponent {
	protected m_viewerLayer: HTMLDivElement;
	protected m_containerDiv: HTMLDivElement;
	protected m_headDiv: HTMLDivElement;
	protected m_bodyDiv: HTMLDivElement;
	protected m_input: HTMLInputElement;
	protected m_param: DataItemComponentParam;
	x = 45;
	y = 50;
	constructor() {}

	initialize(viewerLayer: HTMLDivElement, param: DataItemComponentParam): void {
		this.m_viewerLayer = viewerLayer;
		this.m_param = param;
		this.init(viewerLayer, param);
	}
	getKeyName(): string {
		return this.m_param.keyName;
	}
	getParam(): DataItemComponentParam {
		return this.m_param;
	}
	protected init(viewerLayer: HTMLDivElement, param: DataItemComponentParam): void {
		// 286dab
		let height = 23;
		let width = 159;
		let container = this.createDiv(this.x, this.y, 320, height, "", "", "absolute");
		let style = container.style;
		let headDiv = this.createDiv(0, 0, width, height, "", "", "absolute");
		let bodyDiv = this.createDiv(161, 0, width, height, "", "", "absolute");
		style = headDiv.style;
		style.background = "#286dab";
		style.color = "#eeeeee";
		style = bodyDiv.style;
		style.background = "#286dab";
		style.color = "#eeeeee";
		// let style = container.style;
		// style.background = "#286dab";
		viewerLayer.appendChild(container);

		this.m_containerDiv = container;
		this.m_headDiv = headDiv;
		this.m_bodyDiv = bodyDiv;
		param.head_viewer = headDiv;
		param.body_viewer = bodyDiv;
		this.createInput(bodyDiv, param, width, height);

		container.appendChild(headDiv);
		container.appendChild(bodyDiv);
		param.displayToViewer();
		param.initEvents();
	}
	protected createInput(bodyDiv: HTMLDivElement, param: DataItemComponentParam, width: number, height: number): void {
		if (param.editEnabled) {
			var input = document.createElement("input");
			// input.type = param.inputType;
			let style = input.style;
			style.position = "absolute";
			style.left = 0 + "px";
			style.top = 0 + "px";
			style.width = width + "px";
			style.height = height + "px";
			style.background = "transparent";
			style.borderWidth = "0px";
			style.outline = "none";
			style.color = "#eeeeee";
			style.fontSize = "17px";
			style.textAlign = "center";
			// style.alignItems = "center";
			// style.justifyContent = "center";
			bodyDiv.append(input);
			this.m_input = input;
			param.body_viewer = input;
		}
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

import { DivTool } from "../utils/HtmlDivUtils";
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

		let height = 23;
		let width = 159;
		let container = DivTool.createDivT1(this.x, this.y, 320, height, "block", "absolute", false);
		let style = container.style;
		let headDiv = DivTool.createDivT1(0, 0, width, height, "block", "absolute", false);
		let bodyDiv =  DivTool.createDivT1(161, 0, width, height, "block", "absolute", false);
		style = headDiv.style;
		style.background = "#286dab";
		style.color = "#eeeeee";
		style = bodyDiv.style;
		style.background = "#286dab";
		style.color = "#eeeeee";
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
			bodyDiv.append(input);
			this.m_input = input;
			param.body_viewer = input;
		}
	}
}
export { DataItemComponent, DataItemComponentParam };

import { DivTool } from "../utils/HtmlDivUtils";
import { DataItemComponentParam } from "./DataItemComponentParam";
import RendererDevice from "../../../vox/render/RendererDevice";
class DataItemComponent {
	protected m_viewerLayer: HTMLDivElement;
	protected m_containerDiv: HTMLDivElement;
	protected m_headDiv: HTMLDivElement;
	protected m_bodyDiv: HTMLDivElement;
	protected m_input: HTMLInputElement;
	protected m_param: DataItemComponentParam;
	protected m_areaWidth = 512;
	protected m_areaHeight = 512;
	private m_isMobileWeb = false;
	height = 23;
	x = 45;
	y = 50;
	constructor() {}

	initialize(width: number, height: number, viewerLayer: HTMLDivElement, param: DataItemComponentParam): void {

		this.m_areaWidth = width;
		this.m_areaHeight = height;

		this.m_viewerLayer = viewerLayer;
		this.m_param = param;
		this.m_isMobileWeb = RendererDevice.IsMobileWeb();
		// this.m_isMobileWeb = true;

		this.init(viewerLayer, param);
	}
	getKeyName(): string {
		return this.m_param.keyName;
	}
	getParam(): DataItemComponentParam {
		return this.m_param;
	}
	protected init(viewerLayer: HTMLDivElement, param: DataItemComponentParam): void {

		let height = this.height;
		let width = Math.floor((this.m_areaWidth) * 0.5) - 2;
		// console.log("comp width: ", width);
		let container = DivTool.createDivT1(2, this.y, width * 2 + 2, height, "block", "absolute", false);
		let style = container.style;
		let headDiv = DivTool.createDivT1(0, 0, width, height, "block", "absolute", false);
		let bodyDiv =  DivTool.createDivT1(width + 1, 0, width, height, "block", "absolute", false);
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
		param.mobileWebEnabled = this.m_isMobileWeb;
		param.displayToViewer();
		param.initEvents();
	}
	protected createInput(bodyDiv: HTMLDivElement, param: DataItemComponentParam, width: number, height: number): void {
		if (param.editEnabled) {
			if(this.m_isMobileWeb) {

			}else {
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
				style.userSelect = "none";

				bodyDiv.append(input);
				this.m_input = input;
				param.body_viewer = input;
			}
		}
	}
}
export { DataItemComponent, DataItemComponentParam };

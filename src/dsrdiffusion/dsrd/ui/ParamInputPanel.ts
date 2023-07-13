import { IItemData } from "./IItemData";
import { DataItemComponentParam, DataItemComponent } from "./DataItemComponent";
import { DivTool } from "../utils/HtmlDivUtils";
import { HTMLViewerLayer } from "../base/HTMLViewerLayer";
import { IDataItemComponentParam } from "./IDataItemComponentParam";
import { IParamInputPanel } from "./IParamInputPanel";
import { ButtonDivItem } from "./button/ButtonDivItem";
class ParamInputPanel implements IParamInputPanel {
	protected m_viewerLayer: HTMLDivElement = null;
	protected m_areaWidth = 512;
	protected m_areaHeight = 512;
	private m_confirmBtn: ButtonDivItem = null;
	protected m_input: HTMLInputElement;
	private m_itemParam = new DataItemComponentParam();
	viewLayer: HTMLViewerLayer = new HTMLViewerLayer();
	private m_param: IDataItemComponentParam = null;

	constructor() {}
	setParam(param: IDataItemComponentParam): void {
		if(param != this.m_itemParam) {
			if(param != null) {
				this.m_itemParam.editEnabled = true;
				this.m_itemParam.floatNumberEnabled = param.floatNumberEnabled;
				this.m_itemParam.compType = param.compType;
				this.m_itemParam.name = param.name;
				// console.log("bbbbbbbb param.getCurrValueString(): ", param.getCurrValueString());
				this.m_itemParam.updateValueWithStr(param.getCurrValueString());
			}
			this.m_param = param;
		}
	}
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number, layoutHorizon: boolean): void {
		console.log("ParamInputPanel::initialize()......");

		this.m_viewerLayer = viewerLayer;
		this.m_areaWidth = areaWidth;
		this.m_areaHeight = areaHeight;

		this.viewLayer.setViewer(this.m_viewerLayer);
		if (layoutHorizon) {
		}

		let pw = 80;
		let ph = 50;
		let px = (this.m_areaWidth - pw) * 0.5;
		let py = this.m_areaHeight * 0.7;
		let btnDiv = DivTool.createDivT1(px, py, pw, ph, "flex", "absolute", true);
		let colors = [0x157c73, 0x156a85, 0x15648b];
		this.m_viewerLayer.appendChild(btnDiv);
		let btn = new ButtonDivItem();
		btn.setDeselectColors(colors);
		btn.initialize(btnDiv, "确认", "confirm_param_update");
		btn.onmouseup = evt => {
			let currEvt = evt as any;
			console.log("button_idns: ", currEvt.button_idns);
			this.applyParamValue();
		};
		this.m_confirmBtn = btn;
		btn.setTextColor(0xeeeeee);
		this.init(viewerLayer, areaWidth, areaHeight);
		this.open();
	}
	private applyParamValue(): void {
		if(this.m_input.value != "") {
			if(this.m_param != null) {
				this.m_param.updateValueWithStr(this.m_input.value);
			}
		}
		this.close();
	}

	protected init(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number): void {
		let height = 50;
		let width = Math.floor(areaWidth * 0.5) - 2;
		console.log("ParamInputPanel::init(), width: ", width);
		let container = DivTool.createDivT1(2, 20, width * 2 + 2, height, "block", "absolute", false);
		let style = container.style;
		let headDiv = DivTool.createDivT1(0, 0, width, height, "flex", "absolute", false);
		let bodyDiv = DivTool.createDivT1(width + 1, 0, width, height, "block", "absolute", false);
		style = headDiv.style;
		style.textAlign = "center";
		style.alignItems = "center";
		style.justifyContent = "center";
		style.background = "#286dab";
		style.color = "#eeeeee";

		style = bodyDiv.style;
		style.background = "#286dab";
		style.color = "#eeeeee";
		container.appendChild(headDiv);
		container.appendChild(bodyDiv);
		viewerLayer.appendChild(container);
		this.createInput(bodyDiv, width, height);
		let param = this.m_itemParam;
		param.editEnabled = true;
		// param.numberMinValue = -0xffffff;
		// param.numberMaxValue = 0xffffff;
		param.head_viewer = headDiv;
		param.body_viewer = this.m_input;
		param.initEvents();

		// headDiv.innerHTML = "图像";
		// this.m_input.value = "512";
	}
	protected createInput(bodyDiv: HTMLDivElement,  width: number, height: number): void {
		var input = document.createElement("input");
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
		// input.onkeydown = evt => {
		// 	input.value = "fff"
		// }
		input.onkeyup = evt => {
			// console.log(evt);
			//input.value = "xxx" + evt.key
			let keyStr = evt.key + "";
			if(keyStr == "Enter") {
				this.applyParamValue();
			}
		}
	}
	setVisible(v: boolean): void {
		this.viewLayer.setVisible(v);
	}
	isVisible(): boolean {
		return this.viewLayer.isVisible();
	}
	open(): void {
		if (!this.isVisible()) {
			this.setVisible(true);
		}
	}
	isOpen(): boolean {
		return this.isVisible();
	}
	close(): void {
		if (this.isVisible()) {
			this.m_input.value = "";
			this.setParam(null);
			this.setVisible(false);
		}
	}
}
export { ParamInputPanel };

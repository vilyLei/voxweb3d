import Color4 from "../../../vox/material/Color4";

const __$$colorTool = new Color4()
class DataItemComponentParam {
	keyName = "";
	name = "";
	numberValue?: number;
	booleanValue?: boolean;
	textValue?: string;
	unit = "";
	compType = "number";
	colorRGBUint24?: number;
	constructor() {}
	toNumber(): void {
		this.compType = "number";
	}
	toBoolean(): void {
		this.compType = "boolean";
	}
	toText(): void {
		this.compType = "text";
	}
	toColor(): void {
		this.compType = "color";
	}
	displayToViewer(head_viewer: HTMLDivElement, body_viewer: HTMLDivElement): void {
		switch (this.compType) {
			case "number":
			case "text":
				head_viewer.innerHTML = this.name;
				if(this.numberValue != undefined) {
					body_viewer.innerHTML = this.numberValue + "";
				}else if(this.textValue != undefined) {
					body_viewer.innerHTML = this.textValue + "";
				}
				break;
			case "boolean":
				head_viewer.innerHTML = this.name;
				body_viewer.innerHTML = this.booleanValue ? "是" : "否";
				break;
			case "color":
				__$$colorTool.setRGBUint24(this.numberValue)
				head_viewer.innerHTML = this.name;
				body_viewer.innerHTML = __$$colorTool.getCSSHeXRGBColor();
				// body_viewer.innerHTML = __$$colorTool.getCSSHeXRGBColor().toUpperCase();
				break;
		}
	}
}
export { DataItemComponentParam };

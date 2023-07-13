import { IItemData } from "./IItemData";
import { SettingDataPanel } from "./SettingDataPanel";
import { DataItemComponentParam, DataItemComponent } from "./DataItemComponent";
class OutputDataPanel extends SettingDataPanel {
	constructor() {
		super();
	}
	getJsonStr(beginStr = "{", endStr = "}"): string {

		let paramW = this.getItemCompByKeyName("image_width").getParam();
		let paramH = this.getItemCompByKeyName("image_height").getParam();
		let sizes = [paramW.numberValue, paramH.numberValue];
		let jsonStr = `${beginStr}"path":"", "resolution":[${sizes}]`;
		return super.getJsonStr(jsonStr,endStr);
	}
	protected init(viewerLayer: HTMLDivElement): void {
		let params: DataItemComponentParam[] = [];
		let param = new DataItemComponentParam();
		param.keyName = "image_width";
		param.name = "图像宽";
		param.numberValue = 512;
		param.inputType = "number";
		param.numberMinValue = 128;
		param.numberMaxValue = 4096;
		param.editEnabled = true;
		param.autoEncoding = false;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "image_height";
		param.name = "图像高";
		param.numberValue = 512;
		param.inputType = "number";
		param.numberMinValue = 128;
		param.numberMaxValue = 4096;
		param.editEnabled = true;
		param.autoEncoding = false;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "bgTransparent";
		param.name = "背景透明";
		param.toBoolean();
		param.booleanValue = false;
		// param.editEnabled = true;
		params.push(param);

		param = new DataItemComponentParam();
		param.keyName = "outputType";
		param.name = "出图类型";
		param.textValue = "single_image";
		param.textContent = "单张图";
		param.toText();
		params.push(param);

		param = new DataItemComponentParam();
		param.keyName = "bgColor";
		param.name = "背景色";
		param.numberValue = 0x1668a;
		param.editEnabled = true;
		param.toColor();
		params.push(param);
		this.m_params = params;

		let startY = 60;
		let disY = 50;
		let py = 0;
		for (let i = 0; i < params.length; ++i) {
			this.createItemComponent(startY + py, params[i]);
			py += disY;
		}
	}
}
export { OutputDataPanel };

import {IItemData} from "./IItemData"
import {SettingDataPanel} from "./SettingDataPanel"
import {DataItemComponentParam, DataItemComponent} from "./DataItemComponent"
class LightDataPanel extends SettingDataPanel {
	constructor() {super()}

	getJsonStr(beginStr = "{", endStr = "}"): string {

		// let uvSX = this.getItemCompByKeyName("uvScale_x").getParam();
		// let uvSY = this.getItemCompByKeyName("uvScale_y").getParam();
		// let uvScales = [uvSX.numberValue, uvSY.numberValue];
		// let jsonStr = `${beginStr}"modelName":"${this.modelName}", "uvScales":[${uvScales}]`;
		// return super.getJsonStr(jsonStr,endStr);
		let jsonBody = this.getJsonBodyStr(beginStr,endStr)
		return `"lights":[${jsonBody}]`;
	}
	protected init(viewerLayer: HTMLDivElement): void {

		let params: DataItemComponentParam[] = []
		let param = new DataItemComponentParam();
		param.keyName = "type";
		param.name = "类型";
		param.textValue = "point";
		param.toText();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "color";
		param.name = "灯光颜色";
		param.numberValue = 0xaaeebb;
		param.editEnabled = true;
		param.toColor();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "power";
		param.name = "灯光功率";
		param.numberValue = 500;
		param.inputType = "number";
		param.numberMinValue = 0;
		param.numberMaxValue = 50000;
		param.editEnabled = true;
		param.unit = "W";
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "new_light";
		param.name = "新建光源";
		param.textValue = "..."
		param.toText();
		param.autoEncoding = false;
		params.push(param);

		this.m_params = params;

		let startY = 95;
		let disY = 50;
		let py = 0
		for(let i = 0; i < params.length; ++i) {
			this.createItemComponent(startY + py, params[i]);

			py += disY;
		}
	}
}
export {LightDataPanel}

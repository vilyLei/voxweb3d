import {IItemData} from "./IItemData"
import {SettingDataPanel} from "./SettingDataPanel"
import {DataItemComponentParam, DataItemComponent} from "./DataItemComponent"
class EnvDataPanel extends SettingDataPanel {
	constructor() {super()}

	getJsonStr(beginStr = "{", endStr = "}"): string {
		let jsonStr = `${beginStr}"path":""`;
		return super.getJsonStr(jsonStr,endStr);
	}
	protected init(viewerLayer: HTMLDivElement): void {

		let params: DataItemComponentParam[] = []
		let param = new DataItemComponentParam();
		param.keyName = "type";
		param.name = "环境选择";
		param.textValue = "inner_room";
		param.textContent = "室内";
		param.toText();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "brightness";
		param.name = "环境亮度";
		param.numberValue = 0.7;
		param.inputType = "number";
		param.numberMinValue = 0.0;
		param.numberMaxValue = 3.0;
		param.floatNumberEnabled = true;
		param.editEnabled = true;
		param.toNumber();
		params.push(param);

		param = new DataItemComponentParam();
		param.keyName = "ao";
		param.name = "AO";
		param.numberValue = 0.0;
		param.inputType = "number";
		param.numberMinValue = 0.0;
		param.numberMaxValue = 10.0;
		param.floatNumberEnabled = true;
		param.editEnabled = true;
		param.toNumber();
		params.push(param);

		param = new DataItemComponentParam();
		param.keyName = "rotation";
		param.name = "旋转角度";
		param.numberValue = 0;
		// param.unit = "度";
		param.toNumber();
		// param.autoEncoding = false;
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
export {EnvDataPanel}

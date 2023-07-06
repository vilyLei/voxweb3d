import {IItemData} from "./IItemData"
import {SettingDataPanel} from "./SettingDataPanel"
import {DataItemComponentParam, DataItemComponent} from "./DataItemComponent"
class EnvDataPanel extends SettingDataPanel {
	constructor() {super()}

	protected init(viewerLayer: HTMLDivElement): void {

		let params: DataItemComponentParam[] = []
		let param = new DataItemComponentParam();
		param.keyName = "type";
		param.name = "环境选择";
		param.textValue = "室内";
		param.toText()
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "brightness";
		param.name = "环境亮度";
		param.numberValue = 0.7;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "rotation";
		param.name = "旋转角度";
		param.numberValue = 0;
		param.toNumber();
		params.push(param);

		let container = this.m_container;
		let startX = 45;
		let startY = 95;
		let disY = 60;
		let py = 0
		for(let i = 0; i < params.length; ++i) {

			let itemComp = new DataItemComponent();
			itemComp.x = startX;
			itemComp.y = startY + py;
			itemComp.initialize(container, params[i]);

			py += disY;
		}
	}
}
export {EnvDataPanel}

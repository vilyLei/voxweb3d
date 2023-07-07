import {IItemData} from "./IItemData"
import {SettingDataPanel} from "./SettingDataPanel"
import {DataItemComponentParam, DataItemComponent} from "./DataItemComponent"
class LightDataPanel extends SettingDataPanel {
	constructor() {super()}

	protected init(viewerLayer: HTMLDivElement): void {

		let params: DataItemComponentParam[] = []
		let param = new DataItemComponentParam();
		param.keyName = "color";
		param.name = "灯光颜色";
		param.numberValue = 0xaaeebb;
		param.toColor();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "energy";
		param.name = "灯光功率";
		param.numberValue = 500;
		param.unit = "W";
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "new_light";
		param.name = "新建光源";
		param.textValue = "..."
		param.toText();
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
export {LightDataPanel}

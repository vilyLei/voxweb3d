import {IItemData} from "./IItemData"
import {SettingDataPanel} from "./SettingDataPanel"
import {DataItemComponentParam, DataItemComponent} from "./DataItemComponent"
class OutputDataPanel extends SettingDataPanel {
	constructor() {super()}

	protected init(viewerLayer: HTMLDivElement): void {

		let params: DataItemComponentParam[] = []
		let param = new DataItemComponentParam();
		param.keyName = "image_width";
		param.name = "图像宽";
		param.numberValue = 512;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "image_height";
		param.name = "图像高";
		param.numberValue = 512;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "bg_transparent";
		param.name = "背景透明";
		param.toBoolean();
		param.booleanValue = false;
		params.push(param);

		param = new DataItemComponentParam();
		param.keyName = "output_image_type";
		param.name = "出图类型";
		param.textValue = "单张图";
		param.toText();
		params.push(param);

		param = new DataItemComponentParam();
		param.keyName = "bg_color";
		param.name = "背景色";
		param.numberValue = 0x33668a;
		param.toColor()
		params.push(param);

		let container = this.m_container;
		let startX = 45;
		let startY = 60;
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
export {OutputDataPanel}

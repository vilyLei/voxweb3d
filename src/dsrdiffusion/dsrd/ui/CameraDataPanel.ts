import {IItemData} from "./IItemData"
import {SettingDataPanel} from "./SettingDataPanel"
import {DataItemComponentParam, DataItemComponent} from "./DataItemComponent"
class CameraDataPanel extends SettingDataPanel {
	constructor() {super()}

	protected init(viewerLayer: HTMLDivElement): void {

		let params: DataItemComponentParam[] = []
		let param = new DataItemComponentParam();
		param.keyName = "viewAngle";
		param.name = "视角";
		param.numberValue = 45;
		param.unit = "度";
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "near";
		param.name = "近平面";
		param.numberValue = 0.1;
		param.unit = "m";
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "far";
		param.name = "远平面";
		param.numberValue = 20;
		param.unit = "m";
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
export {CameraDataPanel}

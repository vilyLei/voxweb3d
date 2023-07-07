import {IItemData} from "./IItemData"
import {SettingDataPanel} from "./SettingDataPanel"
import {DataItemComponentParam, DataItemComponent} from "./DataItemComponent"
class MaterialDataPanel extends SettingDataPanel {
	constructor() {super()}

	protected init(viewerLayer: HTMLDivElement): void {

		let params: DataItemComponentParam[] = []
		let param = new DataItemComponentParam();
		param.keyName = "type";
		param.name = "材质类型";
		param.textContent = "BSDF";
		param.textValue = "bsdf";
		param.toText();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "specular";
		param.name = "发射率";
		param.numberValue = 0.5;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "metallic";
		param.name = "金属度";
		param.numberValue = 0.5;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "roughness";
		param.name = "粗糙度";
		param.numberValue = 0.5;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "normalStrength";
		param.name = "凹凸强度";
		param.numberValue = 1.0;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "uv_scale_x";
		param.name = "X轴UV缩放";
		param.numberValue = 1.0;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "uv_scale_y";
		param.name = "Y轴UV缩放";
		param.numberValue = 1.0;
		param.toNumber();
		params.push(param);

		let container = this.m_container;
		let startX = 45;
		let startY = 45;
		let disY = 45;
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
export {MaterialDataPanel}

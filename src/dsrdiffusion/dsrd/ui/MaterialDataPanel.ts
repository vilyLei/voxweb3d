import { IItemData } from "./IItemData";
import { SettingDataPanel } from "./SettingDataPanel";
import { DataItemComponentParam, DataItemComponent } from "./DataItemComponent";
import URLFilter from "../../../cospace/app/utils/URLFilter";
class MaterialDataPanel extends SettingDataPanel {
	constructor() {
		super();
	}
	// modelName = "apple_body_model";
	modelNames: string[] = [];
	uvScales = [1.0, 1.0];

	setModelNamesWithUrls(urls: string[]): void {
		if (urls && urls.length > 0) {
			this.modelNames = [];
			for (let i = 0; i < urls.length; i++) {
				let url = urls[i];
				let ns = url != "" ? URLFilter.getFileName(url) : "";
				if (ns != "") {
				}
				this.modelNames.push(ns);
				// console.log("setModelNameWithUrl(), ns: >" + ns + "<");
			}
		} else {
			this.modelNames = [];
		}
		console.log("this.modelNames: ", this.modelNames);
	}
	getJsonStr(beginStr = "{", endStr = "}"): string {
		let jsonBody = "";
		if (this.modelNames.length > 0) {
			let ls = this.modelNames;
			for (let i = 0; i < ls.length; i++) {
				const modelName = ls[i];
				if (modelName != "") {
					let uvSX = this.getItemCompByKeyName("uvScale_x").getParam();
					let uvSY = this.getItemCompByKeyName("uvScale_y").getParam();
					let uvScales = [uvSX.numberValue, uvSY.numberValue];
					let jsonStr = `${beginStr}"modelName":"${modelName}", "uvScales":[${uvScales}],"act":"update"`;
					// return super.getJsonStr(jsonStr,endStr);
					if (jsonBody != "") {
						jsonBody += "," + this.getJsonBodyStr(jsonStr, endStr);
					} else {
						jsonBody = this.getJsonBodyStr(jsonStr, endStr);
					}
				}
			}
		}
		return `"materials":[${jsonBody}]`;
	}
	protected init(viewerLayer: HTMLDivElement): void {
		let params: DataItemComponentParam[] = [];
		let param = new DataItemComponentParam();
		param.keyName = "type";
		param.name = "材质类型";
		param.textContent = "BSDF";
		param.textValue = "bsdf";
		param.toText();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "color";
		param.name = "颜色";
		param.numberValue = 0xffffff;
		param.editEnabled = true;
		param.toColor();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "specular";
		param.name = "反射率";
		param.numberValue = 0.5;
		param.inputType = "number";
		param.floatNumberEnabled = true;
		param.numberMinValue = 0.0;
		param.numberMaxValue = 3.0;
		param.editEnabled = true;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "metallic";
		param.name = "金属度";
		param.numberValue = 0.5;
		param.inputType = "number";
		param.floatNumberEnabled = true;
		param.numberMinValue = 0.0;
		param.numberMaxValue = 3.0;
		param.editEnabled = true;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "roughness";
		param.name = "粗糙度";
		param.numberValue = 0.5;
		param.inputType = "number";
		param.floatNumberEnabled = true;
		param.numberMinValue = 0.0;
		param.numberMaxValue = 3.0;
		param.editEnabled = true;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "normalStrength";
		param.name = "凹凸强度";
		param.numberValue = 1.0;
		param.inputType = "number";
		param.floatNumberEnabled = true;
		param.numberMinValue = 0.0;
		param.numberMaxValue = 3.0;
		param.editEnabled = true;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "uvScale_x";
		param.name = "X轴UV缩放";
		param.numberValue = 1.0;
		param.inputType = "number";
		param.floatNumberEnabled = true;
		param.numberMinValue = 0.0;
		param.numberMaxValue = 30.0;
		param.editEnabled = true;
		param.autoEncoding = false;
		param.toNumber();
		params.push(param);
		param = new DataItemComponentParam();
		param.keyName = "uvScale_y";
		param.name = "Y轴UV缩放";
		param.numberValue = 1.0;
		param.inputType = "number";
		param.floatNumberEnabled = true;
		param.numberMinValue = 0.0;
		param.numberMaxValue = 30.0;
		param.editEnabled = true;
		param.autoEncoding = false;
		param.toNumber();
		params.push(param);

		this.m_params = params;

		let startY = 45;
		let disY = 31;
		let py = 0;
		for (let i = 0; i < params.length; ++i) {
			this.createItemComponent(startY + py, params[i]);
			py += disY;
		}
	}
}
export { MaterialDataPanel };

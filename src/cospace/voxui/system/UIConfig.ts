
import IColor4 from "../../../vox/material/IColor4";
import { TextPackedLoader } from "../../modules/loaders/TextPackedLoader";
import { IUIFontFormat, IUIConfig } from "./IUIConfig";
import { IUIButtonColor, IUIGlobalColor } from "./uiconfig/IUIGlobalColor";
import { IUIGlobalText } from "./uiconfig/IUIGlobalText";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { IButton } from "../button/IButton";
import { IColorClipLabel } from "../entity/IColorClipLabel";
declare var CoRScene: ICoRScene;

class UIConfig implements IUIConfig {
	private m_callback: () => void;
	private m_jsonRawData = "";
	private m_jsonObj: Object = null;
	private m_globalColor: IUIGlobalColor = null;
	private m_globalText: IUIGlobalText = null;
	constructor() { }
	initialize(configUrl: string, callback: () => void): void {
		// load the cofig text file
		this.m_callback = callback;
		let jsonLoader = new TextPackedLoader(1, (): void => {
			// console.log("jsonLoader loaded: ", jsonLoader.getDataByUrl(configUrl));
			this.m_jsonRawData = jsonLoader.getDataByUrl(configUrl) as string;
			this.m_jsonObj = JSON.parse(this.m_jsonRawData);
			// console.log("this.m_jsonObj: ", this.m_jsonObj);
			if (this.m_callback != null) {
				this.m_callback();
				this.m_callback = null;
			}
		}).load(configUrl);
	}
	createColorByData(bytesArray3: number[]): IColor4 {
		let c = CoRScene.createColor4();
		c.fromBytesArray3(bytesArray3);
		return c;
	}
	applyButtonGlobalColor(btn: IButton, colorName: string): void {
		if (btn != null && colorName != "") {
			let gColor = this.m_globalColor.button;
			if (gColor != null) {
				let c = (gColor as any)[colorName] as IUIButtonColor;
				if (c != undefined) {
					let label = btn.getLable() as IColorClipLabel;
					this.applyButtonColor(label.getColors(), c);
					label.setClipIndex(0);
				}
			}
		}
	}
	applyButtonColor(btnColors: IColor4[], uiBtnColor: IUIButtonColor): void {

		// let ls = uiBtnColor.out;
		// btnColors[0].setRGB3Bytes(ls[0], ls[1], ls[2]);
		// ls = uiBtnColor.over;
		// btnColors[1].setRGB3Bytes(ls[0], ls[1], ls[2]);
		// ls = uiBtnColor.down;
		// btnColors[2].setRGB3Bytes(ls[0], ls[1], ls[2]);
		// if(btnColors.length > 3) {
		// 	ls = uiBtnColor.up;
		// 	btnColors[3].setRGB3Bytes(ls[0], ls[1], ls[2]);
		// }
		const len = btnColors.length;
		btnColors[0].fromBytesArray3(uiBtnColor.out);
		btnColors[1].fromBytesArray3(uiBtnColor.over);
		if (len > 2) {
			btnColors[2].fromBytesArray3(uiBtnColor.down != undefined ? uiBtnColor.down : uiBtnColor.out);
		}
		if (len > 3) {
			btnColors[3].fromBytesArray3(uiBtnColor.up != undefined ? uiBtnColor.up : uiBtnColor.out);
		}
	}

	getUIGlobalText(): IUIGlobalText {
		if (this.m_globalText != null) return this.m_globalText;
		let obj = this.m_jsonObj;
		if (obj != null) {
			let uiModule = (obj as any)["text"];
			if (uiModule !== undefined) {
				this.m_globalText = uiModule as IUIGlobalText;
				return this.m_globalText;
			}
		}
		return null;
	}
	getUIGlobalColor(): IUIGlobalColor {
		if (this.m_globalColor != null) return this.m_globalColor;
		let obj = this.m_jsonObj;
		if (obj != null) {
			let uiModule = (obj as any)["color"];
			if (uiModule !== undefined) {
				this.m_globalColor = uiModule as IUIGlobalColor;
				return this.m_globalColor;
			}
		}
		return null;
	}
	getUIModuleByName(moduleName: string): unknown | null {
		if (moduleName != "") {
			let obj = this.m_jsonObj;
			if (obj != null) {
				let uiModule = (obj as any)["uiModule"];
				console.log("XXXX uiModule: ", uiModule);
				if (uiModule !== undefined) {
					let module = uiModule[moduleName];
					if (module !== undefined) {
						return module;
					}
				}
			}

		}
		return null;
	}
	destroy(): void {
	}
}

export { UIConfig }

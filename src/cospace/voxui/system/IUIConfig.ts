import IColor4 from "../../../vox/material/IColor4";
import { IUIFontFormat } from "./uiconfig/IUIFontFormat";
import { IUIButtonColor, IUIGlobalColor } from "./uiconfig/IUIGlobalColor";
import { IUIGlobalText } from "./uiconfig/IUIGlobalText";

interface IUIConfig {
	initialize(configUrl: string, callback: () => void): void;
	destroy(): void;
	createColorByData(bytesArray3: number[]): IColor4;
	applyButtonColor(btnColors: IColor4[], uiBtnColor: IUIButtonColor): void;
	getUIGlobalText(): IUIGlobalText;
	getUIGlobalColor(): IUIGlobalColor;
	getUIModuleByName(moduleName: string): unknown | null;
}

export { IUIFontFormat, IUIConfig }

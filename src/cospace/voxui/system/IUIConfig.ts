import IColor4 from "../../../vox/material/IColor4";
import { IButton } from "../button/IButton";
import { IUIFontFormat } from "./uiconfig/IUIFontFormat";
import { IUIButtonColor, IUIGlobalColor } from "./uiconfig/IUIGlobalColor";
import { IUIGlobalText } from "./uiconfig/IUIGlobalText";

interface IUIConfig {
	initialize(configUrl: string, callback: () => void): void;
	destroy(): void;
	createColorByData(bytesArray3: number[]): IColor4;
	applyButtonGlobalColor(btn: IButton, colorName: string): void;
	applyButtonColor(btnColors: IColor4[], uiBtnColor: IUIButtonColor): void;
	getUIGlobalText(): IUIGlobalText;
	getUIGlobalColor(): IUIGlobalColor;
	getUIModuleByName(moduleName: string): unknown | null;
}

export { IUIFontFormat, IUIConfig }

import IColor4 from "../../../vox/material/IColor4";
import { IUIButtonColor, IUIGlobalColor } from "./uiconfig/IUIGlobalColor";

interface IFontFormat {
	font: string;
	size: number;
	bold: boolean;
	italic: boolean;
	fontColor: number[];
}
interface IUIConfig {
	initialize(configUrl: string, callback: () => void): void;
	destroy(): void;
	applyButtonColor(btnColors: IColor4[], uiBtnColor: IUIButtonColor): void;
	getUIGlobalColor(): IUIGlobalColor;
	getUIModuleByName(moduleName: string): unknown | null;
}

export { IFontFormat, IUIConfig }

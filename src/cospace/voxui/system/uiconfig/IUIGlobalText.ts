
import { IUIFontFormat } from "./IUIFontFormat";
interface IUIFontFormatSet {
	common: IUIFontFormat;
	tips: IUIFontFormat;
	button: IUIFontFormat;
}
interface IUIGlobalText {
	fontFormat: IUIFontFormatSet;
}

export { IUIFontFormat, IUIFontFormatSet, IUIGlobalText }

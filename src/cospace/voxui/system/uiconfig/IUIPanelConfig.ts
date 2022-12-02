import { IUIFontFormat } from "./IUIFontFormat";

interface IUIButtonStyle {
	globalColor: string;
	tipsAlign: string;
}

interface IUIPanelItem {
	name: string;
	text: string;
}
interface IUIPanelConfig {
	items?: IUIPanelItem[];
	buttonStyle?: IUIButtonStyle;
	bgColor: number[];
	btnTextFontFormat: IUIFontFormat;
	textFontFormat: IUIFontFormat;
	btnTextAreaSize: number[];
	panelSize: number[];
	btnSize: number[];
	btnNames: string[];
	btnKeys: string[];
	btnTips: string[];
	btnTypes?: number[];

}

export { IUIPanelConfig }

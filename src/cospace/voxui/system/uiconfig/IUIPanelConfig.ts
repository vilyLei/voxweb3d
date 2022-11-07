import { IUIFontFormat } from "./IUIFontFormat";

interface IUIButtonStyle {
	globalColor: string;
	tipsAlign: string;
}
interface IUIPanelConfig {
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

}

export { IUIPanelConfig }

import IColor4 from "../../../vox/material/IColor4";
import { IPromptPanel } from "../panel/IPromptPanel";

interface IPromptSystem {

	setPromptTextColor(color: IColor4, type?: number): void;
	setPromptBGColor(color: IColor4, type?: number): void;
	setPromptListener(confirmFunc: () => void, cancelFunc: () => void, type?: number): void;
	showPrompt(promptInfo: string, type?: number): void;
	getPromptPanel(type?: number): IPromptPanel;
	
}
export { IPromptSystem };
